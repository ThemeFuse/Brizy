import $ from "jquery";

interface Select2MethodApi {
  select2: (command: "open" | "close") => void;
}

interface Options {
  select: HTMLSelectElement;
  selectNode: HTMLElement;
}

export class TranslationAccessibility {
  private select: HTMLSelectElement;
  private selectNode: HTMLElement;

  constructor({ select, selectNode }: Options) {
    this.select = select;
    this.selectNode = selectNode;
  }

  public init(): void {
    const selection = this.getSelection();

    if (!selection) {
      return;
    }

    selection.addEventListener("keydown", this.handleSelectionKeyDown, true);
    selection.addEventListener("focus", this.handleSelectionFocus);
    selection.addEventListener("blur", this.handleSelectionBlur);
    this.select.addEventListener("change", this.handleStateChange);
    $(this.select)
      .on("select2:open", this.handleStateChange)
      .on("select2:close", this.handleStateChange);

    this.sync();
  }

  public sync(): void {
    const selection = this.getSelection();

    if (!selection) {
      return;
    }

    selection.setAttribute("role", "combobox");
    selection.setAttribute("tabindex", "0");
    selection.setAttribute("aria-haspopup", "listbox");
    selection.setAttribute("aria-expanded", this.isOpen().toString());
    selection.setAttribute("aria-disabled", this.select.disabled.toString());

    if (this.select.required) {
      selection.setAttribute("aria-required", "true");
    } else {
      selection.removeAttribute("aria-required");
    }

    this.syncRenderedValue();
    this.syncListbox();
  }

  private handleStateChange = (): void => {
    this.sync();
    this.syncHighlightedIndicator();
  };

  private handleSelectionKeyDown = (event: KeyboardEvent): void => {
    if (this.isOpen()) {
      if (!this.select.multiple) {
        switch (event.key) {
          case "Enter":
          case " ":
          case "Spacebar":
            event.preventDefault();
            event.stopPropagation();
            this.commitHighlightedOption();
            this.closeAfterCommit();
            break;
          case "Tab":
            event.stopPropagation();
            this.commitHighlightedOption();
            this.closeAfterCommit();
            break;
          case "Escape":
            event.preventDefault();
            event.stopPropagation();
            this.close();
            break;
        }
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        window.requestAnimationFrame(() => this.syncHighlightedIndicator());
      }

      return;
    }

    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        event.stopPropagation();
        this.open();
        window.requestAnimationFrame(() => this.syncHighlightedIndicator());
        break;
    }
  };

  private handleSelectionFocus = (): void => {
    this.selectNode.classList.add("brz-translation--keyboard-focus");
  };

  private handleSelectionBlur = (): void => {
    this.selectNode.classList.remove(
      "brz-translation--keyboard-focus"
    );
  };

  private syncRenderedValue(): void {
    const renderedValue = this.selectNode.querySelector<HTMLElement>(
      ".select2-selection__rendered"
    );

    if (!renderedValue) {
      return;
    }

    if (renderedValue.getAttribute("role") === "textbox") {
      renderedValue.removeAttribute("role");
    }
  }

  private syncListbox(): void {
    const listbox = this.selectNode.querySelector<HTMLElement>(
      ".select2-container--open .select2-results__options"
    );

    if (!listbox) {
      return;
    }

    listbox.setAttribute("role", "listbox");

    if (this.select.multiple) {
      listbox.setAttribute("aria-multiselectable", "true");
    } else {
      listbox.removeAttribute("aria-multiselectable");
    }
  }

  private open(): void {
    this.getSelect2Api().select2("open");
  }

  private close(): void {
    this.getSelect2Api().select2("close");
  }

  private isOpen(): boolean {
    return this.getSelection()?.getAttribute("aria-expanded") === "true";
  }

  private getSelect2Api(): JQuery<HTMLSelectElement> & Select2MethodApi {
    return $(this.select) as JQuery<HTMLSelectElement> & Select2MethodApi;
  }

  private commitHighlightedOption(): void {
    const highlightedOption = this.selectNode.querySelector<HTMLElement>(
      ".select2-container--open .select2-results__option--highlighted"
    );

    highlightedOption?.dispatchEvent(
      new MouseEvent("mouseup", { bubbles: true })
    );
  }

  private closeAfterCommit(): void {
    window.requestAnimationFrame(() => {
      if (this.isOpen()) {
        this.close();
      }
    });
  }

  private syncHighlightedIndicator(): void {
    const options = this.selectNode.querySelectorAll<HTMLElement>(
      ".select2-container--open .select2-results__option"
    );

    options.forEach((option) => {
      option.classList.remove("brz-translation-option--active");
    });

    const highlightedOption = this.selectNode.querySelector<HTMLElement>(
      ".select2-container--open .select2-results__option--highlighted"
    );

    if (!highlightedOption) {
      return;
    }

    highlightedOption.classList.add("brz-translation-option--active");
    highlightedOption.scrollIntoView({ block: "nearest" });
  }

  private getSelection(): HTMLElement | null {
    return this.selectNode.querySelector<HTMLElement>(".select2-selection");
  }
}
