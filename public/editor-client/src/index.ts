import { autoSave } from "./autoSave";
import { getCollectionItemsIds } from "./collectionItems/getCollectionItemsIds";
import { loadCollectionTypes } from "./collectionTypes/loadCollectionTypes";
import { getConfig } from "./config";
import { addFile } from "./customFile/addFile";
import { explodePlaceholder } from "./dynamicContent/explodePlaceholder";
import { makePlaceholder } from "./dynamicContent/makePlaceholder";
import { addMedia } from "./media/addMedia";
import { addMediaGallery } from "./media/addMediaGallery";
import { onChange } from "./onChange";
import { publish } from "./publish";
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
  savedLayouts,
  collectionItems: {
    getCollectionItemsIds
  },
  collectionTypes: {
    loadCollectionTypes
  }
};

if (window.__VISUAL_CONFIG__) {
  // API
  window.__VISUAL_CONFIG__.api = api;

  // AutoSave
  window.__VISUAL_CONFIG__.onAutoSave = autoSave;

  // OnChange
  window.__VISUAL_CONFIG__.onChange = onChange;

  // UI
  if (window.__VISUAL_CONFIG__.ui) {
    window.__VISUAL_CONFIG__.ui.publish = publish;
  }

  // Dynamic Content
  if (window.__VISUAL_CONFIG__.dynamicContent) {
    window.__VISUAL_CONFIG__.dynamicContent.makePlaceholder = makePlaceholder;
    window.__VISUAL_CONFIG__.dynamicContent.explodePlaceholder =
      explodePlaceholder;
  }
}
