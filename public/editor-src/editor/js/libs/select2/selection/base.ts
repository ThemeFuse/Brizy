import { type Hub, hub } from "../dom";
import { KEYS } from "../keys";
import { Observable } from "../observable";
import type { Options } from "../options";
import type { DataItem, Placeholder } from "../types";
import { escapeMarkup, oldTabindexStore } from "../utils";

export interface SelectionContainer extends Observable {
  id: string;
  isOpen: () => boolean;
  closeOthers: (pressed: Element | undefined) => void;
}

interface SelectionHubs {
  keydown: Hub<HTMLElementEventMap["keydown"]>;
  click: Hub<HTMLElementEventMap["click"]>;
  keyup: Hub<HTMLElementEventMap["keyup"]>;
  input: Hub<HTMLElementEventMap["input"]>;
}

// What shows the current selection in place of the select.
export class BaseSelection extends Observable {
  selection: HTMLElement = document.createElement("span");
  protected container: SelectionContainer | undefined = undefined;
  protected hubs: SelectionHubs | undefined = undefined;
  protected tabindex: string | number = 0;

  protected disposers: VoidFunction[] = [];

  private closeHandler: ((event: MouseEvent) => void) | undefined = undefined;
  private focusFired = false;
  private handlingFocus = false;

  constructor(
    protected element: HTMLSelectElement,
    protected options: Options
  ) {
    super();
  }

  render(): HTMLElement {
    const selection = document.createElement("span");

    selection.className = "select2-selection";
    selection.setAttribute("role", "combobox");
    selection.setAttribute("aria-haspopup", "true");
    selection.setAttribute("aria-expanded", "false");

    this.tabindex = 0;

    const oldTabindex = oldTabindexStore.get(this.element);
    const tabindex = this.element.getAttribute("tabindex");

    if (oldTabindex !== undefined) {
      this.tabindex = oldTabindex;
    } else if (tabindex !== null) {
      this.tabindex = tabindex;
    }

    const title = this.element.getAttribute("title");

    if (title !== null) {
      selection.setAttribute("title", title);
    }

    selection.setAttribute("tabindex", String(this.tabindex));
    selection.setAttribute("aria-disabled", "false");

    this.selection = selection;

    return selection;
  }

  bind(container: SelectionContainer): void {
    const resultsId = `${container.id}-results`;

    this.container = container;

    this.selection.addEventListener("focus", () => {
      this.focusFired = true;
      this.handlingFocus = true;
      this.onFocus();
      this.handlingFocus = false;
    });

    this.selection.addEventListener("blur", () => {
      this.handleBlur();
    });

    const hubs: SelectionHubs = {
      keydown: hub(this.selection, "keydown"),
      click: hub(this.selection, "click"),
      keyup: hub(this.selection, "keyup"),
      input: hub(this.selection, "input")
    };

    this.hubs = hubs;

    hubs.keydown.on((event) => {
      this.trigger("keypress", event);

      if (event.which === KEYS.SPACE) {
        event.preventDefault();
      }
    });

    container.on("results:focus", (params) => {
      if (params.data.resultId !== undefined) {
        this.selection.setAttribute(
          "aria-activedescendant",
          params.data.resultId
        );
      }
    });

    container.on("selection:update", (params) => {
      this.update(params.data);
    });

    container.on("open", () => {
      this.selection.setAttribute("aria-expanded", "true");
      this.selection.setAttribute("aria-owns", resultsId);

      this.attachCloseHandler(container);
    });

    container.on("close", () => {
      this.selection.setAttribute("aria-expanded", "false");
      this.selection.removeAttribute("aria-activedescendant");
      this.selection.removeAttribute("aria-owns");

      this.focusSelection();

      this.detachCloseHandler();
    });

    container.on("enable", () => {
      this.selection.setAttribute("tabindex", String(this.tabindex));
      this.selection.setAttribute("aria-disabled", "false");
    });

    container.on("disable", () => {
      this.selection.setAttribute("tabindex", "-1");
      this.selection.setAttribute("aria-disabled", "true");
    });
  }

  position(selection: HTMLElement, container: HTMLElement): void {
    container.querySelector(".selection")?.append(selection);
  }

  destroy(): void {
    this.detachCloseHandler();
    this.disposers.forEach((dispose) => dispose());
    this.disposers = [];
  }

  update(_data: DataItem[]): void {
    throw new Error("The `update` method must be defined in child classes.");
  }

  clear(): void {}

  display(data: DataItem | Placeholder): HTMLElement | string {
    const formatted = this.options.templateSelection({
      id: data.id,
      text: data.text,
      element: "element" in data ? data.element : undefined
    });

    return typeof formatted === "string" ? escapeMarkup(formatted) : formatted;
  }

  selectionContainer(): HTMLElement {
    return document.createElement("span");
  }

  // Overridden where the placeholder is shown somewhere else than in the selection.
  createPlaceholder(_placeholder: Placeholder): HTMLElement | undefined {
    return undefined;
  }

  isDisabled(): boolean {
    return Boolean(this.options.get("disabled"));
  }

  // Moves the focus to the selection; when it is there already, only the handlers run.
  focusSelection(): void {
    if (this.handlingFocus) {
      this.onFocus();
      return;
    }

    this.focusFired = false;
    this.selection.focus();

    if (!this.focusFired) {
      this.onFocus();
    }
  }

  protected onFocus(): void {
    this.trigger("focus", undefined);
  }

  protected handleBlur(): void {
    // The active element is the body while a Tab press is being handled.
    window.setTimeout(() => {
      if (
        document.activeElement === this.selection ||
        this.selection.contains(document.activeElement)
      ) {
        return;
      }

      this.trigger("blur", undefined);
    }, 1);
  }

  private attachCloseHandler(container: SelectionContainer): void {
    this.detachCloseHandler();

    this.closeHandler = (event) => {
      const target = event.target;
      const pressed =
        target instanceof Element ? target.closest(".select2") : undefined;

      container.closeOthers(pressed ?? undefined);
    };

    document.body.addEventListener("mousedown", this.closeHandler);
  }

  private detachCloseHandler(): void {
    if (this.closeHandler !== undefined) {
      document.body.removeEventListener("mousedown", this.closeHandler);
      this.closeHandler = undefined;
    }
  }
}

export type SelectionConstructor = new (
  element: HTMLSelectElement,
  options: Options
) => BaseSelection;
