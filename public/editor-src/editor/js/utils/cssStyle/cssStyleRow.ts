import {
  styleElementColumnMinHeight,
  styleElementColumnMinHeightSuffix,
  styleElementColumnMinHeightType,
  styleReverseColumnsJustify,
  styleReverseColumnsRow,
  styleReverseColumnsWrap
} from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleRowMinHeight({ v, device }: CSSValue): string {
  const minHeightType = styleElementColumnMinHeightType({ v, device });
  const minHeight =
    minHeightType === "custom"
      ? `${styleElementColumnMinHeight({
          v,
          device
        })}${styleElementColumnMinHeightSuffix({ v, device })}`
      : minHeightType === "fullHeight"
        ? "100vh"
        : "auto";

  return `min-height: ${minHeight};`;
}

export function cssStyleRowReverseColumn({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const flexDirection =
    styleReverseColumnsRow({ v, device, state, store, getConfig }) === "on"
      ? "row-reverse"
      : "row";
  const flexWrap =
    styleReverseColumnsWrap({ v, device }) === "on" ? "wrap-reverse" : "wrap";
  const justifyContent =
    styleReverseColumnsJustify({ v, device }) === "on"
      ? "flex-end"
      : "flex-start";

  return device !== "desktop"
    ? `flex-direction:${flexDirection};flex-wrap:${flexWrap};justify-content:${justifyContent};`
    : "";
}
