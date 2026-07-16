import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import QuickLRU from "quick-lru";
import {
  children,
  closestByClassName,
  css,
  getElementsByAttribute,
  getElementsByClassName,
  getElementsByTagName,
  removeNode
} from "./xmldom-utils";

const CACHE_MAX_ENTRIES = 30;
const CACHE_MAX_BYTES = 20 * 1024 * 1024;
const CACHE_IDLE_MS = 60 * 1000;

let cacheBytes = 0;
const cache = new QuickLRU({
  maxSize: CACHE_MAX_ENTRIES,
  onEviction: (_key, value) => {
    cacheBytes -= estimateSize(value);
    if (cacheBytes < 0) cacheBytes = 0;
  }
});

let idleTimer = null;
function scheduleCacheClear() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    cache.clear?.();
    cacheBytes = 0;
    idleTimer = null;
  }, CACHE_IDLE_MS);
}

function estimateSize(value) {
  // base64 strings: char count ≈ byte count (UTF-16 doubled but V8 latin-1 stores 1 byte for ASCII)
  return typeof value === "string" ? value.length : 0;
}

function evictByBytes() {
  // QuickLRU iterator yields newer items first (cache), then older (oldCache).
  // We want to evict oldest first, so snapshot then walk in reverse. Snapshot
  // also avoids mutation-during-iteration issues with QuickLRU's 2-Map structure.
  const entries = [...cache];
  for (let i = entries.length - 1; i >= 0; i--) {
    if (cacheBytes <= CACHE_MAX_BYTES) break;
    const [key, value] = entries[i];
    cacheBytes -= estimateSize(value);
    if (cacheBytes < 0) cacheBytes = 0;
    cache.delete(key);
  }
}

onerror = (e) => {
  console.error(e);
};

onmessage = async (e) => {
  scheduleCacheClear();
  const { id, url: incomingUrl, options, assetUrl, siteUrl, proxyUrl } = e.data;

  try {
    const r = await fetch(incomingUrl);
    const nodeString = await r.text();

    const node = new DOMParser().parseFromString(
      // DOMParser lib has terrible performance
      // when it tries to parse a string with a single long line
      // so we clumsily split it into multiple to ease it's job
      beautifyHTML(nodeString),
      "text/html"
    );
    const config = { assetUrl, siteUrl, proxyUrl };

    traverseAndProcess(node);
    transformPictureToImg(node);
    await inlineImages(node, config);
    deactivateBackgroundParallax(node);
    await replaceIframesWithPlaceholders(node, config);

    const svgString = makeSvgString(
      new XMLSerializer().serializeToString(node),
      options
    );
    // temp hack made when images inside lottie svg were not working
    const svgFixed = svgString.replace(/xmlns:xlink=""/g, "");

    const blob = new Blob([svgFixed], { type: "image/svg+xml" });
    // FileReader.readAsDataURL is native base64 encoding — ~3× smaller output
    // than encodeURIComponent and much faster for large SVGs.
    const url = await blobToDataUri(blob);

    postMessage({ id, url });
  } catch (err) {
    // Notify main thread so its promise can reject immediately
    // instead of waiting for the 30s timeout.
    console.error("screenshot worker onmessage failed", err);
    postMessage({ id, error: String(err && err.message ? err.message : err) });
  }
};

// splits html string into multiple lines
// the goal is not to produce beautiful html, just to split
function beautifyHTML(html) {
  return html.replace(/(<\/[^>]+>)/g, "\n$1");
}

// Classes whose nodes should be removed entirely
const REMOVE_CLASSES = new Set([
  "brz-ed-collapsible",
  "brz-ed-border__inner",
  "brz-ed-border__button",
  "brz-ed-container-plus",
  "brz-ed-container-trigger",
  "brz-ed-toolbar",
  "brz-ed-row__toolbar",
  "brz-ed-column__toolbar",
  "brz-ed-wrapper__toolbar",
  "brz-form__select-list",
  "brz-popup2__button-go-to-editor",
  "brz-ed-icon-svg",
  "brz-ed-slider__spinner",
  "brz-ed-portal__loading"
]);

// Attributes to strip (class kept — inline styles make it redundant but
// removing it saves bytes; id/data-href kept for compat with existing behaviour)
const REMOVE_ATTRS = ["id", "class", "data-block-id", "data-href"];

function traverseAndProcess(root) {
  // Collect nodes to remove/unwrap after traversal to avoid mutating the tree
  // while walking it.
  const toRemove = [];
  const toUnwrap = [];

  visitAll(root, (node) => {
    if (node.nodeType !== 1) return;

    const tag = node.tagName;

    if (tag === "script") {
      toRemove.push(node);
      return;
    }

    // Strip external SVG sprite references — they trigger cross-origin fetches
    // during SVG rendering which taint the canvas
    if (tag === "use") {
      const href = node.getAttribute("xlink:href") || node.getAttribute("href");
      if (href && !href.startsWith("#")) {
        node.removeAttribute("xlink:href");
        node.removeAttribute("href");
      }
    }

    const cls = node.getAttribute("class") || "";

    // Editor-only nodes — remove with their subtree
    if (REMOVE_CLASSES.has(getFirstClass(cls))) {
      toRemove.push(node);
      return;
    }

    // brz-ed-draggable: remove unless it's a padding handle
    if (
      hasClass(cls, "brz-ed-draggable") &&
      !hasClass(cls, "brz-ed-draggable__padding")
    ) {
      toRemove.push(node);
      return;
    }

    // Padding draggable — clear background if active, remove children
    if (hasClass(cls, "brz-ed-draggable__padding")) {
      if (hasClass(cls, "brz-ed-draggable__padding--active")) {
        css(node, "background", "transparent");
        children(node).forEach((child) => toRemove.push(child));
      }
    }

    // Text mask — remove background so underlying gradient shows
    if (hasClass(cls, "brz-text-mask")) {
      css(node, {
        background: "transparent",
        color: "inherit !important",
        "-webkit-text-fill-color": "unset"
      });
    }

    // Strip unwanted attributes
    for (const attr of REMOVE_ATTRS) {
      if (node.getAttribute(attr) !== null) {
        node.removeAttribute(attr);
      }
    }
  });

  toRemove.forEach((n) => {
    if (n.parentNode) removeNode(n);
  });
  toUnwrap.forEach((n) => {
    if (n.parentNode) unwrapNode(n);
  });
}

function hasClass(classList, name) {
  return classList.split(" ").includes(name);
}

function getFirstClass(classList) {
  return classList.split(" ")[0];
}

function unwrapNode(node) {
  const parent = node.parentNode;
  while (node.firstChild) {
    parent.insertBefore(node.firstChild, node);
  }
  parent.removeChild(node);
}

// Generic DFS visitor
function visitAll(node, cb) {
  cb(node);
  let child = node.firstChild;
  while (child) {
    const next = child.nextSibling;
    visitAll(child, cb);
    child = next;
  }
}

function deactivateBackgroundParallax(node) {
  const bgWithParallax = getElementsByClassName(node, "brz-bg-image-parallax");

  bgWithParallax.forEach((node) =>
    css(node, {
      transform: "none",
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%"
    })
  );
}

function replaceIframesWithPlaceholders(node, config) {
  const promises = [];
  const supportedPlaceholders = [
    "soundcloud",
    "map",
    "bg-map",
    "video",
    "bg-video"
  ];

  getElementsByTagName(node, "iframe").forEach((node) => {
    const iframeStyle = css(node);

    if (iframeStyle.display === "none") {
      removeNode(node);
      return;
    }

    const parentClassNames = [
      "brz-map",
      "brz-bg-map",
      "brz-video",
      "brz-bg-video",
      "brz-soundcloud"
    ];

    for (let className of parentClassNames) {
      const parentComponent = closestByClassName(node, className);

      if (!parentComponent) {
        continue;
      }

      const placeholderId = className.replace("brz-", "");
      const promise = supportedPlaceholders.includes(placeholderId)
        ? fetchResource(
            getResourceDownloadUrl(
              `${config.assetUrl}/editor/img/screenshot-placeholder-${placeholderId}.png`,
              config
            )
          )
        : Promise.resolve();
      promise.then((base64) => {
        const placeholderStyle = {
          width: node.getAttribute("width") || iframeStyle.width,
          height: node.getAttribute("height") || iframeStyle.height,
          position: iframeStyle.position,
          top: iframeStyle.top,
          bottom: iframeStyle.bottom,
          left: iframeStyle.left,
          right: iframeStyle.right,
          margin: iframeStyle.margin,
          ...(base64
            ? {
                "background-repeat": "no-repeat",
                "background-position": "center center",
                "background-size": "cover",
                "background-image": `url(${base64})`
              }
            : {
                "background-color": "#373e48"
              })
        };
        const placeholderStyleStr = Object.entries(placeholderStyle).reduce(
          (acc, [key, value]) => (acc += `${key}:${value};`),
          ""
        );
        const placeholder = node.ownerDocument.createElement("div");

        placeholder.setAttribute("style", placeholderStyleStr);
        node.parentNode.replaceChild(placeholder, node);
      });
      promises.push(promise);

      break;
    }
  });

  return Promise.all(promises);
}

function transformPictureToImg(node) {
  getElementsByTagName(node, "picture").forEach((node) => {
    getElementsByTagName(node, "source").forEach(removeNode);
    getElementsByTagName(node, "img").forEach((node) =>
      node.removeAttribute("srcset")
    );
  });
}

async function inlineImages(node, config) {
  const promises = [];

  getElementsByTagName(node, "img").forEach(async (node) => {
    const src = node.getAttribute("src");

    if (src && !isBase64(src)) {
      promises.push(
        fetchResource(getResourceDownloadUrl(src, config)).then((base64) => {
          if (typeof base64 === "string") {
            node.setAttribute("src", base64);
          }
          return base64;
        })
      );
    }
  });

  getElementsByAttribute(node, "style").forEach(async (node) => {
    const style = node.getAttribute("style");
    if (!style.includes("url")) {
      return;
    }

    const urlRegex = /url\(["']?([^#"')]+)["']?\)/g;
    const externalMatches = [...style.matchAll(urlRegex)].filter(
      ([, src]) => src && !isBase64(src)
    );

    if (externalMatches.length > 0) {
      promises.push(
        Promise.all(
          externalMatches.map(([fullMatch, src]) =>
            fetchResource(getResourceDownloadUrl(src, config)).then(
              (base64) => [fullMatch, base64]
            )
          )
        ).then((replacements) => {
          let newStyle = style;
          for (const [fullMatch, base64] of replacements) {
            if (base64) {
              newStyle = newStyle.replace(fullMatch, `url("${base64}")`);
            }
          }
          node.setAttribute("style", newStyle);
        })
      );
    }
  });

  return Promise.all(promises);
}

function makeSvgString(nodeString, options) {
  const { width, height } = options;
  const foreignObject = `<foreignObject x="0" y="0" width="100%" height="100%" style="background-color: white;">${nodeString}</foreignObject>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">${foreignObject}</svg>`;
}

function fetchResource(url) {
  if (cache.has(url)) {
    return Promise.resolve(cache.get(url));
  }

  return fetch(url, { credentials: "omit" })
    .then((r) => {
      if (r.ok) {
        return r.blob();
      } else {
        throw new Error(`could not fetch ${url}`);
      }
    })
    .then(blobToDataUri)
    .then((base64) => {
      if (typeof base64 === "string") {
        cache.set(url, base64);
        cacheBytes += estimateSize(base64);
        if (cacheBytes > CACHE_MAX_BYTES) evictByBytes();
      }
      return base64;
    })
    .catch((e) => {
      console.error("worker fetch:", e);
      return undefined;
    });
}

function getResourceDownloadUrl(src, { siteUrl, proxyUrl }) {
  if (src.indexOf(siteUrl) === 0 || src[0] === "/" || !proxyUrl) {
    return src;
  }

  return proxyUrl + encodeURIComponent(src);
}

function blobToDataUri(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(this.result);
    };
    reader.onerror = () => reject(new Error("FileReader failed to decode blob"));
    reader.readAsDataURL(blob);
  });
}

function isBase64(src) {
  return /^data:.+;base64/.test(src);
}
