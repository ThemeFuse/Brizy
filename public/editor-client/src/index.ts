import set from "lodash/set";
import { doAiRequest } from "./aiText";
import { autoSave } from "./autoSave";
import { getCollectionItemsIds } from "./collectionItems/getCollectionItemsIds";
import { searchCollectionItems } from "./collectionItems/searchCollectionItems";
import { loadCollectionTypes } from "./collectionTypes/loadCollectionTypes";
import { getConfig } from "./config";
import { addFile } from "./customFile/addFile";
import {
  defaultKits,
  defaultLayouts,
  defaultPopups,
  defaultStories
} from "./defaultTemplates";
import { handler as filters, possibleValues } from "./Elements/Filters";
import { placeholderData, placeholders } from "./dynamicContent";
import { handler as posts } from "./Elements/Posts";
import { uploadedFonts } from "./fonts";
import { heartBeat } from "./heartBeat";
import {globalBlocks } from "./globalBlocks/blocks";
import { globalPopups } from "./globalBlocks/popups";
import { addMedia } from "./media/addMedia";
import { addMediaGallery } from "./media/addMediaGallery";
import { onChange } from "./onChange";
import { onStartLoad } from "./onStartLoad";
import { popupConditions } from "./popupConditions";
import { publish } from "./publish";
import { savedBlocks } from "./savedBlocks/savedBlocks";
import { savedLayouts } from "./savedBlocks/savedLayouts";
import { savedPopups } from "./savedBlocks/savedPopups";
import { screenshots } from "./screenshots";

const config = getConfig();

if (!config) {
  throw new Error("Invalid __BRZ_PLUGIN_ENV__");
}

const api = {
  ...(config.api.openAIUrl ? { textAI: { handler: doAiRequest } } : {}),
  media: {
    addMedia,
    addMediaGallery,
    mediaResizeUrl: config.api.mediaResizeUrl,
    imagePatterns: config.api.imagePatterns
  },
  customFile: {
    addFile,
    fileUrl: config.api.fileUrl
  },
  savedBlocks,
  savedPopups,
  savedLayouts,
  popupConditions,
  globalBlocks,
  globalPopups,
  defaultKits: defaultKits(config),
  defaultPopups: defaultPopups(config),
  defaultStories: defaultStories(config),
  defaultLayouts: defaultLayouts(config),
  collectionItems: {
    searchCollectionItems,
    getCollectionItemsIds
  },
  collectionTypes: {
    loadCollectionTypes
  },
  screenshots: screenshots(),
  heartBeat: heartBeat(config)
};

if (window.__VISUAL_CONFIG__) {
  // API
  window.__VISUAL_CONFIG__.api = api;

  // AutoSave
  window.__VISUAL_CONFIG__.onAutoSave = autoSave;

  //onStartLoad

  window.__VISUAL_CONFIG__.onStartLoad = onStartLoad(config);

  // OnChange
  window.__VISUAL_CONFIG__.onChange = onChange;

  // UI
  if (window.__VISUAL_CONFIG__.ui) {
    window.__VISUAL_CONFIG__.ui.publish = publish;
  }

  // Elements
  if (window.__VISUAL_CONFIG__.elements) {
    set(window.__VISUAL_CONFIG__.elements, ["posts", "handler"], posts);
    set(window.__VISUAL_CONFIG__.elements, ["filters", "handler"], filters);
    set(
      window.__VISUAL_CONFIG__.elements,
      ["filters", "possibleValues"],
      possibleValues
    );
  } else {
    set(window.__VISUAL_CONFIG__, ["elements", "posts", "handler"], posts);
    set(window.__VISUAL_CONFIG__, ["elements", "filters", "handler"], filters);
    set(
      window.__VISUAL_CONFIG__,
      ["elements", "filters", "possibleValues"],
      possibleValues
    );
  }

  // Dynamic Content
  if (window.__VISUAL_CONFIG__.dynamicContent) {
    set(window.__VISUAL_CONFIG__.dynamicContent, ["handler"], placeholders);
    set(
      window.__VISUAL_CONFIG__.dynamicContent,
      ["getPlaceholderData"],
      placeholderData
    );
  }

  set(
    window.__VISUAL_CONFIG__,
    ["integrations", "fonts", "upload"],
    uploadedFonts
  );
}
