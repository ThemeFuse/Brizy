import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";
import { MValue } from "visual/utils/value";

type Get = (k: string) => MValue<string>;
type MString = MValue<string>;

export function styleElementFiltersSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("spacing");
}

export function styleElementFiltersRangeDots({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("dots");
}

export function styleElementFiltersHierarchicalSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("hierarchicalSpacing");
}

export function styleElementFiltersTitleSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("titleSpacing");
}

export function styleElementFiltersOptionSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("optionSpacing");
}

export function styleElementFiltersGap({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("gap");
}

export function styleElementFiltersShowApply({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("showApply");
}

export function styleElementFiltersOptionWidth({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("optionWidth");
}

export function styleElementFiltersOptionWidthSuffix({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("optionWidthSuffix");
}

export function styleElementFiltersLabelSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("labelSpacing");
}

export function styleElementFiltersBtnSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("btnSpacing");
}

export function styleElementFiltersCheckboxOrientation({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("checkOrientation");
}

export function styleElementFiltersCheckboxOrientationCustomStyles({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("checkOrientationCustom");
}

export function styleElementFiltersOptionsAlign({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("horizontalAlignOption");
}

export function styleElementFiltersCheckboxShowCounter({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("showCounter");
}

export function styleElementFiltersActiveOrientation({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("activeOrientation");
}

export function styleElementFiltersType({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("filterType");
}

export function styleElementFiltersDataSource({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("dataSource");
}

export function styleElementFiltersCheckboxType({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("checkboxType");
}

export function styleElementFiltersCheckboxColumns({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("checkColumns");
}

export function styleElementFiltersCheckboxColumnsCustomStyles({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("checkColumnsCustom");
}

export function styleElementFiltersActiveColumns({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("activeColumns");
}

export function styleElementFiltersBtnWidth({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("btnWidth");
}

export function styleElementFiltersBtnHeight({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("btnHeight");
}

export function styleElementFiltersHorizontalAlignBtn({
  v,
  device,
  state
}: CSSValue): MString {
  const aligns = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  };

  const horizontalAlign: "left" | "center" | "right" = defaultValueValue({
    v,
    key: "horizontalAlignBtn",
    device,
    state
  });

  return horizontalAlign === undefined
    ? horizontalAlign
    : aligns[horizontalAlign];
}

export function styleElementFiltersHorizontalAlignOption({
  v,
  device,
  state
}: CSSValue): MString {
  const aligns = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  };

  const horizontalAlign: "left" | "center" | "right" = defaultValueValue({
    v,
    key: "horizontalAlignOption",
    device,
    state
  });

  return horizontalAlign === undefined
    ? horizontalAlign
    : aligns[horizontalAlign];
}

export function styleElementFiltersHorizontalAlignLabel({
  v,
  device,
  state
}: CSSValue): MString {
  const aligns = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  };

  const horizontalAlign: "left" | "center" | "right" = defaultValueValue({
    v,
    key: "horizontalAlignLabel",
    device,
    state
  });

  return horizontalAlign === undefined
    ? horizontalAlign
    : aligns[horizontalAlign];
}

export function styleElementFiltersDateOptionWidth({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("widthDateOption");
}

export function styleElementFiltersCheckSize({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("checkSize");
}

export function styleElementFiltersCheckColorSize({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("checkColorSize");
}

export function styleElementFiltersCheckImgWidth({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("imgWidth");
}

export function styleElementFiltersCheckImgHeight({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("imgHeight");
}

export function styleElementFiltersIconSize({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("iconSize");
}

export function styleElementFiltersIconCustomSize({
  v,
  device,
  state
}: CSSValue): MString {
  const dvv: Get = (key: string) =>
    defaultValueValue({ v, key, device, state });

  return dvv("iconCustomSize");
}
