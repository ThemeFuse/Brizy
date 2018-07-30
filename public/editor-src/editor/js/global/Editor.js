const components = {};
let notFoundComponent;
let blocksConfig;
let blocksById;
let shortcodes = {};

const Editor = {
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

  registerNotFoundComponent(component) {
    notFoundComponent = component;
  },

  registerBlocks(config) {
    blocksConfig = config;
    blocksById = config.blocks.reduce((acc, blockData) => {
      acc[blockData.id] = blockData;
      return acc;
    }, {});
  },

  registerShortcode(shortcodeComponents) {
    shortcodes = shortcodeComponents;
  },

  getComponents() {
    return components;
  },

  getComponent(id) {
    return components[id] || null;
  },

  getNotFoundComponent() {
    if (!notFoundComponent) {
      throw new Error("NotFoundComponent not registered");
    }

    return notFoundComponent;
  },

  getBlocks() {
    return blocksConfig;
  },

  getBlock(id) {
    return blocksById[id] || null;
  },

  getShortcodes() {
    return shortcodes;
  },

  getShortcode(shortcodeType) {
    return shortcodes[shortcodeType] || null;
  }
};

export default Editor;
