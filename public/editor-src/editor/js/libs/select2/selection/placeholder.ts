import type { DataItem, Placeholder } from "../types";
import { normalizePlaceholder } from "../utils";
import type { SelectionConstructor } from "./base";

// Shows the placeholder while nothing, or only the empty option, is selected.
export function withPlaceholder(
  Base: SelectionConstructor
): SelectionConstructor {
  return class extends Base {
    private placeholder = normalizePlaceholder(this.options.get("placeholder"));

    createPlaceholder(placeholder: Placeholder): HTMLElement | undefined {
      const node = this.selectionContainer();
      const formatted = this.display(placeholder);

      if (typeof formatted === "string") {
        node.innerHTML = formatted;
      } else {
        node.replaceChildren(formatted);
      }

      node.classList.add("select2-selection__placeholder");
      node.classList.remove("select2-selection__choice");

      return node;
    }

    update(data: DataItem[]): void {
      // The ids are compared loosely, as select2 does.
      const singlePlaceholder =
        data.length === 1 && data[0].id != this.placeholder.id;
      const multipleSelections = data.length > 1;

      if (multipleSelections || singlePlaceholder) {
        super.update(data);
        return;
      }

      this.clear();

      const placeholder = this.createPlaceholder(this.placeholder);

      if (placeholder !== undefined) {
        this.selection
          .querySelector(".select2-selection__rendered")
          ?.append(placeholder);
      }
    }
  };
}
