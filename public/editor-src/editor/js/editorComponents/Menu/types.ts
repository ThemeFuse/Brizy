import { ElementModel } from "visual/component/Elements/Types";
import { DeviceMode } from "visual/types";
import type { Placement as PopperPlacement } from "@popperjs/core";

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
