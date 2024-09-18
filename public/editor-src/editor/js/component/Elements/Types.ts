import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export type ElementModel = {
  _id?: string;
  items?: Array<ElementModelType>;
  [k: string]: unknown;
};

export type ElementPatch<T extends ElementModel = ElementModel> = Partial<T>;

export type ElementProps<
  T extends Record<string, unknown> = Record<string, unknown>
> = ComponentsMeta & T;

export interface ElementModelType2<T extends ElementModel = ElementModel> {
  type: ElementTypes;
  value: T;
}

export enum ModelType {
  Default = "default",
  Rules = "rules",
  Custom = "custom"
}

/** @deprecated use ElementModelType2*/
export interface ElementModelType {
  type: string;
  value: ElementModel;
}

export interface ElementDefaultValue {
  content?: {
    items?: Array<ElementModelType>;
    popups?: Array<ElementModelType>;

    // These keys must count all keys about images uid actually,
    // the keys is terminated with `Src` example bgImageSrc, imageSrc
    images?: Record<string, unknown>;

    [k: string]: unknown;
  };

  style?: {
    // These keys must count all keys about families name actually,
    // the keys is terminated with `Family` example fontFamily, titleFamily
    families?: Record<string, unknown>;
    [k: string]: unknown;
  };

  toolbar?: Record<string, unknown>;

  link?: Record<string, unknown>;

  [k: string]: unknown;
}
