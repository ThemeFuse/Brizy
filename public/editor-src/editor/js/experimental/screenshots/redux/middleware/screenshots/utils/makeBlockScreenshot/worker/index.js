import { DOMParser, XMLSerializer } from "xmldom";
import {
  getElementsByClassName,
  getElementsByTagName,
  getElementsByAttribute,
  removeNode,
  children,
  css,
  closestByClassName,
  hasClassName
} from "./xmldom-utils";
import iframePlaceholders from "./iframePlaceholders";

onerror = e => {
  console.error(e);
};

onmessage = async e => {
  const { id, url: incomingUrl, options, siteUrl, proxyUrl } = e.data;

  const r = await fetch(incomingUrl);
  const nodeString = await r.text();

  const node = new DOMParser().parseFromString(nodeString, "text/html");

  removeUnwantedNodes(node);
  transformPictureToImg(node);
  await inlineImages(node, { siteUrl, proxyUrl });
  deactivateBackgroundParallax(node);
  replaceIframesWithPlaceholders(node);
  deactivatePaddingDraggable(node);
  removeUnwantedAttributes(node);

  const svgDataUri = makeSvgDataUri(
    new XMLSerializer().serializeToString(node),
    options
  );
  const blob = new Blob([svgDataUri], {
    type: "text/plain"
  });
  const url = URL.createObjectURL(blob);

  postMessage({
    id,
    url
  });
};

function removeUnwantedNodes(node) {
  const selectors = [
    { type: "className", value: "brz-ed-collapsible" },
    {
      type: "className",
      value: "brz-ed-draggable",
      canDelete: node => !hasClassName(node, "brz-ed-draggable__padding")
    },
    { type: "className", value: "brz-ed-border__inner-1" },
    { type: "className", value: "brz-ed-border__inner-2" },
    { type: "className", value: "brz-ed-container-plus" },
    { type: "className", value: "brz-ed-container-trigger" },
    { type: "className", value: "brz-ed-toolbar" },
    { type: "className", value: "brz-ed-row__toolbar" },
    { type: "className", value: "brz-ed-column__toolbar" },
    { type: "className", value: "brz-ed-wrapper__toolbar" },
    { type: "className", value: "brz-form__select-list" }
  ];

  selectors.forEach(({ type, value, canDelete = node => true }) => {
    let nodes;

    switch (type) {
      case "className":
        nodes = getElementsByClassName(node, value);
        break;
      default:
        throw new Error(`unsupported selector type ${type}`);
    }

    nodes.forEach(node => {
      if (canDelete(node)) {
        removeNode(node);
      }
    });
  });
}

function removeUnwantedAttributes(node) {
  // remove extra text. it's quite fast
  // and reduces often multiple thousand chars
  // data-href makes the screenshot crash
  const attributes = ["id", "class", "data-block-id", "data-href"];

  attributes.forEach(attribute => {
    const nodes = getElementsByAttribute(node, attribute);

    nodes.forEach(node => node.removeAttribute(attribute));
  });
}

function deactivatePaddingDraggable(node) {
  const paddingDraggables = getElementsByClassName(
    node,
    "brz-ed-draggable__padding"
  );

  paddingDraggables.forEach(node => {
    if (hasClassName(node, "brz-ed-draggable-active")) {
      css(node, "background", "transparent");
      children(node).forEach(node => removeNode(node));
    }
  });
}

function replaceIframesWithPlaceholders(node) {
  getElementsByTagName(node, "iframe").forEach(node => {
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

      const placeholderImg = iframePlaceholders[className.replace("brz-", "")];
      const placeholderStyle = {
        width: node.getAttribute("width") || iframeStyle.width,
        height: node.getAttribute("height") || iframeStyle.height,
        position: iframeStyle.position,
        top: iframeStyle.top,
        bottom: iframeStyle.bottom,
        left: iframeStyle.left,
        right: iframeStyle.right,
        margin: iframeStyle.margin,
        ...(placeholderImg
          ? {
              "background-repeat": "no-repeat",
              "background-position": "center center",
              "background-size": "cover",
              "background-image": `url(${placeholderImg})`
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

      break;
    }
  });
}

function transformPictureToImg(node) {
  getElementsByTagName(node, "picture").forEach(node => {
    getElementsByTagName(node, "source").forEach(removeNode);
    getElementsByTagName(node, "img").forEach(node =>
      node.removeAttribute("srcset")
    );
  });
}

async function inlineImages(node, config) {
  const promises = [];

  getElementsByTagName(node, "img").forEach(async node => {
    const src = node.getAttribute("src");

    if (src && !isBase64(src)) {
      promises.push(
        fetchResource(getResourceDownloadUrl(src, config)).then(base64 => {
          node.setAttribute("src", base64);

          return base64;
        })
      );
    }
  });

  getElementsByAttribute(node, "style").forEach(async node => {
    const style = node.getAttribute("style");
    if (!style.includes("url")) {
      return;
    }

    const urlRegex = /(url\("?'?([^\"')]+)"?'?\))/;
    const urlMatch = urlRegex.exec(style);
    const [, url, src] = urlMatch || [];

    if (url && src && !isBase64(src)) {
      promises.push(
        fetchResource(getResourceDownloadUrl(src, config)).then(base64 => {
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

  bgWithParallax.forEach(node =>
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

function makeForeignObjectSvg(nodeString, options) {
  const { width, height } = options;
  const foreignObject = `<foreignObject x="0" y="0" width="100%" height="100%" style="background-color: white;">${nodeString}</foreignObject>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${foreignObject}</svg>`;

  return svg;
}

function makeSvgDataUri(nodeString, options) {
  const { width, height } = options;
  const foreignObject = `<foreignObject x="0" y="0" width="100%" height="100%" style="background-color: white;">${nodeString}</foreignObject>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${foreignObject}</svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function fetchResource(url) {
  return fetch(url, { credentials: "omit" })
    .then(r => r.blob())
    .then(blobToDataUri)
    .catch(e => console.error("worker fetch", e));
}

function getResourceDownloadUrl(src, { siteUrl, proxyUrl }) {
  return src.indexOf(siteUrl) === 0 ? src : proxyUrl + encodeURIComponent(src);
}

function blobToDataUri(blob) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function() {
      resolve(this.result);
    };
    reader.onerror = () => console.error("failed to decode image");
    reader.readAsDataURL(blob);
  });
}

function isBase64(src) {
  return /^data:.+;base64/.test(src);
}
