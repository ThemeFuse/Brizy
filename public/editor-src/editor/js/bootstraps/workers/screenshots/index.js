import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import QuickLRU from "quick-lru";
import {
  children,
  closestByClassName,
  css,
  getElementsByAttribute,
  getElementsByClassName,
  getElementsByTagName,
  hasClassName,
  removeNode
} from "./xmldom-utils";

const cache = new QuickLRU({ maxSize: 100 });

onerror = (e) => {
  console.error(e);
};

onmessage = async (e) => {
  const { id, url: incomingUrl, options, assetUrl, siteUrl, proxyUrl } = e.data;

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

  removeUnwantedNodes(node);
  removeTextBackground(node);
  transformPictureToImg(node);
  await inlineImages(node, config);
  deactivateBackgroundParallax(node);
  await replaceIframesWithPlaceholders(node, config);
  deactivatePaddingDraggable(node);
  removeUnwantedAttributes(node);

  const svgDataUri = makeSvgDataUri(
    new XMLSerializer().serializeToString(node),
    options
  );
  // temp hack made when images inside lottie svg were not working
  const svgDataUri2 = svgDataUri.replace(/xmlns%3Axlink%3D%22%22/g, "");

  const blob = new Blob([svgDataUri2], {
    type: "text/plain"
  });
  const url = URL.createObjectURL(blob);

  postMessage({
    id,
    url
  });
};

// splits html string into multiple lines
// the goal is not to produce beautiful html, just to split
function beautifyHTML(html) {
  return html.replace(/(<\/[^>]+>)/g, "\n$1");
}

function removeUnwantedNodes(node) {
  const selectors = [
    { type: "className", value: "brz-ed-collapsible" },
    {
      type: "className",
      value: "brz-ed-draggable",
      canDelete: (node) => !hasClassName(node, "brz-ed-draggable__padding")
    },
    { type: "className", value: "brz-ed-border__inner" },
    { type: "className", value: "brz-ed-border__button" },
    { type: "className", value: "brz-ed-container-plus" },
    { type: "className", value: "brz-ed-container-trigger" },
    { type: "className", value: "brz-ed-toolbar" },
    { type: "className", value: "brz-ed-row__toolbar" },
    { type: "className", value: "brz-ed-column__toolbar" },
    { type: "className", value: "brz-ed-wrapper__toolbar" },
    { type: "className", value: "brz-form__select-list" },
    { type: "className", value: "brz-popup2__button-go-to-editor" },
    { type: "className", value: "brz-ed-icon-svg" },
    { type: "className", value: "brz-ed-slider__spinner" },
    { type: "className", value: "brz-ed-portal__loading" },
    { type: "tagName", value: "script" }
  ];

  /* eslint-disable no-unused-vars */
  selectors.forEach(({ type, value, canDelete }) => {
    let nodes;
    /* eslint-enabled no-unused-vars */
    switch (type) {
      case "className": {
        nodes = getElementsByClassName(node, value);
        break;
      }
      case "tagName": {
        nodes = getElementsByTagName(node, value);
        break;
      }
      default:
        throw new Error(`unsupported selector type ${type}`);
    }

    nodes.forEach((node) => {
      if (canDelete === undefined || canDelete(node)) {
        removeNode(node);
      }
    });
  });
}

function removeTextBackground(node) {
  let nodes = getElementsByClassName(node, "brz-text-mask");

  nodes.forEach((node) => {
    css(node, {
      background: "transparent",
      color: "inherit !important",
      "-webkit-text-fill-color": "unset"
    });
  });
}

function removeUnwantedAttributes(node) {
  // remove extra text. it's quite fast
  // and reduces often multiple thousand chars
  // data-href makes the screenshot crash
  const attributes = ["id", "class", "data-block-id", "data-href"];

  attributes.forEach((attribute) => {
    const nodes = getElementsByAttribute(node, attribute);

    nodes.forEach((node) => node.removeAttribute(attribute));
  });
}

function deactivatePaddingDraggable(node) {
  const paddingDraggables = getElementsByClassName(
    node,
    "brz-ed-draggable__padding"
  );

  paddingDraggables.forEach((node) => {
    if (hasClassName(node, "brz-ed-draggable__padding--active")) {
      css(node, "background", "transparent");
      children(node).forEach((node) => removeNode(node));
    }
  });
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
          node.setAttribute("src", base64);

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

    const urlRegex = /url\(["']?([^#"')]+)["']?\)/;
    const urlMatch = urlRegex.exec(style);
    const [, src] = urlMatch || [];

    if (src && !isBase64(src)) {
      promises.push(
        fetchResource(getResourceDownloadUrl(src, config)).then((base64) => {
          node.setAttribute(
            "style",
            style.replace(urlRegex, `url("${base64}")`)
          );

          return base64;
        })
      );
    }
  });

  return Promise.all(promises);
}

function deactivateBackgroundParallax(node) {
  const bgWithParallax = getElementsByClassName(node, "brz-bg-image-parallax");

  bgWithParallax.forEach((node) =>
    // make the image static (no parallax or fixed)
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

function makeSvgDataUri(nodeString, options) {
  const { width, height } = options;
  const foreignObject = `<foreignObject x="0" y="0" width="100%" height="100%" style="background-color: white;">${nodeString}</foreignObject>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">${foreignObject}</svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function makeSvgDataUriDebug(nodeString, options) {
  const { width, height } = options;
  const foreignObject = `<foreignObject x="0" y="0" width="100%" height="100%" style="background-color: white;">${nodeString}</foreignObject>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">${foreignObject}</svg>`;

  return svg;
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
      cache.set(url, base64);
      return base64;
    })
    .catch((e) => console.error("worker fetch:", e));
}

function getResourceDownloadUrl(src, { siteUrl, proxyUrl }) {
  if (src.indexOf(siteUrl) === 0 || src[0] === "/" || !proxyUrl) {
    return src;
  }

  return proxyUrl + encodeURIComponent(src);
}

function blobToDataUri(blob) {
  return new Promise((resolve) => {
    var reader = new FileReader();
    reader.onload = function () {
      resolve(this.result);
    };
    reader.onerror = () => console.error("failed to decode image");
    reader.readAsDataURL(blob);
  });
}

function isBase64(src) {
  return /^data:.+;base64/.test(src);
}
