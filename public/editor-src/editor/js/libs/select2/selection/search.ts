import { contentWidth, focusHub, px } from "../dom";
import { KEYS } from "../keys";
import type { DataItem, Placeholder } from "../types";
import { itemStore } from "../utils";
import type { SelectionConstructor, SelectionContainer } from "./base";

// The search field inside the selection of a multiple select.
export function withSearch(Base: SelectionConstructor): SelectionConstructor {
  return class extends Base {
    private searchContainer: HTMLElement = document.createElement("li");
    private search: HTMLInputElement = document.createElement("input");
    private keyUpPrevented = false;

    render(): HTMLElement {
      const searchContainer = document.createElement("li");

      searchContainer.className = "select2-search select2-search--inline";
      searchContainer.innerHTML =
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="searchbox" aria-autocomplete="list" />';

      const search = searchContainer.querySelector("input");

      this.searchContainer = searchContainer;

      if (search) {
        this.search = search;
      }

      const rendered = super.render();

      this.transferTabIndex();

      return rendered;
    }

    bind(container: SelectionContainer): void {
      const resultsId = `${container.id}-results`;

      super.bind(container);

      container.on("open", () => {
        this.search.setAttribute("aria-controls", resultsId);
        this.focusSearch();
      });

      container.on("close", () => {
        this.search.value = "";
        this.search.removeAttribute("aria-controls");
        this.search.removeAttribute("aria-activedescendant");
        this.focusSearch();
      });

      container.on("enable", () => {
        this.search.disabled = false;

        this.transferTabIndex();
      });

      container.on("disable", () => {
        this.search.disabled = true;
      });

      container.on("focus", () => {
        this.focusSearch();
      });

      container.on("results:focus", (params) => {
        if (params.data.resultId) {
          this.search.setAttribute(
            "aria-activedescendant",
            params.data.resultId
          );
        } else {
          this.search.removeAttribute("aria-activedescendant");
        }
      });

      const hubs = this.hubs;

      if (hubs === undefined) {
        return;
      }

      const inline = ".select2-search--inline";

      const focusin = focusHub(this.selection, "focus");
      const focusout = focusHub(this.selection, "blur");

      this.disposers.push(focusin.dispose, focusout.dispose);

      focusin.hub.delegate(inline, () => {
        this.searchFocused = true;
        this.onFocus();
      });

      focusout.hub.delegate(inline, () => {
        this.handleBlur();
      });

      hubs.keydown.delegate(inline, (event) => {
        hubs.keydown.stop(event);

        this.trigger("keypress", event);

        this.keyUpPrevented = event.defaultPrevented;

        if (event.which === KEYS.BACKSPACE && this.search.value === "") {
          const previousChoice = this.searchContainer.previousElementSibling;

          if (previousChoice?.matches(".select2-selection__choice")) {
            const item = itemStore.get(previousChoice);

            if (item !== undefined) {
              this.searchRemoveChoice(item);
            }

            event.preventDefault();
          }
        }
      });

      hubs.click.delegate(inline, (event) => {
        if (this.search.value) {
          hubs.click.stop(event);
        }
      });

      const onKeyUp = (event: KeyboardEvent): void => {
        const key = event.which;

        if (key === KEYS.SHIFT || key === KEYS.CTRL || key === KEYS.ALT) {
          return;
        }

        if (key === KEYS.TAB) {
          return;
        }

        this.handleSearch();
      };

      // An `input` event makes the `keyup` that follows it redundant.
      hubs.input.delegate(inline, () => {
        hubs.keyup.off(onKeyUp);
      });

      hubs.keyup.delegate(inline, onKeyUp);

      hubs.input.delegate(inline, () => {
        this.handleSearch();
      });
    }

    createPlaceholder(placeholder: Placeholder): HTMLElement | undefined {
      if (placeholder.text === null) {
        this.search.removeAttribute("placeholder");
      } else if (placeholder.text !== undefined) {
        this.search.setAttribute("placeholder", String(placeholder.text));
      }

      return undefined;
    }

    update(data: DataItem[]): void {
      const searchHadFocus = this.search === document.activeElement;

      this.search.setAttribute("placeholder", "");

      super.update(data);

      this.selection
        .querySelector(".select2-selection__rendered")
        ?.append(this.searchContainer);

      this.resizeSearch();

      if (searchHadFocus) {
        this.focusSearch();
      }
    }

    private searchFocused = false;

    // Moves the focus to the field; when it does not move, only the handlers run.
    private focusSearch(): void {
      this.searchFocused = false;
      this.search.focus();

      if (!this.searchFocused) {
        this.onFocus();
      }
    }

    private transferTabIndex(): void {
      this.search.setAttribute(
        "tabindex",
        this.selection.getAttribute("tabindex") ?? ""
      );
      this.selection.setAttribute("tabindex", "-1");
    }

    private handleSearch(): void {
      this.resizeSearch();

      if (!this.keyUpPrevented) {
        this.trigger("query", { term: this.search.value });
      }

      this.keyUpPrevented = false;
    }

    private searchRemoveChoice(item: DataItem): void {
      this.trigger("unselect", {
        originalEvent: undefined,
        data: item
      });

      this.search.value = item.text;
      this.handleSearch();
    }

    private resizeSearch(): void {
      this.search.style.width = "25px";

      if (this.search.getAttribute("placeholder") !== "") {
        const rendered = this.selection.querySelector<HTMLElement>(
          ".select2-selection__rendered"
        );

        if (rendered) {
          this.search.style.width = px(contentWidth(rendered));
        }
      } else {
        const minimumWidth = this.search.value.length + 1;

        this.search.style.width = `${minimumWidth * 0.75}em`;
      }
    }
  };
}
