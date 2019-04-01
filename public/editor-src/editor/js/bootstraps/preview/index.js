import "@babel/polyfill";
import jQuery from "jquery";
import * as Components from "../../component/index.export.js";
import * as EditorComponents from "../../editorComponents/index.export.js";

jQuery(document).ready(function() {
  Object.values(Components).forEach(fn => {
    fn();
  });

  Object.values(EditorComponents).forEach(fn => {
    fn();
  });
});
