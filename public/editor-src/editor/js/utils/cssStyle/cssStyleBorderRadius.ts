import { styleBorderRadiusType } from "visual/utils/style2";
import { checkValue } from "../checkValue";
import { defaultValueValue } from "../onChange";
import { capByPrefix } from "../string";
import { CSSValue } from "../style2/types";

type BorderRadiusType = "square" | "rounded" | "custom";

const getBorderRadiusType = checkValue<BorderRadiusType>([
  "square",
  "rounded",
  "custom"
]);

export function cssStyleBorderRadius({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const radiusType = styleBorderRadiusType({ v, device, state, prefix });

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const radius = dvv(capByPrefix(prefix, "borderRadius"));
  const radiusSuffix = dvv(capByPrefix(prefix, "borderRadiusSuffix")) ?? "px";

  const topLeftRadius = dvv(capByPrefix(prefix, "borderTopLeftRadius"));
  const topLeftRadiusSuffix =
    dvv(capByPrefix(prefix, "borderTopLeftRadiusSuffix")) ?? "px";

  const topRightRadius = dvv(capByPrefix(prefix, "borderTopRightRadius"));
  const topRightRadiusSuffix =
    dvv(capByPrefix(prefix, "borderTopRightRadiusSuffix")) ?? "px";

  const bottomLeftRadius = dvv(capByPrefix(prefix, "borderBottomLeftRadius"));
  const bottomLeftRadiusSuffix =
    dvv(capByPrefix(prefix, "borderBottomLeftRadiusSuffix")) ?? "px";

  const bottomRightRadius = dvv(capByPrefix(prefix, "borderBottomRightRadius"));
  const bottomRightRadiusSuffix =
    dvv(capByPrefix(prefix, "borderBottomRightRadiusSuffix")) ?? "px";

  if (radiusType !== "ungrouped") {
    return `border-radius: ${radius}${radiusSuffix};`;
  }

  return `border-radius:${topLeftRadius}${topLeftRadiusSuffix} ${topRightRadius}${topRightRadiusSuffix} ${bottomRightRadius}${bottomRightRadiusSuffix} ${bottomLeftRadius}${bottomLeftRadiusSuffix};`;
}

export function cssStyleBorderRadiusType({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const radiusType = getBorderRadiusType(
    styleBorderRadiusType({ v, device, state, prefix })
  );
  const radius = dvv(capByPrefix(prefix, "borderRadius"));

  switch (radiusType) {
    case "square":
      return "border-radius: 0;";
    case "rounded":
      return "border-radius: 100px;";
    case "custom":
      return `border-radius:${radius}px;`;
    case undefined:
      return "";
  }
}
