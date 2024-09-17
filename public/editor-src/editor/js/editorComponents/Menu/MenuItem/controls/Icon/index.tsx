import React from "react";
import { Icon } from "./Icon";
import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { ContainerProps } from "./types";

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
