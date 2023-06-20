import { mergeIn } from "timm";
import { ElementModel } from "visual/component/Elements/Types";
import { Settings } from "visual/libs/gallery";
import { Breakpoint } from "visual/types";
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import { Value } from "./index";

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
  items: ElementModel[],
  data: Record<string, unknown>
): ElementModel[] => {
  return items.map((image: ElementModel) =>
    mergeIn(image, ["value"], {
      ...(image.value as Value),
      ...(data ?? {})
    })
  ) as ElementModel[];
};

export const removeHorizontalThumbStyleData = (items: ElementModel[]) => {
  return items.map(({ type, value }) => {
    const {
      // this is a small hack to remove some keys from object without mutation
      // eslint-disable-next-line
      width, tabletWidth, mobileWidth, widthSuffix, tabletWidthSuffix, mobileWidthSuffix,
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
  items?: ElementModel[]
) => {
  const {
    items: dbItems,
    bigImageImagesHeight,
    tabletBigImageImagesHeight,
    mobilebigImageImagesHeight,
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
    if ((value as Value).clonedFromGallery) {
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
        mobileHeight: mobilebigImageImagesHeight,
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
