import $ from "jquery";
import { getFreeLibs } from "visual/libs";
import * as Str from "visual/utils/reader/string";

interface ShowData {
  showName: boolean;
  showFlags: boolean;
}

const getFlagElement = (showFlags: boolean, flag: string): string =>
  showFlags ? `<img class="brz-translation__flag" src="${flag}" />` : "";

const getNameElement = (showName: boolean, name: string) =>
  showName ? `<span class="brz-span">${name}</span>` : "";

const divInnerHTML = (
  item: Record<string, unknown>,
  flag: string,
  showData: ShowData
) =>
  getNameElement(showData.showName, Str.read(item.text) ?? "English") +
  getFlagElement(showData.showFlags, flag);

const handleTemplateResult =
  (showData: ShowData) =>
  (
    // select2 doesn't have .ts
    item: Record<string, unknown>
  ) => {
    // @ts-expect-error: select2 doesn't have .ts
    const flag = item.element?.dataset?.flag ?? "";

    const div = document.createElement("div");
    div.className = "brz-translation__select-item";
    div.innerHTML = divInnerHTML(item, flag, showData);

    return div;
  };

const handleTemplateSelection =
  (showData: ShowData) =>
  (
    // select2 doesn't have .ts
    item: Record<string, unknown>
  ) => {
    // @ts-expect-error: select2 doesn't have .ts
    const flag = item.element?.dataset?.flag ?? "";

    const div = document.createElement("div");
    div.className = "brz-translation__select-item";
    div.innerHTML = divInnerHTML(item, flag, showData);

    return div;
  };

export default function ($node: JQuery): void {
  const root = $node.get(0);

  root.querySelectorAll<HTMLElement>(".brz-translation").forEach((element) => {
    const $this = $(element);

    const showFlags = element.getAttribute("data-showflags") === "on";
    const showName = element.getAttribute("data-showname") === "on";
    const selectDom =
      element.querySelector<HTMLSelectElement>("select.brz-select");

    if (selectDom) {
      $(selectDom).select2({
        minimumResultsForSearch: Infinity,
        dropdownParent: $this,
        // @ts-expect-error: select2 doesn't have .ts
        templateResult: handleTemplateResult({ showFlags, showName }),
        templateSelection: handleTemplateSelection({ showFlags, showName }),
        dropdownAutoWidth: true
      });

      $(selectDom).on("select2:select", (e) => {
        const href = e.target?.selectedOptions?.[0]?.dataset?.href ?? "#";

        window.location.href = href;
      });

      // Custom Scrollbars
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let scrollbars: any;
      $(selectDom).on("select2:opening", () => {
        // waiting appear the dropdown in the dom
        setTimeout(function () {
          const dropdown =
            element.querySelector<HTMLElement>(".select2-dropdown");

          if (dropdown) {
            const item = dropdown.querySelector(
              ".select2-results__options .select2-results__option"
            );
            if (item) {
              const itemHeight = item.getBoundingClientRect().height;

              const { Scrollbars } = getFreeLibs();

              dropdown.style.maxHeight = `${itemHeight * 4}px`;

              if (Scrollbars) {
                scrollbars = new Scrollbars(dropdown);
              }
            }
          }
        }, 0);
      });

      // destroy custom scrollbar when dropdown closed
      $(selectDom).on("select2:close", () => {
        if (scrollbars) {
          scrollbars.destroy();
          scrollbars = null;
        }
      });
    }
  });
}
