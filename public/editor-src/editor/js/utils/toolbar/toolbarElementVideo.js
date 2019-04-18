import { t } from "visual/utils/i18n";

export function toolbarElementVideoLink({ v, population }) {
  return {
    id: "video",
    label: t("Link"),
    type: "input",
    placeholder: t("YouTube or Vimeo"),
    population: {
      show: population.length > 0,
      choices: population
    },
    value: {
      population: v.videoPopulation,
      value: v.video
    },
    onChange: ({ value: video, population: videoPopulation }) => ({
      videoPopulation,
      video
    })
  };
}

export function toolbarElementVideoRatio({ v }) {
  return {
    id: "ratio",
    label: t("Ratio"),
    type: "select",
    roles: ["admin"],
    choices: [
      {
        title: "16:9",
        value: "16:9"
      },
      {
        title: "4:3",
        value: "4:3"
      }
    ],
    value: v.ratio
  };
}

export function toolbarElementVideoControls({ v }) {
  return {
    id: "controls",
    label: t("Controls"),
    type: "switch",
    roles: ["admin"],
    value: v.controls
  };
}

export function toolbarElementVideoCover({ v }) {
  return {
    id: "cover",
    label: t("Cover"),
    type: "imageSetter",
    value: {
      width: v.coverImageWidth,
      height: v.coverImageHeight,
      src: v.coverImageSrc,
      x: v.coverPositionX,
      y: v.coverPositionY
    },
    onChange: ({ width, height, src, x, y }) => {
      return {
        coverImageWidth: width,
        coverImageHeight: height,
        coverImageSrc: src,
        coverPositionX: x,
        coverPositionY: y
      };
    }
  };
}

export function toolbarElementVideoCoverZoom({ v }) {
  return {
    id: "coverZoom",
    label: t("Zoom"),
    type: "slider",
    slider: {
      min: 100,
      max: 200
    },
    input: {
      show: true,
      min: 100,
      max: 200
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "%",
          value: "%"
        }
      ]
    },
    value: {
      value: v.coverZoom
    },
    onChange: ({ value: coverZoom }) => {
      return { coverZoom };
    }
  };
}

export function toolbarElementVideoPlaySize({ v }) {
  return {
    id: "iconSize",
    label: t("Play"),
    type: "slider",
    roles: ["admin"],
    slider: {
      min: 50,
      max: 200
    },
    input: {
      show: true,
      min: 50,
      max: 200
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        }
      ]
    },
    value: {
      value: v.iconSize
    },
    onChange: ({ value: iconSize }) => {
      return {
        iconSize,
        iconSizeWidth: iconSize,
        iconSizeHeight: iconSize
      };
    }
  };
}
