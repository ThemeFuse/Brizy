import jQuery from "jquery";
import * as Components from "../../component/index.export.js";
import * as EditorComponents from "../../editorComponents/index.export.js";
import * as EditorProComponents from "../../editorComponents/index.export.pro.js";

export default function initExports($elem: typeof jQuery): void {
  Object.values({
    ...Components,
    ...EditorComponents,
    ...EditorProComponents
  }).forEach(fn => {
    fn($elem);
  });
}
