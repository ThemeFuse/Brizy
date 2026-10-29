import { SelectAdapter } from "./data/select";
import { adaptersFor } from "./defaults";
import { outerWidth, px } from "./dom";
import type { Dropdown } from "./dropdown/dropdown";
import { KEYS } from "./keys";
import { Observable } from "./observable";
import { Options } from "./options";
import type { Results } from "./results";
import type { BaseSelection } from "./selection/base";
import type {
  PreParams,
  Select2EventName,
  Select2Events,
  Select2Options
} from "./types";
import {
  createStore,
  generateChars,
  oldTabindexStore,
  removeData
} from "./utils";

// The instance behind a select and the select behind a container.
const instances = createStore<Select2>();
const elements = createStore<HTMLSelectElement>();

const WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

type PreEvent = "opening" | "closing" | "selecting" | "unselecting";

// The event that is sent first and can call the given one off.
function preEventOf(event: Select2EventName): PreEvent | undefined {
  switch (event) {
    case "open":
      return "opening";
    case "close":
      return "closing";
    case "select":
      return "selecting";
    case "unselect":
      return "unselecting";
    default:
      return undefined;
  }
}

export function instanceOf(element: HTMLSelectElement): Select2 | undefined {
  return instances.get(element);
}

export class Select2 extends Observable {
  readonly id: string;

  private options: Options;
  private dataAdapter: SelectAdapter;
  private selection: BaseSelection;
  private dropdown: Dropdown;
  private results: Results;
  private container: HTMLElement;
  private observer: MutationObserver | undefined = undefined;
  private onChange: VoidFunction;
  private onFocus: VoidFunction;

  constructor(
    private element: HTMLSelectElement,
    options: Select2Options
  ) {
    super();

    instances.get(element)?.destroy();

    this.id = this.generateId(element);

    this.options = new Options(options, element);

    const tabindex = element.getAttribute("tabindex") || 0;

    oldTabindexStore.set(element, tabindex);
    element.setAttribute("tabindex", "-1");

    const adapters = adaptersFor(this.options);

    this.dataAdapter = new SelectAdapter(element);

    this.container = this.render();

    this.placeContainer(this.container);

    this.selection = new adapters.Selection(element, this.options);

    const selection = this.selection.render();

    this.selection.position(selection, this.container);

    this.dropdown = new adapters.Dropdown(this.options);

    const dropdown = this.dropdown.render();

    this.dropdown.position(dropdown, this.container);

    this.results = new adapters.Results(this.options, this.dataAdapter);

    const results = this.results.render();

    this.results.position(results, dropdown);

    this.dataAdapter.bind(this);
    this.selection.bind(this);
    this.dropdown.bind(this);
    this.results.bind(this);

    this.onChange = () => {
      this.dataAdapter.current((data) => {
        this.trigger("selection:update", { data });
      });
    };

    this.onFocus = () => {
      this.trigger("focus", undefined);
    };

    this.registerDomEvents();

    this.selection.on("toggle", () => {
      this.toggleDropdown();
    });

    this.selection.on("focus", () => {
      this.focus();
    });

    this.selection.onAny((event) => {
      if (event.name === "toggle" || event.name === "focus") {
        return;
      }

      event.relayTo(this);
    });

    this.dropdown.onAny((event) => {
      event.relayTo(this);
    });

    this.results.onAny((event) => {
      event.relayTo(this);
    });

    this.registerEvents();

    this.dataAdapter.current((initialData) => {
      this.trigger("selection:update", { data: initialData });
    });

    element.classList.add("select2-hidden-accessible");
    element.setAttribute("aria-hidden", "true");

    this.syncAttributes();

    instances.set(element, this);
  }

  trigger<K extends Select2EventName>(
    event: K,
    params: Select2Events[K]
  ): void {
    const preEvent = preEventOf(event);

    if (preEvent !== undefined) {
      const pre: PreParams = { prevented: false, name: event, args: params };

      this.invoke(preEvent, pre);

      if (pre.prevented) {
        return;
      }
    }

    this.invoke(event, params);
  }

  toggleDropdown(): void {
    if (this.isDisabled()) {
      return;
    }

    if (this.isOpen()) {
      this.close(undefined);
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isOpen()) {
      return;
    }

    if (this.isDisabled()) {
      return;
    }

    this.trigger("query", { term: undefined });
  }

  close(event: KeyboardEvent | undefined): void {
    if (!this.isOpen()) {
      return;
    }

    this.trigger("close", { originalEvent: event });
  }

  isDisabled(): boolean {
    return Boolean(this.options.get("disabled"));
  }

  isOpen(): boolean {
    return this.container.classList.contains("select2-container--open");
  }

  hasFocus(): boolean {
    return this.container.classList.contains("select2-container--focus");
  }

  focus(): void {
    if (this.hasFocus()) {
      return;
    }

    this.container.classList.add("select2-container--focus");
    this.trigger("focus", undefined);
  }

  // Closes every open select but the one that was pressed.
  closeOthers(pressed: Element | undefined): void {
    document
      .querySelectorAll(".select2.select2-container--open")
      .forEach((container) => {
        if (container === pressed) {
          return;
        }

        const element = elements.get(container);

        if (element !== undefined) {
          instances.get(element)?.close(undefined);
        }
      });
  }

  destroy(): void {
    this.container.remove();

    this.observer?.disconnect();
    this.observer = undefined;

    this.element.removeEventListener("change", this.onChange);
    this.element.removeEventListener("focus", this.onFocus);
    this.element.setAttribute(
      "tabindex",
      String(oldTabindexStore.get(this.element))
    );

    this.element.classList.remove("select2-hidden-accessible");
    this.element.setAttribute("aria-hidden", "false");
    removeData(this.element);

    this.dataAdapter.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();
  }

  private generateId(element: HTMLSelectElement): string {
    const own = element.getAttribute("id");
    const name = element.getAttribute("name");
    let id: string;

    if (own !== null) {
      id = own;
    } else if (name !== null) {
      id = `${name}-${generateChars(2)}`;
    } else {
      id = generateChars(4);
    }

    id = id.replace(/(:|\.|\[|\]|,)/g, "");

    return `select2-${id}`;
  }

  private placeContainer(container: HTMLElement): void {
    this.element.after(container);

    const width = this.resolveWidth(this.options.get("width"));

    if (typeof width === "number") {
      container.style.width = px(width);
    } else if (typeof width === "string") {
      container.style.width = width;
    }
  }

  private resolveWidth(method: unknown): unknown {
    if (method === "resolve") {
      const styleWidth = this.resolveWidth("style");

      if (styleWidth !== undefined) {
        return styleWidth;
      }

      return this.resolveWidth("element");
    }

    if (method === "element") {
      const elementWidth = outerWidth(this.element);

      if (elementWidth <= 0) {
        return "auto";
      }

      return px(elementWidth);
    }

    if (method === "style") {
      const style = this.element.getAttribute("style");

      if (style === null) {
        return undefined;
      }

      for (const declaration of style.split(";")) {
        const matches = declaration.replace(/\s/g, "").match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return undefined;
    }

    if (method === "computedstyle") {
      return window.getComputedStyle(this.element).width;
    }

    return method;
  }

  private registerDomEvents(): void {
    this.element.addEventListener("change", this.onChange);
    this.element.addEventListener("focus", this.onFocus);

    this.observer = new MutationObserver((mutations) => {
      this.syncAttributes();
      this.syncSubtree(mutations);
    });

    this.observer.observe(this.element, {
      attributes: true,
      childList: true,
      subtree: false
    });
  }

  private registerEvents(): void {
    this.on("open", () => {
      this.container.classList.add("select2-container--open");
    });

    this.on("close", () => {
      this.container.classList.remove("select2-container--open");
    });

    this.on("enable", () => {
      this.container.classList.remove("select2-container--disabled");
    });

    this.on("disable", () => {
      this.container.classList.add("select2-container--disabled");
    });

    this.on("blur", () => {
      this.container.classList.remove("select2-container--focus");
    });

    this.on("query", (params) => {
      if (!this.isOpen()) {
        this.trigger("open", undefined);
      }

      this.dataAdapter.query(params, (data) => {
        this.trigger("results:all", { data, query: params });
      });
    });

    this.on("keypress", (event) => {
      const key = event.which;

      if (this.isOpen()) {
        if (
          key === KEYS.ESC ||
          key === KEYS.TAB ||
          (key === KEYS.UP && event.altKey)
        ) {
          this.close(event);

          event.preventDefault();
        } else if (key === KEYS.ENTER) {
          this.trigger("results:select", undefined);

          event.preventDefault();
        } else if (key === KEYS.SPACE && event.ctrlKey) {
          this.trigger("results:toggle", undefined);

          event.preventDefault();
        } else if (key === KEYS.UP) {
          this.trigger("results:previous", undefined);

          event.preventDefault();
        } else if (key === KEYS.DOWN) {
          this.trigger("results:next", undefined);

          event.preventDefault();
        }
      } else {
        if (
          key === KEYS.ENTER ||
          key === KEYS.SPACE ||
          (key === KEYS.DOWN && event.altKey)
        ) {
          this.open();

          event.preventDefault();
        }
      }
    });
  }

  private syncAttributes(): void {
    this.options.set("disabled", this.element.disabled);

    if (this.isDisabled()) {
      if (this.isOpen()) {
        this.close(undefined);
      }

      this.trigger("disable", undefined);
    } else {
      this.trigger("enable", undefined);
    }
  }

  // Options that came or went may have changed what is selected.
  private syncSubtree(mutations: MutationRecord[]): void {
    const changed = mutations.some((mutation) => {
      if (mutation.addedNodes.length > 0) {
        return [...mutation.addedNodes].some(
          (node) => node instanceof HTMLOptionElement && node.selected
        );
      }

      return mutation.removedNodes.length > 0;
    });

    if (changed) {
      this.dataAdapter.current((currentData) => {
        this.trigger("selection:update", { data: currentData });
      });
    }
  }

  private render(): HTMLElement {
    const container = document.createElement("span");

    container.className = "select2 select2-container";
    container.innerHTML =
      '<span class="selection"></span>' +
      '<span class="dropdown-wrapper" aria-hidden="true"></span>';

    container.setAttribute("dir", String(this.options.get("dir")));

    container.classList.add(`select2-container--${this.options.get("theme")}`);

    elements.set(container, this.element);

    return container;
  }
}
