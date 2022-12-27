import { getConfig } from "./config";
import { addMedia } from "./media/addMedia";

const config = getConfig();

if (!config) {
  throw new Error("Invalid __BRZ_PLUGIN_ENV__");
}

const api = {
  media: {
    addMedia,
    mediaResizeUrl: config.actions.mediaResizeUrl
  }
};

if (window.__VISUAL_CONFIG__) {
  window.__VISUAL_CONFIG__.api = api;
}
