export interface Select2TemplateItem {
  id: unknown;
  text: unknown;
  element: HTMLOptionElement | HTMLOptGroupElement | undefined;
}

export type Select2Template = (
  item: Select2TemplateItem
) => HTMLElement | string;

export interface Select2Options {
  width: string;
  minimumResultsForSearch: number;
  dropdownParent: HTMLElement;
  placeholder: unknown;
  templateSelection: Select2Template;
  templateResult: Select2Template;
  dropdownAutoWidth: boolean;
}

export interface Select2Handle {
  open: VoidFunction;
  close: VoidFunction;
  destroy: VoidFunction;
}

export interface DataItem {
  id: string | undefined;
  text: string;
  selected: boolean;
  disabled: boolean;
  title: string | undefined;
  element: HTMLOptionElement | HTMLOptGroupElement | undefined;
  children: DataItem[] | undefined;
  resultId: string | undefined;
}

export interface Placeholder {
  id: unknown;
  text: unknown;
}

export type OriginalEvent = MouseEvent | KeyboardEvent | undefined;

export interface QueryParams {
  term: string | undefined;
}

export interface ResultsData {
  results: DataItem[];
}

interface CloseParams {
  originalEvent: OriginalEvent;
}

export interface SelectParams {
  originalEvent: OriginalEvent;
  data: DataItem;
}

// What the `…ing` event sent before an event carries; a listener may call the event off.
export interface PreParams {
  prevented: boolean;
  name: string;
  args: unknown;
}

export interface Select2Events {
  open: undefined;
  opening: PreParams;
  close: CloseParams;
  closing: PreParams;
  select: SelectParams;
  selecting: PreParams;
  unselect: SelectParams;
  unselecting: PreParams;
  query: QueryParams;
  "results:all": { data: ResultsData; query: QueryParams };
  "results:message": undefined;
  "results:focus": { data: DataItem; element: HTMLElement };
  "results:select": undefined;
  "results:toggle": undefined;
  "results:previous": undefined;
  "results:next": undefined;
  "selection:update": { data: DataItem[] };
  toggle: undefined;
  focus: undefined;
  blur: undefined;
  keypress: KeyboardEvent;
  enable: undefined;
  disable: undefined;
}

export type Select2EventName = keyof Select2Events;
