import { cssStyleSizeWidth } from "visual/utils/cssStyle";
import * as Num from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import * as HAlign from "visual/utils/position/HAlign";
import * as Position from "visual/utils/position/Position";
import * as VAlign from "visual/utils/position/VAlign";
import { capByPrefix } from "visual/utils/string";
import * as Str from "visual/utils/string/specs";
import { styleZIndex } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { checkValue } from "../checkValue";

type Direction = "top" | "right" | "bottom" | "left";
const getDirection = checkValue<Direction>(["top", "right", "bottom", "left"]);

export function cssStylePosition(d: CSSValue): string {
  const zIndex = styleZIndex(d);

  return zIndex ? cssStylePositionRelative() : cssStylePositionStatic();
}

export function cssStylePositionRelative(): string {
  return "position:relative;";
}
export function cssStylePositionAbsolute(): string {
  return "position:absolute;";
}

export function cssStylePositionStatic(): string {
  return "position:static;";
}

export function cssStyleCustomPosition(d: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ key, ...d });

  const elementPosition = Position.read(dvv("elementPosition"));

  return elementPosition === undefined ? "" : `position:${elementPosition};`;
}

export function cssStyleCustomWidth({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const elementPosition = dvv("elementPosition");

  return elementPosition === "relative"
    ? ""
    : cssStyleSizeWidth({ v, device, state, store, getConfig });
}

export function cssStyleOffset(d: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ key, ...d });

  const elementPosition = Position.read(dvv("elementPosition"));

  if (!elementPosition || elementPosition === "relative") {
    return "";
  }

  const offsetYAlignment = VAlign.read(dvv("offsetYAlignment"));
  const offsetY = Num.read(dvv("offsetY"));
  const offsetYSuffix = Str.read(dvv("offsetYSuffix")) ?? "px";

  const offsetXAlignment = HAlign.read(dvv("offsetXAlignment"));
  const offsetX = Num.read(dvv("offsetX"));
  const offsetXSuffix = Str.read(dvv("offsetXSuffix")) ?? "px";

  const vertical = offsetYAlignment
    ? {
        top: "unset",
        bottom: "unset",
        [offsetYAlignment]: `${offsetY}${offsetYSuffix}`
      }
    : {};

  const horizontal = offsetXAlignment
    ? {
        right: "unset",
        left: "unset",
        [offsetXAlignment]: `${offsetX}${offsetXSuffix}`
      }
    : {};

  return Object.entries({ ...vertical, ...horizontal })
    .map(([k, v]) => (v ? `${k}: ${v};` : ""))
    .join("");
}

export function cssStylePositionTop({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const positionTop = Num.read(dvv(capByPrefix(prefix, "positionTop")));
  const positionTopSuffix = Str.read(
    dvv(capByPrefix(prefix, "positionTopSuffix"))
  );

  return `top:${positionTop}${positionTopSuffix};`;
}

export function cssStylePositionLeft({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const positionLeft = Num.read(dvv(capByPrefix(prefix, "positionLeft")));
  const positionLeftSuffix = Str.read(
    dvv(capByPrefix(prefix, "positionLeftSuffix"))
  );

  return `left:${positionLeft}${positionLeftSuffix};`;
}

export function cssStyleIconPosition({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const iconPosition = dvv(capByPrefix(prefix, "position"));

  const position =
    iconPosition === "left" ? "row nowrap" : "row-reverse nowrap";

  return position === undefined ? "" : `flex-flow:${position};`;
}

export function cssStylePositionElement({
  v,
  device,
  state,
  prefix = "",
  direction = ""
}: CSSValue & { direction: string }): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const position = dvv(capByPrefix(prefix, "position"));
  const suffix = dvv(capByPrefix(prefix, "positionSuffix"));

  switch (getDirection(direction)) {
    case "top":
      return `top:${position}${suffix};`;
    case "right":
      return `right:${position}${suffix};`;
    case "bottom":
      return `bottom:${position}${suffix};`;
    case "left":
      return `left:${position}${suffix};`;
    case undefined:
      return "";
  }
}
