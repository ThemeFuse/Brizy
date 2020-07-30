import {
  DESKTOP,
  MOBILE,
  TABLET,
  ResponsiveMode
} from "visual/utils/responsiveMode";
import {
  wInFullPage,
  wInTabletPage,
  wInMobilePage
} from "visual/config/columns";
import {
  styleElementMegaMenuWidth,
  styleElementMegaMenuWidthSuffix
} from "visual/utils/style2";

type CalculateMeta = {
  meta: Meta;
  mods: Mods;
  v: unknown;
  isMMenu: boolean;
};
type GetWidth = {
  W: number;
  isMMenu: boolean;
  v: unknown;
  mode: Mode;
  device: ResponsiveMode;
};

type Meta = {
  desktopW: number;
  tabletW: number;
  mobileW: number;
};

type Mode = "vertical" | "horizontal";

type Mods = {
  desktop: Mode;
  tablet: Mode;
  mobile: Mode;
};

type Suffix = "px" | "vw" | "%";

// Hardcoded in css
const MMENU_WIDTH = 440;
const MOBILE_MMENU_WIDTH = 380;

const getWPerDevice = (device: ResponsiveMode): number => {
  switch (device) {
    case "desktop": {
      return wInFullPage;
    }
    case "tablet": {
      return wInTabletPage;
    }
    default: {
      return wInMobilePage;
    }
  }
};

const getWidth = (data: GetWidth): number => {
  const { W, mode, device, isMMenu, v } = data;

  // don't calculate W if MMenu
  if (isMMenu) {
    return device === "mobile" ? MOBILE_MMENU_WIDTH : MMENU_WIDTH;
  }

  // don't calculate W if mode === horizontal
  if (mode === "horizontal") {
    return W;
  }

  const width: number = styleElementMegaMenuWidth({
    v,
    device: device,
    state: "normal"
  });
  const suffix: Suffix = styleElementMegaMenuWidthSuffix({
    v,
    device: device,
    state: "normal"
  });

  switch (suffix) {
    case "px": {
      return width;
    }
    case "vw": {
      const newW = device === "mobile" ? W : getWPerDevice(device);
      const containerW = width >= 100 ? newW : newW * (width / 100);
      return Math.round(containerW * 10) / 10;
    }
    case "%": {
      const containerW = W * (width / 100);
      return Math.round(containerW * 10) / 10;
    }
  }
};

export const calculateMeta = (data: CalculateMeta): Meta => {
  const { meta, mods, isMMenu, v } = data;
  const { desktopW, tabletW, mobileW } = meta;

  return {
    desktopW: getWidth({
      v,
      isMMenu,
      W: desktopW,
      mode: mods[DESKTOP],
      device: DESKTOP
    }),
    tabletW: getWidth({
      v,
      isMMenu,
      W: tabletW,
      mode: mods[TABLET],
      device: TABLET
    }),
    mobileW: getWidth({
      v,
      isMMenu,
      W: mobileW,
      mode: mods[MOBILE],
      device: MOBILE
    })
  };
};
