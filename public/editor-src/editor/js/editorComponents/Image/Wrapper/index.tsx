/* eslint-disable @typescript-eslint/no-use-before-define */
import classnames from "classnames";
import React, { useCallback } from "react";
import BoxResizer from "visual/component/BoxResizer";
import { getSizeType, isGIF, isSVG } from "visual/editorComponents/Image/utils";
import { css } from "visual/utils/cssStyle";
import { clamp } from "visual/utils/math";
import { mobileSyncOnChange, tabletSyncOnChange } from "visual/utils/onChange";
import { DESKTOP } from "visual/utils/responsiveMode";
import { styleWrapper, styleWrapperContainer } from "../styles";
import { ImageProps, Meta, Patch, Styles, V } from "../types";
import { showOriginalImage } from "../utils";
import useResizerPoints from "./useResizerPoints";

const Image: React.FC<ImageProps> = (props) => {
  const {
    v,
    vs,
    vd,
    _id,
    componentId,
    wrapperSizes,
    meta,
    onChange,
    onStart,
    onEnd
  } = props;

  const { maskShape } = v;
  const { points, restrictions } = useResizerPoints(props);

  const classNameWrapper = classnames(
    "brz-ed-image__wrapper",
    { "brz-img__original": showOriginalImage(v) },
    css(
      // hard to explain, but because styles are generated from props in this case
      // we can't rely on the usual way of using css(),
      // so we trick it with a custom class for both default and custom classNames
      // `${componentId}-wrapper`,
      `${componentId}-${_id}-wrapper`,
      `${_id}-wrapper`,
      styleWrapper(v, vs, vd, {
        ...wrapperSizes,
        showOriginalImage: showOriginalImage(v)
      }) as Styles
    )
  );

  const handleOnResize = useCallback(
    (patch: Patch) => {
      onChange(resizerTransformPatch(patch, v));
    },
    [onChange, v]
  );

  const classNameWrapperContainer = classnames(
    "brz-ed-image__wrapper-container",
    css(
      `${componentId}-${_id}-wrapper-container`,
      `${_id}-wrapper-container`,
      styleWrapperContainer(v, vs, vd)
    )
  );

  return (
    <BoxResizer
      keepAspectRatio
      restrictions={restrictions}
      points={points}
      meta={meta}
      value={resizerTransformValue(v, meta)}
      onChange={handleOnResize}
      onStart={onStart}
      onEnd={onEnd}
    >
      {maskShape !== "none" ? (
        <div className={classNameWrapperContainer}>
          <div className={classNameWrapper}>{props.children}</div>
        </div>
      ) : (
        <div className={classNameWrapper}>{props.children}</div>
      )}
    </BoxResizer>
  );

  function resizerTransformValue(v: V, meta: Meta): Partial<V> {
    const {
      width,
      height,
      tabletWidth,
      mobileWidth,
      imageWidth,
      imageHeight,
      elementPosition,
      widthSuffix,
      imagePopulation,
      imageExtension
    } = v;
    const { desktopW, tabletW, mobileW } = meta;
    const isAbsoluteOrFixed =
      elementPosition === "absolute" || elementPosition === "fixed";
    const sizeType = getSizeType(v, DESKTOP);
    const { size, ..._v } = v;
    const isSvgOrGif =
      (isSVG(imageExtension) || isGIF(imageExtension)) && !imagePopulation;

    return {
      ..._v,
      width:
        widthSuffix === "px" ? clamp(width || desktopW, 0, desktopW) : width,
      tabletWidth:
        tabletSyncOnChange(v, "widthSuffix") === "px"
          ? clamp(tabletWidth || width, 0, tabletW)
          : tabletWidth,
      mobileWidth: mobileSyncOnChange(v, "widthSuffix")
        ? clamp(mobileWidth || width, 0, mobileW)
        : mobileWidth,
      height: isAbsoluteOrFixed ? height / (imageWidth / imageHeight) : height,
      ...(sizeType !== "custom" && !isSvgOrGif && { size })
    };
  }

  function resizerTransformPatch(patch: Patch, v: V): Patch {
    const isAbsoluteOrFixed =
      v.elementPosition === "absolute" || v.elementPosition === "fixed";

    let newPatch = {};
    if (isAbsoluteOrFixed) {
      const ratio = v.imageWidth / v.imageHeight;

      newPatch = {
        offsetY: patch.offsetY || v.offsetY,
        height: patch.height * ratio
      };
    }

    return { ...patch, ...newPatch };
  }
};

export default Image;
