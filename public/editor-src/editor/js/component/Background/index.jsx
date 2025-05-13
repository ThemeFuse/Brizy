import React from "react";
import { useRender } from "visual/providers/RenderProvider";
import {
  deviceStateValueByKey,
  makeKeyByStateDevice,
  validateKeyByProperty
} from "visual/utils/onChange";
import { videoData } from "visual/utils/video";
import Background from "./Background";
import { setBgPopulationVars } from "./utils";

const toNormal =
  (v) =>
  (a = [], c) => {
    const cV = v[c];
    return cV !== null && cV !== undefined ? a.concat(cV) : a;
  };

const getMediaProps = (v) => {
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

  const media = opacityKeyValue.some((k) => k < 1);

  if (v.bgColorType === "none") {
    return {
      media,
      opacity: false
    };
  }

  // Verify if media is less than 1
  // Verify if opacity is greater than 0
  return {
    media,
    opacity: opacityKeyValue.some((k) => k > 0)
  };
};

const getImage = (v) =>
  deviceStateValueByKey(v, "bgImageSrc") ||
  deviceStateValueByKey(v, "bgPopulation");
const getBoxShadow = (v) => deviceStateValueByKey(v, "boxShadow");

const getBorder = (v) => {
  const currentKeys =
    v.borderWidthType === "grouped"
      ? ["borderWidth"]
      : [
          "borderTopWidth",
          "borderRightWidth",
          "borderBottomWidth",
          "borderLeftWidth"
        ];

  return currentKeys.some((key) => deviceStateValueByKey(v, key));
};

const getParallax = (v, meta = {}) => {
  const { bgAttachment, bgSize } = v;
  const { section } = meta;

  return (
    bgSize === "cover" &&
    bgAttachment &&
    bgAttachment === "animated" &&
    !section.isSlider
  );
};

const getMedia = (v) => {
  const normalKeyValue = toNormal(v);
  return makeKeyByStateDevice(v, "media").reduce(normalKeyValue, []);
};

const BackgroundContainer = ({ value, meta, children }) => {
  const { renderType } = useRender();

  const { media, opacity } = getMediaProps(value);

  let props = {
    opacity,
    renderContext: renderType,
    image: media && getImage(value),
    parallax: getParallax(value, meta),
    boxShadow: getBoxShadow(value),
    border: getBorder(value),
    shapeTop: validateKeyByProperty(value, "shapeTopType", "none"),
    shapeBottom: validateKeyByProperty(value, "shapeBottomType", "none"),
    ...(media && { style: setBgPopulationVars(value) })
  };
  const currentMedia = media && getMedia(value);

  if (media && currentMedia.includes("video")) {
    const { bgVideo, bgVideoLoop, bgVideoStart, bgVideoCustom, bgVideoType } =
      value;

    const isCustomVideo = bgVideoType === "bgVideoCustom";
    const isCustomUrl = bgVideoType === "url";

    const customVideo =
      (isCustomVideo && bgVideoCustom) || (isCustomUrl && bgVideo);

    props.video = videoData(bgVideo);
    props.videoStart = bgVideoStart;
    props.videoLoop = bgVideoLoop === "on";
    props.customVideo = customVideo;
    props.videoType = bgVideoType;
  }

  if (media && currentMedia.includes("map")) {
    const { bgMapZoom, bgMapAddress } = value;
    props.map = bgMapAddress;
    props.mapZoom = bgMapZoom;
  }

  if (media && currentMedia.includes("slideshow")) {
    const {
      slideshow,
      slideshowLoop,
      slideshowDuration,
      slideshowTransitionType,
      slideshowTransition,
      kenBurnsEffect
    } = value;

    props = {
      ...props,
      slideshow,
      slideshowLoop,
      slideshowDuration,
      slideshowTransitionType,
      slideshowTransition,
      kenBurnsEffect
    };
  }

  return <Background {...props}>{children}</Background>;
};

export default BackgroundContainer;
