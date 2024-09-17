import React from "react";
import { Props } from "./types";
import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { FCC } from "visual/utils/react/types";

export const MegaMenuContainer: FCC<Props> = (props) => {
  const { wrapInPlaceholder, itemId, children } = props;

  if (wrapInPlaceholder) {
    const startPlaceholder = makeStartPlaceholder({
      content: "{{ mega_menu_value }}",
      attr: { itemId }
    });
    const endPlaceholder = makeEndPlaceholder({
      content: "{{ end_mega_menu_value }}"
    });

    return (
      <>
        {startPlaceholder}
        {children}
        {endPlaceholder}
      </>
    );
  }

  return children;
};
