import $ from "jquery";

interface Select2MethodApi {
  select2: (command: "open" | "close") => void;
}

interface Options {
  select: HTMLSelectElement;
  selectNode: HTMLElement;
  rootNode: HTMLElement;
}

export interface MultiStepFormAccessibilityOptions {
  form: HTMLFormElement;
  indicators: HTMLElement[];
  items: HTMLElement[];
  nextButtonContainer: HTMLElement | null;
  prevButtonContainer: HTMLElement | null;
  getActiveStep: () => number;
  onRequestNext: () => void;
  onRequestPrev: () => void;
}

export class FormAccessibility {
  private select: HTMLSelectElement;
  private selectNode: HTMLElement;
  private phoneAccessibilityInitialized = false;
  private rootNode: HTMLElement;

  constructor({ select, selectNode, rootNode }: Options) {
    this.select = select;
    this.selectNode = selectNode;
    this.rootNode = rootNode;
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
    this.initPhoneAccessibility();
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
    this.selectNode.classList.add("brz-forms2__field-select--keyboard-focus");
  };

  private handleSelectionBlur = (): void => {
    this.selectNode.classList.remove(
      "brz-forms2__field-select--keyboard-focus"
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
      option.classList.remove("brz-forms2__select-option--active");
    });

    const highlightedOption = this.selectNode.querySelector<HTMLElement>(
      ".select2-container--open .select2-results__option--highlighted"
    );

    if (!highlightedOption) {
      return;
    }

    highlightedOption.classList.add("brz-forms2__select-option--active");
    highlightedOption.scrollIntoView({ block: "nearest" });
  }

  private getSelection(): HTMLElement | null {
    return this.selectNode.querySelector<HTMLElement>(".select2-selection");
  }

  // Phone (SlimSelect) accessibility

  private initPhoneAccessibility(): void {
    if (this.phoneAccessibilityInitialized) {
      return;
    }

    const root = this.rootNode;

    // Ensure we only wire listeners once per form
    if (root instanceof HTMLElement) {
      if (root.dataset.brzFormPhoneA11y === "true") {
        this.phoneAccessibilityInitialized = true;
        return;
      }

      root.dataset.brzFormPhoneA11y = "true";
    }

    const syncAll = (): void => {
      const fields = root.querySelectorAll<HTMLElement>(
        ".brz-forms2__field-phone"
      );

      fields.forEach((field) => {
        this.syncPhoneField(field);
      });
    };

    const scheduleSync = (): void => {
      window.requestAnimationFrame(syncAll);
    };

    root.addEventListener("click", scheduleSync, true);
    root.addEventListener("keydown", scheduleSync, true);

    // Initial sync
    scheduleSync();

    this.phoneAccessibilityInitialized = true;
  }

  private syncPhoneField(field: HTMLElement): void {
    const main = field.querySelector<HTMLElement>(".ss-main");
    const list = field.querySelector<HTMLElement>(".ss-content .ss-list");

    if (!main || !list) {
      return;
    }

    const isOpen =
      main.classList.contains("ss-open") || list.classList.contains("ss-open");

    // Combobox semantics
    main.setAttribute("role", "combobox");
    main.setAttribute("tabindex", "0");
    main.setAttribute("aria-haspopup", "listbox");
    main.setAttribute("aria-expanded", String(isOpen));

    // Listbox visibility and interaction
    if (isOpen) {
      list.setAttribute("role", "listbox");
      list.removeAttribute("aria-hidden");
      list.removeAttribute("inert");
    } else {
      list.removeAttribute("role");
      list.setAttribute("aria-hidden", "true");
      // Prevent focus/interaction when closed without fighting the browser's focus management
      list.setAttribute("inert", "");
    }

    // Options semantics
    const options = list.querySelectorAll<HTMLElement>(".ss-option");

    options.forEach((option) => {
      const isSelected = option.classList.contains("ss-option-selected");
      const isHighlighted = option.classList.contains("ss-option-highlighted");

      if (isOpen) {
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", String(isSelected));

        if (isHighlighted) {
          option.classList.add("brz-forms2__select-option--active");
        } else {
          option.classList.remove("brz-forms2__select-option--active");
        }
      } else {
        option.removeAttribute("role");
        option.removeAttribute("aria-selected");
        option.classList.remove("brz-forms2__select-option--active");
      }
    });
  }

  public static initMultiStepFormAccessibility(
    options: MultiStepFormAccessibilityOptions
  ): void {
    const {
      form,
      indicators,
      items,
      nextButtonContainer,
      prevButtonContainer,
      getActiveStep,
      onRequestNext,
      onRequestPrev
    } = options;

    if (!form || !indicators.length || !items.length) {
      return;
    }

    if (nextButtonContainer) {
      const link = nextButtonContainer.querySelector("a");
      if (link) {
        link.removeAttribute("href");
      }
      nextButtonContainer.setAttribute("role", "button");
      nextButtonContainer.setAttribute("tabindex", "0");

      nextButtonContainer.addEventListener("keydown", (event) => {
        if (
          event.key === "Enter" ||
          event.key === " " ||
          event.key === "Spacebar"
        ) {
          event.preventDefault();
          onRequestNext();
        }
      });
    }

    if (prevButtonContainer) {
      const link = prevButtonContainer.querySelector("a");
      if (link) {
        link.removeAttribute("href");
      }
      prevButtonContainer.setAttribute("role", "button");
      prevButtonContainer.setAttribute("tabindex", "0");

      prevButtonContainer.addEventListener("keydown", (event) => {
        if (
          event.key === "Enter" ||
          event.key === " " ||
          event.key === "Spacebar"
        ) {
          event.preventDefault();
          onRequestPrev();
        }
      });
    }

    const indicatorsContainer =
      indicators.length > 0 ? indicators[0].parentElement : null;

    if (indicatorsContainer) {
      indicatorsContainer.setAttribute("role", "tablist");
    }

    const ensureIndicatorIds = (): void => {
      indicators.forEach((indicator, index) => {
        if (!indicator.id) {
          indicator.id = `brz-form-ms-indicator-${index + 1}`;
        }
      });
    };

    const updateAccessibilityState = (): void => {
      ensureIndicatorIds();

      const activeStep = getActiveStep();

      indicators.forEach((indicator, index) => {
        const isActive = index === activeStep - 1;
        const relatedContent = items[index];

        indicator.setAttribute("role", "tab");
        indicator.setAttribute("aria-selected", String(isActive));

        if (relatedContent) {
          const indicatorId = indicator.id;

          relatedContent.setAttribute("role", "tabpanel");
          relatedContent.setAttribute("aria-hidden", String(!isActive));

          if (indicatorId) {
            relatedContent.setAttribute("aria-labelledby", indicatorId);
          }
        }
      });
    };

    updateAccessibilityState();
  }
}
