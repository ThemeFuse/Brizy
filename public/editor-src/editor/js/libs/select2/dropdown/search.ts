import type { DropdownConstructor, DropdownContainer } from "./dropdown";

// The search field at the top of the dropdown of a single select.
export function withSearch(Base: DropdownConstructor): DropdownConstructor {
  return class extends Base {
    private searchContainer: HTMLElement = document.createElement("span");
    private search: HTMLInputElement = document.createElement("input");
    private keyUpPrevented = false;

    render(): HTMLElement {
      const rendered = super.render();
      const searchContainer = document.createElement("span");

      searchContainer.className = "select2-search select2-search--dropdown";
      searchContainer.innerHTML =
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="searchbox" aria-autocomplete="list" />';

      const search = searchContainer.querySelector("input");

      this.searchContainer = searchContainer;

      if (search) {
        this.search = search;
      }

      rendered.prepend(searchContainer);

      return rendered;
    }

    bind(container: DropdownContainer): void {
      const resultsId = `${container.id}-results`;

      super.bind(container);

      this.search.addEventListener("keydown", (event) => {
        this.trigger("keypress", event);

        this.keyUpPrevented = event.defaultPrevented;
      });

      const onKeyUp = (): void => {
        this.handleSearch();
      };

      // An `input` event makes the `keyup` that follows it redundant.
      this.search.addEventListener("input", () => {
        this.search.removeEventListener("keyup", onKeyUp);
      });

      this.search.addEventListener("keyup", onKeyUp);

      this.search.addEventListener("input", () => {
        this.handleSearch();
      });

      container.on("open", () => {
        this.search.setAttribute("tabindex", "0");
        this.search.setAttribute("aria-controls", resultsId);

        this.search.focus();

        window.setTimeout(() => {
          this.search.focus();
        }, 0);
      });

      container.on("close", () => {
        this.search.setAttribute("tabindex", "-1");
        this.search.removeAttribute("aria-controls");
        this.search.removeAttribute("aria-activedescendant");

        this.search.value = "";
        this.search.blur();
      });

      container.on("focus", () => {
        if (!container.isOpen()) {
          this.search.focus();
        }
      });

      container.on("results:all", (params) => {
        if (params.query.term === undefined || params.query.term === "") {
          if (this.showSearch(params)) {
            this.searchContainer.classList.remove("select2-search--hide");
          } else {
            this.searchContainer.classList.add("select2-search--hide");
          }
        }
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
    }

    private handleSearch(): void {
      if (!this.keyUpPrevented) {
        this.trigger("query", { term: this.search.value });
      }

      this.keyUpPrevented = false;
    }
  };
}
