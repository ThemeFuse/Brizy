import { ElementModel } from "visual/component/Elements/Types";
import { DeviceMode } from "visual/types";
import { defaultValueValue } from "visual/utils/onChange";
import * as N from "visual/utils/math/number";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent";

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
    width: isAbsolute ? N.read(meta[`${device}WNoSpacing`]) ?? 0 : innerWidth,
    height: innerHeight
  };
};
