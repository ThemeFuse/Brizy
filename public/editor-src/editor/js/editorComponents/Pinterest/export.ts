import type { ExportFunction } from "visual/types";
import { loadPinterestScript } from "./scripts";

const fn: ExportFunction = (node) => {
  const pinterestNodes = node.querySelectorAll(".brz-pinterest");

  if (pinterestNodes.length > 0) {
    loadPinterestScript(document);
  }
};

export default fn;
