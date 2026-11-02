import type { SelectionConstructor, SelectionContainer } from "./base";

const RELAYED = [
  "open",
  "opening",
  "close",
  "closing",
  "select",
  "selecting",
  "unselect",
  "unselecting"
];

const PREVENTABLE = ["opening", "closing", "selecting", "unselecting"];

// Announces what select2 does as `select2:*` events on the select.
export function withEventRelay(
  Base: SelectionConstructor
): SelectionConstructor {
  return class extends Base {
    bind(container: SelectionContainer): void {
      super.bind(container);

      container.onAny(({ name, params }) => {
        if (RELAYED.indexOf(name) === -1) {
          return;
        }

        const event = new CustomEvent(`select2:${name}`, {
          bubbles: true,
          cancelable: true,
          detail: { params: params ?? {} }
        });

        this.element.dispatchEvent(event);

        if (PREVENTABLE.indexOf(name) === -1) {
          return;
        }

        if (params !== undefined && "prevented" in params) {
          params.prevented = event.defaultPrevented;
        }
      });
    }
  };
}
