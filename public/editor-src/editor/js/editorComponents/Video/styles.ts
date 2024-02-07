import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./toolbar";

export function styleContent(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeMaxWidthSize"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover .brz-video-content": {
      standart: [
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBorderRadius",
        "cssStyleElementVideoBgColorPadding",
        "cssStyleElementVideoBgGradientPadding"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover .brz-iframe, &&:hover .brz-video__cover:before": {
      standart: ["cssStyleFilter"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover.brz-custom-video video": {
      standart: ["cssStyleFilter", "cssStylePaddingBG"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover .brz-iframe": {
      standart: ["cssStylePaddingBG"]
    },
    ".brz && .brz-video-content .brz-video-elem": {
      standart: ["cssStylePaddingBG"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleWrapper(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementVideoRatio"]
    },
    ".brz &&:hover .brz-video__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition",
        "cssStyleElementVideoBgSize",
        "cssStyleFilter",
        "cssStyleElementVideoCoverPaddingBG"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover .brz-video__cover .brz-video__cover-icon": {
      standart: [
        "cssStyleElementVideoIconFontSize",
        "cssStyleElementVideoIconWidth",
        "cssStyleElementVideoIconHeight",
        "cssStyleBgColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover .brz-video__cover .brz-video__cover-icon .brz-span": {
      standart: ["cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleCustomVideo(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz && > .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-current-time:hover":
      {
        standart: ["cssStyleVideoIconControls"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && > .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-total-time:hover":
      {
        standart: ["cssStyleVideoIconControls"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-custom-slider:hover:before": {
      standart: ["cssStyleBg2Color", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz && .brz-video-custom-slider:hover .brz-video-custom-progress": {
      standart: ["cssStyleBg2Color"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz && .brz-video-custom-video-controls:hover": {
      standart: ["cssStyleVideoControlsBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleControls(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementMediaPadding",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleIcon(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementVideoControlsIconFontSize",
        "cssStyleVideoIconControls"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
