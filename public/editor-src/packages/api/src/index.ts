import { getConfig } from "./config";
import { addFile } from "./customFile/addFile";
import { addMedia } from "./media/addMedia";
import { addMediaGallery } from "./media/addMediaGallery";

const config = getConfig();

if (!config) {
  throw new Error("Invalid __CLOUD_ENV__");
}

const api = {
  media: {
    mediaResizeUrl: config.mediaResizeUrl,
    addMedia: addMedia,
    addMediaGallery
  },
  customFile: {
    fileUrl: config.fileUrl,
    addFile: addFile
  }
};

if (window.__VISUAL_CONFIG__) {
  window.__VISUAL_CONFIG__.api = api;
}
