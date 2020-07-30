import { styleZIndex } from "visual/utils/style2";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";
import * as Num from "visual/utils/math/number";
import * as Str from "visual/utils/string/specs";
import * as Position from "visual/utils/position/Position";
import * as VAlign from "visual/utils/position/VAlign";
import * as HAlign from "visual/utils/position/HAlign";

export function cssStylePosition(d: CSSValue): string {
  const zIndex = styleZIndex(d);

  return zIndex ? "position:relative;" : "position:static;";
}

export function cssStylePositionMode(): string {
  return "position:relative;";
}

export function cssStyleCustomPosition(d: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ key, ...d });

  const elementPosition = Position.read(dvv("elementPosition"));

  return elementPosition === undefined ? "" : `position:${elementPosition};`;
}

export function cssStyleCustomWidth(d: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ key, ...d });

  const elementPosition = dvv("elementPosition");
  const width = Num.read(dvv("width"));
  const widthSuffix = Str.read(dvv("widthSuffix"));

  return width === undefined || !widthSuffix || elementPosition === "relative"
    ? ""
    : `width:${width}${widthSuffix};`;
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
    .map(([k, v]) => (v ? `${k}: ${v}` : ""))
    .join(";");
}
