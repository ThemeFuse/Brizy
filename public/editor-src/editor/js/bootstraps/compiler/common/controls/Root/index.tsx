import React, { ReactElement } from "react";
import { Root as BaseRoot } from "visual/component/Root";
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
      <BaseRoot className={className}>
        {hasGlobalBlocks && topPlaceholder}
        {children}
        {hasGlobalBlocks && bottomPlaceholder}
      </BaseRoot>
    );
  }

  return children;
};
