import { ElementModel } from "visual/component/Elements/Types";
import { Target } from "visual/component/Link/types/Target";
import { Type } from "visual/component/Link/types/Type";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { Block } from "visual/types";

export interface Value extends ElementModel {
  popups: Block[];
  linkPopup: string;
  linkExternal: string;
  linkExternalBlank: Target;
  linkExternalRel: string;
  linkAnchor: string;
  linkUpload: string;
  linkType: Type;
  linkLightBox: string;
  linkPage: string;
  tagName: keyof JSX.IntrinsicElements;
  sourceType: ShopifyTemplate;
  postElements: string;
}
