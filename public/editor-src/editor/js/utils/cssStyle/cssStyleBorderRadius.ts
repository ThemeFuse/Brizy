import { styleBorderRadiusType } from "visual/utils/style2";
import { defaultValueValue } from "../onChange";
import { capByPrefix } from "../string";
import { CSSValue } from "../style2/types";

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
