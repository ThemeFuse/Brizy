import { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { DeviceMode } from "visual/types";
import {
  ElementModelToValue,
  elementModelToValue,
  patchOnDCChange,
  patchOnSizeTypeChange,
  PatchUnit,
  pathOnUnitChange,
  Size,
  Value
} from "../imageChange";
import { ImageDCPatch, SizeTypePatch, UnitPatch } from "../types/ImagePatch";
import { imageSizes } from "./utils";

// init config before start the tests
beforeEach(() => {
  require("visual/bootstraps/initConfig");
});

describe("Testing 'elementModelToValue' function", () => {
  test("Match properties", () => {
    const input: ElementModelToValue = {
      imageExtension: "gif",
      widthSuffix: "px",
      heightSuffix: "%",
      sizeType: "custom",
      width: 45,
      height: 50,
      size: 10,
      imagePopulation: undefined,
      tabletWidth: undefined,
      tabletHeight: undefined,
      tabletWidthSuffix: undefined,
      tabletHeightSuffix: undefined,
      mobileWidth: undefined,
      mobileHeight: undefined,
      mobileWidthSuffix: undefined,
      mobileHeightSuffix: undefined
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

    const responsiveInput: ElementModelToValue = {
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
    expect(patchOnSizeTypeChange(cW, customPatch, imageSizes)).toStrictEqual({
      sizeType: "custom",
      width: 100,
      height: 100,
      widthSuffix: "%",
      heightSuffix: "%"
    });

    const originalPatch: SizeTypePatch = {
      sizeType: "original"
    };
    expect(patchOnSizeTypeChange(cW, originalPatch, imageSizes)).toStrictEqual({
      sizeType: "original",
      size: 100
    });

    // predefined sizes
    // width: 150 & height: 150 see in jest.config
    const thumbnailPatch: SizeTypePatch = {
      sizeType: "thumbnail"
    };
    expect(patchOnSizeTypeChange(cW, thumbnailPatch, imageSizes)).toStrictEqual(
      {
        sizeType: "thumbnail",
        size: 37.5
      }
    );

    // width: 300 & height: 300 see in jest.config
    const mediumPatch: SizeTypePatch = {
      sizeType: "medium"
    };
    expect(patchOnSizeTypeChange(cW, mediumPatch, imageSizes)).toStrictEqual({
      sizeType: "medium",
      size: 75
    });

    // width: 1024 & height: 1024 see in jest.config
    const largePatch: SizeTypePatch = {
      sizeType: "large"
    };
    expect(patchOnSizeTypeChange(cW, largePatch, imageSizes)).toStrictEqual({
      sizeType: "large",
      size: 100
    });

    // width: 1536 & height: 1536 see in jest.config
    const patch1536x1536: SizeTypePatch = {
      sizeType: "1536x1536"
    };
    expect(patchOnSizeTypeChange(cW, patch1536x1536, imageSizes)).toStrictEqual(
      {
        sizeType: "1536x1536",
        size: 100
      }
    );
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
    const makeEditorComponentContext = (
      itemId: string
    ): EditorComponentContextValue => ({
      dynamicContent: {
        itemId,
        config: {
          image: [
            {
              label: "Featured Image",
              placeholder: "{{test size=''}}",
              attr: {
                size: ""
              }
            },
            {
              label: "Featured Image 2",
              placeholder: "",
              optgroup: [
                {
                  label: "Custom",
                  placeholder: "{{test}}",
                  attr: {}
                },
                {
                  label: "Original",
                  placeholder: "{{test size='original'}}",
                  attr: {
                    size: "original"
                  }
                },
                {
                  label: "Thumbnail",
                  placeholder: "{{test size='thumbnail'}}",
                  attr: {
                    size: "thumbnail"
                  }
                },
                {
                  label: "Others",
                  placeholder: "{{test size='others'}}",
                  attr: {
                    size: "others"
                  }
                },
                {
                  label: "Medium",
                  placeholder: "{{test size='medium'}}",
                  attr: {
                    size: "medium"
                  }
                },
                {
                  label: "Large",
                  placeholder: "{{test size='large'}}",
                  attr: {
                    size: "large"
                  }
                },
                {
                  label: "1536x1536",
                  placeholder: "{{test size='1536x1536'}}",
                  attr: {
                    size: "1536x1536"
                  }
                }
              ]
            }
          ],
          link: [],
          richText: [],
          reference: [],
          multiReference: []
        }
      }
    });
    const context = makeEditorComponentContext("post1");

    expect(
      patchOnDCChange(cW, patch, wrapperSizes, context, imageSizes)
    ).toStrictEqual({
      height: 200,
      heightSuffix: "px",
      sizeType: "custom"
    });

    const emptyPatch: ImageDCPatch = {
      imagePopulation: ""
    };
    expect(
      patchOnDCChange(cW, emptyPatch, wrapperSizes, context, imageSizes)
    ).toStrictEqual({
      width: 100,
      height: 100,
      heightSuffix: "%",
      widthSuffix: "%",
      sizeType: "custom"
    });

    const patchOriginal: ImageDCPatch = {
      imagePopulation: "{{test size='original'}}"
    };
    expect(
      patchOnDCChange(cW, patchOriginal, wrapperSizes, context, imageSizes)
    ).toStrictEqual({ size: 100, sizeType: "original" });

    const patchOther: ImageDCPatch = {
      imagePopulation: "{{test size='others'}}"
    };
    expect(
      patchOnDCChange(cW, patchOther, wrapperSizes, context, imageSizes)
    ).toStrictEqual({ size: 100, sizeType: "others" });

    const patchEmpty: ImageDCPatch = {
      imagePopulation: "{{test size=''}}"
    };
    expect(
      patchOnDCChange(cW, patchEmpty, wrapperSizes, context, imageSizes)
    ).toStrictEqual({ size: 100, sizeType: "custom" });

    // predefined sizes from config
    // width: 150 & height: 150 see in jest.config
    const patchThumbnail: ImageDCPatch = {
      imagePopulation: "{{test size='thumbnail'}}"
    };
    expect(
      patchOnDCChange(cW, patchThumbnail, wrapperSizes, context, imageSizes)
    ).toStrictEqual({ size: 37.5, sizeType: "thumbnail" });

    // width: 300 & height: 300 see in jest.config
    const patchMedium: ImageDCPatch = {
      imagePopulation: "{{test size='medium'}}"
    };
    expect(
      patchOnDCChange(cW, patchMedium, wrapperSizes, context, imageSizes)
    ).toStrictEqual({ size: 75, sizeType: "medium" });

    // width: 1024 & height: 1024 see in jest.config
    const patchLarge: ImageDCPatch = {
      imagePopulation: "{{test size='large'}}"
    };
    expect(
      patchOnDCChange(cW, patchLarge, wrapperSizes, context, imageSizes)
    ).toStrictEqual({ size: 100, sizeType: "large" });

    // width: 1536 & height: 1536 see in jest.config
    const patch1536x1536: ImageDCPatch = {
      imagePopulation: "{{test size='1536x1536'}}"
    };
    expect(
      patchOnDCChange(cW, patch1536x1536, wrapperSizes, context, imageSizes)
    ).toStrictEqual({ size: 100, sizeType: "1536x1536" });

    // Custom Placeholder
    const patchCustomPlaceholder: ImageDCPatch = {
      imagePopulation: "{{UserAttribute['test_12312'] default('abc')}}"
    };
    expect(
      patchOnDCChange(
        cW,
        patchCustomPlaceholder,
        wrapperSizes,
        context,
        imageSizes
      )
    ).toStrictEqual({ height: 200, heightSuffix: "px", sizeType: "custom" });
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
