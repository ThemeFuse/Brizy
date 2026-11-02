import type { SelectParams } from "../types";
import type { DropdownConstructor, DropdownContainer } from "./dropdown";

// Closes the dropdown after a choice, unless ctrl or meta is held.
export function withCloseOnSelect(
  Base: DropdownConstructor
): DropdownConstructor {
  return class extends Base {
    bind(container: DropdownContainer): void {
      super.bind(container);

      const selectTriggered = (params: SelectParams): void => {
        const originalEvent = params.originalEvent;

        if (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey)) {
          return;
        }

        this.closeAfter(params);
      };

      container.on("select", selectTriggered);
      container.on("unselect", selectTriggered);
    }
  };
}
