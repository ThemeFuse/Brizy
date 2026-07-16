import { once } from "es-toolkit";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon.js";
import { isWp } from "visual/global/Config/types/configs/WP";
import { assetUrl } from "visual/utils/asset";
import { urlContainsQueryString } from "visual/utils/url";
import { uuid } from "visual/utils/uuid";
import { _Worker } from "visual/utils/worker";
import { cloneAndInlineStyles } from "./cloneAndInlineStyles.js";

export { browserSupports, isScreenshotSupported } from "./browserSupports";

// Note: Workers are build in a separated files
// See rspack.config.worker.js
const getWorkerUrl = (config: ConfigCommon) => {
  const base = config.urls?.worker ?? assetUrl("editor/js", config);
  return `${base}/screenshots.worker.min.js?ver=${BUILD_VERSION}`;
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
type Pending = [
  (s: Screenshot) => void,
  OnErrorEventHandler,
  Options,
  string,
  ReturnType<typeof setTimeout>
];
const promises: Record<string, Pending> = {};
const SCREENSHOT_TIMEOUT_MS = 30 * 1000;

function settlePending(id: string, err: unknown) {
  const entry = promises[id];
  if (!entry) return;
  const [, reject, , mainThreadUrl, timer] = entry;
  clearTimeout(timer);
  delete promises[id];
  URL.revokeObjectURL(mainThreadUrl);
  reject?.(err as Event);
}

function rejectAllPending(err: unknown) {
  for (const id of Object.keys(promises)) {
    settlePending(id, err);
  }
}

const getWorker = once((config: ConfigCommon) => {
  const Worker = _Worker.getInstance();
  const worker = new Worker(getWorkerUrl(config), { type: "module" });

  worker.onerror = (err) => {
    console.error("screenshot worker error", err);
    rejectAllPending(err);
  };

  worker.onmessage = (e) => {
    const { id, url: dataUri, error } = e.data;
    if (error) {
      settlePending(id, new Error(`screenshot worker: ${error}`));
      return;
    }
    const entry = promises[id];
    if (!entry) return;
    const [resolve, reject, options, mainThreadUrl, timer] = entry;

    clearTimeout(timer);
    delete promises[id];
    URL.revokeObjectURL(mainThreadUrl);

    const image = document.createElement("img");
    image.onload = () => {
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

      try {
        resolve({
          src: canvas.toDataURL("image/jpeg", 1),
          width: canvasWidth,
          height: canvasHeight
        });
      } catch (e) {
        // SecurityError: canvas tainted — should not happen with data URIs
        // but guard anyway so the promise always settles
        console.error("screenshot toDataURL failed", e);
        reject?.(e as Event);
      }
    };
    image.onerror = (err) => {
      console.error("screenshot image failed to load", err);
      reject?.(err ?? new Event("error"));
    };
    // Worker sends a data:image/svg+xml;base64,... URI via FileReader.
    // Data URIs do not taint the canvas; blob URLs do (Chrome security policy).
    image.src = dataUri;
  };

  return worker;
});

export async function makeNodeScreenshot(
  node: Element | null,
  globalConfig: ConfigCommon,
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

  const cloned = cloneAndInlineStyles(node);

  const options = calcOptions(node);
  const blob = new Blob([cloned.outerHTML], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const id = uuid(3);
    const { assets: assetUrl, site: siteUrl } = globalConfig.urls ?? {};

    const timer = setTimeout(() => {
      settlePending(id, new Error("screenshot worker timeout"));
    }, SCREENSHOT_TIMEOUT_MS);

    promises[id] = [
      resolve,
      reject,
      { ...options, maxWidth: config?.maxWidth || SCREENSHOT_MAX_WIDTH },
      url,
      timer
    ];

    const worker = getWorker(globalConfig);

    worker.postMessage({
      id,
      url,
      assetUrl,
      siteUrl,
      options,
      proxyUrl: proxyUrl(globalConfig)
    });
  });
}

function calcOptions(node: Element): { width: number; height: number } {
  const { width, height } = node.getBoundingClientRect();

  return { width, height };
}

function proxyUrl(config: ConfigCommon) {
  const siteUrl = config.urls?.site;

  if (TARGET === "WP" && siteUrl) {
    const prefix = (isWp(config) ? config.prefix : undefined) ?? "brizy";

    return urlContainsQueryString(siteUrl)
      ? `${siteUrl}&${prefix}_file=`
      : `${siteUrl}?${prefix}_file=`;
  } else {
    return "";
  }
}
