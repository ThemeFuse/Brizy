export function clean(node) {
  removeUnwantedDOMNodes(node);
  removeUnwantedAttributes(node);
  transformPictureToImg(node);
}

export async function inlineAssets(node) {
  await inlineImages(node);
}

function removeUnwantedDOMNodes(node) {
  const selector = [
    ".brz-ed-collapsible",
    ".brz-ed-draggable",
    ".brz-ed-border__inner-1",
    ".brz-ed-border__inner-2",
    ".brz-ed-container-plus",
    ".brz-ed-container-trigger",
    ".brz-ed-toolbar",
    ".brz-ed-column__toolbar",
    ".brz-ed-wrapper__toolbar",
    ".brz-form__select-list"
  ].join(",");

  node.querySelectorAll(selector).forEach(element => element.remove());
}

function removeUnwantedAttributes(node) {
  node.querySelectorAll("[id],[class],[data-href]").forEach(element => {
    element.removeAttribute("id");
    // element.removeAttribute("class");
    element.removeAttribute("data-href");
  });
}

function transformPictureToImg(node) {
  node.querySelectorAll("picture").forEach(picture => {
    picture.querySelectorAll("source").forEach(source => source.remove());
    picture.querySelector("img").removeAttribute("srcset");
  });
}

async function inlineImages(node) {
  const promises = [];

  node.querySelectorAll("img").forEach(async function(img) {
    const src = img.src;

    if (!isBase64(src)) {
      promises.push(
        fetchResource(src).then(base64 => {
          img.src = base64;
        })
      );
    }
  });

  node.querySelectorAll(`[style]`).forEach(async function(element) {
    const style = element.style.cssText;
    if (!style.includes("url")) {
      return;
    }

    const urlRegex = /(url\("?'?([^\"')]+)"?'?\))/;
    const urlMatch = urlRegex.exec(style);
    const [, url, src] = urlMatch || [];

    if (url && src && !isBase64(src)) {
      promises.push(
        fetchResource(src).then(base64 => {
          element.setAttribute(
            "style",
            style.replace(urlRegex, `url("${base64}")`)
          );
        })
      );
    }
  });

  return Promise.all(promises);
}

function fetchResource(url) {
  return fetch(url)
    .then(r => r.blob())
    .then(blobToDataUri)
    .catch(e => console.error("worker fetch", e));
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

export function calcOptions(options, node) {
  let rect;

  if (!options.width || !options.height) {
    rect = node.getBoundingClientRect();
  }

  return {
    width: options.width || rect.width,
    height: options.height || rect.height
  };
}

export function makeForeignObjectSVG(node, options) {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  svg.setAttributeNS(null, "width", options.width);
  svg.setAttributeNS(null, "height", options.height);

  const foreignObject = document.createElementNS(xmlns, "foreignObject");
  foreignObject.setAttributeNS(null, "width", "100%");
  foreignObject.setAttributeNS(null, "height", "100%");
  svg.appendChild(foreignObject);

  foreignObject.appendChild(node);

  return svg;
}

export function loadSVGIntoImage(svg) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;

    img.src = `data:image/svg+xml;charset=utf-8,${new XMLSerializer().serializeToString(
      svg
    )}`;
  });
}

export function getBase64FromImage(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  canvas.getContext("2d").drawImage(image, 0, 0);

  return canvas.toDataURL("image/jpeg", 1);
}

export function cloneAndInlineStyles(node) {
  const original = node;
  const cloned = node.cloneNode(true);

  inlineStyles(cloned, original);

  return cloned;
}

function inlineStyles(clone, original) {
  const originalStyle = window.getComputedStyle(original);

  if (originalStyle.cssText) {
    clone.style.cssText = originalStyle.cssText;
  } else {
    for (let i = 0; i < originalStyle.length; i++) {
      const name = originalStyle[i];

      clone.style.setProperty(
        name,
        originalStyle.getPropertyValue(name),
        originalStyle.getPropertyPriority(name)
      );
    }
  }

  if (original instanceof HTMLIFrameElement) {
    return;
  }

  for (let i = 0; i < clone.children.length; i++) {
    inlineStyles(clone.children[i], original.children[i]);
  }
}
