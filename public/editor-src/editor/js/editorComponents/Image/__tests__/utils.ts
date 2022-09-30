import { V } from "../types";
import {
  calcWrapperOriginalSizes,
  calcWrapperPredefinedSizes,
  getImageSize,
  getSizeType,
  ImageValue,
  PredefinedCustomSize
} from "../utils";

// init config before start the tests
beforeEach(() => {
  require("visual/bootstraps/initConfig");
});

describe("Testing 'Calc for image wrapper' functions", () => {
  test("calcWrapperPredefinedSizes", () => {
    const size200x200: PredefinedCustomSize = {
      width: 200,
      height: 200,
      widthSuffix: "px",
      heightSuffix: "px"
    };
    const size1000x400: PredefinedCustomSize = {
      width: 1000,
      height: 400,
      widthSuffix: "px",
      heightSuffix: "px"
    };
    const size400x1000: PredefinedCustomSize = {
      width: 400,
      height: 1000,
      widthSuffix: "px",
      heightSuffix: "px"
    };

    expect(calcWrapperPredefinedSizes(size200x200, 150)).toStrictEqual({
      width: 150,
      height: 150
    });

    expect(calcWrapperPredefinedSizes(size200x200, 400)).toStrictEqual({
      width: 200,
      height: 200
    });

    expect(calcWrapperPredefinedSizes(size1000x400, 400)).toStrictEqual({
      width: 400,
      height: 160
    });

    expect(calcWrapperPredefinedSizes(size400x1000, 150)).toStrictEqual({
      width: 150,
      height: 375
    });
  });

  test("calcWrapperOriginalSizes", () => {
    const v: ImageValue = {
      size: 100,
      imageWidth: 600,
      imageHeight: 450,
      width: 100,
      height: 100,
      widthSuffix: "px",
      heightSuffix: "px"
    };
    const v2: ImageValue = {
      size: 50,
      imageWidth: 450,
      imageHeight: 600,
      width: 30,
      height: 50,
      widthSuffix: "px",
      heightSuffix: "px"
    };

    expect(calcWrapperOriginalSizes(v, 400)).toStrictEqual({
      width: 400,
      height: 300
    });

    expect(calcWrapperOriginalSizes(v2, 200)).toStrictEqual({
      width: 100,
      height: 66.67
    });
  });
});

describe("Testing 'Getters Image' functions", () => {
  test("getImageSize", () => {
    expect(getImageSize("custom")).toBe("custom");
    expect(getImageSize("thumbnail")).toStrictEqual({
      width: 150,
      height: 150,
      widthSuffix: "px",
      heightSuffix: "px"
    });
    expect(getImageSize("someType")).toBe("original");
  });

  test("getSizeType", () => {
    const v: V = {
      className: "",
      zoom: 0,
      width: 100,
      height: 100,
      tabletWidth: null,
      tabletHeight: null,
      mobileWidth: null,
      mobileHeight: null,
      imageWidth: 0,
      imageHeight: 0,
      widthSuffix: "px",
      heightSuffix: "px",
      imageSrc: "",
      imageFileName: "",
      imageExtension: "",
      imagePopulation: "",
      sizeType: "custom",
      size: 0,
      tabletSize: null,
      mobileSize: null,
      positionY: 0,
      positionX: 0,
      offsetX: 0,
      offsetY: 0,
      linkType: "anchor",
      linkAnchor: "",
      linkToSlide: 1,
      linkExternalBlank: "off",
      linkExternalRel: "off",
      linkLightBox: "off",
      linkExternalType: "",
      linkPopup: "",
      linkUpload: "",
      showOriginalImage: "off"
    };

    // without population
    expect(getSizeType(v, "desktop")).toBe("custom");
    expect(getSizeType(v, "tablet")).toBe("custom");
    expect(getSizeType(v, "mobile")).toBe("custom");

    const vPopulation: V = {
      ...v,
      imagePopulation: "{{test}}"
    };

    // with population
    expect(getSizeType(vPopulation, "desktop")).toBe("custom");
    expect(getSizeType(vPopulation, "tablet")).toBe("custom");
    expect(getSizeType(vPopulation, "mobile")).toBe("custom");

    const vPopulationSize: V = {
      ...v,
      imagePopulation: "{{test size='thumbnail'}}"
    };

    // with population
    expect(getSizeType(vPopulationSize, "desktop")).toBe("thumbnail");
    expect(getSizeType(vPopulationSize, "tablet")).toBe("thumbnail");
    expect(getSizeType(vPopulationSize, "mobile")).toBe("thumbnail");

    const vPopulationSizeEmpty: V = {
      ...v,
      imagePopulation: "{{test size=''}}"
    };

    // with population
    expect(getSizeType(vPopulationSizeEmpty, "desktop")).toBe("custom");
    expect(getSizeType(vPopulationSizeEmpty, "tablet")).toBe("custom");
    expect(getSizeType(vPopulationSizeEmpty, "mobile")).toBe("custom");
  });
});
