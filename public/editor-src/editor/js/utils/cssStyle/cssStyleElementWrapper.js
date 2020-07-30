import { defaultValueValue } from "visual/utils/onChange";
import { toPositive } from "visual/utils/math";
import { NumberSpec } from "visual/utils/math/number";
import * as Position from "visual/utils/position/Position";

export function cssStyleWrapperCustomHeight({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const elementPosition = dvv("elementPosition") ?? "relative";

  if (elementPosition === "relative") {
    return "";
  }

  const height = toPositive(NumberSpec.read(dvv("height")));
  const heightSuffix = dvv("heightSuffix");

  return height && heightSuffix
    ? `content: ""; width: 0; padding-top:${height}${heightSuffix} !important;`
    : "";
}
export function cssStyleWrapperFixedFlex({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const elementPosition = dvv("elementPosition") ?? "relative";

  if (elementPosition === "relative") {
    return "";
  }

  return "display: flex; align-items: stretch;";
}

export function cssStyleWrapperBorderFlex({ v, device, state, mode }) {
  if (mode !== "editor") {
    return "";
  }

  const dvv = key => defaultValueValue({ v, key, device, state });
  const elementPosition = Position.read(dvv("elementPosition")) ?? "relative";

  return elementPosition === "relative" ? "" : "display: flex; flex: 1 1 auto;";
}

export const cssStyleWrapperContainerFlex = ({ v, device, state }) => {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const position = Position.read(dvv("elementPosition")) ?? "relative";

  return position === "relative" ? "" : "display: flex; width: 100%";
};
