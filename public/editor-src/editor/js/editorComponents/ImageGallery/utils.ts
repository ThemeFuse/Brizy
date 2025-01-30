import { last } from "es-toolkit";
import { isT } from "fp-utilities";
import { produce } from "immer";
import { insert, mergeIn } from "timm";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { SizeType } from "visual/global/Config/types/configs/common";
import { Settings } from "visual/libs/gallery";
import { Breakpoint, DeviceMode2 } from "visual/types";
import { setIds } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/reader/string";
import { Unit } from "../Image/types";
import { calcWrapperSizes } from "../Image/utils";
import { SizeChangedType, Value } from "./types";

interface IsotopeParams {
  itemSelector: string;
  masonry: {
    columnWidth: string;
  };
}

export interface JustifySettings {
  type: "justified";
  settings: Settings;
}

export interface IsotopeSettings {
  type: "grid" | "masonry" | "bigImage";
  settings?: IsotopeParams;
}

export const unitPx: Unit = "px";
export const unitPercent: Unit = "%";

export const makeOptionValueToSettings = (
  v: Value,
  breakpoints: Breakpoint[]
): JustifySettings | IsotopeSettings => {
  const rowHeight = Num.read(v.rowHeight) ?? 0;

  switch (v.layout) {
    case "bigImage": {
      return {
        type: "bigImage"
      };
    }
    case "masonry": {
      return {
        type: "masonry",
        settings: {
          itemSelector: ".brz-image__gallery-item",
          masonry: { columnWidth: ".brz-image__gallery-item" }
        }
      };
    }
    case "grid": {
      return {
        type: "grid"
      };
    }
    case "justified": {
      return {
        type: "justified",
        settings: {
          rowHeight,
          itemSelector: ".brz-image__gallery-item",
          responsive: breakpoints.map((breakpoint) => {
            const device = breakpoint.value;
            const rowHeight = defaultValueValue({
              v,
              device,
              key: "rowHeight"
            });
            return {
              breakpoint: breakpoint.breakpoint,
              settings: {
                rowHeight
              }
            };
          })
        }
      };
    }
  }
};

export const getSpacing = (v: Value) => {
  return {
    spacing: v.spacing,
    tabletSpacing: v.tabletSpacing,
    mobileSPacing: v.mobileSpacing
  };
};

export const changeImagesData = (
  items: ElementModelType[],
  data: Record<string, unknown>
): ElementModelType[] => {
  return items.map(
    (image) =>
      mergeIn(image, ["value"], {
        ...(image.value as Value),
        ...(data ?? {})
      }) as ElementModelType
  );
};

export const removeHorizontalThumbStyleData = (items: ElementModelType[]) => {
  return items.map(({ type, value }) => {
    const {
      // this is a small hack to remove some keys from object without mutation
      /* eslint-disable */
      width,
      tabletWidth,
      mobileWidth,
      widthSuffix,
      tabletWidthSuffix,
      mobileWidthSuffix,
      /* eslint-enable*/
      ...others
    } = value as Value;

    return {
      type,
      value: others
    };
  });
};

export const addHorizontalThumbStyleData = (
  v: Value,
  items?: ElementModelType[]
) => {
  const {
    items: dbItems,
    bigImageImagesHeight,
    tabletBigImageImagesHeight,
    mobileBigImageImagesHeight,
    bigImageImagesHeightSuffix,
    tabletBigImageImagesHeightSuffix,
    mobileBigImageImagesHeightSuffix,
    thumbWidth,
    thumbWidthSuffix,
    tabletThumbWidth,
    tabletThumbWidthSuffix,
    mobileThumbWidth,
    mobileThumbWidthSuffix
  } = v;

  const _items = items ?? dbItems;

  return _items.map(({ type, value }) => {
    if (value.clonedFromGallery) {
      return { type, value };
    }

    return {
      type,
      value: {
        ...(value as Value),
        height: bigImageImagesHeight,
        heightSuffix: bigImageImagesHeightSuffix,
        tabletHeight: tabletBigImageImagesHeight,
        tabletHeightSuffix: tabletBigImageImagesHeightSuffix,
        mobileHeight: mobileBigImageImagesHeight,
        mobileHeightSuffix: mobileBigImageImagesHeightSuffix,
        width: thumbWidth,
        widthSuffix: thumbWidthSuffix,
        tabletWidth: tabletThumbWidth,
        tabletWidthSuffix: tabletThumbWidthSuffix,
        mobileWidth: mobileThumbWidth,
        mobileWidthSuffix: mobileThumbWidthSuffix
      }
    };
  });
};

export const mergeLinkType = (lightBox: "on" | "off") => {
  return {
    linkType: lightBox === "on" ? "lightBox" : "external",
    linkLightBox: lightBox
  };
};

export const getPatchExtraData = (v: Value): Partial<Value> => {
  const {
    layout,
    bigImageImagesHeight,
    tabletBigImageImagesHeight,
    mobileBigImageImagesHeight
  } = v;

  switch (layout) {
    case "bigImage":
      return {
        height: bigImageImagesHeight,
        heightSuffix: "px",
        tabletHeight: tabletBigImageImagesHeight,
        tabletHeightSuffix: "px",
        mobileHeight: mobileBigImageImagesHeight,
        mobileHeightSuffix: "px"
      };
    default:
      return {};
  }
};

export const isPlaceholderImage = (item: ElementModelType): boolean =>
  !(item.value as Value).imageSrc;

const initialPlaceholders = new Map();

export const multiUpload = (
  v: Value,
  patchItems: ElementModel[]
): ElementModelType[] => {
  const { _id, layout, items: dbItems, lightBox } = v;

  let placeholderIndex = 0;

  if (!initialPlaceholders.get(_id)) {
    const placeholders = dbItems.filter(isPlaceholderImage);

    if (placeholders.length) {
      initialPlaceholders.set(_id, placeholders);
    }
  }

  const sizeType = layout === "justified" ? SizeType.original : SizeType.custom;

  const items = patchItems
    .map((item: ElementModel) => {
      const currentItem = dbItems.find((i: ElementModelType) => {
        const value = i.value as Value;
        return (
          value.imageSrc &&
          item.uid &&
          !value.clonedFromGallery &&
          value.imageSrc === item.uid
        );
      });

      if (currentItem) {
        const currentValue = currentItem.value as Value;
        const { uid, width, height } = item;
        const { imageWidth, imageHeight, imageFileName } = currentValue;

        return imageWidth !== width || imageHeight !== height
          ? {
              ...currentItem,
              value: {
                ...(currentItem.value as Value),
                imageSrc: uid,
                imageWidth: width,
                imageHeight: height,
                imageFileName
              }
            }
          : currentItem;
      } else {
        const extraData = getPatchExtraData(v);

        let value = {};

        const placeholders = initialPlaceholders.get(_id);
        const currentPlaceholder = placeholders?.[placeholderIndex];

        if (currentPlaceholder) {
          value = currentPlaceholder.value ?? {};
          const newPlaceholders = produce<ElementModel[]>(
            placeholders,
            (draft) => {
              if (draft && draft[placeholderIndex]) {
                draft[placeholderIndex].wasUsed = true;
              }
            }
          );
          initialPlaceholders.set(_id, newPlaceholders);

          placeholderIndex++;
        }

        return setIds({
          type: "Image",
          value: {
            ...(value as Value),
            ...extraData,
            ...mergeLinkType(lightBox),
            imageSrc: item.uid,
            imageFileName: item.fileName,
            imageWidth: item.width,
            imageHeight: item.height,
            imageExtension: last((Str.read(item.uid) ?? "").split(".")),
            sizeType,
            _styles: ["image"]
          }
        });
      }
    })
    .filter(isT);

  const { imageSrc, imageFileName, imageExtension } = items[0].value;

  // gallery option does not know that we have cloned image and when we change something from toolbar we lose that cloned image
  const newItem =
    layout === "bigImage"
      ? setIds({
          type: "Image",
          value: {
            ...(dbItems[0].value as Value),
            imageSrc,
            imageFileName,
            imageExtension,
            sizeType: SizeType.custom,
            tabletSizeType: null,
            mobileSizeType: null,
            clonedFromGallery: true
          }
        })
      : null;

  const placeholders = initialPlaceholders.get(_id);

  const _items = [...items, ...notUsedPlaceholders(placeholders)];

  cleanUsedPlaceholders(placeholders);

  return newItem ? insert(_items, 0, newItem) : _items;
};

export const imagesSrc = (items: ElementModelType[]): string[] => {
  return items.map((v) => (v.value as Value).imageSrc).filter(Boolean);
};

export const notUsedPlaceholders = (
  items?: ElementModelType[]
  // @ts-expect-error: Temporary
): ElementModelType[] => (items ? items.filter((item) => !item?.wasUsed) : []);

const cleanUsedPlaceholders = (_id: number, items?: ElementModel[]): void => {
  if (items && items.every((item) => item.wasUsed)) {
    initialPlaceholders.delete(_id);
  }
};

export const getDefaultGridItems = ({
  gridAspectRatio,
  gridColumn,
  items,
  lightBox,
  node,
  v,
  cW
}: {
  gridAspectRatio?: string;
  gridColumn?: number;
  items?: ElementModelType[];
  lightBox?: Value["lightBox"];
  node: HTMLElement | null;
  v: Value;
  cW?: number;
}): ElementModelType[] => {
  const {
    gridAspectRatio: oldGridAspectRatio,
    gridColumn: oldGridColumn,
    items: oldItems
  } = v;

  if (node) {
    const { width } = node.getBoundingClientRect();
    const containerWidth = cW ?? width;

    const _newItems = (items ?? oldItems).map((el) => {
      const value = el.value as Value;

      const [x, y] = (gridAspectRatio ?? oldGridAspectRatio).split("/");
      const _x = Num.read(x) ?? 4;
      const _y = Num.read(y) ?? 3;

      const newHeight =
        containerWidth / (_x / _y) / (gridColumn ?? oldGridColumn);

      const wrapperSizes = {
        width: containerWidth / (gridColumn ?? oldGridColumn),
        height: newHeight
      };

      const commonData = {
        width: 100,
        widthSuffix: unitPercent,
        height: 100,
        heightSuffix: unitPercent,
        size: Num.read(value.size) ?? 100
      };

      const wrapperWidth = containerWidth / (gridColumn ?? oldGridColumn);

      const newWrapperSizes = calcWrapperSizes(
        {
          imageWidth: Num.read(value.imageWidth) ?? 600,
          imageHeight: Num.read(value.imageHeight) ?? 450,
          ...commonData
        },
        wrapperWidth
      );

      const newHoverWrapperSizes = calcWrapperSizes(
        {
          imageWidth: Num.read(value.hoverImageWidth) ?? 600,
          imageHeight: Num.read(value.hoverImageHeight) ?? 450,
          ...commonData
        },
        wrapperWidth
      );

      return mergeIn(el, ["value"], {
        height: (wrapperSizes.height * 100) / newWrapperSizes.height,
        hoverHeight: (wrapperSizes.height * 100) / newHoverWrapperSizes.height,
        heightSuffix: "%",
        tabletHeight: null,
        tabletHeightSuffix: null,
        mobileHeight: null,
        mobileHeightSuffix: null,
        sizeType: SizeType.custom,
        tabletSizeType: null,
        mobileSizeType: null,
        ...(lightBox && mergeLinkType(lightBox))
      }) as ElementModelType;
    });

    return _newItems;
  }

  return items ?? [];
};

export const adjustImagesByHeight = ({
  height,
  heightKey,
  heightSuffix = "px",
  width,
  widthKey,
  items,
  isChanged,
  responsiveGridColumn,
  node,
  cW,
  v
}: {
  height?: number;
  heightSuffix?: Unit;
  width?: number;
  heightKey?: string;
  widthKey?: string;
  items: ElementModelType[];
  isChanged?: SizeChangedType;
  cW?: number;
  node: HTMLElement | null;
  responsiveGridColumn: number;
  v: Value;
}): { items: ElementModelType[]; height: number } => {
  if (node) {
    const { gridColumn } = v;
    const { width: nodeWidth } = node.getBoundingClientRect();
    const containerWidth = cW ?? nodeWidth;

    const _height = height ?? containerWidth / gridColumn;
    let vHeight = _height;

    const newItems = items.map((image) => {
      const value = image.value;

      if (value.clonedFromGallery) {
        return image;
      }

      const newWrapperSizes = calcWrapperSizes(
        {
          imageWidth: Num.read(value.imageWidth) ?? 600,
          imageHeight: Num.read(value.imageHeight) ?? 450,
          width: 100,
          widthSuffix: "%",
          height: _height,
          heightSuffix,
          size: Num.read(value.size) ?? 100
        },
        containerWidth / responsiveGridColumn
      );

      vHeight = newWrapperSizes.height;

      return mergeIn(image, ["value"], {
        hoverHeight: newWrapperSizes.height,
        heightSuffix: "px",
        tabletHeight: value.tabletHeight ?? value.height,
        tabletHeightSuffix: "px",
        mobileHeight: value.mobileHeight ?? value.height,
        mobileHeightSuffix: "px",
        [heightKey ?? "height"]:
          isChanged === "height" ? newWrapperSizes.height : value.height,
        ...(isChanged === "width"
          ? {
              widthSuffix: "px",
              tabletWidth: value.tabletWidth ?? width ?? value.width,
              tabletWidthSuffix: "px",
              mobileWidth: value.mobileWidth ?? width ?? value.width,
              mobileWidthSuffix: "px",
              [widthKey ?? "width"]: width
            }
          : {})
      }) as ElementModelType;
    });

    return {
      items: newItems,
      height: vHeight
    };
  }

  return {
    items,
    height: height ?? 100
  };
};

export const breakpoints: Breakpoint[] = [
  {
    title: "desktop",
    value: DeviceMode2.Desktop,
    enabled: true,
    breakpoint: 1500,
    content: 1500
  },
  {
    title: "tablet",
    value: DeviceMode2.Tablet,
    enabled: true,
    breakpoint: 991,
    content: 991
  },
  {
    title: "mobile",
    value: DeviceMode2.Mobile,
    enabled: true,
    breakpoint: 767,
    content: 767
  }
];
