import { MouseEvent as ReactMouseEvent } from "react";
import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { onOffToBool } from "visual/utils/boolean";
import { containsNode } from "visual/utils/ecwid";
import { Value } from "./types";

interface Data {
  selector: string;
  fn: (e: MouseEvent) => void;
}

export const onClickCapture = (
  e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
  data: Array<Data>
) => {
  e.stopPropagation();
  e.preventDefault();

  for (let i = 0; i < data.length; i++) {
    const { selector, fn } = data[i];

    if (containsNode(e, selector)) {
      fn(e.nativeEvent);
      break;
    }
  }
};

export const valueToEciwdConfig = (v: Value): EcwidConfig => ({
  show_footer_menu: onOffToBool(v.footerDisplay),
  product_filters_position_search_page: v.sidebarAlign
});
