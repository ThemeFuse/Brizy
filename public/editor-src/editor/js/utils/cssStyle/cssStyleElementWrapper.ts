import { toPositive } from "visual/utils/math";
import { NumberSpec } from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import * as Position from "visual/utils/position/Position";
import { CSSValue } from "../style2/types";

export function cssStyleWrapperCustomHeight({
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

  const height = toPositive(NumberSpec.read(dvv("height")));
  const heightSuffix = dvv("heightSuffix");

  return height && heightSuffix
    ? `content: ""; width: 0; padding-top:${height}${heightSuffix} !important;`
    : "";
}

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

export const cssStyleWrapperContainerSize = ({
  v,
  device,
  state
}: CSSValue): string => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const position = Position.read(dvv("elementPosition")) ?? "relative";

  return position === "relative" ? "" : "width: 100%";
};
