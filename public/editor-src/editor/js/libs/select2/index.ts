import { Select2, instanceOf } from "./core";
import type { Select2Handle, Select2Options } from "./types";

export type {
  Select2Handle,
  Select2Options,
  Select2Template,
  Select2TemplateItem
} from "./types";

function instance(element: HTMLSelectElement, method: string): Select2 {
  const found = instanceOf(element);

  if (found === undefined) {
    throw new Error(
      `The select2('${method}') method was called on an element that is not using Select2.`
    );
  }

  return found;
}

// Turns a select into a select2 and returns the handle that drives it.
export function select2(
  element: HTMLSelectElement,
  options: Select2Options
): Select2Handle {
  new Select2(element, options);

  return {
    open: () => instance(element, "open").open(),
    close: () => instance(element, "close").close(undefined),
    destroy: () => instance(element, "destroy").destroy()
  };
}
