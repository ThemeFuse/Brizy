import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { Target } from "visual/component/Link/types/Target";
import { Type } from "visual/component/Link/types/Type";
import { Block } from "visual/types/Block";
import { ComponentsMeta } from "../EditorComponent/types";

type Switch = "on" | "off";

export interface Value extends ElementModel {
  className: string;
  cssClass: string;
  customClassName: string;
  customAttributes: string;
  animationClassName: string;

  membershipRoles: Switch;
  translationsLangs: Switch;

  linkPage: string;
  popups: Block[];
  linkPopup: string;
  linkLightBox: string;
  linkExternal: string;
  linkExternalBlank: Target;
  linkExternalRel: string;
  linkPopulation: string;
  linkAnchor: string;
  linkUpload: string;
  linkExternalType: "linkExternal" | "linkPopulation";
  linkType: Type;
  customID: string;
  linkToSlide: number;

  items: Array<ElementModelType>;
  tagName: keyof JSX.IntrinsicElements;

  stopSlider: Switch;
}

export interface Props {
  patch?: {
    slider?: string;
  };

  value: string;
  componentId: string;
  initDelay: number;
  forceUpdate: boolean;

  meta?: Meta;
  blockId: string;
  instanceKey: string;
}

export type Patch = Partial<Value>;

export interface Meta extends ComponentsMeta {
  [k: string]: unknown;
  patch: Patch;
}
