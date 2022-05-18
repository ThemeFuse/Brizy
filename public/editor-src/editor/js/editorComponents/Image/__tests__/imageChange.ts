import { DeviceMode } from "visual/types";
import { ElementModel } from "visual/component/Elements/Types";
import { ImageDCPatch, SizeTypePatch, UnitPatch } from "../types/ImagePatch";
import {
  elementModelToValue,
  patchOnSizeTypeChange,
  patchOnDCChange,
  pathOnUnitChange,
  Value,
  Size,
  PatchUnit
} from "../imageChange";

// init config before start the tests
beforeEach(() => {
  require("visual/bootstraps/initConfig");
});

describe("Testing 'elementModelToValue' function", () => {
  test("Match properties", () => {
    const input: ElementModel = {
      imageExtension: "gif",
      widthSuffix: "px",
      heightSuffix: "%",
      sizeType: "custom",
      width: 45,
      height: 50,
      size: 10
    };

    const output: Value = {
      imageExtension: "gif",
      imagePopulation: undefined,
      mobileHeight: undefined,
      mobileHeightSuffix: undefined,
      mobileWidth: undefined,
      mobileWidthSuffix: undefined,
      tabletHeight: undefined,
      tabletHeightSuffix: undefined,
      tabletWidth: undefined,
      tabletWidthSuffix: undefined,
      widthSuffix: "px",
      heightSuffix: "%",
      sizeType: "custom",
      width: 45,
      height: 50,
      size: 10
    };

    expect(elementModelToValue(input)).toStrictEqual(output);

    const responsiveInput: ElementModel = {
      imageExtension: "gif",
      imagePopulation: "{{feature}}",
      widthSuffix: "px",
      heightSuffix: "%",
      sizeType: "custom",
      width: 45,
      height: 50,
      size: 10,
      mobileHeight: 10,
      mobileHeightSuffix: "px",
      mobileWidth: 10,
      mobileWidthSuffix: "%",
      tabletHeight: 20,
      tabletHeightSuffix: "%",
      tabletWidth: 20,
      tabletWidthSuffix: "px"
    };
    const responsiveOutput: Value = {
      imageExtension: "gif",

      mobileHeight: 10,
      mobileHeightSuffix: "px",
      mobileWidth: 10,
      mobileWidthSuffix: "%",
      tabletHeight: 20,
      tabletHeightSuffix: "%",
      tabletWidth: 20,
      tabletWidthSuffix: "px",
      widthSuffix: "px",
      heightSuffix: "%",
      sizeType: "custom",
      width: 45,
      height: 50,
      size: 10,
      imagePopulation: "{{feature}}"
    };

    expect(elementModelToValue(responsiveInput)).toStrictEqual(
      responsiveOutput
    );
  });
});

describe("Testing 'Patches for image' functions", () => {
  test("patchOnSizeTypeChange", () => {
    const cW = 400;

    const customPatch: SizeTypePatch = {
      sizeType: "custom"
    };
    expect(patchOnSizeTypeChange(cW, customPatch)).toStrictEqual({
      sizeType: "custom",
      width: 100,
      height: 100,
      widthSuffix: "%",
      heightSuffix: "%"
    });

    const originalPatch: SizeTypePatch = {
      sizeType: "original"
    };
    expect(patchOnSizeTypeChange(cW, originalPatch)).toStrictEqual({
      sizeType: "original",
      size: 100
    });

    // predefined sizes
    // width: 150 & height: 150 see in jest.config
    const thumbnailPatch: SizeTypePatch = {
      sizeType: "thumbnail"
    };
    expect(patchOnSizeTypeChange(cW, thumbnailPatch)).toStrictEqual({
      sizeType: "thumbnail",
      size: 37.5
    });

    // width: 300 & height: 300 see in jest.config
    const mediumPatch: SizeTypePatch = {
      sizeType: "medium"
    };
    expect(patchOnSizeTypeChange(cW, mediumPatch)).toStrictEqual({
      sizeType: "medium",
      size: 75
    });

    // width: 1024 & height: 1024 see in jest.config
    const largePatch: SizeTypePatch = {
      sizeType: "large"
    };
    expect(patchOnSizeTypeChange(cW, largePatch)).toStrictEqual({
      sizeType: "large",
      size: 100
    });

    // width: 1536 & height: 1536 see in jest.config
    const patch1536x1536: SizeTypePatch = {
      sizeType: "1536x1536"
    };
    expect(patchOnSizeTypeChange(cW, patch1536x1536)).toStrictEqual({
      sizeType: "1536x1536",
      size: 100
    });
  });

  test("patchOnDCChange", () => {
    const cW = 400;
    const patch: ImageDCPatch = {
      imagePopulation: "{{test}}"
    };
    const wrapperSizes: Size = {
      width: 200,
      height: 200
    };
    expect(patchOnDCChange(cW, patch, wrapperSizes)).toStrictEqual({
      height: 200,
      heightSuffix: "px"
    });

    const emptyPatch: ImageDCPatch = {
      imagePopulation: ""
    };
    expect(patchOnDCChange(cW, emptyPatch, wrapperSizes)).toStrictEqual({
      width: 100,
      height: 100,
      heightSuffix: "%",
      widthSuffix: "%"
    });

    const patchOriginal: ImageDCPatch = {
      imagePopulation: "{{test size='original'}}"
    };
    expect(patchOnDCChange(cW, patchOriginal, wrapperSizes)).toStrictEqual({
      size: 100
    });

    const patchOther: ImageDCPatch = {
      imagePopulation: "{{test size='others'}}"
    };
    expect(patchOnDCChange(cW, patchOther, wrapperSizes)).toStrictEqual({
      size: 100
    });

    const patchEmpty: ImageDCPatch = {
      imagePopulation: "{{test size=''}}"
    };
    expect(patchOnDCChange(cW, patchEmpty, wrapperSizes)).toStrictEqual({
      size: 100
    });

    // predefined sizes from config
    // width: 150 & height: 150 see in jest.config
    const patchThumbnail: ImageDCPatch = {
      imagePopulation: "{{test size='thumbnail'}}"
    };
    expect(patchOnDCChange(cW, patchThumbnail, wrapperSizes)).toStrictEqual({
      size: 37.5
    });

    // width: 300 & height: 300 see in jest.config
    const patchMedium: ImageDCPatch = {
      imagePopulation: "{{test size='medium'}}"
    };
    expect(patchOnDCChange(cW, patchMedium, wrapperSizes)).toStrictEqual({
      size: 75
    });

    // width: 1024 & height: 1024 see in jest.config
    const patchLarge: ImageDCPatch = {
      imagePopulation: "{{test size='large'}}"
    };
    expect(patchOnDCChange(cW, patchLarge, wrapperSizes)).toStrictEqual({
      size: 100
    });

    // width: 1536 & height: 1536 see in jest.config
    const patch1536x1536: ImageDCPatch = {
      imagePopulation: "{{test size='1536x1536'}}"
    };
    expect(patchOnDCChange(cW, patch1536x1536, wrapperSizes)).toStrictEqual({
      size: 100
    });
  });

  test.each<[number, Value, UnitPatch, DeviceMode, PatchUnit]>([
    // base
    [
      400,
      {
        width: 0,
        height: 0,
        widthSuffix: "px",
        heightSuffix: "px",
        size: 0,
        sizeType: "custom",
        imageExtension: "jpeg"
      },
      {
        width: 100,
        height: 100
      },
      "desktop",
      {
        width: 100,
        height: 100
      }
    ],
    [
      500,
      {
        width: 500,
        height: 200,
        widthSuffix: "px",
        heightSuffix: "px",
        size: 100,
        sizeType: "custom",
        imageExtension: "gif"
      },
      {
        widthSuffix: "%"
      },
      "desktop",
      {
        width: 100,
        widthSuffix: "%"
      }
    ],
    [
      500,
      {
        width: 250,
        height: 200,
        widthSuffix: "px",
        heightSuffix: "px",
        size: 100,
        sizeType: "custom",
        imageExtension: "gif"
      },
      {
        widthSuffix: "%"
      },
      "desktop",
      {
        width: 50,
        widthSuffix: "%"
      }
    ],
    [
      500,
      {
        width: 50,
        height: 200,
        widthSuffix: "%",
        heightSuffix: "px",
        size: 100,
        sizeType: "custom",
        imageExtension: "gif"
      },
      {
        widthSuffix: "px"
      },
      "desktop",
      {
        width: 250,
        widthSuffix: "px"
      }
    ],
    [
      500,
      {
        width: 100,
        height: 200,
        widthSuffix: "%",
        heightSuffix: "px",
        size: 100,
        sizeType: "custom",
        imageExtension: "gif",
        tabletWidth: 75,
        tabletWidthSuffix: "%"
      },
      {
        tabletWidthSuffix: "px"
      },
      "tablet",
      {
        tabletWidth: 375,
        tabletWidthSuffix: "px"
      }
    ]
  ])("pathOnUnitChange cW = %i", (cW, v, patch, device, resolve) => {
    expect(pathOnUnitChange(cW, v, patch, device)).toStrictEqual(resolve);
  });
});
