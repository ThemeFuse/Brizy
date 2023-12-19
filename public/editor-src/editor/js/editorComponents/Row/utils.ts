import { setIn } from "timm";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import {
  wInBoxedPage,
  wInMobilePage,
  wInTabletPage
} from "visual/config/columns";
import { defaultValueValue } from "visual/utils/onChange";
import {
  DESKTOP,
  MOBILE,
  ResponsiveMode,
  TABLET
} from "visual/utils/responsiveMode";

const ROW_WIDTH = 100; // percent
const truncate = (num: number) => Number(num.toFixed(1));

export function normalizeRowColumns(
  columns: ElementModelType[]
): Array<ElementModelType> {
  if (!columns || columns.length === 0) {
    return columns;
  }

  const nonLastColumnWidth = truncate(ROW_WIDTH / columns.length);
  const lastColumnWidth = truncate(
    ROW_WIDTH - nonLastColumnWidth * (columns.length - 1)
  );

  return columns.map((column, index) => {
    const width =
      index !== columns.length - 1 ? nonLastColumnWidth : lastColumnWidth;

    return setIn(column, ["value", "width"], width) as ElementModelType;
  });
}

export function getElemWidthWithoutPaddings(node: Element) {
  const styles = window.getComputedStyle(node);

  return (
    node.clientWidth -
    parseFloat(styles.paddingLeft) -
    parseFloat(styles.paddingRight)
  );
}

const minWidthPercentage = 40;
const maxWidthPercentage = 100;

export function getMinRowWidth({
  v,
  device
}: {
  v: ElementModel;
  device: ResponsiveMode;
}): number {
  const dvv = (key: string, device: ResponsiveMode): unknown =>
    defaultValueValue({ v, key, device });

  const sizeSuffix = dvv("sizeSuffix", DESKTOP);
  const tabletSizeSuffix = dvv("sizeSuffix", TABLET);
  const mobileSizeSuffix = dvv("sizeSuffix", MOBILE);

  const minWidth = Math.round((wInBoxedPage * minWidthPercentage) / 100);
  const tabletMinWidth = Math.round((wInTabletPage * minWidthPercentage) / 100);
  const mobileMinWidth = Math.round((wInMobilePage * minWidthPercentage) / 100);

  switch (device) {
    case "desktop": {
      return sizeSuffix === "px" ? minWidth : minWidthPercentage;
    }
    case "tablet": {
      return tabletSizeSuffix === "px" ? tabletMinWidth : minWidthPercentage;
    }
    case "mobile": {
      return mobileSizeSuffix === "px" ? mobileMinWidth : minWidthPercentage;
    }
  }
}

export function getMaxRowWidth({
  v,
  device
}: {
  v: ElementModel;
  device: ResponsiveMode;
}): number {
  const dvv = (key: string, device: ResponsiveMode): unknown =>
    defaultValueValue({ v, key, device });

  const sizeSuffix = dvv("sizeSuffix", DESKTOP);
  const tabletSizeSuffix = dvv("sizeSuffix", TABLET);
  const mobileSizeSuffix = dvv("sizeSuffix", MOBILE);

  switch (device) {
    case "desktop": {
      return sizeSuffix === "px" ? wInBoxedPage : maxWidthPercentage;
    }
    case "tablet": {
      return tabletSizeSuffix === "px" ? wInTabletPage : maxWidthPercentage;
    }
    case "mobile": {
      return mobileSizeSuffix === "px" ? wInMobilePage : maxWidthPercentage;
    }
  }
}
