import classnames from "classnames";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { MIN_COL_WIDTH } from "visual/config/columns";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  SizeType,
  defaultCrop
} from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/global/hooks";
import { isEditor } from "visual/providers/RenderProvider";
import { useCSS } from "visual/providers/StyleProvider/useCSS";
import { getImageUrl } from "visual/utils/image";
import {
  defaultValueValue,
  mobileSyncOnChange,
  tabletSyncOnChange
} from "visual/utils/onChange";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { styleImage } from "../styles";
import { Device, ImageProps, ImageSizes } from "../types";
import { calcImageSizes } from "../utils";

interface RetinaData {
  src: string;
  fileName: string;
  sizeType: SizeType;
  maxCw: number;
}

const formatRetinaSrc = (data: RetinaData, config: ConfigCommon): string => {
  const { sizeType, src, maxCw, fileName } = data;

  switch (sizeType) {
    case SizeType.custom: {
      const url_1X = getImageUrl(
        {
          fileName,
          uid: src,
          sizeType: SizeType.custom,
          crop: { ...defaultCrop, iW: maxCw }
        },
        config
      );
      const url_2X = getImageUrl(
        {
          fileName,
          uid: src,
          sizeType: SizeType.custom,
          crop: { ...defaultCrop, iW: maxCw * 2 }
        },
        config
      );
      return `${url_1X} 1x, ${url_2X} 2x`;
    }
    default: {
      const url = getImageUrl({ fileName, sizeType, uid: src }, config);
      return `${url} 1x, ${url} 2x`;
    }
  }
};

const formatSrc = (data: RetinaData, config: ConfigCommon): string => {
  const { sizeType, src, maxCw, fileName } = data;

  switch (sizeType) {
    case SizeType.custom: {
      return (
        getImageUrl(
          {
            fileName,
            sizeType: SizeType.custom,
            uid: src,
            crop: { ...defaultCrop, iW: maxCw, iH: "any" }
          },
          config
        ) ?? ""
      );
    }
    default: {
      return getImageUrl({ sizeType, uid: src, fileName }, config) ?? "";
    }
  }
};

const SimpleImage = (props: ImageProps): ReactElement => {
  const {
    v,
    vs,
    vd,
    _id,
    componentId,
    meta,
    extraAttributes = {},
    getResponsiveUrls,
    store,
    renderContext,
    editorMode
  } = props;
  const { desktopW, tabletW, mobileW, row } = meta;
  const {
    imageSrc,
    imageFileName,
    imageWidth,
    imageHeight,
    positionX,
    positionY,
    zoom,
    width,
    height,
    widthSuffix,
    heightSuffix,
    tabletWidth,
    tabletHeight,
    mobileWidth,
    mobileHeight,
    className
  } = v;
  const isFirstRun = useRef(true);
  const config = useConfig();

  const dvv: <T>(key: string, device: Device) => T = useCallback(
    (key, device) => defaultValueValue({ v, key, device }),
    [v]
  );

  const getImageSizes = useMemo(() => {
    return (cW = desktopW): ImageSizes => {
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
        width: tabletWidth || width,
        height: tabletHeight || height,
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
        width: mobileWidth || width,
        height: mobileHeight || height,
        widthSuffix: mobileSyncOnChange(v, "widthSuffix"),
        heightSuffix: mobileSyncOnChange(v, "heightSuffix"),
        size: dvv<number>("size", MOBILE)
      };

      return {
        desktop: calcImageSizes(desktopValue, cW),
        tablet: calcImageSizes(tabletValue, tabletW),
        mobile: calcImageSizes(mobileValue, mobileW)
      };
    };
  }, [
    desktopW,
    height,
    heightSuffix,
    imageHeight,
    imageWidth,
    mobileW,
    positionX,
    positionY,
    tabletW,
    v,
    width,
    widthSuffix,
    zoom,
    mobileHeight,
    mobileWidth,
    tabletHeight,
    tabletWidth,
    dvv
  ]);

  const getMaxCW = useMemo(() => {
    return (cW: number, type: Device = "desktop"): number => {
      const widthStepInPercent = 20;
      const imgSizes = getImageSizes(cW);

      let shortcodeWidthInPercent;
      let maxDesktopContainerWidth;
      if (row?.itemsLength) {
        const { itemsLength } = row;

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
        Math.min((maxWidthPercent * maxDesktopContainerWidth) / 100, imageWidth)
      );
    };
  }, [desktopW, getImageSizes, row, imageWidth]);

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
  }, [
    desktopW,
    tabletW,
    mobileW,
    maxDesktopCW,
    maxMobileCW,
    maxTabletCW,
    getMaxCW,
    setMaxDesktopCw,
    setMaxTabletCw,
    setMaxMobileCw
  ]);

  const imageSizes = getImageSizes();
  const sizeType = dvv<SizeType>("sizeType", DESKTOP);
  const tabletSizeType = dvv<SizeType>("sizeType", TABLET);
  const mobileSizeType = dvv<SizeType>("sizeType", MOBILE);

  // ! find less hacky way
  const responsiveUrls = getResponsiveUrls && getResponsiveUrls(imageSizes);

  const { desktopSrc, tabletSrc, mobileSrc, sourceSrc } = responsiveUrls || {
    desktopSrc: formatRetinaSrc(
      {
        src: imageSrc,
        fileName: imageFileName,
        sizeType: sizeType,
        maxCw: maxDesktopCW
      },
      config
    ),
    tabletSrc: formatRetinaSrc(
      {
        src: imageSrc,
        fileName: imageFileName,
        sizeType: tabletSizeType,
        maxCw: maxTabletCW
      },
      config
    ),
    mobileSrc: formatRetinaSrc(
      {
        src: imageSrc,
        fileName: imageFileName,
        sizeType: mobileSizeType,
        maxCw: maxMobileCW
      },
      config
    ),
    sourceSrc: formatSrc(
      {
        src: imageSrc,
        fileName: imageFileName,
        sizeType: sizeType,
        maxCw: maxMobileCW
      },
      config
    )
  };
  // ! find less hacky way

  const modelClassName = useCSS({
    id: `${_id}-image`,
    componentId: `${componentId}-${_id}-image`,
    css: styleImage({
      v,
      vs,
      vd,
      props: imageSizes,
      store,
      contexts: {
        renderContext,
        mode: editorMode
      }
    })
  });

  const imageClassName = isEditor(renderContext)
    ? classnames("brz-img", className, modelClassName)
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
};

export default SimpleImage;
