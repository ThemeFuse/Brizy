import { makeAttr } from "visual/utils/i18n/attribute";
import { read as readNumber } from "visual/utils/reader/number";
import { ProgressStyle } from "./types";
import { animate, readType } from "./utils";

export default function ($node: JQuery): void {
  const node = $node.get(0);

  if (!node) {
    return;
  }

  node.querySelectorAll<HTMLDivElement>(".brz-progress-bar").forEach((item) => {
    const wrapper = item.querySelector<HTMLDivElement>(
      ".brz-progress-bar__wrapper"
    );
    const text = item.querySelector<HTMLSpanElement>(
      ".brz-progress-bar__percent"
    );

    const type =
      readType(item.getAttribute(makeAttr("type"))) ?? ProgressStyle.Style1;
    const value = readNumber(wrapper?.getAttribute("data-progress"));

    if (wrapper && value) {
      animate({ text, wrapper, type, value });
    }
  });
}
