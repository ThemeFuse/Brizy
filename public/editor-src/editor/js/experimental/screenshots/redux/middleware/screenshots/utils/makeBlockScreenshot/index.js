import Config from "visual/global/Config";
import { uuid } from "visual/utils/uuid";
import { urlContainsQueryString } from "visual/utils/url";
import { cloneAndInlineStyles } from "./cloneAndInlineStyles.js";

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
    const canvas = document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    canvas.getContext("2d").drawImage(image, 0, 0);

    const canvasBase64 = canvas.toDataURL("image/jpeg", 1);

    resolve({
      src: canvasBase64,
      width: image.width,
      height: image.height
    });
  };
  image.onerror = reject;
  image.crossOrigin = "anonymous";
  image.src = base64;

  delete promises[id];
};

export async function makeBlockScreenshot(block, options = {}) {
  const node = document.querySelector(`#${block.value._id}`);

  if (!node) {
    return Promise.reject(`Could not find block with _id ${block.value._id}`);
  }

  let cloned;

  try {
    cloned = await cloneAndInlineStyles(node);
  } catch (e) {
    console.error("cloneinline", e);
  }

  const options_ = calcOptions(options, node);
  const blob = new Blob([cloned.outerHTML], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const id = uuid(3);

    promises[id] = [resolve, reject, options_, url];

    worker.postMessage({
      id,
      url,
      options: options_,
      proxyUrl: proxyUrl()
    });
  });
}

function calcOptions(options, node) {
  let rect;

  if (!options.width || !options.height) {
    rect = node.getBoundingClientRect();
  }

  return {
    width: options.width || rect.width,
    height: options.height || rect.height
  };
}

function proxyUrl() {
  const siteUrl = Config.get("urls").site;

  return urlContainsQueryString(siteUrl)
    ? `${siteUrl}&brizy_file=`
    : `${siteUrl}?brizy_file=`;
}
