import { Num } from "@brizy/readers";
import { Base64 } from "js-base64";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { imagePopulationUrl } from "visual/utils/image";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import {
  defaultValueValue,
  mobileSyncOnChange,
  tabletSyncOnChange
} from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/ImageUpload/converters";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { Literal } from "visual/utils/types/Literal";
import { SizeType } from "visual/global/Config/types/configs/common";
import { DeviceMode } from "visual/types";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { ECKeyDCInfo } from "visual/editorComponents/EditorComponent/types";
import {
  fromLinkElementModel,
  patchOnDCChange as patchOnLinkDCChange
} from "visual/utils/patch/Link/";
import { capByPrefix } from "visual/utils/string";
import {
  elementModelToValue,
  patchOnDCChange,
  patchOnHoverImageChange,
  patchOnImageChange,
  patchOnSizeTypeChange,
  pathOnUnitChange
} from "../imageChange";
import * as ImagePatch from "../types/ImagePatch";
import {
  isDCImagePatch,
  isHoverImagePatch,
  isImagePatch,
  isLinkDcPatch,
  isSizeTypePatch
} from "../types/ImagePatch";
import {
  calcImageSizes,
  calcWrapperOriginalSizes,
  calcWrapperPredefinedSizes,
  calcWrapperSizes,
  getCustomImageUrl,
  getImageSize,
  getSizeType,
  isOriginalSize,
  isPredefinedSize,
  multiplier
} from "../utils";
import {
  ContainerSizes,
  DCValueHookResult,
  Dimensions,
  ExtraImageAttributes,
  ExtendedWrapperSizes,
  HoverImageUrlResult,
  ImageComponentState,
  ImagePatchResult,
  ImageSizes,
  ImagesSources,
  ImageUrlResult,
  ImageUtilsContext,
  Patch,
  Value,
  WrapperSizes
} from "./types";

/**
 * Gets the dimension (width or height) of the container element
 */
export function getDimension(
  container: React.RefObject<Element>,
  size: "width" | "height"
): number | undefined {
  switch (size) {
    case "width": {
      let parentNode = container.current?.parentElement;

      if (parentNode) {
        if (parentNode.classList.contains("brz-wrapper__scrollmotion")) {
          parentNode = parentNode.parentElement;
        }

        const parentWidth = parentNode?.getBoundingClientRect().width;
        const parentWidthValue = Num.read(parentWidth);

        if (parentWidthValue && parentNode) {
          const cs = getComputedStyle(parentNode);

          const paddingX =
            parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
          const borderX =
            parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

          return parentWidthValue - paddingX - borderX;
        }
      }

      return undefined;
    }
    case "height": {
      const parentNode = container.current?.querySelector(".brz-picture");

      if (parentNode) {
        const parentHeight = parentNode.getBoundingClientRect()?.height;

        if (Num.read(parentHeight)) {
          const cs = getComputedStyle(parentNode);

          const paddingY =
            parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
          const borderY =
            parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

          return parentHeight - paddingY - borderY;
        }
      }

      return undefined;
    }
  }
}

/**
 * Updates container dimensions in state if changed
 */
export function updateContainerDimensions(
  state: ImageComponentState,
  setState: ImageUtilsContext["setState"],
  width: number,
  widthStateKey: Dimensions
): void {
  if (state[widthStateKey] !== width) {
    setState((prevState) => ({
      ...prevState,
      [widthStateKey]: width
    }));
  }
}

/**
 * Updates container width based on current device mode
 */
export function updateContainerWidth(ctx: ImageUtilsContext): void {
  if (!ctx.mounted) {
    return;
  }

  const width = getDimension(ctx.container, "width");

  if (width !== undefined) {
    switch (ctx.deviceMode) {
      case "desktop": {
        updateContainerDimensions(
          ctx.state,
          ctx.setState,
          width,
          "containerWidth"
        );
        break;
      }
      case "tablet": {
        updateContainerDimensions(
          ctx.state,
          ctx.setState,
          width,
          "tabletContainerWidth"
        );
        break;
      }
      case "mobile": {
        updateContainerDimensions(
          ctx.state,
          ctx.setState,
          width,
          "mobileContainerWidth"
        );
        break;
      }
    }
  }
}

/**
 * Gets extra image props for dynamic attributes like alt and title
 */
export function getExtraImageProps(v: Value): ExtraImageAttributes {
  const {
    alt: altValue,
    imageSrc,
    imagePopulation,
    imagePopulationEntityType: entityType,
    imagePopulationEntityId: entityId,
    enableLazyLoad
  } = v;

  const attr = enableLazyLoad === "on" ? { loading: "lazy" as const } : {};

  if (imagePopulation) {
    const imagePlaceholder = Base64.encode(
      imagePopulation.replace(/"/g, '\\"')
    );
    return {
      ...attr,
      alt:
        altValue ||
        makePlaceholder({
          content: "{{ brizy_dc_image_alt }}",
          attr: { imagePlaceholder, entityType, entityId }
        }),
      title: makePlaceholder({
        content: "{{ brizy_dc_image_title }}",
        attr: { imagePlaceholder, entityType, entityId }
      })
    };
  }

  return {
    ...attr,
    alt:
      altValue ||
      makePlaceholder({
        content: "{{ brizy_dc_image_alt }}",
        attr: { imageSrc }
      }),
    title: makePlaceholder({
      content: "{{ brizy_dc_image_title }}",
      attr: { imageSrc }
    })
  };
}

/**
 * Gets image URLs for a specific device
 */
export function getImageUrlsFor(
  v: Value,
  wrapperSizes: WrapperSizes,
  imageSizes: ImageSizes,
  device: DeviceMode,
  config: ImageUtilsContext["config"]
): ImageUrlResult {
  let { width: cW, height: cH } = wrapperSizes[device];
  cW = Math.round(cW);
  cH = Math.round(cH);

  if (v.imagePopulation) {
    const src = v.imageSrc;
    const options = { cW: Math.round(cW), cH: Math.round(cH) };
    const options2X = multiplier(options, 2);
    const url = imagePopulationUrl(src, { ...options });

    return {
      source: url,
      url: `${url} 1x, ${imagePopulationUrl(src, {
        ...options2X
      })} 2x`
    };
  }

  const dvv = (key: string): Literal => defaultValueValue({ v, key, device });

  return getCustomImageUrl(
    fromElementModel(dvv),
    wrapperSizes[device],
    imageSizes[device],
    config
  );
}

/**
 * Gets hover image URLs
 */
export function getHoverImageUrlsFor(
  v: Value,
  wrapperSizes: WrapperSizes,
  imageSizes: ImageSizes,
  config: ImageUtilsContext["config"]
): HoverImageUrlResult {
  const { hoverImagePopulation, hoverImage, sizeType } = v;
  const desktopSizes = wrapperSizes["desktop"];

  let { width: cW, height: cH } = desktopSizes;
  cW = Math.round(cW);
  cH = Math.round(cH);

  const dvv = (key: string): Literal =>
    defaultValueValue({ v, key, device: "desktop" });
  const hoverGetter = (key: string): Literal =>
    dvv(capByPrefix("hover", key));

  if (hoverImagePopulation && hoverImage) {
    const options = { cW, cH };
    const hoverUrl = imagePopulationUrl(hoverImage, options) || "";

    return {
      hoverSource: hoverUrl,
      hoverUrl: `${hoverUrl} 1x, ${imagePopulationUrl(
        hoverImage,
        multiplier(options, 2)
      )} 2x`,
      isHover: true
    };
  }

  const hoverModel = {
    ...fromElementModel(hoverGetter),
    sizeType
  };

  return getCustomImageUrl(
    fromElementModel(dvv),
    desktopSizes,
    imageSizes["desktop"],
    config,
    hoverModel
  );
}

/**
 * Gets responsive URLs for all devices
 */
export function getResponsiveUrls(
  v: Value,
  wrapperSizes: WrapperSizes,
  imageSizes: ImageSizes,
  config: ImageUtilsContext["config"]
): ImagesSources {
  return {
    desktopSrc: getImageUrlsFor(v, wrapperSizes, imageSizes, "desktop", config)
      .url,
    hoverDesktopSrc:
      getHoverImageUrlsFor(v, wrapperSizes, imageSizes, config).hoverUrl ?? "",
    tabletSrc: getImageUrlsFor(v, wrapperSizes, imageSizes, "tablet", config)
      .url,
    mobileSrc: getImageUrlsFor(v, wrapperSizes, imageSizes, "mobile", config)
      .url,
    sourceSrc:
      getImageUrlsFor(v, wrapperSizes, imageSizes, "desktop", config).source ??
      "",
    hoverSourceSrc:
      getHoverImageUrlsFor(v, wrapperSizes, imageSizes, config).hoverSource ??
      ""
  };
}

/**
 * Gets container sizes from state
 */
export function getContainerSize(state: ImageComponentState): ContainerSizes {
  return {
    desktop: state.containerWidth,
    tablet: state.tabletContainerWidth,
    mobile: state.mobileContainerWidth
  };
}

/**
 * Calculates wrapper sizes for all devices
 */
export function calculateWrapperSizes(
  v: Value,
  state: ImageComponentState,
  config: ImageUtilsContext["config"]
): ExtendedWrapperSizes {
  const { imageSizes: cfgImageSizes = [] } = config;

  const { containerWidth, tabletContainerWidth, mobileContainerWidth } = state;
  const {
    imageExtension,
    imagePopulation,
    imageWidth,
    imageHeight,
    width,
    height,
    widthSuffix,
    heightSuffix
  } = v;

  const isSvgOrGif =
    (isSVGExtension(imageExtension) || isGIFExtension(imageExtension)) &&
    !imagePopulation;

  const _sizeType = getSizeType(v, DESKTOP);
  const _tabletSizeType = getSizeType(v, TABLET);
  const _mobileSizeType = getSizeType(v, MOBILE);

  const sizeType = getImageSize(_sizeType, cfgImageSizes);
  const tabletSizeType = getImageSize(_tabletSizeType, cfgImageSizes);
  const mobileSizeType = getImageSize(_mobileSizeType, cfgImageSizes);

  const containerSizes = getContainerSize(state);
  const { desktop, tablet, mobile } = containerSizes;

  const isPredefined =
    isPredefinedSize(sizeType) &&
    isPredefinedSize(tabletSizeType) &&
    isPredefinedSize(mobileSizeType);

  if (isPredefined && !isSvgOrGif) {
    return {
      desktop: calcWrapperPredefinedSizes(sizeType, desktop),
      tablet: calcWrapperPredefinedSizes(tabletSizeType, tablet),
      mobile: calcWrapperPredefinedSizes(mobileSizeType, mobile)
    };
  }

  const dvv = (key: string, device: DeviceMode): number =>
    defaultValueValue({ v, device, key });
  const dvvH = (key: string): number =>
    defaultValueValue({ v, device: "desktop", key, state: "hover" });

  const size = dvv("size", DESKTOP);
  const tabletSize = dvv("size", TABLET);
  const mobileSize = dvv("size", MOBILE);

  const desktopValue = {
    imageWidth,
    imageHeight,
    imageExtension,
    width,
    height,
    widthSuffix,
    heightSuffix,
    size
  };

  const hoverDesktopValue = {
    imageWidth: dvvH("imageWidth"),
    imageHeight: dvvH("imageHeight"),
    imageExtension: dvvH("imageExtension"),
    height: dvvH("height"),
    width,
    widthSuffix,
    heightSuffix,
    size
  };

  const tabletValue = {
    imageWidth,
    imageHeight,
    imageExtension,
    size: tabletSize,
    width: v.tabletWidth || width,
    height: v.tabletHeight || height,
    widthSuffix: tabletSyncOnChange(v, "widthSuffix"),
    heightSuffix: tabletSyncOnChange(v, "heightSuffix")
  };

  const mobileValue = {
    imageWidth,
    imageHeight,
    imageExtension,
    size: mobileSize,
    width: v.mobileWidth || width,
    height: v.mobileHeight || height,
    widthSuffix: mobileSyncOnChange(v, "widthSuffix"),
    heightSuffix: mobileSyncOnChange(v, "heightSuffix")
  };

  if (isOriginalSize(sizeType) && !isSvgOrGif) {
    return {
      desktop: calcWrapperOriginalSizes(desktopValue, containerWidth),
      hoverDesktop: calcWrapperOriginalSizes(
        hoverDesktopValue,
        containerWidth
      ),
      tablet: calcWrapperOriginalSizes(tabletValue, tabletContainerWidth),
      mobile: calcWrapperOriginalSizes(mobileValue, mobileContainerWidth)
    };
  }

  return {
    desktop: calcWrapperSizes(desktopValue, containerWidth),
    hoverDesktop: calcWrapperSizes(hoverDesktopValue, containerWidth),
    tablet: calcWrapperSizes(tabletValue, tabletContainerWidth),
    mobile: calcWrapperSizes(mobileValue, mobileContainerWidth)
  };
}

/**
 * Processes DB value with resize transformations
 */
export function processDBValue(
  dbValue: Value & {
    resize?: number;
    tabletResize?: number;
    mobileResize?: number;
  },
  state: ImageComponentState,
  config: ImageUtilsContext["config"]
): Value {
  const { resize, tabletResize, mobileResize, ...restDbValue } = dbValue;

  let value: Partial<Value> = {};

  if (resize) {
    value = { ...value, width: resize };
  }
  if (tabletResize) {
    value = { ...value, tabletWidth: tabletResize };
  }
  if (mobileResize) {
    value = { ...value, mobileWidth: mobileResize };
  }

  if (restDbValue.width) {
    value = { ...value, width: restDbValue.width };
  }
  if (restDbValue.tabletWidth) {
    value = { ...value, tabletWidth: restDbValue.tabletWidth };
  }
  if (restDbValue.mobileWidth) {
    value = { ...value, mobileWidth: restDbValue.mobileWidth };
  }

  if (restDbValue.height && !restDbValue.heightSuffix) {
    value = { ...value, heightSuffix: "%" };
  }
  if (restDbValue.tabletHeight && !restDbValue.tabletHeightSuffix) {
    value = { ...value, tabletHeightSuffix: "%" };
  }
  if (restDbValue.mobileHeight && !restDbValue.mobileHeightSuffix) {
    value = { ...value, mobileHeightSuffix: "%" };
  }

  if (
    !restDbValue.imagePopulation &&
    restDbValue.sizeType !== undefined &&
    restDbValue.sizeType !== SizeType.custom
  ) {
    const { imageSizes } = config;
    const imageData = imageSizes?.find(
      ({ name }) => name === restDbValue.sizeType
    );
    if (imageData === undefined) {
      restDbValue.sizeType = SizeType.original;
    }
  }

  const sizeValue = state.sizePatch ?? {};

  return {
    ...restDbValue,
    ...value,
    ...sizeValue
  } as Value;
}

/**
 * Hook for processing DC (Dynamic Content) values
 */
export function processDCValueHook(
  dcKeys: ECKeyDCInfo[],
  v: Value,
  ctx: ImageUtilsContext
): (ECKeyDCInfo | DCValueHookResult)[] {
  const wrapperSizes = calculateWrapperSizes(v, ctx.state, ctx.config);
  const deviceMode = ctx.deviceMode;
  const dvv = (key: string): Literal =>
    defaultValueValue({ v, key, device: deviceMode });

  return dcKeys.map((dcKey) => {
    if (dcKey.key === "image") {
      const { width, height } = wrapperSizes[deviceMode];
      let { cW, cH } = ctx.prevWrapperSizes;

      if (width > cW || height > cH) {
        cW = width;
        cH = height;

        ctx.updatePrevWrapperSizes({ cW: width, cH: height });
      }

      const fallbackImage = fromElementModel(
        (k) =>
          v[createOptionId(keyToDCFallback2Key(dcKey.key), k)] as Literal
      );

      const fallbackUrl = getCustomImageUrl(
        fallbackImage,
        wrapperSizes[deviceMode],
        calcImageSizes(
          {
            size: dvv("size") as number,
            width: dvv("width") as number,
            height: dvv("height") as number,
            widthSuffix: dvv("widthSuffix") as "px" | "%",
            heightSuffix: dvv("heightSuffix") as "px" | "%",
            imageHeight: fallbackImage.height ?? 0,
            imageWidth: fallbackImage.width ?? 0,
            positionX: fallbackImage.x ?? 0,
            positionY: fallbackImage.y ?? 0,
            zoom: dvv("zoom") as number
          },
          ctx.meta[`${deviceMode}W`],
          isView(ctx.renderContext)
        ),
        ctx.config
      ).source;

      return {
        ...dcKey,
        key: "imageSrc",
        attr: {
          ...dcKey.attr,
          cW: Math.round(cW),
          cH: Math.round(cH),
          disableCrop: isEditor(ctx.renderContext)
        },
        ...(fallbackUrl ? { fallback: fallbackUrl } : {})
      } as ECKeyDCInfo;
    }

    return dcKey;
  });
}

/**
 * Handles image change patch processing
 */
export function handleImageChangePatch(
  patch: Patch,
  ctx: ImageUtilsContext
): ImagePatchResult {
  updateContainerWidth(ctx);

  const { imageSizes: cfgImageSizes = [] } = ctx.config;
  const device = ctx.deviceMode;
  const { v } = ctx.getValue2();
  const dvv = (key: string): Literal => defaultValueValue({ v, device, key });
  const value = elementModelToValue(v);

  const image = isImagePatch(patch)
    ? ImagePatch.fromImageElementModel(patch)
    : undefined;

  const hoverImage = isHoverImagePatch(patch)
    ? ImagePatch.fromHoverImageElementModel(patch)
    : undefined;

  const isDCPatch = isDCImagePatch(patch);

  const imageDC = isDCPatch
    ? ImagePatch.fromImageDCElementModel(patch)
    : undefined;

  const imageSizeType = isSizeTypePatch(patch)
    ? ImagePatch.patchImageSizeType(patch)
    : undefined;

  const imageUnit = ImagePatch.patchImageUnit(patch, device);

  const imageLinkDC = isLinkDcPatch(patch)
    ? fromLinkElementModel(patch)
    : undefined;

  if (value === undefined) {
    return {};
  }

  if (image !== undefined) {
    const wrapperSizes = calculateWrapperSizes(v, ctx.state, ctx.config);
    const wrapperSize = wrapperSizes[device];
    const containerWidth = getContainerSize(ctx.state)[device];

    return {
      ...patchOnImageChange(containerWidth, value, wrapperSize, image)
    };
  }

  if (hoverImage !== undefined) {
    const { imageExtension } = v;

    const wrapperSizes = calculateWrapperSizes(v, ctx.state, ctx.config);
    const wrapperSize = { ...wrapperSizes["desktop"] };
    const containerWidth = getContainerSize(ctx.state)["desktop"];

    if (isSVGExtension(imageExtension) || isGIFExtension(imageExtension)) {
      wrapperSize.height = wrapperSize.width;
    }

    return {
      ...patchOnHoverImageChange(
        containerWidth,
        value,
        wrapperSize,
        hoverImage
      )
    };
  }

  if (imageDC !== undefined && isDCPatch) {
    const context = ctx.editorContext;
    const wrapperSizes = calculateWrapperSizes(v, ctx.state, ctx.config);
    const wrapperSize = wrapperSizes[device];
    const containerWidth = getContainerSize(ctx.state)[device];

    return {
      ...patchOnDCChange(
        containerWidth,
        patch,
        wrapperSize,
        context,
        cfgImageSizes
      )
    };
  }

  if (imageUnit !== undefined) {
    const containerWidth = getDimension(ctx.container, "width") ?? 0;
    const containerHeight = getDimension(ctx.container, "height") ?? 0;

    return {
      ...pathOnUnitChange(
        containerWidth,
        containerHeight,
        value,
        imageUnit,
        device
      )
    };
  }

  const sizeType = dvv("sizeType");
  if (imageSizeType !== undefined && imageSizeType.sizeType !== sizeType) {
    const {
      hoverImageSrc,
      hoverImageExtension,
      hoverImageWidth,
      hoverImageHeight
    } = v;

    const containerWidth = getContainerSize(ctx.state)[device];
    const wrapperSizes = calculateWrapperSizes(v, ctx.state, ctx.config);
    const wrapperSize = wrapperSizes["desktop"];

    return {
      ...patchOnSizeTypeChange(
        containerWidth,
        imageSizeType,
        cfgImageSizes ?? []
      ),
      ...patchOnHoverImageChange(containerWidth, value, wrapperSize, {
        hoverImageSrc,
        hoverImageExtension,
        hoverImageWidth,
        hoverImageHeight
      })
    };
  }

  if (imageLinkDC) {
    return { ...patchOnLinkDCChange(imageLinkDC) };
  }

  return {};
}

/**
 * Updates hover image height when size type or suffix changes
 */
export function updateHoverImageHeight(ctx: ImageUtilsContext): void {
  const v = ctx.getValue();

  const {
    hoverHeight,
    hoverImageSrc,
    hoverImageExtension,
    hoverImageWidth,
    hoverImageHeight
  } = v;

  const value = elementModelToValue(v);

  if (!value) {
    return;
  }

  const device = ctx.deviceMode;
  const containerWidth = getContainerSize(ctx.state)[device];
  const wrapperSizes = calculateWrapperSizes(v, ctx.state, ctx.config);
  const wrapperSize = wrapperSizes[device];

  const patch = patchOnHoverImageChange(containerWidth, value, wrapperSize, {
    hoverImageSrc,
    hoverImageExtension,
    hoverImageWidth,
    hoverImageHeight
  });

  if (Math.round(hoverHeight) !== Math.round(patch.hoverHeight)) {
    ctx.patchValue(patch);
  }
}
