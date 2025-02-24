import React, { ReactElement } from "react";
import { RootContainer } from "visual/component/RootContainer";
import { getGlobalBlockPlaceholder } from "visual/utils/dynamicContent/globalBlocks";

interface Props {
  className?: string;
  type: "page" | "block";
  children: ReactElement;
  hasGlobalBlocks?: boolean;
}

export const Root = (props: Props): ReactElement => {
  const { type, children, className, hasGlobalBlocks } = props;

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
      <RootContainer className={className}>
        {hasGlobalBlocks && topPlaceholder}
        {children}
        {hasGlobalBlocks && bottomPlaceholder}
      </RootContainer>
    );
  }

  return children;
};
