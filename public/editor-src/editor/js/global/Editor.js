import deepMerge from "deepmerge";

let components = {};
let notFoundComponent;
let blocks = {};
let blocksById = {};
let blockThumbnailUrlHandlers = [];
let templates;
let templateThumbnailUrlHandlers = [];
let shortcodes = {};
let styles = [];

const Editor = {
  // components

  registerComponent(component) {
    if (process.env.NODE_ENV === "development") {
      if (!component.componentId) {
        throw new Error(
          "an EditorComponent must have a static componentId property"
        );
      }
    }

    components[component.componentId] = component;
  },

  getComponents() {
    return components;
  },

  getComponent(id) {
    return components[id] || null;
  },

  registerNotFoundComponent(component) {
    notFoundComponent = component;
  },

  getNotFoundComponent() {
    if (!notFoundComponent) {
      throw new Error("NotFoundComponent not registered");
    }

    return notFoundComponent;
  },

  // blocks

  registerBlocks(config, { thumbnailUrlHandler } = {}) {
    if (thumbnailUrlHandler) {
      blockThumbnailUrlHandlers.push(thumbnailUrlHandler);
    }

    blocks = deepMerge(blocks, config);

    blocksById = blocks.blocks.reduce((acc, blockData) => {
      acc[blockData.id] = blockData;
      return acc;
    }, {});
  },

  getBlocks() {
    return blocks;
  },

  getBlock(id) {
    return blocksById[id] || null;
  },

  getBlockThumbnailUrlHandlers() {
    return blockThumbnailUrlHandlers;
  },

  // templates

  registerTemplates(templatesConfig, { thumbnailUrlHandler } = {}) {
    if (thumbnailUrlHandler) {
      templateThumbnailUrlHandlers.push(thumbnailUrlHandler);
    }

    templates = templatesConfig;
  },

  getTemplates() {
    return templates;
  },

  getTemplateThumbnailUrlHandlers() {
    return templateThumbnailUrlHandlers;
  },

  // shortcodes

  registerShortcode(shortcodeComponents) {
    shortcodes = shortcodeComponents;
  },

  getShortcodes() {
    return shortcodes;
  },

  getShortcode(id) {
    return shortcodes[id] || null;
  },

  // styles

  registerStyles(stylesConfig) {
    styles.push(...stylesConfig);
  },

  getStyles() {
    return styles;
  },

  getStyle(id) {
    return styles.find(style => style.id === id);
  }
};

export default Editor;
