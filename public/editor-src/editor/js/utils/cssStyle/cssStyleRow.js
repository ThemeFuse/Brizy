import {
  styleElementColumnMinHeightType,
  styleElementColumnMinHeight,
  styleReverseColumnsRow,
  styleReverseColumnsWrap,
  styleReverseColumnsJustify
} from "visual/utils/style2";

export function cssStyleRowMinHeight({ v, device }) {
  const minHeightType = styleElementColumnMinHeightType({ v, device });
  const minHeight =
    minHeightType === "custom"
      ? `${styleElementColumnMinHeight({ v, device })}px`
      : "auto";

  return `min-height: ${minHeight};`;
}

export function cssStyleRowReverseColumn({ v, device }) {
  const flexDirection =
    styleReverseColumnsRow({ v, device }) === "on" ? "row-reverse" : "row";
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
