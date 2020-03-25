import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementContainerTypeAll({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("media"),
    label: t("Type"),
    type: "radioGroup",
    devices,
    choices: [
      {
        value: "image",
        icon: "nc-media-image"
      },
      {
        value: "video",
        icon: "nc-media-video"
      },
      {
        value: "map",
        icon: "nc-media-map"
      }
    ],
    value: dvv("media")
  };
}

export function toolbarElementContainerTypeImageMap({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("media"),
    label: t("Type"),
    type: "radioGroup",
    devices,
    choices: [
      {
        value: "image",
        icon: "nc-media-image"
      },
      {
        value: "map",
        icon: "nc-media-map"
      }
    ],
    value: dvv("media") === "video" ? "image" : dvv("media")
  };
}

export function toolbarElementContainerType({
  v,
  device,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    type: "multiPicker",
    position: 10,
    devices,
    picker: {
      id: dvk("containerType"),
      label: t("Width"),
      type: "select",
      choices: [
        {
          title: t("Boxed"),
          value: "boxed"
        },
        {
          title: t("Full"),
          value: "fullWidth"
        }
      ],
      value: dvv("containerType")
    },
    choices: {
      boxed: [
        {
          id: dvk("containerSize"),
          type: "slider",
          slider: {
            min: 35,
            max: 100
          },
          input: {
            show: true,
            min: 35,
            max: 100
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
            value: dvv("containerSize")
          },
          onChange: ({ value: containerSize }) => ({
            [dvk("containerSize")]: containerSize
          })
        }
      ]
    }
  };
}

export function toolbarElementContainerTypeResponsive({
  v,
  device,
  position = 10,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ v, key, device, state });

  return {
    id: dvk("containerSize"),
    type: "slider",
    label: t("Width"),
    position,
    devices,
    slider: {
      min: 35,
      max: 100
    },
    input: {
      show: true,
      min: 35,
      max: 100
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
      value: dvv("containerSize")
    },
    onChange: ({ value: containerSize }) => ({
      [dvk("containerSize")]: containerSize
    })
  };
}
