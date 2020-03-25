import jQuery from "jquery";
import * as Components from "../../component/index.export.js";
import * as EditorComponents from "../../editorComponents/index.export.js";

export default function initExports($elem: typeof jQuery): void {
  Object.values(Components).forEach(fn => {
    fn($elem);
  });

  Object.values(EditorComponents).forEach(fn => {
    fn($elem);
  });
}
