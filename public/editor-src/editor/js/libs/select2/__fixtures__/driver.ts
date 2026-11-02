// The one place the select2 suites touch the implementation. Everything else is DOM.

import { publishLibGroup } from "../../../../../jest-utils/libGroups";
import type { Select2Handle, Select2TemplateItem } from "../index";

interface TemplateItem {
  id: unknown;
  text: unknown;
  element: HTMLOptionElement | undefined;
}

export type Template = (item: TemplateItem) => HTMLElement | string;

export interface MountOptions {
  width: string;
  minimumResultsForSearch: number;
  dropdownParent: HTMLElement;
  placeholder: string | undefined;
  templateSelection: Template;
  templateResult: Template;
  dropdownAutoWidth: boolean;
}

export type Select2EventName =
  | "select2:opening"
  | "select2:open"
  | "select2:closing"
  | "select2:close"
  | "select2:selecting"
  | "select2:select"
  | "select2:unselecting"
  | "select2:unselect";

interface Select2Event {
  preventDefault: VoidFunction;
}

type Library = typeof import("../index");

let library: Library | undefined;
let release: VoidFunction[] = [];

// A fresh library: ids and caches start from zero.
export async function freshSelect2(): Promise<void> {
  release = [];
  jest.resetModules();
  library = await import("../index");
}

const adapt =
  (template: Template) =>
  (item: Select2TemplateItem): HTMLElement | string =>
    template({
      id: item.id,
      text: item.text,
      element:
        item.element instanceof HTMLOptionElement ? item.element : undefined
    });

export function mountSelect2(
  select: HTMLSelectElement,
  options: MountOptions
): Select2Handle {
  if (library === undefined) {
    throw new Error("call freshSelect2 before mounting");
  }

  let destroyed = false;
  const handle: Select2Handle = library.select2(select, {
    ...options,
    templateSelection: adapt(options.templateSelection),
    templateResult: adapt(options.templateResult)
  });

  release.push(() => {
    if (!destroyed) {
      handle.close();
    }
  });

  return {
    open: handle.open,
    close: handle.close,
    destroy: () => {
      destroyed = true;
      handle.destroy();
    }
  };
}

export function onSelect2(
  select: HTMLSelectElement,
  name: Select2EventName,
  listener: (event: Select2Event) => void
): void {
  select.addEventListener(name, (event) => {
    listener({ preventDefault: () => event.preventDefault() });
  });
}

// The `change` select2 announces a selection with.
export function onChange(
  select: HTMLSelectElement,
  listener: VoidFunction
): void {
  select.addEventListener("change", () => listener());
}

// Closes whatever a test left open, so no window listener outlives it.
export function releaseSelect2(): void {
  release.forEach((close) => close());
  release = [];
}

// A fresh module registry with the `group-1` bundle published, as on a page with a form.
export async function freshGroup1(): Promise<void> {
  jest.resetModules();
  publishLibGroup("BrizyLibs", await import("../../group-1"));
}
