import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  SizeType,
  isSizeType
} from "visual/global/Config/types/configs/common";
import { getColor } from "visual/utils/color";
import {
  OptionStyle,
  OptionStyleData,
  OutputOptionStyle,
  StyleCSSProperties
} from "visual/utils/cssStyle/types";
import { getImageUrl } from "visual/utils/image";
import { read as readString } from "visual/utils/reader/string";
import { BgPaddingFlags } from "./types";
import { getRatio, isRatio } from "./utils";

export const ratioCSS: OptionStyle<"select"> = ({
  value: { value: ratio }
}) => {
  if (isRatio(ratio)) {
    return {
      "{{WRAPPER}} .video-wrapper": {
        "aspect-ratio": getRatio(ratio)
      }
    };
  }
};

export const sizeCSS: OptionStyle<"slider"> = ({ value: { value, unit } }) => ({
  "{{WRAPPER}}": {
    "max-width": `${value}${unit}`
  }
});

export const playBgColorCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => ({
    "{{WRAPPER}}:hover .brz-video__cover .brz-video__cover-icon": {
      "background-color": getColor(palette, hex, opacity, config) ?? ""
    }
  });

export const sliderBgColorCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => ({
    "{{WRAPPER}} .brz-video-custom-slider:hover:before, {{WRAPPER}} .brz-video-custom-slider:hover .brz-video-custom-progress":
      {
        "background-color": getColor(palette, hex, opacity, config) ?? ""
      }
  });

export const iconSizeCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}} .video-wrapper .brz-video__cover .brz-video__cover-icon": {
    "font-size": `${Math.round(value * 0.35)}px`,
    width: `${value}${unit}`,
    height: `${value}${unit}`
  }
});

export const iconCustomSizeCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}} .brz-video-custom-play, {{WRAPPER}} .brz-video-custom-pause, {{WRAPPER}} .brz-video-custom-mute, {{WRAPPER}} .brz-video-custom-unmute, {{WRAPPER}} .brz-video-custom-fullscreen-icon":
    {
      "font-size": `${value}${unit}`
    }
});

export const barBgColorCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => ({
    "{{WRAPPER}} .brz-video-custom-video-controls:hover": {
      "background-color": getColor(palette, hex, opacity, config) ?? ""
    }
  });

export const coverImageCSS =
  (config: ConfigCommon): OptionStyle<"imageUpload"> =>
  ({ value: { src, sizeType, fileName, x, y } }) => {
    if (readString(src) && src !== "" && isSizeType(sizeType)) {
      return {
        "{{WRAPPER}} .video-wrapper .brz-video__cover::before": {
          "background-image": `url("${getImageUrl(
            {
              uid: src,
              fileName,
              sizeType
            },
            config
          )}")`,
          "background-position": `${x}% ${y}%`
        }
      };
    }
  };

export const coverZoomCSS: OptionStyle<"slider"> = ({ value: { value } }) => ({
  "{{WRAPPER}} .video-wrapper .brz-video__cover::before": {
    "background-size": `${value}%`
  }
});

export const bgPaddingCSS = (
  { isControlsEnabled, isCustomVideo }: BgPaddingFlags,
  {
    meta,
    value: {
      top,
      topUnit,
      right,
      rightUnit,
      bottom,
      bottomUnit,
      left,
      leftUnit
    }
  }: OptionStyleData<"padding">
): OutputOptionStyle => {
  const bottomMarginUngrouped =
    isControlsEnabled && isCustomVideo ? 0 : `${bottom}${bottomUnit}`;

  const bottomMarginGrouped = isControlsEnabled && isCustomVideo ? 0 : "";

  const padding = meta?.isNoEmptyGrouped
    ? `${top}${topUnit}`
    : `${top}${topUnit} ${right}${rightUnit} ${bottom}${bottomUnit} ${left}${leftUnit}`;

  const margin: StyleCSSProperties = meta?.isNoEmptyGrouped
    ? {
        margin: `${top}${topUnit}`,
        "margin-bottom": bottomMarginGrouped
      }
    : {
        margin: `${top}${topUnit} ${right}${rightUnit} ${bottomMarginUngrouped} ${left}${leftUnit};`
      };

  return {
    "{{WRAPPER}} .brz-iframe, {{WRAPPER}} .brz-video-content .brz-video-elem": {
      padding
    },
    "{{WRAPPER}} .video-wrapper .brz-video__cover::before": { ...margin }
  };
};

export const transitionCSS: OptionStyle<"slider"> = ({ value: { value } }) => ({
  "{{WRAPPER}} .brz-video-custom-play, {{WRAPPER}} .brz-video-custom-pause, {{WRAPPER}} .brz-video-custom-mute, {{WRAPPER}} .brz-video-custom-unmute, {{WRAPPER}} .brz-video-custom-fullscreen-icon, {{WRAPPER}} .brz-video-elem > .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-current-time, {{WRAPPER}} .brz-video-elem > .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-total-time, {{WRAPPER}} .brz-video-custom-slider:before, {{WRAPPER}} .brz-video-custom-slider .brz-video-custom-progress, {{WRAPPER}} .brz-video-custom-video-controls, {{WRAPPER}}.brz-video, {{WRAPPER}} .brz-video-content, {{WRAPPER}} .brz-iframe, &&:hover .brz-video__cover:before, {{WRAPPER}}.brz-custom-video video, {{WRAPPER}} .brz-video__cover::before, {{WRAPPER}} .brz-video__cover .brz-video__cover-icon, {{WRAPPER}} .brz-video__cover .brz-video__cover-icon .brz-span, {{WRAPPER}} .brz-media-caption":
    {
      "transition-duration": `0.${value}s`,
      "transition-property":
        "filter, color, background, border-color, box-shadow, transform;"
    }
});

export const maskImageUrlCSS =
  (config: ConfigCommon): OptionStyle<"imageUpload"> =>
  ({ value: { src, fileName, sizeType } }) => {
    const url = getImageUrl(
      {
        uid: src,
        fileName,
        sizeType: sizeType as SizeType
      },
      config
    );

    if (!url) return;
    return {
      "{{WRAPPER}}:hover .brz-video-content": {
        "-webkit-mask-image": `url(${url});`,
        "mask-image": `url(${url});`
      }
    };
  };

export const maskImageRepeatCSS: OptionStyle<"select"> = ({
  value: { value }
}) => ({
  "{{WRAPPER}}:hover .brz-video-content": {
    "-webkit-mask-repeat": value,
    "mask-repeat": value
  }
});

export const maskImageSizeCSS: OptionStyle<"select"> = ({
  value: { value }
}) => {
  switch (value) {
    case "contain":
    case "cover":
      return {
        "{{WRAPPER}}:hover .brz-video-content": {
          "-webkit-mask-size": value,
          "mask-size": value
        }
      };
  }
};

export const maskImageScaleCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}}:hover .brz-video-content": {
    "-webkit-mask-size": `${value}${unit};`,
    "mask-size": `${value}${unit};`
  }
});

export const maskImagePositionX: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => {
  return {
    "{{WRAPPER}}:hover .brz-video-content": {
      "-webkit-mask-position-x": `${value}${unit};`,
      "mask-position-x": `${value}${unit};`
    }
  };
};

export const maskImagePositionY: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => {
  return {
    "{{WRAPPER}}:hover .brz-video-content": {
      "-webkit-mask-position-y": `${value}${unit};`,
      "mask-position-y": `${value}${unit};`
    }
  };
};

export const maskImagePosition: OptionStyle<"select"> = ({
  value: { value }
}) => {
  switch (value) {
    case "center center":
    case "center left":
    case "center right":
    case "top center":
    case "top right":
    case "top left":
    case "bottom center":
    case "bottom left":
    case "bottom right":
      return {
        "{{WRAPPER}}:hover .brz-video-content": {
          "-webkit-mask-position": value,
          "mask-position": value
        }
      };
  }
};
