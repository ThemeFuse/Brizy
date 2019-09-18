import Config from "visual/global/Config";
import { uuid } from "visual/utils/uuid";
import { urlContainsQueryString } from "visual/utils/url";
import { cloneAndInlineStyles } from "./cloneAndInlineStyles.js";

const SCREENSHOT_MAX_WIDTH = 600;

const promises = {};

const worker = new Worker("./worker/index.js", { type: "module" });

worker.onmessage = async e => {
  const { id, url: workerUrl } = e.data;

  const r = await fetch(workerUrl);
  const base64 = await r.text();

  const [resolve, reject, options, mainThreadUrl] = promises[id];

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

export async function makeBlockScreenshot(block, options = {}) {
  const node = options.node || document.querySelector(`#${block.value._id}`);

  if (!node) {
    return Promise.reject(`Could not find block with _id ${block.value._id}`);
  }

  const nodeStyle = getComputedStyle(node);

  if (nodeStyle.display === "none" || nodeStyle.opacity === "0") {
    return Promise.reject(
      `Could not make screenshot for block with _id ${
        block.value._id
      } because it's hidden`
    );
  }

  let cloned;

  try {
    cloned = await cloneAndInlineStyles(node);
  } catch (e) {
    console.error("cloneinline", e);
  }

  const options_ = calcOptions(node);
  const blob = new Blob([cloned.outerHTML], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const id = uuid(3);
    const siteUrl = Config.get("urls").site;

    promises[id] = [resolve, reject, options_, url];

    worker.postMessage({
      id,
      url,
      options: options_,
      siteUrl,
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

    return urlContainsQueryString(siteUrl)
      ? `${siteUrl}&brizy_file=`
      : `${siteUrl}?brizy_file=`;
  } else {
    const siteUrl = Config.get("urls").site;

    return `${siteUrl}/download/proxy?url=`;
  }
}
