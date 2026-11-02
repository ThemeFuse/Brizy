import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";

export const consentCategories = [
  "auto",
  "preferences",
  "statistics",
  "marketing",
  "other"
] as const;

export type ConsentCategory = (typeof consentCategories)[number];

export interface Value extends ElementModel {
  code: string;
  customCSS: string;
  consentCategory: ConsentCategory;
}

export interface Meta extends ComponentsMeta {
  patch: Partial<Value>;
}

export type ObserverCallback = (entry: ResizeObserverEntry) => void;

export enum VisibleElement {
  Placeholder = "placeholder",
  Content = "content"
}

export interface State {
  visibleElement: VisibleElement;
}
