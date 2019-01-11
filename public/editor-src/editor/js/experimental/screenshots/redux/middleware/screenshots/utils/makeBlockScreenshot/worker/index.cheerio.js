import cheerio from "cheerio";
import iframePlaceholders from "./iframePlaceholders";

onmessage = async e => {
  const { id, nodeString, options } = e.data;

  const $ = cheerio.load(nodeString, {
    withDomLvl1: false,
    xmlMode: true,
    normalizeWhitespace: true
  });

  removeEditorDOMNodes($);
  replaceIframesWithPlaceholders($);
  transformPictureToImg($);
  await inlineImages($);

  // remove extra text. it's quite fast
  // and reduces often multiple thousand chars
  $("*")
    .removeAttr("id")
    .removeAttr("class")
    .removeAttr("data-href"); // data-href makes the screenshot crash

  const uri = makeSvgDataUri($.xml(), options).replace(/#/g, "%23");

  postMessage({
    id,
    uri
  });
};

function removeEditorDOMNodes($) {
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

  $(selector).remove();
}

function replaceIframesWithPlaceholders($) {
  $("iframe").each(function() {
    const $this = $(this);
    const display = $this.css("display");

    if (display !== "none") {
      const selectors = [
        "script",
        ".brz-map",
        ".brz-bg-map",
        ".brz-video",
        ".brz-bg-video",
        ".brz-soundcloud",
        ".brz-test"
      ];
      const $parentComponent = $this.closest(selectors.join(","));
      const placeholderImg =
        $parentComponent.length > 0 &&
        selectors.reduce((acc, el) => {
          return $parentComponent.hasClass(el.slice(1))
            ? iframePlaceholders[el.replace(".brz-", "")]
            : acc;
        }, null);

      const iframeStyle = $this.css();
      const placeholderStyle = {
        width: $this.attr("width") || iframeStyle.width,
        height: $this.attr("height") || iframeStyle.height,
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
      const placeholder = `<div style="${placeholderStyleStr}"></div>`;

      $this.replaceWith(placeholder);
    }
  });
}

function transformPictureToImg($) {
  $("picture").each(function() {
    const $this = $(this);

    $this.find("source").remove();
    $this.find("img").removeAttr("srcset");
  });
}

async function inlineImages($) {
  const promises = [];

  $("img").each(async function() {
    const $this = $(this);
    const src = $(this).attr("src");

    if (!isBase64(src)) {
      promises.push(
        fetchResource(src).then(base64 => {
          $this.attr("src", base64);
        })
      );
    }
  });

  $(`[style*="url"]`).each(async function() {
    const $this = $(this);
    const style = $this.attr("style");
    const urlRegex = /(url\("?'?([^\"')]+)"?'?\))/;
    const urlMatch = urlRegex.exec(style);
    const [, url, src] = urlMatch || [];

    if (url && src && !isBase64(src)) {
      promises.push(
        fetchResource(src).then(base64 => {
          $this.attr("style", style.replace(urlRegex, `url("${base64}")`));
        })
      );
    }
  });

  return Promise.all(promises);
}

function makeSvgDataUri(nodeString, options) {
  const { width, height } = options;
  const foreignObject = `<foreignObject x="0" y="0" width="100%" height="100%">${nodeString}</foreignObject>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${foreignObject}</svg>`;

  return "data:image/svg+xml;charset=utf-8," + svg;
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
