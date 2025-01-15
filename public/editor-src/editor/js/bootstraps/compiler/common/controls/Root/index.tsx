import React, { ReactElement } from "react";
import { RootContainer } from "visual/component/RootContainer";
import { EditorMode } from "visual/global/EditorModeContext";
import { getGlobalBlockPlaceholder } from "visual/utils/dynamicContent/globalBlocks";

interface Props {
  className?: string;
  type: "page" | "block";
  children: ReactElement;
  hasGlobalBlocks?: boolean;
  editorMode: EditorMode;
}

export const Root = (props: Props): ReactElement => {
  const { type, children, className, hasGlobalBlocks, editorMode } = props;

  if (type === "page") {
    const topPlaceholder = getGlobalBlockPlaceholder({
      type: "position",
      position: "top"
    });
    const bottomPlaceholder = getGlobalBlockPlaceholder({
      type: "position",
      position: "bottom"
    });

    return (
      <RootContainer className={className} editorMode={editorMode}>
        {hasGlobalBlocks && topPlaceholder}
        {children}
        {hasGlobalBlocks && bottomPlaceholder}
      </RootContainer>
    );
  }

  return children;
};
