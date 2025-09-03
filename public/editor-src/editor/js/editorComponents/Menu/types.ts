import type { Placement as PopperPlacement } from "@popperjs/core";
import { ElementModel } from "visual/component/Elements/Types";
import { DeviceMode } from "visual/types";

export interface Value extends ElementModel {
  closeColorHex: string;
  closeColorPalette: string;
  closeColorOpacity: number;
}

export interface Settings {
  widths?: {
    [k in DeviceMode]: string;
  };
  mods?: {
    [k in DeviceMode]: "vertical" | "horizontal";
  };
  placement?: {
    [k in DeviceMode]: PopperPlacement;
  };
}

export enum MMenuAnimationTypes {
  OFF = "off",
  TILT = "tilt",
  SQUASH = "squash",
  TWIRL = "twirl",
  FADE = "fade",
  DIVIDE = "divide",
  TURN = "turn",
  SLING = "sling",
  SPIN = "spin"
}
