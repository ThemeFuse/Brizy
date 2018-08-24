import Config from "visual/global/Config";
import Editor from "visual/global/Editor";

const {
  registerTemplates,
  registerBlocks,
  registerStyles,
  getShortcodes
} = Editor;

global.Brizy = {
  config: Config,
  utils: {
    registerTemplates,
    registerBlocks,
    registerStyles,
    getShortcodes
  }
};
