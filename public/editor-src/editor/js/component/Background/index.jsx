import React from "react";
import { videoData } from "visual/utils/video";
import {
  deviceStateValueByKey,
  makeKeyByStateDevice,
  validateKeyByProperty
} from "visual/utils/onChange";
import Background from "./Background";

const toNormal = v => (a = [], c) => {
  const cV = v[c];
  return cV !== null && cV !== undefined ? a.concat(cV) : a;
};

const getMediaProps = v => {
  const normalKeyValue = toNormal(v);
  let opacityKeyValue;

  if (v.bgColorType === "solid") {
    opacityKeyValue = makeKeyByStateDevice(v, "bgColorOpacity").reduce(
      normalKeyValue,
      []
    );
  } else {
    const opacityKeys = ["bgColorOpacity", "gradientColorOpacity"];
    opacityKeyValue = opacityKeys
      .reduce((a, k) => a.concat(makeKeyByStateDevice(v, k)), [])
      .reduce(normalKeyValue, []);
  }

  // Verify if media is less than 1
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
  const { bgVideo, bgVideoLoop, bgVideoStart, bgMapZoom, bgMapAddress } = value;
  const currentMedia = deviceStateValueByKey(value, "media");
  const { media, opacity } = getMediaProps(value);

  let props = {
    className,
    opacity,
    children,
    image: media && getImage(value),
    imageExtension: value.bgImageExtension,
    border: getBorder(value),
    boxShadow: getBoxShadow(value),
    parallax: getParallax(value, meta),
    shapeTop: validateKeyByProperty(value, "shapeTopType", "none"),
    shapeBottom: validateKeyByProperty(value, "shapeBottomType", "none")
  };

  if (currentMedia === "video") {
    props.video = media && videoData(bgVideo);
    props.bgVideoStart = bgVideoStart;
    props.bgVideoLoop = bgVideoLoop === "on";
  }

  if (currentMedia === "map") {
    props.map = media && bgMapAddress;
    props.mapZoom = bgMapZoom;
  }

  return <Background {...props} />;
}
