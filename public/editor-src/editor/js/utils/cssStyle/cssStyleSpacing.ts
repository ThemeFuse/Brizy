import { defaultValueValue } from "visual/utils/onChange";
import { checkValue } from "../checkValue";
import { capByPrefix } from "../string";
import { CSSValue } from "../style2/types";

type Direction =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "horizontal"
  | "vertical";
const getDirection = checkValue<Direction>([
  "top",
  "right",
  "bottom",
  "left",
  "horizontal",
  "vertical"
]);

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
      return `margin:${spacing}${spacingSuffix} 0 0 0;`;
    case "right":
      return `margin: 0 ${spacing}${spacingSuffix} 0 0;`;
    case "bottom":
      return `margin:0 0 ${spacing}${spacingSuffix} 0;`;
    case "left":
      return `margin: 0 0 0 ${spacing}${spacingSuffix};`;
    case "horizontal":
      return `margin: 0 ${spacing}${spacingSuffix};`;
    case "vertical":
      return `margin: ${spacing}${spacingSuffix} 0;`;
    case undefined:
      return "";
  }
}
