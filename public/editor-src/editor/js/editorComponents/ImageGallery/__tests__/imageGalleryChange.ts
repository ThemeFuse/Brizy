import type { ElementModelType } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  patchOnBigImageAsCurrLayout,
  patchOnBigImageAsPrevLayout,
  patchOnBigImageChange,
  patchOnBigImageImagesThumbSizeChange,
  patchOnBigImageLayout,
  patchOnColumnChange,
  patchOnJustifiedLayout,
  patchOnLightBox,
  patchOnMasonryLayout,
  patchOnThumbStyleChange
} from "../imageGalleryChange";
import type {
  LayoutType,
  SizeChangedType,
  State,
  ThumbStyle,
  Value
} from "../types";
import {
  addHorizontalThumbStyleData,
  adjustImagesByHeight,
  getDefaultGridItems,
  removeHorizontalThumbStyleData,
  unitPercent,
  unitPx
} from "../utils";

const enabled: State = "on";
export const disabled: State = "off";

const node = document.createElement("div");

const gridLayout: LayoutType = "grid";
export const masonryLayout: LayoutType = "masonry";
export const justifiedLayout: LayoutType = "justified";
export const bigImageLayout: LayoutType = "bigImage";

const thumbBottom: ThumbStyle = "bottom";

const isChangedHeight: SizeChangedType = "height";

export const mockValue: Value = {
  layout: gridLayout,
  lightBox: disabled,
  thumbStyle: thumbBottom,
  spacing: 5,
  gridColumn: 2,
  tabletGridColumn: 2,
  mobileGridColumn: 2,
  items: [],
  itemsOption: [],
  gridAspectRatio: "4/3",
  tags: "",
  imageSrc: "",
  imageFileName: "",
  imageWidth: 300,
  imageHeight: 200,
  allTag: "",
  bigImageImagesHeight: 300,
  bigImageImagesHeightSuffix: "px",
  tabletBigImageImagesHeight: 300,
  tabletBigImageImagesHeightSuffix: "px",
  mobileBigImageImagesHeight: 300,
  mobileBigImageImagesHeightSuffix: "px",
  thumbWidth: 150,
  thumbWidthSuffix: "px",
  tabletThumbWidth: 150,
  tabletThumbWidthSuffix: "px",
  mobileThumbWidth: 150,
  mobileThumbWidthSuffix: "px",
  _id: "1",
  customCSS: ""
};

export const emptyImage: ElementModelType = { type: "Image", value: {} };

const emptyClonedImage: ElementModelType = {
  type: "Image",
  value: { clonedFromGallery: true }
};

const imageWithMockTestKey: ElementModelType = {
  type: "Image",
  value: { testK: 1 }
};

const imageLinkExternal: ElementModelType = {
  type: "Image",
  value: { linkType: "external", linkLightBox: "" }
};

export const lightBoxDisabledOutput: ElementModelType = {
  type: "Image",
  value: { linkLightBox: disabled, linkType: "external" }
};

const lightBoxEnabledOutput: ElementModelType = {
  type: "Image",
  value: { linkType: "lightBox", linkLightBox: enabled }
};

const horizontalThumbStyleDataOutputValue = {
  height: 100,
  heightSuffix: "%",
  tabletHeight: 200,
  tabletHeightSuffix: "px",
  mobileHeight: 300,
  mobileHeightSuffix: "px",
  width: 100,
  widthSuffix: "%",
  tabletWidth: 200,
  tabletWidthSuffix: "px",
  mobileWidth: 200,
  mobileWidthSuffix: "px"
};

const horizontalThumbStyleDataOutput: ElementModelType = {
  type: "Image",
  value: horizontalThumbStyleDataOutputValue
};

const bigImageImagesThumbSizeChangeOutputValue = {
  height: 254,
  heightSuffix: "px",
  hoverHeight: 254,
  mobileHeightSuffix: "px",
  mobileSizeType: null,
  sizeType: "custom",
  tabletHeightSuffix: "px",
  tabletSizeType: null
};

const bigImageImagesThumbSizeChangeOutput: ElementModelType = {
  type: ElementTypes.Image,
  value: bigImageImagesThumbSizeChangeOutputValue
};

const gridItemsThreeColumnsOuptput: ElementModelType = {
  type: "Image",
  value: {
    height: 100,
    hoverHeight: 100,
    heightSuffix: "%",
    tabletHeight: null,
    tabletHeightSuffix: null,
    mobileHeight: null,
    mobileHeightSuffix: null,
    sizeType: "custom",
    tabletSizeType: null,
    mobileSizeType: null
  }
};

const gridItemsThreeColumnsRatio1Output: ElementModelType = {
  type: "Image",
  value: {
    height: 133.33333333333331,
    hoverHeight: 133.33333333333331,
    heightSuffix: "%",
    tabletHeight: null,
    tabletHeightSuffix: null,
    mobileHeight: null,
    mobileHeightSuffix: null,
    sizeType: "custom",
    tabletSizeType: null,
    mobileSizeType: null
  }
};

const gridItemsSixColumnsOutput: ElementModelType = {
  type: "Image",
  value: {
    height: 99.9969112923153,
    heightSuffix: "%",
    hoverHeight: 99.9969112923153,
    mobileHeight: null,
    mobileHeightSuffix: null,
    mobileSizeType: null,
    sizeType: "custom",
    tabletHeight: null,
    tabletHeightSuffix: null,
    tabletSizeType: null
  }
};

const bigImageLayoutPatchValue = {
  height: 300,
  heightSuffix: "px",
  hoverHeight: 300,
  mobileHeightSuffix: "px",
  mobileSizeType: null,
  sizeType: "custom",
  tabletHeightSuffix: "px",
  tabletSizeType: null
};

const bigImageLayoutPatch: ElementModelType = {
  type: "Image",
  value: bigImageLayoutPatchValue
};

const justifiedLayoutStaticData = {
  sizeType: "original",
  tabletSizeType: null,
  mobileSizeType: null,
  linkType: "lightBox",
  linkLightBox: enabled,
  height: 300,
  heightSuffix: "px"
};

const bigImageCurrentLayoutStaticData = {
  sizeType: "custom",
  tabletSizeType: null,
  mobileSizeType: null,
  clonedFromGallery: true
};

const removeHorizontalThumbStyleDataWidths = {
  width: 100,
  tabletWidth: 150,
  mobileWidth: 150
};

const removeHorizontalThumbStyleDataWidthSuffixes = {
  width: 100,
  tabletWidth: 150,
  mobileWidth: 150
};

const bigImageAsCurrentLayoutStaticData = {
  imageSrc: "1.jpg",
  imageFileName: "1.jpg",
  imageWidth: 500,
  imageHeight: 200,
  imageExtension: "jpg",
  size: 100
};

const bigImageAsCurrentLayoutStaticItems: ElementModelType[] = [
  { type: "Image", value: { color: "red", imageSrc: "1.jpg" } },
  { type: "Image", value: { color: "green", imageSrc: "2.jpg" } },
  { type: "Image", value: { color: "blue", imageSrc: "3.jpg" } }
];

const bigImageChangeStaticData1 = {
  imageSrc: "1.jpg",
  imageFileName: "1.jpg",
  imageExtension: "jpg",
  imageWidth: 500,
  imageHeight: 300,
  size: 100
};

const bigImageChangeStaticData2 = {
  imageSrc: "2.jpg",
  imageFileName: "2.jpg",
  imageExtension: "jpg",
  imageWidth: 300,
  imageHeight: 100,
  size: 50
};

const patchOnMasonryLayoutStaticData = {
  sizeType: "custom",
  tabletSizeType: null,
  mobileSizeType: null,
  linkType: "external",
  linkLightBox: disabled
};

const patchOnBigImageLayoutStaticHeight = {
  bigImageImagesHeight: 300,
  bigImageImagesHeightSuffix: "px"
};

const patchOnBigImageAsPrevLayoutStaticData: ElementModelType[] = [
  { type: "Image", value: { key: 1 } },
  { type: "Image", value: { key: 2 } },
  { type: "Image", value: { key: 3 } }
];

const imageColorGreen: ElementModelType = {
  type: "Image",
  value: {
    color: "green"
  }
};

const imageColorBlue: ElementModelType = {
  type: "Image",
  value: {
    color: "blue"
  }
};

const imageColorRed: ElementModelType = {
  type: "Image",
  value: {
    color: "red"
  }
};

const horizontalThumbStyleInputData = {
  bigImageImagesHeight: 100,
  tabletBigImageImagesHeight: 200,
  mobileBigImageImagesHeight: 300,
  bigImageImagesHeightSuffix: unitPercent,
  tabletBigImageImagesHeightSuffix: unitPx,
  mobileBigImageImagesHeightSuffix: unitPx,
  thumbWidth: 100,
  thumbWidthSuffix: unitPercent,
  tabletThumbWidth: 200,
  tabletThumbWidthSuffix: unitPx,
  mobileThumbWidth: 200,
  mobileThumbWidthSuffix: unitPx
};

const adjustImagesByHeightData = {
  node,
  responsiveGridColumn: 2,
  thumbStyle: thumbBottom,
  cW: 500
};

const adjustImageByHeightOutputCommonData = {
  heightSuffix: "px",
  hoverHeight: 250,
  mobileHeightSuffix: "px",
  mobileWidth: 100,
  mobileWidthSuffix: "px",
  tabletHeightSuffix: "px",
  tabletWidth: 100,
  tabletWidthSuffix: "px",
  width: 100,
  widthSuffix: "px"
};

const itemWithMasonryStaticData: ElementModelType = {
  type: "Image",
  value: patchOnMasonryLayoutStaticData
};

const patchOnMasonryLayoutOutput: ElementModelType = {
  type: "Image",
  value: patchOnMasonryLayoutStaticData
};

const patchOnJustifiedInputData = {
  rowHeight: 300,
  heightKey: "height",
  heightSuffixKey: "heightSuffix"
};

const patchOnBigImageThumbSizeChange = {
  height: 254,
  heightSuffix: unitPx,
  heightKey: "height",
  width: 643,
  widthKey: "width",
  isChanged: isChangedHeight,
  imagesHeightKey: "bigImageImagesHeight",
  responsiveGridColumn: 2,
  node,
  cW: 1295
};

describe("Testing patchOnBigImageImagesThumbSizeChange that should change image sizes for bigImage layout", () => {
  test("Test patchOnBigImageImagesThumbSizeChange with placeholder. Should be changed", () => {
    const newV = {
      ...mockValue,
      items: [emptyClonedImage, emptyImage, emptyImage, emptyImage, emptyImage]
    };

    expect(
      patchOnBigImageImagesThumbSizeChange(
        newV,
        mockValue,
        patchOnBigImageThumbSizeChange
      )
    ).toStrictEqual({
      ...mockValue,
      bigImageImagesHeight: 254,
      items: [
        {
          type: "Image",
          value: bigImageCurrentLayoutStaticData
        },
        bigImageImagesThumbSizeChangeOutput,
        bigImageImagesThumbSizeChangeOutput,
        bigImageImagesThumbSizeChangeOutput,
        bigImageImagesThumbSizeChangeOutput
      ]
    });
  });

  test("Test patchOnBigImageImagesThumbSizeChange with working images", () => {
    const newV = {
      ...mockValue,
      items: [imageColorRed, imageColorGreen]
    };

    expect(
      patchOnBigImageImagesThumbSizeChange(
        newV,
        mockValue,
        patchOnBigImageThumbSizeChange
      )
    ).toStrictEqual({
      ...mockValue,
      bigImageImagesHeight: 254,
      items: [
        {
          type: "Image",
          value: {
            ...bigImageImagesThumbSizeChangeOutputValue,
            color: "red"
          }
        },
        {
          type: "Image",
          value: {
            ...bigImageImagesThumbSizeChangeOutputValue,
            color: "green"
          }
        }
      ]
    });
  });
});

describe("Testing patchOnLightBox function that manage lightBox mode of image gallery", () => {
  test("Patch with disabled lightBox. Images lightBox should be disabled", () => {
    const newV = {
      ...mockValue,
      items: [emptyImage, emptyImage]
    };

    expect(patchOnLightBox(newV)).toStrictEqual({
      ...mockValue,
      items: [lightBoxDisabledOutput, lightBoxDisabledOutput]
    });
  });

  test("Patch with enabled lightBox. Images lightBox should be enabled", () => {
    const newV = {
      ...mockValue,
      layout: bigImageLayout,
      lightBox: enabled,
      items: [emptyImage, emptyImage]
    };

    expect(patchOnLightBox(newV)).toStrictEqual({
      ...mockValue,
      layout: bigImageLayout,
      lightBox: enabled,
      items: [imageLinkExternal, imageLinkExternal]
    });
  });

  test('Patch with enabled lightBox with "justified" layout. Images lightBox should be enabled', () => {
    const newV = {
      ...mockValue,
      layout: justifiedLayout,
      lightBox: enabled,
      items: [emptyImage, emptyImage]
    };

    expect(patchOnLightBox(newV)).toStrictEqual({
      ...mockValue,
      layout: "justified",
      lightBox: enabled,
      items: [lightBoxEnabledOutput, lightBoxEnabledOutput]
    });
  });
});

describe("Testing patchOnThumbStyleChange that prepare images model for bigImage layout", () => {
  test("Testing with enabled lightBox, should return the same input", () => {
    const data = {
      ...mockValue,
      items: [lightBoxEnabledOutput]
    };
    expect(patchOnThumbStyleChange("top", mockValue, data)).toStrictEqual({
      ...mockValue,
      items: [lightBoxEnabledOutput]
    });
  });

  test("Testing with placeholders and no layout, should return the same input", () => {
    const data = {
      ...mockValue,
      items: [emptyImage, emptyImage, emptyImage]
    };
    expect(patchOnThumbStyleChange("bottom", mockValue, data)).toStrictEqual({
      ...mockValue,
      items: [emptyImage, emptyImage, emptyImage]
    });
  });

  test("Testing with working data, should return images with model base on input data", () => {
    const data = {
      ...mockValue,
      ...horizontalThumbStyleInputData,
      items: [emptyImage, emptyImage]
    };

    expect(patchOnThumbStyleChange("left", mockValue, data)).toStrictEqual({
      ...mockValue,
      items: [horizontalThumbStyleDataOutput, horizontalThumbStyleDataOutput]
    });
  });

  test("Testing witouth items, should return the same input", () => {
    const data = {
      ...mockValue,
      ...horizontalThumbStyleInputData
    };

    expect(patchOnThumbStyleChange("right", mockValue, data)).toStrictEqual({
      ...mockValue,
      items: []
    });
  });
});

describe("Testing getDefaultGridItems that prepare images model for grid layout", () => {
  test("Testing with working data with default aspectRatio, should return array with 3 images", () => {
    const v = {
      ...mockValue,
      gridAspectRatio: "4/3",
      gridColumn: 3,
      items: [emptyImage, emptyImage, emptyImage]
    };

    expect(getDefaultGridItems({ v, node, cW: 500 })).toStrictEqual([
      gridItemsThreeColumnsOuptput,
      gridItemsThreeColumnsOuptput,
      gridItemsThreeColumnsOuptput
    ]);
  });

  test("Testing with working data with '1/1' aspectRatio, should return array with 2 images", () => {
    const v = {
      ...mockValue,
      gridAspectRatio: "1/1",
      gridColumn: 3,
      items: [emptyImage, emptyImage]
    };

    expect(getDefaultGridItems({ v, node, cW: 500 })).toStrictEqual([
      gridItemsThreeColumnsRatio1Output,
      gridItemsThreeColumnsRatio1Output
    ]);
  });

  test("Testing with working data with '4/3' aspectRatio, should return array with 6 images", () => {
    const v = {
      ...mockValue,
      gridAspectRatio: "4/3",
      gridColumn: 6,
      items: [
        emptyImage,
        emptyImage,
        emptyImage,
        emptyImage,
        emptyImage,
        emptyImage
      ]
    };

    expect(getDefaultGridItems({ v, node, cW: 1295 })).toStrictEqual([
      gridItemsSixColumnsOutput,
      gridItemsSixColumnsOutput,
      gridItemsSixColumnsOutput,
      gridItemsSixColumnsOutput,
      gridItemsSixColumnsOutput,
      gridItemsSixColumnsOutput
    ]);
  });
});

describe("Testing patchOnColumnChange that create placeholders if columns number is bigger than items number", () => {
  const oldValue = {
    ...mockValue,
    items: [emptyImage, emptyImage]
  };

  test("items number is equal with columns, should return input data", () => {
    const columns = 2;
    expect(patchOnColumnChange(columns, mockValue, oldValue)).toStrictEqual(
      mockValue
    );
  });

  test("columns number is bigger with 1 than items, should return 3 items", () => {
    const columns = 3;

    expect(patchOnColumnChange(columns, mockValue, oldValue)).toStrictEqual({
      ...mockValue,
      items: [emptyImage, emptyImage, emptyImage]
    });
  });

  test("items number is bigger that column number, should return input data", () => {
    const columns3 = 3;
    const oldValue3 = {
      ...mockValue,
      items: [emptyImage, emptyImage, emptyImage, emptyImage]
    };

    expect(patchOnColumnChange(columns3, mockValue, oldValue3)).toStrictEqual(
      mockValue
    );
  });
});

describe("Testing removeHorizontalThumbStyleData that should remove keys from images value", () => {
  test("Remove horizontal thumb style data from lightBox Image, should return the same input", () => {
    const items = [lightBoxEnabledOutput];

    expect(removeHorizontalThumbStyleData(items)).toStrictEqual(items);
  });

  test("Remov thumb width from image, should be removed", () => {
    const items = [
      { type: "Image", value: { width: 100, testK: 1, testK2: 2 } }
    ];

    expect(removeHorizontalThumbStyleData(items)).toStrictEqual([
      { type: "Image", value: { testK: 1, testK2: 2 } }
    ]);
  });

  test("Remove width from more images, should be removed", () => {
    const items = [
      {
        type: "Image",
        value: {
          ...removeHorizontalThumbStyleDataWidths,
          ...removeHorizontalThumbStyleDataWidthSuffixes
        }
      },
      {
        type: "Image",
        value: {
          ...removeHorizontalThumbStyleDataWidths,
          testK: 1
        }
      },
      {
        type: "Image",
        value: {
          ...removeHorizontalThumbStyleDataWidthSuffixes,
          testK: 1
        }
      }
    ];

    expect(removeHorizontalThumbStyleData(items)).toStrictEqual([
      emptyImage,
      imageWithMockTestKey,
      imageWithMockTestKey
    ]);
  });
});

describe("Testing patchOnBigImageAsPrevLayout that should remove unused data", () => {
  test("Remove cloned image in layout grid. Should be removed", () => {
    const newV = {
      ...mockValue,
      items: [emptyClonedImage, ...patchOnBigImageAsPrevLayoutStaticData]
    };

    expect(patchOnBigImageAsPrevLayout(newV)).toStrictEqual({
      ...mockValue,
      items: patchOnBigImageAsPrevLayoutStaticData
    });
  });

  test("Remove cloned image from different data than bigImage model. Should be removed", () => {
    const newV = {
      ...mockValue,
      items: [
        emptyClonedImage,
        { type: "Image", value: { color: "red", width: 100 } },
        { type: "Image", value: { color: "green", tabletWidth: 200 } },
        { type: "Image", value: { color: "blue" }, mobileWidth: 300 }
      ]
    };

    expect(patchOnBigImageAsPrevLayout(newV)).toStrictEqual({
      ...mockValue,
      items: [imageColorRed, imageColorGreen, imageColorBlue]
    });
  });
});

describe("Testing patchOnBigImageAsCurrLayout that should add useful data for bigImage layout", () => {
  test("Clone first image and preserve all other data. Should be cloned and preserved.", () => {
    const newV = {
      ...mockValue,
      items: bigImageAsCurrentLayoutStaticItems
    };

    expect(patchOnBigImageAsCurrLayout(newV)).toStrictEqual({
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            imageSrc: "1.jpg",
            ...bigImageCurrentLayoutStaticData
          }
        },
        ...bigImageAsCurrentLayoutStaticItems
      ]
    });
  });

  test("Clone first image. Should be cloned", () => {
    const newV = {
      ...mockValue,
      items: [emptyImage, emptyImage, emptyImage]
    };

    expect(patchOnBigImageAsCurrLayout(newV)).toStrictEqual({
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            ...bigImageCurrentLayoutStaticData
          }
        },
        emptyImage,
        emptyImage,
        emptyImage
      ]
    });
  });

  test("Test 2: Clone first image. Should be cloned.", () => {
    const newV = {
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            ...bigImageAsCurrentLayoutStaticData,
            color: "red"
          }
        },
        imageColorGreen,
        imageColorBlue
      ]
    };

    expect(patchOnBigImageAsCurrLayout(newV)).toStrictEqual({
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            ...bigImageAsCurrentLayoutStaticData,
            ...bigImageCurrentLayoutStaticData
          }
        },
        {
          type: "Image",
          value: {
            ...bigImageAsCurrentLayoutStaticData,
            color: "red"
          }
        },
        imageColorGreen,
        imageColorBlue
      ]
    });
  });
});

describe("Testing patchOnBigImageChange that should change bigImage data", () => {
  test("Change bigImage data with the same image, should be the same as input data", () => {
    const newV = {
      ...mockValue,
      items: [
        {
          type: "Image",
          value: bigImageChangeStaticData1
        },
        {
          type: "Image",
          value: bigImageChangeStaticData1
        },
        {
          type: "Image",
          value: bigImageChangeStaticData2
        }
      ]
    };

    expect(patchOnBigImageChange(newV)).toStrictEqual(newV);
  });

  test("Change bigImage data with the new image, should be the new image data", () => {
    const newV = {
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            imageSrc: "cloned.jpg",
            imageFileName: "cloned.jpg",
            imageExtension: "jpg",
            imageWidth: 1000,
            imageHeight: 1000,
            size: 100,
            clonedFromGallery: true
          }
        },
        {
          type: "Image",
          value: bigImageChangeStaticData1
        },
        {
          type: "Image",
          value: bigImageChangeStaticData2
        }
      ]
    };

    expect(patchOnBigImageChange(newV)).toStrictEqual({
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            ...bigImageChangeStaticData1,
            clonedFromGallery: true
          }
        },
        {
          type: "Image",
          value: bigImageChangeStaticData1
        },
        {
          type: "Image",
          value: bigImageChangeStaticData2
        }
      ]
    });
  });
});

describe("Testing patchOnMasonryLayout that should prepare data for masonry layout", () => {
  test("Try patchOnMasonryLayout with the same data. Should be as input data", () => {
    const newV = {
      ...mockValue,
      items: [itemWithMasonryStaticData, itemWithMasonryStaticData]
    };

    expect(patchOnMasonryLayout(newV)).toStrictEqual({
      ...mockValue,
      items: [patchOnMasonryLayoutOutput, patchOnMasonryLayoutOutput]
    });
  });

  test("Add masonry data and preserve old data. Should be preserved and changed to new masonry data", () => {
    const newV = {
      ...mockValue,
      items: [
        imageColorRed,
        { type: "Image", value: { link: "https://google.com" } },
        { type: "Image", value: { bgColor: "green" } },
        { type: "Image", value: { gradient: "blue" } },
        { type: "Image", value: { content: "Test" } }
      ]
    };

    expect(patchOnMasonryLayout(newV)).toStrictEqual({
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            color: "red",
            ...patchOnMasonryLayoutStaticData
          }
        },
        {
          type: "Image",
          value: {
            link: "https://google.com",
            ...patchOnMasonryLayoutStaticData
          }
        },
        {
          type: "Image",
          value: {
            bgColor: "green",
            ...patchOnMasonryLayoutStaticData
          }
        },
        {
          type: "Image",
          value: {
            gradient: "blue",
            ...patchOnMasonryLayoutStaticData
          }
        },
        {
          type: "Image",
          value: {
            content: "Test",
            ...patchOnMasonryLayoutStaticData
          }
        }
      ]
    });
  });
});

describe("Testing adjustImagesByHeight that should return modified images model by new size", () => {
  test("Adjust with no items. Should be as the input data", () =>
    expect(
      adjustImagesByHeight({
        ...adjustImagesByHeightData,
        height: 300,
        heightSuffix: "px",
        isChanged: "height",
        v: mockValue,
        items: []
      })
    ).toStrictEqual({
      height: 300,
      items: []
    }));

  test("Adjust with empty image. Size should be changed", () =>
    expect(
      adjustImagesByHeight({
        ...adjustImagesByHeightData,
        height: 100,
        heightSuffix: "%",
        isChanged: "height",
        v: { ...mockValue, gridColumn: 2 },
        items: [emptyImage]
      })
    ).toStrictEqual({
      height: 187.5,
      items: [
        {
          type: "Image",
          value: {
            height: 187.5,
            heightSuffix: "px",
            hoverHeight: 187.5,
            mobileHeightSuffix: "px",
            tabletHeightSuffix: "px"
          }
        }
      ]
    }));

  test("Adjust with cloned image. Should be changed", () =>
    expect(
      adjustImagesByHeight({
        ...adjustImagesByHeightData,
        height: 20,
        heightSuffix: "%",
        isChanged: "width",
        v: { ...mockValue, gridColumn: 10 },
        items: [emptyClonedImage]
      })
    ).toStrictEqual({
      height: 20,
      items: [{ type: "Image", value: { clonedFromGallery: true } }]
    }));

  test("Adjust with cloned and simple images. Should be changed", () =>
    expect(
      adjustImagesByHeight({
        ...adjustImagesByHeightData,
        width: 100,
        isChanged: "width",
        v: { ...mockValue, layout: "bigImage" },
        items: [emptyClonedImage, imageWithMockTestKey, lightBoxEnabledOutput]
      })
    ).toStrictEqual({
      height: 250,
      items: [
        { type: "Image", value: { clonedFromGallery: true } },
        {
          type: "Image",
          value: {
            testK: 1,
            ...adjustImageByHeightOutputCommonData
          }
        },
        {
          type: "Image",
          value: {
            linkLightBox: enabled,
            linkType: "lightBox",
            ...adjustImageByHeightOutputCommonData
          }
        }
      ]
    }));
});

describe("Testing addHorizontalThumbStyleData that should add new values to images model", () => {
  test("Add new data to cloned image", () => {
    const v = {
      ...mockValue,
      items: [emptyClonedImage]
    };

    expect(addHorizontalThumbStyleData(v)).toStrictEqual([emptyClonedImage]);
  });

  test("Add new data to cloned cloned image and placeholders. Should be only for placeholders", () => {
    const v = {
      ...mockValue,
      ...horizontalThumbStyleInputData,
      items: [emptyClonedImage, emptyImage, emptyImage, emptyImage, emptyImage]
    };

    expect(addHorizontalThumbStyleData(v)).toStrictEqual([
      emptyClonedImage,
      horizontalThumbStyleDataOutput,
      horizontalThumbStyleDataOutput,
      horizontalThumbStyleDataOutput,
      horizontalThumbStyleDataOutput
    ]);
  });

  test("Add new data to simple images. Should be added", () => {
    const v = {
      ...mockValue,
      ...horizontalThumbStyleInputData,
      items: [imageColorRed, imageColorBlue]
    };

    expect(addHorizontalThumbStyleData(v)).toStrictEqual([
      {
        type: "Image",
        value: {
          color: "red",
          ...horizontalThumbStyleDataOutputValue
        }
      },
      {
        type: "Image",
        value: {
          color: "blue",
          ...horizontalThumbStyleDataOutputValue
        }
      }
    ]);
  });
});

describe("Testing patchOnBigImageLayout that shoud change image gallery model to be able to work with bigImage", () => {
  test("Change sizes for placeholders. Should be changed.", () => {
    const newV = {
      ...patchOnBigImageLayoutStaticHeight,
      ...mockValue,
      items: [emptyImage, emptyImage, emptyImage]
    };

    expect(
      patchOnBigImageLayout(newV, mockValue, adjustImagesByHeightData)
    ).toStrictEqual({
      ...patchOnBigImageLayoutStaticHeight,
      ...mockValue,
      items: [bigImageLayoutPatch, bigImageLayoutPatch, bigImageLayoutPatch]
    });
  });

  test("Change size for cloned image. Should be changed.", () => {
    const newV = {
      ...patchOnBigImageLayoutStaticHeight,
      ...mockValue,
      items: [emptyClonedImage]
    };

    expect(
      patchOnBigImageLayout(newV, mockValue, adjustImagesByHeightData)
    ).toStrictEqual({
      ...patchOnBigImageLayoutStaticHeight,
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            clonedFromGallery: true,
            mobileSizeType: null,
            sizeType: "custom",
            tabletSizeType: null
          }
        }
      ]
    });
  });

  test("Change size for image and preseve previous data. Should be changed and preserved old data.", () => {
    const newV = {
      ...patchOnBigImageLayoutStaticHeight,
      ...mockValue,
      items: [imageColorRed]
    };

    expect(
      patchOnBigImageLayout(newV, mockValue, adjustImagesByHeightData)
    ).toStrictEqual({
      ...patchOnBigImageLayoutStaticHeight,
      ...mockValue,
      items: [
        {
          ...bigImageLayoutPatch,
          value: {
            ...bigImageLayoutPatchValue,
            color: "red"
          }
        }
      ]
    });
  });
});

describe("Testing patchOnJustifiedLayout that should change image gallery model to be able to work with justified layout", () => {
  test("Change data for clonedImage. Should be changed.", () => {
    const newV = {
      ...mockValue,
      items: [emptyClonedImage]
    };

    expect(
      patchOnJustifiedLayout(newV, patchOnJustifiedInputData)
    ).toStrictEqual({
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            clonedFromGallery: true,
            height: 300,
            heightSuffix: "px",
            linkType: "external",
            linkLightBox: disabled,
            mobileSizeType: null,
            sizeType: "original",
            tabletSizeType: null
          }
        }
      ]
    });
  });

  test("Change dara for placeholders. Should be changed.", () => {
    const newV = {
      ...mockValue,
      lightBox: enabled,
      items: [emptyImage]
    };

    expect(
      patchOnJustifiedLayout(newV, patchOnJustifiedInputData)
    ).toStrictEqual({
      ...mockValue,
      lightBox: enabled,
      items: [
        {
          type: "Image",
          value: justifiedLayoutStaticData
        }
      ]
    });
  });

  test("Change data with working images. Should be changed", () => {
    const newV = {
      ...mockValue,
      lightBox: enabled,
      items: [
        {
          type: "Image",
          value: {
            color: "#FF0000"
          }
        },
        { type: "Image", value: { size: 100 } },
        { type: "Image", value: { popups: [] } },
        { type: "Image", value: { tags: "" } },
        { type: "Image", value: { offsetX: 0 } }
      ]
    };

    expect(
      patchOnJustifiedLayout(newV, patchOnJustifiedInputData)
    ).toStrictEqual({
      ...mockValue,
      lightBox: enabled,
      items: [
        {
          type: "Image",
          value: {
            color: "#FF0000",
            ...justifiedLayoutStaticData
          }
        },
        {
          type: "Image",
          value: {
            size: 100,
            ...justifiedLayoutStaticData
          }
        },
        {
          type: "Image",
          value: {
            popups: [],
            ...justifiedLayoutStaticData
          }
        },
        {
          type: "Image",
          value: {
            tags: "",
            ...justifiedLayoutStaticData
          }
        },
        {
          type: "Image",
          value: {
            offsetX: 0,
            ...justifiedLayoutStaticData
          }
        }
      ]
    });
  });
});
