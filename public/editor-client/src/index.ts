import { getConfig } from "./config";
import { addFile } from "./customFile/addFile";
import { addMedia } from "./media/addMedia";
import { addMediaGallery } from "./media/addMediaGallery";
import { savedBlocks } from "./savedBlocks/savedBlocks";
import { savedLayouts } from "./savedBlocks/savedLayouts";
import { savedPopups } from "./savedBlocks/savedPopups";

const config = getConfig();

if (!config) {
  throw new Error("Invalid __BRZ_PLUGIN_ENV__");
}

const api = {
  media: {
    addMedia,
    addMediaGallery,
    mediaResizeUrl: config.api.mediaResizeUrl
  },
  customFile: {
    addFile,
    customFileUrl: config.api.customFileUrl
  },
  savedBlocks,
  savedPopups,
  savedLayouts
};

if (window.__VISUAL_CONFIG__) {
  window.__VISUAL_CONFIG__.api = api;
}
