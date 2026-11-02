import { appendContent, appendMarkup, hub, offset, outerHeight } from "./dom";
import { Observable } from "./observable";
import type { Options } from "./options";
import { translations } from "./translation";
import type { DataItem, OriginalEvent, ResultsData } from "./types";
import { escapeMarkup, itemStore, normalizePlaceholder } from "./utils";

interface Container extends Observable {
  id: string;
  isOpen: () => boolean;
}

interface DataSource {
  current: (callback: (data: DataItem[]) => void) => void;
}

const SELECTABLE = ".select2-results__option[aria-selected]";
const HIGHLIGHTED = "select2-results__option--highlighted";

// The list of results in the dropdown.
export class Results extends Observable {
  protected list: HTMLElement = document.createElement("ul");

  constructor(
    protected options: Options,
    protected data: DataSource
  ) {
    super();
  }

  render(): HTMLElement {
    const list = document.createElement("ul");

    list.className = "select2-results__options";
    list.setAttribute("role", "listbox");

    if (this.options.get("multiple")) {
      list.setAttribute("aria-multiselectable", "true");
    }

    this.list = list;

    return list;
  }

  clear(): void {
    this.list.replaceChildren();
  }

  displayMessage(): void {
    this.clear();

    const message = document.createElement("li");

    message.setAttribute("role", "alert");
    message.setAttribute("aria-live", "assertive");
    message.className = "select2-results__option";
    appendMarkup(message, escapeMarkup(translations.noResults()));
    message.className += " select2-results__message";

    this.list.append(message);
  }

  hideMessages(): void {
    this.list
      .querySelectorAll(".select2-results__message")
      .forEach((node) => node.remove());
  }

  append(data: ResultsData): void {
    if (data.results.length === 0) {
      if (this.list.children.length === 0) {
        this.trigger("results:message", undefined);
      }

      return;
    }

    this.list.append(...data.results.map((item) => this.option(item)));
  }

  position(results: HTMLElement, dropdown: HTMLElement): void {
    dropdown.querySelector(".select2-results")?.append(results);
  }

  highlightFirstItem(): void {
    const options = this.selectable();
    const selected = options.filter(
      (node) => node.getAttribute("aria-selected") === "true"
    );
    const first = selected.length > 0 ? selected[0] : options[0];

    if (first) {
      this.highlight(first);
    }

    this.ensureHighlightVisible();
  }

  setClasses(): void {
    // Reading the selection registers its options, as the original does.
    this.data.current(() => {
      this.selectable().forEach((node) => {
        const item = itemStore.get(node);

        if (item === undefined) {
          return;
        }

        const element = item.element;
        const isSelected =
          element instanceof HTMLOptionElement && element.selected;

        node.setAttribute("aria-selected", isSelected ? "true" : "false");
      });
    });
  }

  showLoading(): void {
    const loading = this.option({
      id: undefined,
      text: translations.searching(),
      selected: false,
      disabled: true,
      title: undefined,
      element: undefined,
      children: undefined,
      resultId: undefined
    });

    loading.className += " loading-results";

    this.list.prepend(loading);
  }

  option(data: DataItem): HTMLElement {
    const option = document.createElement("li");

    option.className = "select2-results__option";

    const attrs = new Map<string, string>([
      ["role", "option"],
      ["aria-selected", "false"]
    ]);

    if (
      (data.element !== undefined && data.element.matches(":disabled")) ||
      (data.element === undefined && data.disabled)
    ) {
      attrs.delete("aria-selected");
      attrs.set("aria-disabled", "true");
    }

    if (data.id === undefined) {
      attrs.delete("aria-selected");
    }

    if (data.resultId !== undefined) {
      option.id = data.resultId;
    }

    if (data.title) {
      option.title = data.title;
    }

    if (data.children) {
      attrs.set("role", "group");
      attrs.set("aria-label", data.text);
      attrs.delete("aria-selected");
    }

    attrs.forEach((value, name) => option.setAttribute(name, value));

    if (data.children) {
      const label = document.createElement("strong");

      label.className = "select2-results__group";
      this.template(data, label);

      const children = data.children.map((child) => this.option(child));
      const childrenContainer = document.createElement("ul");

      childrenContainer.className =
        "select2-results__options select2-results__options--nested";
      childrenContainer.append(...children);

      option.append(label);
      option.append(childrenContainer);
    } else {
      this.template(data, option);
    }

    itemStore.set(option, data);

    return option;
  }

  bind(container: Container): void {
    this.list.setAttribute("id", `${container.id}-results`);

    container.on("results:all", (params) => {
      this.clear();
      this.append(params.data);

      if (container.isOpen()) {
        this.setClasses();
        this.highlightFirstItem();
      }
    });

    container.on("query", () => {
      this.hideMessages();
      this.showLoading();
    });

    container.on("select", () => {
      if (!container.isOpen()) {
        return;
      }

      this.setClasses();

      if (this.options.get("scrollAfterSelect")) {
        this.highlightFirstItem();
      }
    });

    container.on("unselect", () => {
      if (!container.isOpen()) {
        return;
      }

      this.setClasses();

      if (this.options.get("scrollAfterSelect")) {
        this.highlightFirstItem();
      }
    });

    container.on("open", () => {
      this.list.setAttribute("aria-expanded", "true");
      this.list.setAttribute("aria-hidden", "false");

      this.setClasses();
      this.ensureHighlightVisible();
    });

    container.on("close", () => {
      this.list.setAttribute("aria-expanded", "false");
      this.list.setAttribute("aria-hidden", "true");
      this.list.removeAttribute("aria-activedescendant");
    });

    container.on("results:toggle", () => {
      const highlighted = this.highlighted();

      if (highlighted === undefined || !highlighted.matches(SELECTABLE)) {
        return;
      }

      this.choose(highlighted, undefined);
    });

    container.on("results:select", () => {
      const highlighted = this.highlighted();

      if (highlighted === undefined) {
        return;
      }

      const data = itemStore.get(highlighted);

      if (highlighted.getAttribute("aria-selected") === "true") {
        this.trigger("close", { originalEvent: undefined });
      } else if (data !== undefined) {
        this.trigger("select", {
          originalEvent: undefined,
          data
        });
      }
    });

    container.on("results:previous", () => {
      const highlighted = this.highlighted();
      const options = this.marked();
      const currentIndex =
        highlighted === undefined ? -1 : options.indexOf(highlighted);

      if (currentIndex <= 0) {
        return;
      }

      const nextIndex = currentIndex - 1;
      const next = options[nextIndex];

      this.highlight(next);

      const currentOffset = offset(this.list).top;
      const nextTop = offset(next).top;
      const nextOffset = this.list.scrollTop + (nextTop - currentOffset);

      if (nextIndex === 0) {
        this.list.scrollTop = 0;
      } else if (nextTop - currentOffset < 0) {
        this.list.scrollTop = nextOffset;
      }
    });

    container.on("results:next", () => {
      const highlighted = this.highlighted();
      const options = this.marked();
      const currentIndex =
        highlighted === undefined ? -1 : options.indexOf(highlighted);
      const nextIndex = currentIndex + 1;

      if (nextIndex >= options.length) {
        return;
      }

      const next = options[nextIndex];

      this.highlight(next);

      const currentOffset = offset(this.list).top + outerHeight(this.list);
      const nextBottom = offset(next).top + outerHeight(next);
      const nextOffset = this.list.scrollTop + nextBottom - currentOffset;

      if (nextIndex === 0) {
        this.list.scrollTop = 0;
      } else if (nextBottom > currentOffset) {
        this.list.scrollTop = nextOffset;
      }
    });

    container.on("results:focus", (params) => {
      params.element.classList.add(HIGHLIGHTED);
    });

    container.on("results:message", () => {
      this.displayMessage();
    });

    hub(this.list, "mouseup").delegate(SELECTABLE, (event, current) => {
      this.choose(current, event);
    });

    // A pointer entering a result: over it, and not coming from inside it.
    hub(this.list, "mouseover").delegate(SELECTABLE, (event, current) => {
      const related = event.relatedTarget;

      if (
        !related ||
        (related !== current &&
          !(related instanceof Node && current.contains(related)))
      ) {
        this.highlight(current);
      }
    });
  }

  destroy(): void {
    this.list.remove();
  }

  ensureHighlightVisible(): void {
    const highlighted = this.highlighted();

    if (highlighted === undefined) {
      return;
    }

    const currentIndex = this.marked().indexOf(highlighted);
    const currentOffset = offset(this.list).top;
    const nextTop = offset(highlighted).top;
    const offsetDelta = nextTop - currentOffset;
    const nextOffset =
      this.list.scrollTop + offsetDelta - outerHeight(highlighted) * 2;

    if (currentIndex <= 2) {
      this.list.scrollTop = 0;
    } else if (offsetDelta > outerHeight(this.list) || offsetDelta < 0) {
      this.list.scrollTop = nextOffset;
    }
  }

  protected template(result: DataItem, container: HTMLElement): void {
    const content = this.options.templateResult({
      id: result.id,
      text: result.text,
      element: result.element
    });

    if (typeof content === "string") {
      container.innerHTML = escapeMarkup(content);
    } else {
      appendContent(container, content);
    }
  }

  private choose(option: HTMLElement, event: OriginalEvent): void {
    const data = itemStore.get(option);

    if (data === undefined) {
      return;
    }

    if (option.getAttribute("aria-selected") === "true") {
      if (this.options.get("multiple")) {
        this.trigger("unselect", {
          originalEvent: event,
          data
        });
      } else {
        this.trigger("close", { originalEvent: undefined });
      }

      return;
    }

    this.trigger("select", { originalEvent: event, data });
  }

  private highlight(option: HTMLElement): void {
    const data = itemStore.get(option);

    this.list
      .querySelectorAll(`.${HIGHLIGHTED}`)
      .forEach((node) => node.classList.remove(HIGHLIGHTED));

    if (data !== undefined) {
      this.trigger("results:focus", { data, element: option });
    }
  }

  private highlighted(): HTMLElement | undefined {
    return this.list.querySelector<HTMLElement>(`.${HIGHLIGHTED}`) ?? undefined;
  }

  private selectable(): HTMLElement[] {
    return [...this.list.querySelectorAll<HTMLElement>(SELECTABLE)];
  }

  private marked(): HTMLElement[] {
    return [...this.list.querySelectorAll<HTMLElement>("[aria-selected]")];
  }
}

export type ResultsConstructor = new (
  options: Options,
  data: DataSource
) => Results;

// Leaves the option that stands for the placeholder out of the results.
export function withHiddenPlaceholder(
  Base: ResultsConstructor
): ResultsConstructor {
  return class extends Base {
    private placeholder = normalizePlaceholder(this.options.get("placeholder"));

    append(data: ResultsData): void {
      super.append({
        results: data.results.filter((item) => this.placeholder.id !== item.id)
      });
    }
  };
}
