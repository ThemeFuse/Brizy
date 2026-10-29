import { imageValue } from "../../../../../jest-utils/imageValue";
import { config } from "../../../../../jest-utils/mocks";
import { calculateWrapperSizes } from "../shared";
import type { V } from "../types";

// The wrapper of a 1000x500 picture in a 1000 / 600 / 300 pixel container.
// A device sizes it with its own unit, or with the desktop one when it has none.

const state = {
  containerWidth: 1000,
  tabletContainerWidth: 600,
  mobileContainerWidth: 300,
  isDragging: false,
  sizePatch: null
};

const pixels: Partial<V> = {
  width: 400,
  height: 200,
  widthSuffix: "px",
  heightSuffix: "px"
};

describe("calculateWrapperSizes on tablet and mobile", () => {
  it.each<{
    case: string;
    v: Partial<V>;
    tablet: { width: number; height: number };
    mobile: { width: number; height: number };
  }>([
    {
      case: "the desktop percent unit when the device has none",
      v: {},
      tablet: { width: 600, height: 300 },
      mobile: { width: 300, height: 150 }
    },
    {
      case: "the desktop pixel unit when the device has none",
      v: pixels,
      tablet: { width: 400, height: 200 },
      mobile: { width: 300, height: 200 }
    },
    {
      case: "the device's own unit over the desktop percent",
      v: {
        tabletWidth: 300,
        tabletHeight: 150,
        tabletWidthSuffix: "px",
        tabletHeightSuffix: "px",
        mobileWidth: 50,
        mobileHeight: 50,
        mobileWidthSuffix: "%",
        mobileHeightSuffix: "%"
      },
      tablet: { width: 300, height: 150 },
      mobile: { width: 150, height: 37.5 }
    },
    {
      case: "the device's own unit over the desktop pixels",
      v: {
        ...pixels,
        tabletWidth: 50,
        tabletHeight: 100,
        tabletWidthSuffix: "%",
        tabletHeightSuffix: "%",
        mobileWidth: 200,
        mobileHeight: 80,
        mobileWidthSuffix: "px",
        mobileHeightSuffix: "px"
      },
      tablet: { width: 300, height: 150 },
      mobile: { width: 200, height: 80 }
    },
    {
      case: "pixels for a device unit that is not a percent",
      v: {
        tabletWidthSuffix: "",
        tabletHeightSuffix: "",
        mobileWidthSuffix: "",
        mobileHeightSuffix: ""
      },
      tablet: { width: 100, height: 100 },
      mobile: { width: 100, height: 100 }
    }
  ])("uses $case", ({ v, tablet, mobile }) => {
    const sizes = calculateWrapperSizes(imageValue(v), state, config);

    expect({ tablet: sizes.tablet, mobile: sizes.mobile }).toEqual({
      tablet,
      mobile
    });
  });
});
