import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import EditorIcon from "visual/component/EditorIcon";

type RenderNode = HTMLElement | null;
type CloseNode = HTMLElement | null | undefined;

class PortalLoading {
  static opened: Set<HTMLElement> = new Set();

  static render(node: RenderNode): HTMLElement | undefined {
    const rootNode = node || document.body;
    const doc = rootNode && rootNode.ownerDocument;

    if (rootNode && doc) {
      const loading: ReactElement = (
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      );

      const rootContainer: HTMLDivElement = doc.createElement("div");
      rootContainer.className = "brz-ed-portal__loading";

      rootNode.append(rootContainer);
      PortalLoading.opened.add(rootContainer);

      ReactDOM.render(loading, rootContainer);

      return rootContainer;
    }
  }

  static close(node: CloseNode): void {
    if (node) {
      node.remove();
      PortalLoading.opened.delete(node);
    }
  }

  static closeAll(): void {
    // Remove All node append
    PortalLoading.opened.forEach(node => {
      node.remove();
    });

    // Clear Set
    PortalLoading.opened.clear();
  }
}

export { PortalLoading };
