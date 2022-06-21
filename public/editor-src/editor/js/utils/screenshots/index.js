import Config from "visual/global/Config";
import { uuid } from "visual/utils/uuid";
import { urlContainsQueryString } from "visual/utils/url";
import { cloneAndInlineStyles } from "./cloneAndInlineStyles.js";
import { assetUrl } from "visual/utils/asset";

export { browserSupports } from "./browserSupports";

// Note: Workers are build in a separated files
// See webpack.config.worker.js
const getWorkerUrl = config => {
  const url = config.urls.worker ?? assetUrl("editor/js");
  return `${url}/screenshots.worker.js`;
};

const SCREENSHOT_MAX_WIDTH = 600;

const promises = {};

const worker = new Worker(getWorkerUrl(Config.getAll()), { type: "module" });

worker.onmessage = async e => {
  const { id, url: workerUrl } = e.data;

  const r = await fetch(workerUrl);
  const base64 = await r.text();

  /* eslint-disable no-unused-vars */
  const [resolve, reject, options, mainThreadUrl] = promises[id];
  /* eslint-enabled no-unused-vars */

  URL.revokeObjectURL(mainThreadUrl);
  URL.revokeObjectURL(workerUrl);

  const image = document.createElement("img");
  image.onload = async () => {
    let canvasWidth = image.width;
    let canvasHeight = image.height;
    if (canvasWidth > SCREENSHOT_MAX_WIDTH) {
      canvasHeight = Math.floor(
        (SCREENSHOT_MAX_WIDTH * canvasHeight) / canvasWidth
      );
      canvasWidth = SCREENSHOT_MAX_WIDTH;
    }

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.getContext("2d").drawImage(image, 0, 0, canvasWidth, canvasHeight);

    const canvasBase64 = canvas.toDataURL("image/jpeg", 1);

    resolve({
      src: canvasBase64,
      width: canvasWidth,
      height: canvasHeight
    });
  };
  image.onerror = reject;
  image.crossOrigin = "anonymous";
  image.src = base64;

  delete promises[id];
};

export async function makeNodeScreenshot(node) {
  if (!node) {
    return Promise.reject("Could not find node");
  }

  const nodeStyle = getComputedStyle(node);

  if (nodeStyle.display === "none" || nodeStyle.opacity === "0") {
    return Promise.reject(
      `Could not make screenshot for node ${node} because it's hidden`
    );
  }

  let cloned;

  try {
    cloned = await cloneAndInlineStyles(node);
  } catch (e) {
    /* eslint-disable no-console */
    console.error("cloneinline", e);
    /* eslint-enabled no-console */
  }

  const options = calcOptions(node);
  const blob = new Blob([cloned.outerHTML], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const id = uuid(3);
    const { assets: assetUrl, site: siteUrl } = Config.get("urls");

    promises[id] = [resolve, reject, options, url];

    worker.postMessage({
      id,
      url,
      assetUrl,
      siteUrl,
      options,
      proxyUrl: proxyUrl()
    });
  });
}

function calcOptions(node) {
  let { width, height } = node.getBoundingClientRect();

  return { width, height };
}

function proxyUrl() {
  if (TARGET === "WP") {
    const siteUrl = Config.get("urls").site;
    const prefix = Config.get("prefix") ?? "brizy";

    return urlContainsQueryString(siteUrl)
      ? `${siteUrl}&${prefix}_file=`
      : `${siteUrl}?${prefix}_file=`;
  } else {
    const siteUrl = Config.get("urls").site;

    return `${siteUrl}/download/proxy?url=`;
  }
}
