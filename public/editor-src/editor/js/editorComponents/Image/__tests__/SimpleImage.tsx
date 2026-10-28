import React from "react";
import { renderWithProviders } from "test-utils";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import { StyleProvider } from "visual/providers/StyleProvider";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
import { imageValue } from "../../../../../jest-utils/imageValue";
import { mockDataForReduxStore } from "../../../../../jest-utils/mocks";
import SimpleImage from "../Image/SimpleImage";
import type { ImageSize, V } from "../types";

// The sizes SimpleImage works out for a 1000x500 picture in a 1000 / 600 / 300
// pixel container, as it hands them to `getResponsiveUrls`. Position, zoom and
// unit are read per device and fall back to the desktop ones.

const store = createStore();

store.dispatch({
  ...hydrate({ ...mockDataForReduxStore, symbols: [] }),
  type: "HYDRATE"
});

const size = (
  width: number,
  height: number,
  marginLeft: number,
  marginTop: number
): ImageSize => ({ width, height, marginLeft, marginTop });

describe("SimpleImage sizes on tablet and mobile", () => {
  it.each<{
    case: string;
    v: Partial<V>;
    tablet: ImageSize;
    mobile: ImageSize;
  }>([
    {
      case: "the desktop position, zoom and unit when the device has none",
      v: {},
      tablet: size(600, 300, 0, 0),
      mobile: size(300, 150, 0, 0)
    },
    {
      case: "a desktop zoom and position on every device",
      v: { zoom: 150, positionX: 20, positionY: 80 },
      tablet: size(900, 450, 0, -150),
      mobile: size(450, 225, 0, -75)
    },
    {
      case: "the tablet's own zoom",
      v: { tabletZoom: 200 },
      tablet: size(1200, 600, -300, -150),
      mobile: size(300, 150, 0, 0)
    },
    {
      case: "the mobile's own position",
      v: { zoom: 200, mobilePositionX: 0, mobilePositionY: 100 },
      tablet: size(1200, 600, -300, -150),
      mobile: size(600, 300, 0, -150)
    },
    {
      case: "the tablet's own pixel unit",
      v: {
        tabletWidth: 300,
        tabletHeight: 100,
        tabletWidthSuffix: "px",
        tabletHeightSuffix: "px"
      },
      tablet: size(300, 150, 0, -25),
      mobile: size(300, 150, 0, 0)
    },
    {
      case: "the mobile's own percent unit",
      v: {
        width: 400,
        height: 200,
        widthSuffix: "px",
        heightSuffix: "px",
        mobileWidth: 50,
        mobileHeight: 100,
        mobileWidthSuffix: "%",
        mobileHeightSuffix: "%"
      },
      tablet: size(400, 200, 0, 0),
      mobile: size(150, 75, 0, 0)
    },
    {
      case: "the desktop zoom and position for a device value that is not a number",
      v: {
        zoom: 150,
        positionX: 20,
        positionY: 80,
        tabletZoom: "wide",
        mobilePositionX: "left",
        mobilePositionY: "top"
      },
      tablet: size(900, 450, 0, -150),
      mobile: size(450, 225, 0, -75)
    }
  ])("uses $case", ({ v: patch, tablet, mobile }) => {
    const getResponsiveUrls = jest.fn();
    const v = imageValue(patch);

    renderWithProviders(
      <StyleProvider>
        <SimpleImage
          v={v}
          vs={v}
          vd={v}
          _id="image"
          componentId="Image"
          meta={{
            desktopW: 1000,
            tabletW: 600,
            mobileW: 300,
            gallery: { inGallery: false },
            _dc: {}
          }}
          wrapperSizes={{
            desktop: { width: 1000, height: 500 },
            tablet: { width: 600, height: 300 },
            mobile: { width: 300, height: 150 }
          }}
          renderContext="editor"
          editorMode={Mode.page}
          store={store}
          getResponsiveUrls={getResponsiveUrls}
        />
      </StyleProvider>
    );

    const [sizes] = getResponsiveUrls.mock.calls[0];

    expect({ tablet: sizes.tablet, mobile: sizes.mobile }).toEqual({
      tablet,
      mobile
    });
  });
});
