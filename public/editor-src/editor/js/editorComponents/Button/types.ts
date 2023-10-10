import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent";
import { Block } from "visual/types";
import { CssId } from "visual/utils/models/cssId";
import { WithClassName } from "visual/utils/options/attributes";

export interface Value extends ElementModel, CssId {
  iconName: string;
  iconType: string;

  popups: Block[];
  linkPopup: string;
  linkLightBox: string;
  linkExternal: string;
  linkExternalBlank: string;
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
  inPopup2: Block[];

  customClassName: string;
  customID: string;

  hrefs: {
    anchor: string;
    external: string;
    popup: string;
    upload: string;
  };

  fontStyle: string;
  tabletFontStyle: string;
  mobileFontStyle: string;

  bgColorOpacity: number;
  bgColorHex: string;
  bgColorPalette: string;

  colorOpacity: number;
  colorHex: string;
  colorPalette: string;

  paddingTop: number;
  iconCustomSize: number;
  tempBorderWidth: number;

  type: "submit" | "search" | "link";

  size: "small" | "medium" | "large" | "custom";
  iconSize: "small" | "medium" | "large" | "custom";

  borderRadiusType: "square" | "rounded" | "custom";
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
  attributes: Record<string, string | number>;
}
