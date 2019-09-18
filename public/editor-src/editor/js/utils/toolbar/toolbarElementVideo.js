import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementVideoLink({
  v,
  device,
  devices = "all",
  state,
  population
}) {
  return {
    id: defaultValueKey({ key: "video", device, state }),
    label: t("Link"),
    type: "input",
    devices,
    placeholder: t("YouTube or Vimeo"),
    population: {
      show: population.length > 0,
      choices: population
    },
    value: {
      population: defaultValueValue({
        v,
        key: "videoPopulation",
        device,
        state
      }),
      value: defaultValueValue({ v, key: "video", device, state })
    },
    onChange: ({ value, population }) => ({
      [defaultValueKey({
        v,
        key: "videoPopulation",
        device,
        state
      })]: population,
      [defaultValueKey({ v, key: "video", device, state })]: value
    })
  };
}

export function toolbarElementVideoRatio({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "ratio", device, state }),
    devices,
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
    value: defaultValueValue({ v, key: "ratio", device, state })
  };
}

export function toolbarElementVideoControls({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "controls", device, state }),
    label: t("Controls"),
    devices,
    type: "switch",
    roles: ["admin"],
    value: defaultValueValue({ v, key: "controls", device, state })
  };
}

export function toolbarElementVideoCover({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "cover", device, state }),
    devices,
    label: t("Cover"),
    type: "imageSetter",
    value: {
      width: defaultValueValue({ v, key: "coverImageWidth", device, state }),
      height: defaultValueValue({ v, key: "coverImageHeight", device, state }),
      src: defaultValueValue({ v, key: "coverImageSrc", device, state }),
      x: defaultValueValue({ v, key: "coverPositionX", device, state }),
      y: defaultValueValue({ v, key: "coverPositionY", device, state })
    },
    onChange: ({ width, height, src, x, y }) => {
      return {
        [defaultValueKey({ v, key: "coverImageWidth", device, state })]: width,
        [defaultValueKey({
          v,
          key: "coverImageHeight",
          device,
          state
        })]: height,
        [defaultValueKey({ v, key: "coverImageSrc", device, state })]: src,
        [defaultValueKey({ v, key: "coverPositionX", device, state })]: x,
        [defaultValueKey({ v, key: "coverPositionY", device, state })]: y
      };
    }
  };
}

export function toolbarElementVideoCoverZoom({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "coverZoom", device, state }),
    label: t("Zoom"),
    type: "slider",
    devices,
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
      value: defaultValueValue({
        v,
        key: "coverZoom",
        device,
        state
      })
    },
    onChange: ({ value }) => {
      return {
        [defaultValueKey({ v, key: "coverZoom", device, state })]: value
      };
    }
  };
}

export function toolbarElementVideoPlaySize({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "iconSize", device, state }),
    label: t("Play"),
    type: "slider",
    devices,
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
      value: defaultValueValue({
        v,
        key: "iconSize",
        device,
        state
      })
    },
    onChange: ({ value }) => {
      return {
        [defaultValueKey({ v, key: "iconSize", device, state })]: value,
        [defaultValueKey({ v, key: "iconSizeWidth", device, state })]: value,
        [defaultValueKey({ v, key: "iconSizeHeight", device, state })]: value
      };
    }
  };
}

