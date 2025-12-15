import $ from "jquery";
import { getFreeLibs } from "visual/libs";
import { makeAttr } from "visual/utils/i18n/attribute";
import { read } from "visual/utils/reader/string";

interface ShowData {
  showName: boolean;
  showFlags: boolean;
}

interface Select2Item extends Record<string, unknown> {
  element?: HTMLOptionElement;
}

const getFlagElement = (
  showFlags: boolean,
  flag: string,
  code: string
): string =>
  showFlags
    ? `<img class="brz-translation__flag" src="${flag}" alt="${code}" />`
    : "";

const getNameElement = (showName: boolean, name: string) =>
  showName ? `<span class="brz-span">${name}</span>` : "";

const divInnerHTML = (
  item: Record<string, unknown>,
  flag: string,
  showData: ShowData,
  code: string
) =>
  getNameElement(showData.showName, read(item.text) ?? "English") +
  getFlagElement(showData.showFlags, flag, code);

const handleTemplateResult = (showData: ShowData) => (item: Select2Item) => {
  const flag = item.element?.dataset?.flag ?? "";
  const code = item.element?.value ?? "";

  const div = document.createElement("div");
  div.className = "brz-translation__select-item";
  div.innerHTML = divInnerHTML(item, flag, showData, code);

  return div;
};

const handleTemplateSelection = (showData: ShowData) => (item: Select2Item) => {
  const flag = item.element?.dataset?.flag ?? "";
  const code = item.element?.value ?? "";

  const div = document.createElement("div");
  div.className = "brz-translation__select-item";
  div.innerHTML = divInnerHTML(item, flag, showData, code);

  return div;
};

export default function ($node: JQuery): void {
  const root = $node.get(0);
  if (!root) return;

  root.querySelectorAll<HTMLElement>(".brz-translation").forEach((element) => {
    const $this = $(element).find(".brz-translation__dc") ?? $(element);
    const showFlags = element.getAttribute(makeAttr("showflags")) === "on";
    const showName = element.getAttribute(makeAttr("showname")) === "on";
    const selectDom =
      element.querySelector<HTMLSelectElement>("select.brz-select");

    if (selectDom) {
      $(selectDom).select2({
        minimumResultsForSearch: Infinity,
        dropdownParent: $this,
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
