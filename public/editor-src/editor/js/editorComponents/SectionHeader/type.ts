import type { ElementModel } from "visual/component/Elements/Types";
import type { WithClassName } from "visual/types/attributes";
import type { Literal } from "visual/utils/types/Literal";
import type { ComponentsMeta } from "../EditorComponent/types";

export enum RenderType {
  Static = "static",
  Fixed = "fixed",
  Animated = "animated"
}

export interface Value extends ElementModel {
  membership: string;
  membershipRoles: string;
  showOnDesktop: string;
  showOnMobile: string;
  showOnTablet: string;
  cssID: string;
  cssClass: string;
  customAttributes: string;
  animationName: string;
  animationDuration: number;
  animationDelay: number;
  animationInfiniteAnimation: boolean;
  translations: string;
  translationsLangs: string;
  className: string;
  customClassName: string;
  tagName: keyof JSX.IntrinsicElements;
  type: RenderType;
}
export interface Meta extends ComponentsMeta {
  patch: Partial<Value>;
}

export interface Props extends WithClassName {
  meta: Meta;
  instanceKey: string;
  onClone: (id: string) => void;
}

export interface States {
  height: Literal;
}

export type CssName =
  | "height"
  | "display"
  | "boxSizing"
  | "marginTop"
  | "paddingTop"
  | "paddingBottom"
  | "borderTopWidth"
  | "borderBottomWidth";
