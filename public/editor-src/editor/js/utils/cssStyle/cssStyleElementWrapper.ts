import { defaultValueValue } from "visual/utils/onChange";
import * as Position from "visual/utils/position/Position";
import { CSSValue } from "../style2/types";

export function cssStyleWrapperFixedFlex({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const elementPosition = dvv("elementPosition") ?? "relative";

  if (elementPosition === "relative") {
    return "";
  }

  return "align-items: stretch;";
}

export function cssStyleWrapperBorderFlex({
  v,
  device,
  state,
  mode
}: CSSValue): string {
  if (mode !== "editor") {
    return "";
  }

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const elementPosition = Position.read(dvv("elementPosition")) ?? "relative";

  return elementPosition === "relative" ? "" : "display: flex; flex: 1 1 auto;";
}

export const cssStyleWrapperContainerFlex = ({
  v,
  device,
  state
}: CSSValue): string => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const position = Position.read(dvv("elementPosition")) ?? "relative";

  return position === "relative" ? "" : "display: flex; width: 100%";
};
