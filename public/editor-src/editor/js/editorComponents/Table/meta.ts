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

type Meta = {
  desktopW: number;
  tabletW: number;
  mobileW: number;
};

type CalculateMeta = {
  v: unknown;
  state: State;
  meta: Meta;
};

type GetWidth = {
  v: unknown;
  state: State;
  w: number;
  device: ResponsiveMode;
};

type Border = {
  v: unknown;
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

const getWidth = (data: GetWidth): number => {
  const { w, v, device, state } = data;
  const width: number = styleElementTableWidth({ v, device, state });
  const paddingType: string = stylePaddingType({ v, device, state });
  const paddingW: number = getPadding({
    v,
    w,
    device,
    state,
    type: paddingType
  });
  const borderType: string = styleBorderWidthType({ v, device, state });
  const borderWidthW: number = getBorder({
    v,
    device,
    state,
    type: borderType
  });
  const externalSpacing = borderWidthW + paddingW;
  const aside: string = styleElementTableAside({ v, device, state });
  const columns: number = styleElementTableColumns({ v, device, state });

  if (aside === "off" || device === MOBILE) {
    const containerW = w * (width / 100) - externalSpacing;
    return containerW / columns - borderWidthW;
  }

  const asideWidth: number = styleElementTableAsideWidth({ v, device, state });
  const containerW = w * (width / 100) - externalSpacing;

  return (containerW - asideWidth) / columns - borderWidthW;
};

export const calculateMeta = (data: CalculateMeta): Meta => {
  const {
    v,
    state,
    meta: { desktopW, tabletW, mobileW }
  } = data;

  return {
    desktopW: getWidth({
      v,
      state,
      w: desktopW,
      device: DESKTOP
    }),
    tabletW: getWidth({
      v,
      state,
      w: tabletW,
      device: TABLET
    }),
    mobileW: getWidth({
      v,
      state,
      w: mobileW,
      device: MOBILE
    })
  };
};
