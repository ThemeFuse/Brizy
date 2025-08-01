import type { ElementModelType } from "visual/component/Elements/Types";
import { SizeType } from "visual/global/Config/types/configs/common";
import {
  getPatchExtraData,
  imagesSrc,
  isPlaceholderImage,
  multiUpload,
  notUsedPlaceholders
} from "../utils";
import {
  bigImageLayout,
  disabled,
  emptyImage,
  justifiedLayout,
  masonryLayout,
  mockValue
} from "./imageGalleryChange";

const fakeImageUrl = "https://image.com";
const fakeImageUrl2 = "https://image2.com";

const patchItemUid = "ffd3016adba33fba1a1fa4706797359f.jpg";
const patchItemUid2 = "ffd3016adba33fba.jpg";

const patchItemCommonSizes = { imageWidth: 300, imageHeight: 242 };

const mockImage: ElementModelType = {
  type: "Image",
  value: {
    bgColor: "#000000",
    color: "#FFFFFF",
    imageSrc: "1.jpg",
    imageFileName: "1.jpg",
    imageExtension: "jpg",
    sizeType: SizeType.custom,
    linkType: "external",
    linkLightBox: disabled,
    _styles: ["image"],
    ...patchItemCommonSizes
  }
};

const commonSizes = {
  width: 300,
  height: 242
};

const mockImageOnlyImageSrc: ElementModelType = {
  type: "Image",
  value: { imageSrc: fakeImageUrl }
};

const mockImageWithoutImageSrc: ElementModelType = {
  type: "Image",
  value: { imageSrc: undefined }
};

const mockImageWithColors: ElementModelType = {
  type: "Image",
  value: {
    bgColor: "#000000",
    color: "#FFFFFF"
  }
};

const mockImageWithColorsRedBlue: ElementModelType = {
  type: "Image",
  value: {
    bgColor: "red",
    color: "blue"
  }
};

const usedPlaceholderImage: ElementModelType = {
  type: "Image",
  value: {},
  // @ts-expect-error: Temporary
  wasUsed: true
};

const getPatchExtraDataStaticData = {
  bigImageImagesHeight: 200,
  tabletBigImageImagesHeight: 150,
  mobileBigImageImagesHeight: 100
};

const multiUploadCommonData = {
  imageExtension: "jpg",
  sizeType: SizeType.custom,
  linkType: "external",
  _styles: ["image"],
  ...patchItemCommonSizes
};

const multiUploadCommonData2 = {
  imageSrc: "2.jpg",
  imageFileName: "2.jpg",
  imageWidth: 500,
  imageHeight: 500,
  imageExtension: "jpg",
  sizeType: SizeType.custom,
  linkType: "external",
  _styles: ["image"]
};

const multiUploadCommonData3 = {
  lightBox: "asd",
  test: "test",
  imageSrc: "image.jpg",
  imageFileName: "image.jpg",
  ...patchItemCommonSizes
};

const patchItem = {
  id: 1,
  uid: "1.jpg",
  fileName: "1.jpg",
  width: 300,
  height: 242
};

const patchItem2 = {
  id: 2,
  uid: "2.jpg",
  fileName: "2.jpg",
  width: 500,
  height: 500
};

const emptyItems: ElementModelType[] = [];

// Test "notUsedPlaceholders"
describe("Testing utils function that return not used placeholders", () => {
  test("Filtering already used placeholders should return empty array", () => {
    const items = [usedPlaceholderImage, usedPlaceholderImage];

    expect(notUsedPlaceholders(items)).toStrictEqual([]);
  });

  test("Filtering empty array/invalid data sould return empty array", () => {
    expect(notUsedPlaceholders(emptyItems)).toStrictEqual([]);

    expect(notUsedPlaceholders(undefined)).toStrictEqual([]);
  });

  test("Filtering combined used/not used placeholders should return image with where: 'wasUsed' is not true", () => {
    const items = [usedPlaceholderImage, emptyImage];

    expect(notUsedPlaceholders(items)).toStrictEqual([emptyImage]);
  });
});

// Test "imagesSrc"
describe("Testing utils function that return imageSrc from image model", () => {
  test("Get url of images, should return array with url of first image", () => {
    const items = [mockImageOnlyImageSrc, emptyImage];

    expect(imagesSrc(items)).toStrictEqual([fakeImageUrl]);
  });

  test("Get url of images, should return empty array", () => {
    const items = [emptyImage, emptyImage];

    expect(imagesSrc(items)).toStrictEqual([]);
  });

  test("All images has imageSrc, should return array array with 2 urls", () => {
    const items = [
      mockImageOnlyImageSrc,
      { type: "Image", value: { imageSrc: fakeImageUrl2 } }
    ];

    expect(imagesSrc(items)).toStrictEqual([fakeImageUrl, fakeImageUrl2]);
  });

  test("Frist image has imageSrc, should return array with 1 image url", () => {
    const items = [mockImageOnlyImageSrc, mockImageWithoutImageSrc];

    expect(imagesSrc(items)).toStrictEqual([fakeImageUrl]);
  });
});

// Test "isPlaceholderImage"
describe("Testing utils function that check if image is placeholder", () => {
  test("Check if is placeholder image", () => {
    expect(isPlaceholderImage(emptyImage)).toBe(true);

    expect(isPlaceholderImage(mockImageWithoutImageSrc)).toBe(true);

    expect(isPlaceholderImage(mockImageOnlyImageSrc)).toBe(false);
  });
});

// Test "getPatchExtraData"
describe("Testing utils function getPatchExtraData should return extra model data", () => {
  test("Get data for layout grid, should return empty object", () => {
    const v = {
      ...mockValue,
      bigImageImagesHeight: 200
    };

    expect(getPatchExtraData(v)).toStrictEqual({});
  });

  test("Get data for layout justified, should return empty object", () => {
    const v = {
      ...mockValue,
      ...getPatchExtraDataStaticData,
      layout: justifiedLayout
    };

    expect(getPatchExtraData(v)).toStrictEqual({});
  });

  test("Get data for layout masonry, should return empty object", () => {
    const v = {
      ...mockValue,
      ...getPatchExtraDataStaticData,
      layout: masonryLayout
    };

    expect(getPatchExtraData(v)).toStrictEqual({});
  });

  test("Get data for layout bigImage, should return object with heights", () => {
    const v = {
      ...mockValue,
      ...getPatchExtraDataStaticData,
      layout: bigImageLayout
    };

    expect(getPatchExtraData(v)).toStrictEqual({
      height: 200,
      heightSuffix: "px",
      tabletHeight: 150,
      tabletHeightSuffix: "px",
      mobileHeight: 100,
      mobileHeightSuffix: "px"
    });
  });
});

// Test "multiUpload"
describe("Testing multiupload function should return an array with images", () => {
  test("Pass 2 images to 3 placeholders, should return 2 images and 1 placeholder", () => {
    const v = {
      ...mockValue,
      items: [emptyImage, emptyImage, emptyImage],
      _id: "1"
    };

    const patchItems = [
      {
        id: 1,
        uid: patchItemUid,
        fileName: patchItemUid,
        ...commonSizes
      },
      {
        id: 2,
        uid: patchItemUid2,
        fileName: patchItemUid2,
        ...commonSizes
      }
    ];

    expect(multiUpload(v, patchItems)).toStrictEqual([
      {
        type: "Image",
        value: {
          linkLightBox: disabled,
          imageSrc: patchItemUid,
          imageFileName: patchItemUid,
          ...multiUploadCommonData
        }
      },
      {
        type: "Image",
        value: {
          linkLightBox: disabled,
          imageSrc: patchItemUid2,
          imageFileName: patchItemUid2,
          ...multiUploadCommonData
        }
      },
      emptyImage
    ]);
  });

  test("Pass 2 images to 1 placeholder with colors, should return 2 images where first images save the colors", () => {
    const v = {
      ...mockValue,
      items: [mockImageWithColors],
      _id: "2"
    };

    const patchItems = [
      patchItem,
      {
        id: 2,
        uid: "2.jpg",
        fileName: "2.jpg",
        ...commonSizes
      }
    ];

    expect(multiUpload(v, patchItems)).toStrictEqual([
      mockImage,
      {
        type: "Image",
        value: {
          imageSrc: "2.jpg",
          imageFileName: "2.jpg",
          linkLightBox: disabled,
          ...multiUploadCommonData
        }
      }
    ]);
  });

  test("Pass 1 image to 2 placeholders, should return 1 image si values of first placeholder and 1 placeholder", () => {
    const v = {
      ...mockValue,
      items: [mockImageWithColors, mockImageWithColorsRedBlue],
      _id: "3"
    };

    expect(multiUpload(v, [patchItem])).toStrictEqual([
      mockImage,
      mockImageWithColorsRedBlue
    ]);
  });

  test("Pass 2 images to 2 placeholders with colors, should return 2 images that preserves previous colors of placeholders", () => {
    const v = {
      ...mockValue,
      items: [mockImageWithColors, mockImageWithColorsRedBlue],
      _id: "4"
    };

    expect(multiUpload(v, [patchItem, patchItem2])).toStrictEqual([
      mockImage,
      {
        type: "Image",
        value: {
          bgColor: "red",
          color: "blue",
          linkLightBox: disabled,
          ...multiUploadCommonData2
        }
      }
    ]);
  });

  test("Pass 2 images to 1 image that already has uploaded, should return 2 images, where first image should not be changed", () => {
    const v = {
      ...mockValue,
      items: [
        {
          type: "Image",
          value: {
            ...multiUploadCommonData3,
            _id: "test"
          }
        }
      ],
      _id: "5"
    };

    const patchItems = [
      {
        id: "test",
        uid: "image.jpg",
        fileName: "image.jpg",
        ...commonSizes
      },
      patchItem2
    ];

    expect(multiUpload(v, patchItems)).toStrictEqual([
      {
        type: "Image",
        value: {
          ...multiUploadCommonData3,
          _id: "test"
        }
      },
      {
        type: "Image",
        value: {
          linkLightBox: disabled,
          ...multiUploadCommonData2
        }
      }
    ]);
  });
});
