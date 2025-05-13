import { produce } from "immer";
import { getIn, insert, mergeIn } from "timm";
import type {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { SizeType } from "visual/global/Config/types/configs/common";
import { setIds } from "visual/utils/models";
import * as Num from "visual/utils/reader/number";
import type { V as ImageValue, Unit } from "../Image/types";
import { readUnit } from "../Image/utils";
import type { SizeChangedType, ThumbStyle, Value } from "./types";
import {
  addHorizontalThumbStyleData,
  adjustImagesByHeight,
  changeImagesData,
  getDefaultGridItems,
  mergeLinkType,
  removeHorizontalThumbStyleData
} from "./utils";

export const patchOnColumnChange = (
  columns: number,
  newV: Value,
  oldV: Value
): Value => {
  const { layout } = newV;
  const { items: oldItems } = oldV;

  const itemsLength = oldItems.length;
  const _itemsLength = layout === "bigImage" ? itemsLength - 1 : itemsLength;

  if (_itemsLength < columns) {
    const difference = columns - _itemsLength;
    const lastImageValue = oldItems[_itemsLength - 1].value as ImageValue;

    if (lastImageValue) {
      const {
        height,
        heightSuffix,
        width,
        widthSuffix,
        size,
        sizeType,
        sizeSuffix,
        imageWidth,
        imageHeight
      } = lastImageValue;

      const newItems = Array(difference)
        .fill("")
        .map(() =>
          setIds({
            type: "Image",
            value: {
              height,
              heightSuffix,
              width,
              widthSuffix,
              size,
              sizeType,
              sizeSuffix,
              imageWidth,
              imageHeight
            }
          })
        );

      return produce(newV, (draft) => {
        draft.items = [...oldItems, ...newItems];
      });
    }
  }

  return newV;
};

export const patchOnLightBox = (newV: Value): Value => {
  const { lightBox, layout } = newV;

  const items = newV.items.map(
    (el) =>
      mergeIn(el, ["value"], {
        linkType:
          lightBox === "on" && layout !== "bigImage" ? "lightBox" : "external",
        linkLightBox: layout !== "bigImage" ? lightBox : ""
      }) as ElementModelType
  );

  return produce(newV, (draft) => {
    draft.items = items;
  });
};

export const patchOnThumbStyleChange = (
  thumbStyle: Value["thumbStyle"],
  newValue: Value,
  oldValue: Value
): Value => {
  switch (thumbStyle) {
    case "top":
    case "bottom":
      return produce(newValue, (draft) => {
        draft.items = removeHorizontalThumbStyleData(oldValue.items);
      });
    case "left":
    case "right":
      return produce(newValue, (draft) => {
        draft.items = addHorizontalThumbStyleData(oldValue);
      });
  }
};

export const patchOnBigImageAsPrevLayout = (newValue: Value): Value => {
  return produce(newValue, (draft) => {
    draft.items.shift();
    draft.items = removeHorizontalThumbStyleData(draft.items);
  });
};

export const patchOnBigImageAsCurrLayout = (newValue: Value): Value => {
  const image = getIn(newValue, ["items", 0]) as ElementModel;
  const {
    imageSrc,
    imageFileName,
    imageWidth,
    imageHeight,
    size,
    imageExtension
  } = image.value as Value;

  const newImage = setIds({
    type: "Image",
    value: {
      imageSrc,
      imageFileName,
      imageExtension,
      imageWidth,
      imageHeight,
      size,
      sizeType: SizeType.custom,
      tabletSizeType: null,
      mobileSizeType: null,
      clonedFromGallery: true
    }
  });

  const newItems = insert(newValue.items, 0, newImage);

  return produce(newValue, (draft) => {
    draft.items = newItems;
  });
};

export const patchOnGridLayout = (
  node: HTMLElement | null,
  newValue: Value,
  oldValue: Value
): Value => {
  const { lightBox } = newValue;

  const newItems = getDefaultGridItems({ lightBox, v: oldValue, node });

  return produce(newValue, (draft) => {
    draft.items = newItems;
  });
};

export const patchOnJustifiedLayout = (
  newValue: Value,
  extraData: {
    heightKey: string;
    heightSuffixKey: string;
    rowHeight: number;
  }
): Value => {
  const { lightBox } = newValue;
  const { heightKey, heightSuffixKey, rowHeight } = extraData;

  const newItems = newValue.items.map((el) =>
    mergeIn(el, ["value"], {
      sizeType: "original",
      tabletSizeType: null,
      mobileSizeType: null,
      [heightKey]: rowHeight,
      [heightSuffixKey]: "px",
      ...mergeLinkType(lightBox)
    })
  ) as ElementModelType[];

  return produce(newValue, (draft) => {
    draft.items = newItems;
  });
};

export const patchOnGridItemsChange = (
  node: HTMLElement | null,
  newValue: Value,
  oldValue: Value,
  newItems: ElementModelType[]
): Value =>
  produce(newValue, (draft) => {
    draft.items = getDefaultGridItems({
      node,
      v: oldValue,
      items: newItems
    });
  });

export const patchOnGridAspectRationAndColumnChange = (
  node: HTMLElement | null,
  newValue: Value,
  oldValue: Value,
  data: {
    gridAspectRatio?: string;
    gridColumn?: number;
  }
): Value =>
  produce(newValue, (draft) => {
    draft.items = getDefaultGridItems({
      node,
      v: oldValue,
      gridAspectRatio: data.gridAspectRatio,
      gridColumn: data.gridColumn
    });
  });

export const patchOnBigImageChange = (newValue: Value): Value => {
  const {
    imageSrc,
    imageFileName,
    imageExtension,
    imageWidth,
    imageHeight,
    size = 0
  } = newValue.items[1].value as Value;

  return produce(newValue, (draft) => {
    draft.items[0].value = {
      ...(draft.items[0].value as Value),
      imageSrc,
      imageFileName,
      imageExtension,
      imageWidth,
      imageHeight,
      size
    };
  });
};

export const patchOnMasonryLayout = (newValue: Value): Value => {
  const { lightBox } = newValue;

  const newItems = newValue.items.map(
    (image) =>
      mergeIn(image, ["value"], {
        ...(image.value as Value),
        sizeType: SizeType.custom,
        tabletSizeType: null,
        mobileSizeType: null,
        ...mergeLinkType(lightBox)
      }) as ElementModelType
  );

  return produce(newValue, (draft) => {
    draft.items = newItems;
  });
};

export const patchOnBigImageLayout = (
  newValue: Value,
  oldValue: Value,
  extraData: {
    node: HTMLElement | null;
    responsiveGridColumn: number;
    thumbStyle: ThumbStyle;
    cW?: number;
  }
): Value => {
  const { node, responsiveGridColumn, thumbStyle, cW } = extraData;
  const { bigImageImagesHeight, bigImageImagesHeightSuffix } = newValue;

  const _newItems = changeImagesData(newValue.items, {
    sizeType: SizeType.custom,
    tabletSizeType: null,
    mobileSizeType: null
  });

  const { items: newItems, height } = adjustImagesByHeight({
    node,
    cW,
    v: oldValue,
    responsiveGridColumn,
    height: Num.read(bigImageImagesHeight),
    heightSuffix: readUnit(bigImageImagesHeightSuffix),
    items: _newItems,
    isChanged: "height"
  });

  if (thumbStyle === "left" || thumbStyle === "right") {
    return produce(newValue, (draft) => {
      draft.items = addHorizontalThumbStyleData(
        { ...oldValue, ...newValue },
        newItems
      );
    });
  }

  return produce(newValue, (draft) => {
    draft.bigImageImagesHeight = height;
    draft.items = newItems;
  });
};

export const patchOnBigImageImagesThumbSizeChange = (
  newValue: Value,
  oldValue: Value,
  extraData: {
    height?: number;
    heightSuffix?: Unit;
    width?: number;
    heightKey?: string;
    imagesHeightKey?: string;
    widthKey?: string;
    isChanged?: SizeChangedType;
    responsiveGridColumn: number;
    node: HTMLElement | null;
    cW?: number;
  }
): Value => {
  const {
    height,
    heightSuffix,
    heightKey,
    width,
    widthKey,
    isChanged,
    node,
    responsiveGridColumn,
    imagesHeightKey,
    cW
  } = extraData;

  const _newItems = changeImagesData(newValue.items, {
    sizeType: SizeType.custom,
    tabletSizeType: null,
    mobileSizeType: null
  });

  const { items: newItems, height: newHeight } = adjustImagesByHeight({
    node,
    v: oldValue,
    height,
    heightSuffix,
    heightKey,
    width,
    widthKey,
    items: _newItems,
    isChanged,
    responsiveGridColumn,
    cW
  });

  return produce(newValue, (draft) => {
    if (imagesHeightKey) {
      draft[imagesHeightKey] = newHeight;
    }
    draft.items = newItems;
  });
};
