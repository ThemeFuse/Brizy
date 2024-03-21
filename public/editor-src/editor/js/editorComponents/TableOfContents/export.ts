import { makeAttr } from "visual/utils/i18n/attribute";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/reader/string";
import { decodeFromString } from "visual/utils/string";
import { getSelectedElements } from "./utils";
import {
  changeIcon,
  isMinimized,
  openHideTOC,
  readMarkerType,
  renderList
} from "./utils.export";

export default function ($node: JQuery): void {
  const node = $node.get(0);

  if (!node) {
    return;
  }

  node.querySelectorAll<HTMLDivElement>(".brz-toc").forEach((item) => {
    const tocBody = item.querySelector<HTMLDivElement>(".brz-toc-body");
    const tocHeader = item.querySelector<HTMLDivElement>(".brz-toc-header");

    if (tocBody && tocHeader) {
      const tocIconWrapper = item.querySelector<HTMLDivElement>(
        ".brz-toc-icon-wrapper"
      );
      const markerType =
        readMarkerType(item.getAttribute(makeAttr("data-marker"))) ?? "circle";
      const selected =
        Str.read(item.getAttribute(makeAttr("data-selected"))) ?? "";
      const _selected = selected ? decodeFromString<string>(selected) : "";
      const animDuration =
        (Num.read(item.getAttribute(makeAttr("data-anim-duration"))) ?? 0) *
        1000;
      const include =
        Str.read(item.getAttribute(makeAttr("data-include"))) ?? "";
      const exclude =
        Str.read(item.getAttribute(makeAttr("data-exclude"))) ?? "";

      const mDesktop =
        Str.read(item.getAttribute(makeAttr("data-minimized"))) ?? "desktop";
      const mTablet =
        Str.read(item.getAttribute(makeAttr("data-minimized-tablet"))) ??
        mDesktop;
      const mMobile =
        Str.read(item.getAttribute(makeAttr("data-minimized-mobile"))) ??
        mDesktop;
      let _isMinimized = isMinimized(mDesktop, mTablet, mMobile);
      const isMarkerNumbers = markerType === "numbers";

      const bodyList = document.createElement(isMarkerNumbers ? "ol" : "ul");
      bodyList.classList.add("brz-toc-body__list");

      const selectedElements = _selected.length
        ? getSelectedElements(_selected, include, exclude)
        : [];

      renderList(selectedElements, tocBody, bodyList, isMarkerNumbers);

      if (_isMinimized && tocIconWrapper) {
        changeIcon(tocIconWrapper, _isMinimized);
      }

      tocHeader?.addEventListener("click", () => {
        const height =
          tocBody.firstElementChild?.getBoundingClientRect().height ?? 0;

        changeIcon(tocIconWrapper, !_isMinimized);
        openHideTOC(!_isMinimized, tocBody, height, animDuration, tocHeader);
        _isMinimized = !_isMinimized;
      });
    }
  });
}
