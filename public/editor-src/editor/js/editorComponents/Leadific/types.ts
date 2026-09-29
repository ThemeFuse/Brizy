import type { ElementModel } from "visual/component/Elements/Types";
import type { Target } from "visual/component/Link/types/Target";
import type { WithClassName } from "visual/types/attributes";
import type { Block } from "visual/types/Block";
import type { ComponentsMeta } from "../EditorComponent/types";

export interface Value extends ElementModel {
  leadificCustomFields: string;

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
  linkType:
    | "anchor"
    | "external"
    | "popup"
    | "upload"
    | "lightBox"
    | "action"
    | "story";
  linkToSlide: number;
  linkPage: string;
  inPopup2: Block[];

  customCSS: string;
  customID: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}
