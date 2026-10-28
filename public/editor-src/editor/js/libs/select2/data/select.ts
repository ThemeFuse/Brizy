import { DIACRITICS } from "../diacritics";
import type { Observable } from "../observable";
import type { DataItem, QueryParams, ResultsData } from "../types";
import { generateChars, itemStore, removeData } from "../utils";

interface Container extends Observable {
  id: string;
}

const stripDiacritics = (text: string): string =>
  text.replace(/[^\u0000-~]/g, (a) => DIACRITICS[a] || a);

const cloneItem = (item: DataItem): DataItem => ({
  ...item,
  children: item.children?.map(cloneItem)
});

function matcher(params: QueryParams, data: DataItem): DataItem | undefined {
  if ((params.term ?? "").trim() === "") {
    return data;
  }

  if (data.children && data.children.length > 0) {
    const match = cloneItem(data);
    const children = match.children ?? [];

    for (let c = data.children.length - 1; c >= 0; c--) {
      const child = data.children[c];
      const matches = matcher(params, child);

      if (matches === undefined) {
        children.splice(c, 1);
      }
    }

    if (children.length > 0) {
      return match;
    }

    return matcher(params, match);
  }

  const original = stripDiacritics(data.text).toUpperCase();
  const term = stripDiacritics(params.term ?? "").toUpperCase();

  if (original.indexOf(term) > -1) {
    return data;
  }

  return undefined;
}

type Choice = HTMLOptionElement | HTMLOptGroupElement;

// Reads the options of the select as data and writes a selection back to them.
export class SelectAdapter {
  private container: Container | undefined = undefined;

  constructor(private element: HTMLSelectElement) {}

  current(callback: (data: DataItem[]) => void): void {
    const data: DataItem[] = [];

    this.element.querySelectorAll("option").forEach((option) => {
      if (option.selected) {
        data.push(this.item(option));
      }
    });

    callback(data);
  }

  select(data: DataItem): void {
    data.selected = true;

    if (data.element instanceof HTMLOptionElement) {
      data.element.selected = true;
      this.announce();
    }
  }

  unselect(data: DataItem): void {
    data.selected = false;

    if (data.element instanceof HTMLOptionElement) {
      data.element.selected = false;
      this.announce();
    }
  }

  bind(container: Container): void {
    this.container = container;

    container.on("select", (params) => {
      this.select(params.data);
    });

    container.on("unselect", (params) => {
      this.unselect(params.data);
    });
  }

  destroy(): void {
    this.element.querySelectorAll("*").forEach((node) => {
      removeData(node);
    });
  }

  query(params: QueryParams, callback: (data: ResultsData) => void): void {
    const data: DataItem[] = [];

    [...this.element.children].forEach((node) => {
      if (
        !(node instanceof HTMLOptionElement) &&
        !(node instanceof HTMLOptGroupElement)
      ) {
        return;
      }

      const matches = matcher(params, this.item(node));

      if (matches !== undefined) {
        data.push(matches);
      }
    });

    callback({ results: data });
  }

  private item(node: Choice): DataItem {
    const stored = itemStore.get(node);

    if (stored !== undefined) {
      return stored;
    }

    const data =
      node instanceof HTMLOptionElement
        ? this.normalize({
            id: node.value,
            text: node.textContent ?? "",
            disabled: node.disabled,
            selected: node.selected,
            title: node.title,
            element: node,
            children: undefined
          })
        : this.normalize({
            id: undefined,
            text: node.label,
            disabled: false,
            selected: false,
            title: node.title,
            element: node,
            children: [...node.children].flatMap((child) =>
              child instanceof HTMLOptionElement ? [this.item(child)] : []
            )
          });

    itemStore.set(node, data);

    return data;
  }

  private normalize(item: Omit<DataItem, "resultId">): DataItem {
    const resultId =
      item.id && this.container !== undefined
        ? this.generateResultId(this.container, item.id)
        : undefined;

    return { ...item, resultId };
  }

  private generateResultId(container: Container, id: string): string {
    return `${container.id}-result-${generateChars(4)}-${id}`;
  }

  // What used to be a jQuery-only `input` and `change`.
  private announce(): void {
    this.element.dispatchEvent(new Event("input", { bubbles: true }));
    this.element.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
