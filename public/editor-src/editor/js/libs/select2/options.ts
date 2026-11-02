import { dataAttr } from "./dom";
import type { Select2Options, Select2Template } from "./types";

const closestDir = (element: HTMLElement): string => {
  const holder = element.closest("[dir]");

  return holder instanceof HTMLElement ? holder.dir : "";
};

const upperCaseLetter = (_: string, letter: string): string =>
  letter.toUpperCase();

// The options of one select: the caller's, with every `data-*` attribute of the select on top.
export class Options {
  readonly dropdownParent: HTMLElement;
  readonly templateSelection: Select2Template;
  readonly templateResult: Select2Template;

  private values: Record<string, unknown>;

  constructor(options: Select2Options, element: HTMLSelectElement) {
    this.dropdownParent = options.dropdownParent;
    this.templateSelection = options.templateSelection;
    this.templateResult = options.templateResult;

    this.values = {
      closeOnSelect: true,
      scrollAfterSelect: false,
      theme: "default",
      width: options.width,
      minimumResultsForSearch: options.minimumResultsForSearch,
      dropdownAutoWidth: options.dropdownAutoWidth
    };

    if (options.placeholder !== undefined) {
      this.values.placeholder = options.placeholder;
    }

    this.fromElement(element);
  }

  get(key: string): unknown {
    return this.values[key];
  }

  set(key: string, value: unknown): void {
    this.values[key] = value;
  }

  private fromElement(element: HTMLSelectElement): void {
    this.values.multiple = element.multiple;
    this.values.disabled = element.disabled;

    if (element.dir) {
      this.values.dir = element.dir;
    } else if (closestDir(element)) {
      this.values.dir = closestDir(element);
    } else {
      this.values.dir = "ltr";
    }

    // Writing the properties back is what select2 does; it is not a no-op for every engine.
    element.disabled = element.disabled;
    element.multiple = element.multiple;

    const prefix = "data-";

    for (const { name } of [...element.attributes]) {
      if (name.substring(0, prefix.length) !== prefix) {
        continue;
      }

      const dataName = name.substring(prefix.length);
      const key = dataName.replace(/-([a-z])/g, upperCaseLetter);

      if (key === "select2") {
        continue;
      }

      this.values[key] = dataAttr(element, dataName);
    }
  }
}
