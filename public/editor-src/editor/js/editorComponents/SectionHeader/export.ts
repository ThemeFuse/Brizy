import { getFreeLibs } from "visual/libs";
import {
  getHeader,
  onAnimatedStickyChange,
  onFixedStickyChange
} from "./utils";

export default function (node: HTMLElement): void {
  const { sticky } = getFreeLibs();

  if (!sticky) {
    return;
  }

  node
    .querySelectorAll<HTMLElement>(".brz-section__header--animated")
    .forEach((element) => {
      sticky(element, {
        type: "animated",
        refNode: getHeader,
        onStickyChange: onAnimatedStickyChange
      });
    });

  node
    .querySelectorAll<HTMLElement>(".brz-section__header--fixed")
    .forEach((element) => {
      sticky(element, {
        type: "fixed",
        refNode: getHeader,
        onStickyChange: onFixedStickyChange
      });
    });
}
