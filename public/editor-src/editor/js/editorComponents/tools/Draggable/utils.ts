import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { DeviceMode } from "visual/types";
import * as N from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";

export const getContainerSizes = (
  v: ElementModel,
  device: DeviceMode,
  meta: ComponentsMeta,
  innerWidth: number,
  innerHeight: number
): { width: number; height: number } => {
  const value = defaultValueValue({ key: "elementPosition", device, v });
  const isAbsolute = value === "absolute";

  return {
    width: isAbsolute ? (N.read(meta[`${device}WNoSpacing`]) ?? 0) : innerWidth,
    height: innerHeight
  };
};
