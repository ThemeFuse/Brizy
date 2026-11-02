import type PerfectScrollbar from "perfect-scrollbar";
import { getFreeLibs } from "visual/libs";
import type { Select2TemplateItem } from "visual/libs/select2";
import { makeAttr } from "visual/utils/i18n/attribute";
import { read } from "visual/utils/reader/string";
import { TranslationAccessibility } from "../accessibility";

interface ShowData {
  showName: boolean;
  showFlags: boolean;
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
  item: Select2TemplateItem,
  flag: string,
  showData: ShowData,
  code: string
) =>
  getNameElement(showData.showName, read(item.text) ?? "English") +
  getFlagElement(showData.showFlags, flag, code);

const getCode = (item: Select2TemplateItem): string =>
  item.element instanceof HTMLOptionElement ? item.element.value : "";

const handleTemplateResult =
  (showData: ShowData) => (item: Select2TemplateItem) => {
    const flag = item.element?.dataset.flag ?? "";
    const code = getCode(item);

    const div = document.createElement("div");
    div.className = "brz-translation__select-item";
    div.innerHTML = divInnerHTML(item, flag, showData, code);

    return div;
  };

const handleTemplateSelection =
  (showData: ShowData) => (item: Select2TemplateItem) => {
    const flag = item.element?.dataset.flag ?? "";
    const code = getCode(item);

    const div = document.createElement("div");
    div.className = "brz-translation__select-item";
    div.innerHTML = divInnerHTML(item, flag, showData, code);

    return div;
  };

export default function (root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>(".brz-translation").forEach((element) => {
    const dropdownParent =
      element.querySelector<HTMLElement>(".brz-translation__dc") ?? element;
    const showFlags = element.getAttribute(makeAttr("showflags")) === "on";
    const showName = element.getAttribute(makeAttr("showname")) === "on";
    const selectDom =
      element.querySelector<HTMLSelectElement>("select.brz-select");
    const { select2 } = getFreeLibs();

    if (selectDom && select2) {
      const handle = select2(selectDom, {
        width: "resolve",
        minimumResultsForSearch: Number.POSITIVE_INFINITY,
        dropdownParent,
        placeholder: undefined,
        templateResult: handleTemplateResult({ showFlags, showName }),
        templateSelection: handleTemplateSelection({ showFlags, showName }),
        dropdownAutoWidth: true
      });

      selectDom.addEventListener("select2:select", () => {
        const href = selectDom.selectedOptions[0]?.dataset.href ?? "#";

        window.location.href = href;
      });

      // Custom Scrollbars
      let scrollbars: PerfectScrollbar | undefined;
      selectDom.addEventListener("select2:opening", () => {
        // waiting appear the dropdown in the dom
        setTimeout(() => {
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
      selectDom.addEventListener("select2:close", () => {
        if (scrollbars) {
          scrollbars.destroy();
          scrollbars = undefined;
        }
      });

      new TranslationAccessibility({
        select: selectDom,
        selectNode: element,
        select2: handle
      }).init();
    }
  });
}
