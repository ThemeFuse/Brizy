import {
  styleBorderWidthType,
  styleElementTableAside,
  styleElementTableAsideWidth,
  styleElementTableColumns,
  styleElementTableWidth,
  stylePaddingType,
  styleBorderWidthGrouped,
  styleBorderWidthUngrouped
} from "visual/utils/style2";
import { getPadding } from "visual/utils/meta";
import {
  ResponsiveMode,
  DESKTOP,
  TABLET,
  MOBILE
} from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { ElementModel } from "visual/component/Elements/Types";

type Meta = {
  desktopW: number;
  desktopWNoSpacing: number;
  tabletW: number;
  tabletWNoSpacing: number;
  mobileW: number;
  mobileWNoSpacing: number;
};

type CalculateMeta = {
  v: ElementModel;
  state: State;
  meta: Meta;
};

type GetWidth = {
  v: ElementModel;
  state: State;
  w: number;
  wNoSpacing: number;
  device: ResponsiveMode;
};

type Border = {
  v: ElementModel;
  state: State;
  device: ResponsiveMode;
  type: string;
};

const getBorder = ({ v, device, state, type }: Border): number => {
  switch (type) {
    case "grouped": {
      return styleBorderWidthGrouped({ v, device, state });
    }
    case "ungrouped": {
      return (
        styleBorderWidthUngrouped({ v, device, state, current: "left" }) / 2 +
        styleBorderWidthUngrouped({ v, device, state, current: "right" }) / 2
      );
    }
    default: {
      return 0;
    }
  }
};

const getWidth = (data: GetWidth): { w: number; wNoSpacing: number } => {
  const { w, wNoSpacing, v, device, state } = data;
  const width = styleElementTableWidth({ v, device, state });
  const paddingType = stylePaddingType({ v, device, state });
  const paddingW = getPadding({ v, w, device, state, type: paddingType });
  const borderType = styleBorderWidthType({ v, device, state });
  const borderWidthW = getBorder({ v, device, state, type: borderType });
  const externalSpacing = borderWidthW + paddingW;
  const aside = styleElementTableAside({ v, device, state });
  const columns = styleElementTableColumns({ v, device, state });

  if (aside === "off" || device === MOBILE) {
    const containerW = w * (width / 100) - externalSpacing;
    const containerWNoSpacing = wNoSpacing * (width / 100);

    return {
      w: Math.round((containerW / columns - borderWidthW) * 10) / 10,
      wNoSpacing: Math.round((containerWNoSpacing / columns) * 10) / 10
    };
  }

  const asideWidth = styleElementTableAsideWidth({ v, device, state });
  const containerW = w * (width / 100) - externalSpacing;
  const containerWNoAside = containerW - asideWidth;
  const containerWNoSpacing = wNoSpacing * (width / 100);
  const containerWNoSpacingNoAside = containerWNoSpacing - asideWidth;

  return {
    w: Math.round((containerWNoAside / columns - borderWidthW) * 10) / 10,
    wNoSpacing: Math.round((containerWNoSpacingNoAside / columns) * 10) / 10
  };
};

export const calculateMeta = (data: CalculateMeta): Meta => {
  const { v, state } = data;
  const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getWidth({
    v,
    state,
    w: data.meta.desktopW,
    wNoSpacing: data.meta.desktopWNoSpacing,
    device: DESKTOP
  });
  const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getWidth({
    v,
    state,
    w: data.meta.tabletW,
    wNoSpacing: data.meta.tabletWNoSpacing,
    device: TABLET
  });
  const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getWidth({
    v,
    state,
    w: data.meta.mobileW,
    wNoSpacing: data.meta.mobileWNoSpacing,
    device: MOBILE
  });

  return {
    desktopW,
    desktopWNoSpacing,
    tabletW,
    tabletWNoSpacing,
    mobileW,
    mobileWNoSpacing
  };
};
