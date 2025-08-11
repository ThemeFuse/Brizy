import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";

export interface Value extends ElementModel {
  code: string;
  customCSS: string;
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
