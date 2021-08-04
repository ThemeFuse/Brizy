/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useRef, useEffect } from "react";
import { MIN_COL_WIDTH } from "visual/config/columns";
import { imageUrl } from "visual/utils/image";
import { calcImageSizes } from "../utils";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { styleImage } from "../styles";

import { ImageSizes, ImageProps, Device, Styles } from "../types";

const formatSrc = (imageSrc: string, maxCw: number): string => {
  const imgUrl_1X = imageUrl(imageSrc, { iW: maxCw, iH: "any" });

  const imgUrl_2X = imageUrl(imageSrc, {
    iW: maxCw * 2,
    iH: "any"
  });

  return `${imgUrl_1X} 1x, ${imgUrl_2X} 2x`;
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

  // ! find less hacky way
  const responsiveUrls = getResponsiveUrls && getResponsiveUrls(imageSizes);

  const { desktopSrc, tabletSrc, mobileSrc, sourceSrc } = responsiveUrls || {
    desktopSrc: formatSrc(imageSrc, maxDesktopCW),
    tabletSrc: formatSrc(imageSrc, maxTabletCW),
    mobileSrc: formatSrc(imageSrc, maxMobileCW),
    sourceSrc: imageUrl(imageSrc, { iW: maxMobileCW, iH: "any" })
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
    : classnames("brz-img", "brz-p-absolute");

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
      heightSuffix
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
      heightSuffix: tabletSyncOnChange(v, "heightSuffix")
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
      heightSuffix: mobileSyncOnChange(v, "heightSuffix")
    };

    return {
      desktop: calcImageSizes(desktopValue, cW),
      tablet: calcImageSizes(tabletValue, tabletW),
      mobile: calcImageSizes(mobileValue, mobileW)
    };
  }
};

export default SimpleImage;
