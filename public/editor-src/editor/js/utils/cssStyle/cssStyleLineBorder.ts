import { isDefaultLineType } from "visual/editorComponents/Line/utils";
import { styleBorderColor } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { defaultValueValue } from "../onChange";

export function cssStyleLineBorder({ v, device, state }: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const borderWidth = dvv("borderWidth");
  const borderStyle = dvv("lineStyle") as string;
  const borderColor = styleBorderColor({ v, device, state });

  return isDefaultLineType(borderStyle)
    ? `border-top:${borderWidth}px ${borderStyle} ${borderColor};`
    : "border:none;";
}
