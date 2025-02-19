import type {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import { Unit } from "../Image/types";

export interface Value extends ElementModel {
  layout: LayoutType;
  lightBox: "on" | "off";
  thumbStyle: ThumbStyle;
  spacing: number;
  gridColumn: number;
  tabletGridColumn: number;
  mobileGridColumn: number;
  items: Array<ElementModelType>;
  itemsOption: ElementModel[];
  gridAspectRatio: string;
  tags: string;
  imageSrc: string;
  imageFileName: string;
  allTag: string;
  imageWidth: number;
  imageHeight: number;
  bigImageImagesHeight: number;
  bigImageImagesHeightSuffix: Unit;
  tabletBigImageImagesHeightSuffix: Unit;
  mobileBigImageImagesHeightSuffix: Unit;
  tabletBigImageImagesHeight: number;
  mobileBigImageImagesHeight: number;
  thumbWidth: number;
  tabletThumbWidth: number;
  mobileThumbWidth: number;
  thumbWidthSuffix: Unit;
  tabletThumbWidthSuffix: Unit;
  mobileThumbWidthSuffix: Unit;
  _id: string;
  customCSS: string;
}

export type LayoutType = "grid" | "masonry" | "justified" | "bigImage";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export type Patch = Partial<Value>;

export interface Meta {
  [k: string]: unknown;
  patch: Patch;
}

export type ThumbStyle = "top" | "bottom" | "left" | "right";

export type State = "on" | "off";

export type SizeChangedType = "width" | "height";
