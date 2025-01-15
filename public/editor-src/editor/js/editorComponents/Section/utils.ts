import { ElementModel } from "visual/component/Elements/Types";
import {
  maxWidthPercentage,
  minWInBoxedPage,
  minWInMobilePage,
  minWInTabletPage,
  minWidthPercentage,
  wInBoxedPage,
  wInMobilePage,
  wInTabletPage
} from "visual/config/columns";
import { DeviceMode } from "visual/types";
import { defaultValueValue } from "visual/utils/onChange";
import {
  DESKTOP,
  MOBILE,
  ResponsiveMode,
  TABLET
} from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";
import { createOptionId } from "../EditorComponent/utils";
import { Value } from "./type";

export function getMinContainerSuffix({
  v,
  device
}: {
  v: ElementModel;
  device: ResponsiveMode;
}): number {
  const dvv = (key: string, device: ResponsiveMode): unknown =>
    defaultValueValue({ v, key, device });

  const containerSizeSuffix = dvv("containerSizeSuffix", DESKTOP);
  const tabletContainerSizeSuffix = dvv("containerSizeSuffix", TABLET);
  const mobileContainerSizeSuffix = dvv("containerSizeSuffix", MOBILE);

  const desktopSuffix = containerSizeSuffix === "" ? "%" : containerSizeSuffix;
  const tabletSuffix =
    tabletContainerSizeSuffix === "" ? "%" : tabletContainerSizeSuffix;
  const mobileSuffix =
    mobileContainerSizeSuffix === "" ? "%" : mobileContainerSizeSuffix;

  switch (device) {
    case "desktop": {
      return desktopSuffix === "px" ? minWInBoxedPage : minWidthPercentage;
    }
    case "tablet": {
      return tabletSuffix === "px" ? minWInTabletPage : minWidthPercentage;
    }
    case "mobile": {
      return mobileSuffix === "px" ? minWInMobilePage : minWidthPercentage;
    }
  }
}

export function getMaxContainerSuffix({
  v,
  device
}: {
  v: ElementModel;
  device: ResponsiveMode;
}): number {
  const dvv = (key: string, device: ResponsiveMode): unknown =>
    defaultValueValue({ v, key, device });

  const containerSizeSuffix = dvv("containerSizeSuffix", DESKTOP);
  const tabletContainerSizeSuffix = dvv("containerSizeSuffix", TABLET);
  const mobileContainerSizeSuffix = dvv("containerSizeSuffix", MOBILE);

  const desktopSuffix = containerSizeSuffix === "" ? "%" : containerSizeSuffix;
  const tabletSuffix =
    tabletContainerSizeSuffix === "" ? "%" : tabletContainerSizeSuffix;
  const mobileSuffix =
    mobileContainerSizeSuffix === "" ? "%" : mobileContainerSizeSuffix;

  switch (device) {
    case "desktop": {
      return desktopSuffix === "px" ? wInBoxedPage : maxWidthPercentage;
    }
    case "tablet": {
      return tabletSuffix === "px" ? wInTabletPage : maxWidthPercentage;
    }
    case "mobile": {
      return mobileSuffix === "px" ? wInMobilePage : maxWidthPercentage;
    }
  }
}

export const getV = (v: Value, device: DeviceMode) => (key: string) =>
  defaultValueValue({
    v,
    key: createOptionId("margin", key),
    device,
    state: NORMAL
  });
