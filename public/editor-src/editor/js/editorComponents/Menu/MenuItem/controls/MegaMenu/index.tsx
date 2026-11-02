import React from "react";
import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import type { FCC } from "visual/utils/react/types";
import type { Props } from "./types";

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
