// What every suite starts from: a clean page, a fresh library and a mounted select.

import type { Select2Handle } from "../index";
import {
  type MountOptions,
  type Select2EventName,
  type Template,
  freshGroup1,
  freshSelect2,
  mountSelect2,
  onChange,
  onSelect2,
  releaseSelect2
} from "./driver";
import {
  clearPage,
  fixRandom,
  mount,
  pressOutside,
  query,
  queryAll,
  queryInput,
  querySelect,
  stubScrollIntoView
} from "./env";

export function useSelect2Env(): void {
  beforeEach(async () => {
    clearPage();
    fixRandom();
    await freshSelect2();
  });

  afterEach(() => {
    releaseSelect2();
    jest.restoreAllMocks();
    clearPage();
  });
}

// For the call-site suites: a page with the `group-1` bundle loaded.
export function useGroup1Env(): void {
  beforeEach(async () => {
    clearPage();
    fixRandom();
    stubScrollIntoView();
    await freshGroup1();
  });

  afterEach(() => {
    pressOutside();
    jest.restoreAllMocks();
    clearPage();
  });
}

const textTemplate: Template = (item) =>
  typeof item.text === "string" ? item.text : "";

// What Form2 passes, minus its placeholder.
export const standard = (dropdownParent: HTMLElement): MountOptions => ({
  width: "100%",
  minimumResultsForSearch: Number.POSITIVE_INFINITY,
  dropdownParent,
  placeholder: undefined,
  templateSelection: textTemplate,
  templateResult: textTemplate,
  dropdownAutoWidth: false
});

export interface Scene {
  root: HTMLElement;
  parent: HTMLElement;
  select: HTMLSelectElement;
  handle: Select2Handle;
  events: string[];
  container: () => HTMLElement;
  selection: () => HTMLElement;
  rendered: () => HTMLElement;
  results: () => HTMLElement[];
  result: (text: string) => HTMLElement;
  highlighted: () => string | undefined;
  inlineSearch: () => HTMLInputElement;
  dropdownSearch: () => HTMLInputElement;
  isOpen: () => boolean;
  values: () => string[];
}

const EVENTS: Select2EventName[] = [
  "select2:opening",
  "select2:open",
  "select2:closing",
  "select2:close",
  "select2:selecting",
  "select2:select",
  "select2:unselecting",
  "select2:unselect"
];

// `html` must hold one `.parent` (the dropdown parent) with one select inside.
export function scene(
  html: string,
  options: (parent: HTMLElement) => MountOptions
): Scene {
  const root = mount(html);
  const parent = query(root, ".parent");
  const select = querySelect(parent, "select");
  const events: string[] = [];

  onChange(select, () => events.push("change"));
  EVENTS.forEach((name) => {
    onSelect2(select, name, () => events.push(name));
  });

  const handle = mountSelect2(select, options(parent));
  const results = (): HTMLElement[] =>
    queryAll(parent, ".select2-results__option");

  return {
    root,
    parent,
    select,
    handle,
    events,
    container: () => query(parent, ".select2.select2-container"),
    selection: () => query(parent, ".select2-selection"),
    rendered: () => query(parent, ".select2-selection__rendered"),
    results,
    result: (text) => {
      const found = results().find((node) => node.textContent === text);

      if (!found) {
        throw new Error(`no result with the text ${text}`);
      }

      return found;
    },
    highlighted: () =>
      parent.querySelector(".select2-results__option--highlighted")
        ?.textContent ?? undefined,
    inlineSearch: () =>
      queryInput(parent, ".select2-search--inline .select2-search__field"),
    dropdownSearch: () =>
      queryInput(parent, ".select2-search--dropdown .select2-search__field"),
    isOpen: () =>
      query(parent, ".select2.select2-container").classList.contains(
        "select2-container--open"
      ),
    values: () => [...select.selectedOptions].map((item) => item.value)
  };
}
