import { defaultValueValue } from "visual/utils/onChange";
import { checkValue } from "../checkValue";
import { capByPrefix } from "../string";
import { CSSValue } from "../style2/types";

type Direction = "top" | "right" | "bottom" | "left";
const getDirection = checkValue<Direction>(["top", "right", "bottom", "left"]);

export function cssStyleSpacing({
  v,
  device,
  state,
  prefix = "",
  direction = ""
}: CSSValue & { direction: string }): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const spacing = dvv(capByPrefix(prefix, "spacing"));
  const spacingSuffix = dvv(capByPrefix(prefix, "spacingSuffix"));

  switch (getDirection(direction)) {
    case "top":
      return `margin-top:${spacing}${spacingSuffix};`;
    case "right":
      return `margin-right:${spacing}${spacingSuffix};`;
    case "bottom":
      return `margin-bottom:${spacing}${spacingSuffix};`;
    case "left":
      return `margin-left:${spacing}${spacingSuffix};`;
    case undefined:
      return "";
  }
}
