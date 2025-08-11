import { Patch } from "visual/component/BoxResizer/types";
import { ElementModel } from "visual/component/Elements/Types";
import { TooltipPlacement } from "visual/component/Tooltip/types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { Block } from "visual/types/Block";
import { WithClassName } from "visual/types/attributes";
import { CssId } from "visual/utils/models/cssId";

export interface Value extends ElementModel, CssId {
  iconName: string;
  iconType: string;
  iconFilename?: string;

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
  customCSS: string;

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

  enableTooltip: "on" | "off";
  tooltipTriggerClick: "on" | "off";
  tooltipPlacement: TooltipPlacement;
  tooltipWidth: number;
  tooltipText: string;

  tooltipOffset: number;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
  attributes: Record<string, string | number>;
  renderer?: {
    form?: {
      percentWidth?: boolean;
    };
    disableTooltip?: boolean;
  };
  updateWidthPrefixBySizeChange?: "%" | "px";
}

export type PatchValue = (Value | Patch | Record<string, string>) & {
  [k: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
