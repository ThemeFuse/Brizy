import React, { ReactElement } from "react";
import { createPortal } from "react-dom";
import EditorIcon from "visual/component/EditorIcon";

interface Props {
  node: HTMLElement | null;
}

export function PortalLoading(props: Props) {
  const { node } = props;

  if (!node) {
    return null;
  }

  const doc = node.ownerDocument;

  const loading: ReactElement = (
    <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
  );

  const rootContainer: HTMLDivElement = doc.createElement("div");
  rootContainer.className = "brz-ed-portal__loading";

  node.append(rootContainer);

  return createPortal(loading, rootContainer);
}
