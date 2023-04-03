import { ElementModel } from "visual/component/Elements/Types";
import { Target } from "visual/component/Link/types/Target";
import { Type } from "visual/component/Link/types/Type";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { Block } from "visual/types";

export interface Value extends ElementModel {
  customCSS: string;
  linkAnchor: string;
  linkExternal: string;
  linkExternalBlank: Target;
  linkExternalRel: string;
  linkLightBox: string;
  linkPage: string;
  linkPopup: string;
  linkType: Type;
  popups: Block[];
  sourceID: string;
  sourceType: ShopifyTemplate;
  tagName: keyof JSX.IntrinsicElements;
}
