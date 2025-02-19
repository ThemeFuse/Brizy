import { ElementModel } from "visual/component/Elements/Types";
import { Target } from "visual/component/Link/types/Target";
import { Block } from "visual/types/Block";
import { WithClassName } from "visual/types/attributes";
import { ComponentsMeta } from "../EditorComponent/types";

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
