/* eslint-disable @typescript-eslint/no-use-before-define */
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import { clamp } from "visual/utils/math";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { styleWrapper } from "../styles";

import useResizerPoints from "./useResizerPoints";
import { ImageProps, V, Patch, Styles } from "../types";

const Image: React.FC<ImageProps> = props => {
  const { v, vs, vd, _id, componentId, wrapperSizes, meta } = props;
  const isAbsoluteOrFixed =
    v.elementPosition === "absolute" || v.elementPosition === "fixed";
  const { points, restrictions } = useResizerPoints(props);

  const classNameWrapper = classnames(
    "brz-ed-image__wrapper",
    css(
      // hard to explain, but because styles are generated from props in this case
      // we can't rely on the usual way of using css(),
      // so we trick it with a custom class for both default and custom classNames
      // `${componentId}-wrapper`,
      `${componentId}-${_id}-wrapper`,
      `${_id}-wrapper`,
      styleWrapper(v, vs, vd, wrapperSizes) as Styles
    )
  );

  const value = {
    ...v,
    width:
      v.widthSuffix === "px"
        ? clamp(v.width || meta.desktopW, 0, meta.desktopW)
        : v.width,
    tabletWidth:
      tabletSyncOnChange(v, "widthSuffix") === "px"
        ? clamp(v.tabletWidth || v.width, 0, meta.tabletW)
        : v.tabletWidth,
    mobileWidth: mobileSyncOnChange(v, "widthSuffix")
      ? clamp(v.mobileWidth || v.width, 0, meta.mobileW)
      : v.mobileWidth
  };

  return (
    <BoxResizer
      keepAspectRatio
      restrictions={restrictions}
      points={points}
      meta={meta}
      value={resizerTransformValue(value)}
      onChange={(patch: Patch): void =>
        props.onChange(resizerTransformPatch(patch))
      }
    >
      <div className={classNameWrapper}>{props.children}</div>
    </BoxResizer>
  );

  // It's needed only for story. When we change height
  function resizerTransformValue(value: V): V {
    let newValue = {};
    if (isAbsoluteOrFixed) {
      const ratio = v.imageWidth / v.imageHeight;

      newValue = {
        height: value.height / ratio
      };
    }
    return {
      ...value,
      ...newValue
    };
  }

  function resizerTransformPatch(patch: Patch): Patch {
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
