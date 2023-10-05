import * as Components from "../../component/index.export.js";
import * as EditorComponents from "../../editorComponents/index.export.js";

export default function initExports($elem: JQuery<HTMLElement>): void {
  Object.values(Components).forEach(fn => {
    fn($elem);
  });

  Object.values(EditorComponents).forEach(fn => {
    fn($elem);
  });
}
