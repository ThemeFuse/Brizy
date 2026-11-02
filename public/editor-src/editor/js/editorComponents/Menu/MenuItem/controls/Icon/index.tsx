import React from "react";
import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { Icon } from "./Icon";
import type { ContainerProps } from "./types";

export const IconContainer = (props: ContainerProps): JSX.Element => {
  const { itemId, wrapInPlaceholder, ...iconProps } = props;
  const icon = <Icon {...iconProps} />;

  if (wrapInPlaceholder) {
    const startPlaceholder = makeStartPlaceholder({
      content: "{{ menu_item_icon_value }}",
      attr: { itemId }
    });
    const endPlaceholder = makeEndPlaceholder({
      content: "{{ end_menu_item_icon_value }}"
    });
    return (
      <>
        {startPlaceholder}
        {icon}
        {endPlaceholder}
      </>
    );
  }

  return icon;
};
