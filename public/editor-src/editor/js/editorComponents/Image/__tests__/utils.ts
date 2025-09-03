import { ImageType } from "visual/utils/image/types";
import { V } from "../types";
import {
  ImageValue,
  PredefinedCustomSize,
  calcWrapperOriginalSizes,
  calcWrapperPredefinedSizes,
  getImageSize,
  getSizeType
} from "../utils";

export const imageSizes = [
  {
    label: "Original",
    name: "original"
  },
  {
    width: 150,
    height: 150,
    label: "Thumbnail - 150 x 150",
    name: "thumbnail"
  },
  {
    width: 300,
    height: 300,
    label: "Medium - 300 x 300",
    name: "medium"
  },
  {
    width: 1024,
    height: 1024,
    label: "Large - 1024 x 1024",
    name: "large"
  },
  {
    width: 1536,
    height: 1536,
    label: "1536x1536 - 1536 x 1536",
    name: "1536x1536"
  }
];

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
    expect(getImageSize("custom", imageSizes)).toBe("custom");
    expect(getImageSize("thumbnail", imageSizes)).toStrictEqual({
      width: 150,
      height: 150,
      widthSuffix: "px",
      heightSuffix: "px"
    });
    expect(getImageSize("someType", imageSizes)).toBe("original");
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
      imageType: ImageType.Internal,
      alt: "",
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
      showOriginalImage: "off",
      hoverImageSrc: "",
      hoverImageWidth: 0,
      hoverImageHeight: 0,
      hoverPositionX: 0,
      hoverPositionY: 0,
      hoverHeight: 100,
      hoverImageExtension: "",
      hoverImage: "",
      hoverImageFileName: "",
      tabletWidthSuffix: "",
      tabletHeightSuffix: "",
      mobileWidthSuffix: "",
      mobileHeightSuffix: "",
      tooltipOffset: 0,
      tooltipText: "",
      tooltipTriggerClick: "",
      tooltipPlacement: "top",
      customCSS: "",
      enableLazyLoad: "off"
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
      sizeType: "thumbnail",
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
