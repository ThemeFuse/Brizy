/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useRef, useEffect } from "react";
import { MIN_COL_WIDTH } from "visual/config/columns";
import { imageUrl } from "visual/utils/image";
import { calcImageSizes } from "../utils";
import {
  tabletSyncOnChange,
  mobileSyncOnChange,
  defaultValueValue
} from "visual/utils/onChange";

import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { styleImage } from "../styles";

import { ImageSizes, ImageProps, Device, Styles } from "../types";
import { imageSpecificSize } from "visual/utils/image";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";

const formatRetinaSrc = (
  src: string,
  sizeType: string,
  maxCw: number
): string => {
  switch (sizeType) {
    case "custom": {
      const url_1X = imageUrl(src, { iW: maxCw, iH: "any" });
      const url_2X = imageUrl(src, { iW: maxCw * 2, iH: "any" });
      return `${url_1X} 1x, ${url_2X} 2x`;
    }
    default: {
      const url = imageSpecificSize(src, sizeType);
      return `${url} 1x, ${url} 2x`;
    }
  }
};

const formatSrc = (src: string, sizeType: string, maxCw: number): string => {
  switch (sizeType) {
    case "custom": {
      return imageUrl(src, { iW: maxCw, iH: "any" }) ?? "";
    }
    default: {
      return imageSpecificSize(src, sizeType);
    }
  }
};

const SimpleImage: React.FC<ImageProps> = props => {
  const {
    v,
    vs,
    vd,
    _id,
    componentId,
    meta,
    extraAttributes = {},
    getResponsiveUrls
  } = props;
  const { desktopW, tabletW, mobileW } = meta;
  const {
    imageSrc,
    imageWidth,
    imageHeight,
    positionX,
    positionY,
    zoom,
    width,
    height,
    widthSuffix,
    heightSuffix
  } = v;
  const isFirstRun = useRef(true);

  const [maxDesktopCW, setMaxDesktopCw] = useState(getMaxCW(desktopW));
  const [maxTabletCW, setMaxTabletCw] = useState(getMaxCW(tabletW, "tablet"));
  const [maxMobileCW, setMaxMobileCw] = useState(getMaxCW(mobileW, "mobile"));

  useEffect(() => {
    const newDesktopCw = getMaxCW(desktopW);
    const newTabletCw = getMaxCW(tabletW, "tablet");
    const newMobileCw = getMaxCW(mobileW, "mobile");

    if (!isFirstRun.current) {
      newDesktopCw > maxDesktopCW && setMaxDesktopCw(newDesktopCw);
      newTabletCw > maxTabletCW && setMaxTabletCw(newTabletCw);
      newMobileCw > maxMobileCW && setMaxMobileCw(newMobileCw);
    }

    isFirstRun.current = false;
  }, [desktopW, tabletW, mobileW, width, height, zoom]);

  const imageSizes = getImageSizes();
  const sizeType = dvv<string>("sizeType", DESKTOP);
  const tabletSizeType = dvv<string>("sizeType", TABLET);
  const mobileSizeType = dvv<string>("sizeType", MOBILE);

  // ! find less hacky way
  const responsiveUrls = getResponsiveUrls && getResponsiveUrls(imageSizes);

  const { desktopSrc, tabletSrc, mobileSrc, sourceSrc } = responsiveUrls || {
    desktopSrc: formatRetinaSrc(imageSrc, sizeType, maxDesktopCW),
    tabletSrc: formatRetinaSrc(imageSrc, tabletSizeType, maxTabletCW),
    mobileSrc: formatRetinaSrc(imageSrc, mobileSizeType, maxMobileCW),
    sourceSrc: formatSrc(imageSrc, sizeType, maxMobileCW)
  };
  // ! find less hacky way

  const imageClassName = IS_EDITOR
    ? classnames(
        "brz-img",
        v.className,
        css(
          `${componentId}-${_id}-image`,
          `${_id}-image`,
          styleImage(v, vs, vd, imageSizes) as Styles
        )
      )
    : "brz-img";

  return (
    <>
      <source srcSet={desktopSrc} media="(min-width: 992px)" />
      <source srcSet={tabletSrc} media="(min-width: 768px)" />
      <img
        className={imageClassName}
        srcSet={mobileSrc}
        src={sourceSrc}
        {...extraAttributes}
        draggable={false}
        loading="lazy"
      />
    </>
  );
  function dvv<T>(key: string, device: Device): T {
    return defaultValueValue({ v, key, device });
  }

  function getMaxCW(cW: number, type: Device = "desktop"): number {
    const widthStepInPercent = 20;
    const imgSizes = getImageSizes(cW);

    let shortcodeWidthInPercent;
    let maxDesktopContainerWidth;
    if (meta.row?.itemsLength) {
      const { itemsLength } = meta.row;

      maxDesktopContainerWidth = desktopW - MIN_COL_WIDTH * (itemsLength - 1);
      shortcodeWidthInPercent =
        (imgSizes[type].width * 100) / maxDesktopContainerWidth;
    } else {
      maxDesktopContainerWidth = cW;
      shortcodeWidthInPercent = (imgSizes[type].width * 100) / cW;
    }

    const maxWidthPercent =
      Math.ceil(shortcodeWidthInPercent / widthStepInPercent) *
      widthStepInPercent;

    return Math.round(
      Math.min((maxWidthPercent * maxDesktopContainerWidth) / 100, v.imageWidth)
    );
  }

  function getImageSizes(cW = desktopW): ImageSizes {
    const desktopValue = {
      imageWidth,
      imageHeight,
      positionX,
      positionY,
      zoom,
      width,
      height,
      widthSuffix,
      heightSuffix,
      size: dvv<number>("size", DESKTOP)
    };
    const tabletValue = {
      imageWidth,
      imageHeight,
      positionX: tabletSyncOnChange(v, "positionX"),
      positionY: tabletSyncOnChange(v, "positionY"),
      zoom: tabletSyncOnChange(v, "zoom"),
      width: v.tabletWidth || width,
      height: v.tabletHeight || height,
      widthSuffix: tabletSyncOnChange(v, "widthSuffix"),
      heightSuffix: tabletSyncOnChange(v, "heightSuffix"),
      size: dvv<number>("size", TABLET)
    };
    const mobileValue = {
      imageWidth,
      imageHeight,
      positionX: mobileSyncOnChange(v, "positionX"),
      positionY: mobileSyncOnChange(v, "positionY"),
      zoom: mobileSyncOnChange(v, "zoom"),
      width: v.mobileWidth || width,
      height: v.mobileHeight || height,
      widthSuffix: mobileSyncOnChange(v, "widthSuffix"),
      heightSuffix: mobileSyncOnChange(v, "heightSuffix"),
      size: dvv<number>("size", MOBILE)
    };

    return {
      desktop: calcImageSizes(desktopValue, cW),
      tablet: calcImageSizes(tabletValue, tabletW),
      mobile: calcImageSizes(mobileValue, mobileW)
    };
  }
};

export default SimpleImage;
