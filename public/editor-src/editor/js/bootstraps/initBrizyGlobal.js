import Config from "visual/global/Config";
import Editor from "visual/global/Editor";
import { addFilter, applyFilter } from "visual/utils/filters";

const {
  registerTemplates,
  registerBlocks,
  registerStyles,
  getShortcodes
} = Editor;

global.Brizy = {
  config: Config,
  addFilter,
  applyFilter,
  utils: {
    registerTemplates,
    registerBlocks,
    registerStyles,
    getShortcodes
  }
};
