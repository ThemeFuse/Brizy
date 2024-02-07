import React, { ReactElement } from "react";
import { Root as BaseRoot } from "visual/component/Root";
import { getGlobalBlockPlaceholder } from "visual/utils/dynamicContent/globalBlocks";

interface Props {
  type: "page" | "block";
  children: ReactElement;
}

export const Root = (props: Props): ReactElement => {
  const { type, children } = props;

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
      <BaseRoot>
        {topPlaceholder}
        {children}
        {bottomPlaceholder}
      </BaseRoot>
    );
  }

  return children;
};
