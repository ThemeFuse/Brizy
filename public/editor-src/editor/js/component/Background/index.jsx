import React from "react";
import { videoData } from "visual/utils/video";
import {
  deviceStateValueByKey,
  makeKeyByStateDevice
} from "visual/utils/onChange";
import Background from "./Background";

const toNormal = v => (a, c) => {
  const cV = v[c];
  return cV !== null && cV !== undefined ? [...a, cV] : a;
};

const getMediaProps = v => {
  const opacityKey =
    v.bgColorType === "solid" ? "bgColorOpacity" : "gradientColorOpacity";
  const normalKeyValue = toNormal(v);
  const opacityKeyValue = makeKeyByStateDevice(v, opacityKey).reduce(
    normalKeyValue,
    []
  );

  // Verify if opacity is less than 1
  // Verify if opacity is greater than 0
  return {
    media: opacityKeyValue.some(k => k < 1),
    opacity: opacityKeyValue.some(k => k > 0)
  };
};

const getImage = v => deviceStateValueByKey(v, "bgImageSrc") || v.bgPopulation;
const getBoxShadow = v => deviceStateValueByKey(v, "boxShadow");

const getBorder = v => {
  const currentKeys =
    v.borderWidthType === "grouped"
      ? ["borderWidth"]
      : [
          "borderTopWidth",
          "borderRightWidth",
          "borderBottomWidth",
          "borderLeftWidth"
        ];

  return currentKeys.some(key => deviceStateValueByKey(v, key));
};

const getParallax = (v, meta = {}) => {
  const { bgAttachment } = v;
  const { section } = meta;

  return bgAttachment && bgAttachment === "animated" && !section.isSlider;
};

export default function BackgroundContainer({
  value,
  meta,
  className,
  children
}) {
  const {
    bgVideo,
    bgVideoLoop,
    bgVideoQuality,
    bgMapZoom,
    bgMapAddress,
    shapeTopType,
    shapeBottomType
  } = value;
  const currentMedia = deviceStateValueByKey(value, "media");
  const { media, opacity } = getMediaProps(value);

  let props = {
    className,
    opacity,
    children,
    image: media && getImage(value),
    border: getBorder(value),
    boxShadow: getBoxShadow(value),
    parallax: getParallax(value, meta),
    shapeTop: shapeTopType && shapeTopType !== "none",
    shapeBottom: shapeBottomType && shapeBottomType !== "none"
  };

  if (currentMedia === "video") {
    props.video = media && videoData(bgVideo);
    props.bgVideoQuality = bgVideoQuality;
    props.bgVideoLoop = bgVideoLoop === "on";
  }

  if (currentMedia === "map") {
    props.map = media && bgMapAddress;
    props.mapZoom = bgMapZoom;
  }

  return <Background {...props} />;
}
