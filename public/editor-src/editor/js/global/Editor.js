import _ from "underscore";
import { applyFilter } from "visual/utils/filters";

let components = {};
let notFoundComponent;
let blocks = {};
let templates = {};
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

  registerBlocks(config) {
    blocks = config;
  },

  getBlocks: _.memoize(() => {
    const filteredBlocks = applyFilter("getBlocks", blocks);

    filteredBlocks.blocks = _.sortBy(
      filteredBlocks.blocks,
      block => block.position || 10
    );

    return filteredBlocks;
  }),

  getBlock(id) {
    return this.getBlocks().blocks.find(block => block.id === id);
  },

  getBlockThumbnailUrlHandlers() {
    return blockThumbnailUrlHandlers;
  },

  // templates

  getTemplates() {
    return applyFilter("getTemplates", templates);
  },

  getTemplateThumbnailUrlHandlers() {
    return templateThumbnailUrlHandlers;
  },

  // shortcodes

  registerShortcode(shortcodeComponents) {
    shortcodes = shortcodeComponents;
  },

  getShortcodes() {
    return applyFilter("getShortcodes", shortcodes);
  },

  // styles

  registerStyles(stylesConfig) {
    styles.push(...stylesConfig);
  },

  getStyles() {
    return applyFilter("getStyles", styles);
  },

  getStyle(id) {
    return this.getStyles().find(style => style.id === id);
  }
};

export default Editor;
