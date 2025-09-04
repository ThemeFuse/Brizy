import classnames from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { MIN_COL_WIDTH } from "visual/config/columns";
import {
  formatHoverRetinaSrc,
  formatHoverSrc
} from "visual/editorComponents/Image/Image/utils";
import { SizeType } from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/providers/ConfigProvider";
import { isView } from "visual/providers/RenderProvider";
import { useCSS } from "visual/providers/StyleProvider/useCSS";
import { isGIFExtension } from "visual/utils/image/utils";
import { defaultValueValue } from "visual/utils/onChange";
import { FCC } from "visual/utils/react/types";
import { read as readNumber } from "visual/utils/reader/number";
import { DESKTOP } from "visual/utils/responsiveMode";
import { styleHoverImage } from "../styles";
import {
  Device,
  HoverImageCommonProps as HoverImageProps,
  ImageSizes
} from "../types";
import { Value, calcImageSizes } from "../utils";

const HoverSimpleImage: FCC<HoverImageProps> = (props) => {
  const {
    v,
    vs,
    vd,
    _id,
    componentId,
    meta,
    extraAttributes = {},
    store,
    renderContext,
    editorMode,
    getResponsiveUrls
  } = props;

  const { desktopW, tabletW, mobileW, row } = meta;

  const {
    imageSrc,
    imageWidth,
    hoverImageWidth,
    imageHeight,
    hoverImageHeight,
    positionX,
    hoverPositionX,
    positionY,
    hoverPositionY,
    zoom,
    width,
    height,
    widthSuffix,
    heightSuffix,
    hoverImageSrc,
    hoverImage,
    hoverHeight,
    hoverImageFileName,
    hoverImageExtension,
    className: modelClassName,
    tabsState
  } = v;

  const config = useConfig();

  const isFirstRun = useRef(true);
  const isHoverTabActive =
    (hoverImageSrc || hoverImage) && tabsState === "hover";

  const dvv: <T>(key: string, device: Device) => T = useCallback(
    (key, device) => defaultValueValue({ v, key, device }),
    [v]
  );

  const getHoverImageSizes = useCallback(
    (cW = desktopW): ImageSizes => {
      const hoverDesktopValue = {
        imageWidth: hoverImageWidth ?? imageWidth,
        imageHeight: hoverImageHeight ?? imageHeight,
        positionX: hoverPositionX ?? positionX,
        positionY: hoverPositionY ?? positionY,
        zoom,
        width,
        height: hoverHeight,
        widthSuffix,
        heightSuffix,
        size: dvv("size", DESKTOP)
      } as Value;

      return {
        desktop: calcImageSizes(hoverDesktopValue, cW),
        tablet: {
          width: 0,
          height: 0,
          marginLeft: 0,
          marginTop: 0
        },
        mobile: {
          width: 0,
          height: 0,
          marginLeft: 0,
          marginTop: 0
        }
      };
    },
    [
      imageWidth,
      imageHeight,
      positionX,
      positionY,
      desktopW,
      hoverImageWidth,
      hoverImageHeight,
      hoverPositionX,
      hoverPositionY,
      zoom,
      width,
      hoverHeight,
      widthSuffix,
      heightSuffix,
      dvv
    ]
  );

  const getMaxCW = useMemo(() => {
    return (cW: number, type: Device = "desktop"): number => {
      const length = readNumber(row?.itemsLength);

      const widthStepInPercent = 20;
      const imgSizes = getHoverImageSizes(cW);

      const maxDesktopContainerWidth = length
        ? desktopW - MIN_COL_WIDTH * (length - 1)
        : cW;
      const shortcodeWidthInPercent =
        (imgSizes[type].width * 100) / maxDesktopContainerWidth;

      const maxWidthPercent =
        Math.ceil(shortcodeWidthInPercent / widthStepInPercent) *
        widthStepInPercent;

      return Math.round(
        Math.min((maxWidthPercent * maxDesktopContainerWidth) / 100, imageWidth)
      );
    };
  }, [desktopW, getHoverImageSizes, row, imageWidth]);

  const [maxDesktopCW, setMaxDesktopCw] = useState(getMaxCW(desktopW));

  useEffect(() => {
    const newDesktopCw = getMaxCW(desktopW);

    if (!isFirstRun.current && newDesktopCw > maxDesktopCW) {
      setMaxDesktopCw(newDesktopCw);
    }

    isFirstRun.current = false;
  }, [desktopW, tabletW, mobileW, width, height, zoom, maxDesktopCW, getMaxCW]);

  const hoverImageSizes = getHoverImageSizes();

  const sizeType = dvv<SizeType>("sizeType", DESKTOP);

  const hoverResponsiveUrls =
    typeof getResponsiveUrls === "function"
      ? getResponsiveUrls(hoverImageSizes)
      : undefined;

  const { hoverDesktopSrc, hoverSourceSrc } = useMemo(
    () =>
      hoverResponsiveUrls ?? {
        hoverDesktopSrc: formatHoverRetinaSrc(
          {
            src: hoverImageSrc || hoverImage,
            fileName: hoverImageFileName,
            sizeType: sizeType,
            maxCw: maxDesktopCW
          },
          config
        ),
        hoverSourceSrc: formatHoverSrc(
          {
            src: hoverImageSrc || hoverImage,
            fileName: hoverImageFileName,
            sizeType: sizeType,
            maxCw: maxDesktopCW
          },
          config
        )
      },
    [
      hoverImageSrc,
      hoverImage,
      hoverImageFileName,
      sizeType,
      maxDesktopCW,
      hoverResponsiveUrls,
      config
    ]
  );

  const dynamicCSSClassName = useCSS({
    id: `${componentId}-${_id}-image-hover`,
    componentId: `${_id}-image-hover`,
    css: styleHoverImage({
      v,
      vs,
      vd,
      props: hoverImageSizes,
      store,
      contexts: {
        renderContext,
        mode: editorMode,
        getConfig: () => config
      }
    })
  });

  const hoverImageClassName = classnames(
    "brz-img__hover",
    `brz-img__hover-size--${sizeType}`,
    {
      "brz-img__hover-preview brz-transparent": isView(renderContext),
      "brz-img__hover-population": hoverImage,
      "brz-transparent": !isHoverTabActive,
      "brz-img__hover-with-placeholder": !imageSrc,
      "brz-img__hover-gif": isGIFExtension(hoverImageExtension)
    },
    modelClassName,
    dynamicCSSClassName
  );

  return (
    <div className={hoverImageClassName}>
      <img
        srcSet={hoverDesktopSrc}
        src={hoverSourceSrc}
        draggable={false}
        {...extraAttributes}
      />
    </div>
  );
};

export default HoverSimpleImage;
