import { once } from "underscore";
import Config from "visual/global/Config";
import { Config as ConfigType } from "visual/global/Config/types";
import { isWp } from "visual/global/Config/types/configs/WP";
import { assetUrl } from "visual/utils/asset";
import { urlContainsQueryString } from "visual/utils/url";
import { uuid } from "visual/utils/uuid";
import { cloneAndInlineStyles } from "./cloneAndInlineStyles.js";
import { _Worker } from "visual/utils/worker";

export { browserSupports } from "./browserSupports";

// Note: Workers are build in a separated files
// See webpack.config.worker.js
const getWorkerUrl = (config: ConfigType) => {
  const base = config.urls?.worker ?? assetUrl("editor/js");
  const version = config.editorVersion;
  return `${base}/screenshots.worker.min.js?ver=${version}`;
};

const SCREENSHOT_MAX_WIDTH = 600;

interface Screenshot {
  src: string;
  width: number;
  height: number;
}
type Options = {
  width: number;
  height: number;
  maxWidth: number;
};
const promises: Record<
  string,
  [(s: Screenshot) => void, OnErrorEventHandler, Options, string]
> = {};

const getWorker = once(() => {
  const Worker = _Worker.getInstance();
  const worker = new Worker(getWorkerUrl(Config.getAll()), { type: "module" });

  worker.onmessage = async (e) => {
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
      if (canvasWidth > options.maxWidth) {
        canvasHeight = Math.floor(
          (options.maxWidth * canvasHeight) / canvasWidth
        );
        canvasWidth = options.maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas
        ?.getContext("2d")
        ?.drawImage(image, 0, 0, canvasWidth, canvasHeight);

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

  return worker;
});

export async function makeNodeScreenshot(
  node: Element | null,
  config?: { maxWidth?: number }
): Promise<Screenshot> {
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
    const { assets: assetUrl, site: siteUrl } = Config.getAll().urls;

    promises[id] = [
      resolve,
      reject,
      { ...options, maxWidth: config?.maxWidth || SCREENSHOT_MAX_WIDTH },
      url
    ];

    const worker = getWorker();

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

function calcOptions(node: Element): { width: number; height: number } {
  const { width, height } = node.getBoundingClientRect();

  return { width, height };
}

function proxyUrl() {
  const config = Config.getAll();
  if (TARGET === "WP") {
    const siteUrl = config.urls.site;
    const prefix = (isWp(config) ? config.prefix : undefined) ?? "brizy";

    return urlContainsQueryString(siteUrl)
      ? `${siteUrl}&${prefix}_file=`
      : `${siteUrl}?${prefix}_file=`;
  } else {
    return "";
  }
}
