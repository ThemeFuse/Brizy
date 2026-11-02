import type { Patch as BoxResizerPatch } from "visual/component/BoxResizer/types";
import type { ElementModel } from "visual/component/Elements/Types";
import type { Target } from "visual/component/Link/types/Target";
import type { Type } from "visual/component/Link/types/Type";
import type { TooltipPlacement } from "visual/component/Tooltip/types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { Block } from "visual/types/Block";
import type { CssId } from "visual/utils/models/cssId";

export interface Value extends ElementModel, CssId {
  name: string;
  type: string;
  filename?: string;

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
  customClassName: string;
  customID: string;
  linkToSlide: number;

  customSize: number;
  tabletCustomSize: number;
  mobileCustomSize: number;

  customSizeSuffix: string;
  tabletCustomSizeSuffix: string;
  mobileCustomSizeSuffix: string;

  customCSS: string;
  ariaLabel?: string;

  enableTooltip: "on" | "off";
  tooltipTriggerClick: "on" | "off";
  tooltipPlacement: TooltipPlacement;
  tooltipText: string;

  tooltipOffset: number;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
  attributes: Record<string, string | number>;
}

export interface Patch {
  [k: string]: string;
}

export type PatchValue = Value | Patch | BoxResizerPatch["patch"];
