import { getConfig } from "./config";
import { addFile } from "./customFile/addFile";
import { addMedia } from "./media/addMedia";
import { updateProject } from "./project/updateProject";

const config = getConfig();

if (!config) {
  throw new Error("Invalid __BRZ_PLUGIN_ENV__");
}

const api = {
  media: {
    addMedia,
    mediaResizeUrl: config.api.mediaResizeUrl
  },
  customFile: {
    addFile,
    customFileUrl: config.api.customFileUrl
  },
  onProjectUpdate: updateProject
};

if (window.__VISUAL_CONFIG__) {
  window.__VISUAL_CONFIG__.api = api;
}
