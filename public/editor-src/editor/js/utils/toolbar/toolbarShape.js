import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette, getShapes } from "visual/utils/options";
import { toolbarColor2, toolbarColorHexField2 } from "./toolbarColor";

export function toolbarShape({ v, device, devices = "all", state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shape"),
    label: t("Dividers"),
    type: "radioGroup",
    devices,
    choices: [
      {
        value: "top",
        icon: "nc-dividers-top"
      },
      {
        value: "bottom",
        icon: "nc-dividers-bottom"
      }
    ],
    value: dvv("shape")
  };
}

export function toolbarShapeTopType({ v, device, devices = "all", state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeTopType"),
    label: t("Type"),
    type: "select",
    devices,
    className: "brz-control__select-option--icon",
    choices: getShapes(),
    value: dvv("shapeTopType")
  };
}

export function toolbarShapeTopColor({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: shapeTopColorHex } = getOptionColorHexByPalette(
    dvv("shapeTopColorHex"),
    dvv("shapeTopColorPalette")
  );
  return {
    id: dvk("shapeTopColors"),
    type: "popover",
    size: "auto",
    label: t("Color"),
    title: t("Color"),
    devices,
    disabled,
    icon: {
      style: {
        backgroundColor: hexToRgba(
          shapeTopColorHex,
          dvv("shapeTopColorOpacity")
        )
      }
    },
    options: [
      toolbarColor2({
        v,
        device,
        prefix: "shapeTopColor",
        state,
        onChangeHex: [
          "onChangeColorHexAndOpacity",
          "onChangeColorHexAndOpacityPalette"
        ],
        onChangePalette: ["onChangeColorPalette", "onChangeColorPaletteOpacity"]
      }),
      {
        type: "grid",
        className: "brz-ed-grid__color-fileds",
        columns: [
          {
            width: 100,
            options: [
              toolbarColorHexField2({
                v,
                device,
                prefix: "shapeTopColor",
                state,
                onChange: [
                  "onChangeColorHexAndOpacity",
                  "onChangeColorHexAndOpacityPalette"
                ]
              })
            ]
          }
        ]
      }
    ]
  };
}

export function toolbarShapeTopHeight({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeTopHeight"),
    type: "slider",
    icon: "nc-height",
    devices,
    disabled,
    slider: {
      min: 0,
      max: dvv("shapeTopHeightSuffix") === "px" ? 500 : 100
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        },
        {
          title: "%",
          value: "%"
        }
      ]
    },
    value: {
      value: dvv("shapeTopHeight"),
      suffix: dvv("shapeTopHeightSuffix")
    },
    onChange: ({ value: shapeTopHeight, suffix: shapeTopHeightSuffix }) => ({
      [dvk("shapeTopHeight")]: shapeTopHeight,
      [dvk("shapeTopHeightSuffix")]: shapeTopHeightSuffix
    })
  };
}

export function toolbarShapeTopFlip({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeTopFlip"),
    label: t("Flip"),
    type: "checkGroup",
    disabled,
    devices,
    choices: [
      {
        value: "shapeTopHorizontal",
        icon: "nc-flip-horizontal"
      }
    ],
    value: {
      shapeTopHorizontal: dvv("shapeTopHorizontal") === "on"
    },
    onChange: ({ shapeTopHorizontal }) => {
      return {
        [dvk("shapeTopHorizontal")]: shapeTopHorizontal ? "on" : "off"
      };
    }
  };
}

export function toolbarShapeTopIndex({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeTopIndex"),
    type: "radioGroup",
    label: t("Arrangement"),
    disabled,
    devices,
    choices: [
      {
        value: "auto",
        icon: "nc-send-to-back"
      },
      {
        value: "10",
        icon: "nc-bring-to-top"
      }
    ],
    value: dvv("shapeTopIndex")
  };
}

export function toolbarShapeBottomType({ v, device, devices = "all", state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeBottomType"),
    label: t("Type"),
    type: "select",
    devices,
    className:
      "brz-control__select-option--icon brz-control__select-option--icon--bottom",
    choices: getShapes(),
    value: dvv("shapeBottomType")
  };
}

export function toolbarShapeBottomColor({
  v,
  device,
  devices = "all",
  disabled = false,
  state = "normal"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: shapeBottomColorHex } = getOptionColorHexByPalette(
    dvv("shapeBottomColorHex"),
    dvv("shapeBottomColorPalette")
  );
  return {
    id: dvk("shapeBottomColors"),
    type: "popover",
    size: "auto",
    label: t("Color"),
    title: t("Color"),
    devices,
    disabled,
    icon: {
      style: {
        backgroundColor: hexToRgba(
          shapeBottomColorHex,
          dvv("shapeBottomColorOpacity")
        )
      }
    },
    options: [
      toolbarColor2({
        v,
        device,
        prefix: "shapeBottomColor",
        state,
        onChangeHex: [
          "onChangeColorHexAndOpacity",
          "onChangeColorHexAndOpacityPalette"
        ],
        onChangePalette: ["onChangeColorPalette", "onChangeColorPaletteOpacity"]
      }),
      {
        type: "grid",
        className: "brz-ed-grid__color-fileds",
        columns: [
          {
            width: 100,
            options: [
              toolbarColorHexField2({
                v,
                device,
                prefix: "shapeBottomColor",
                state,
                onChange: [
                  "onChangeColorHexAndOpacity",
                  "onChangeColorHexAndOpacityPalette"
                ]
              })
            ]
          }
        ]
      }
    ]
  };
}

export function toolbarShapeBottomHeight({
  v,
  device,
  disabled = false,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeBottomHeight"),
    type: "slider",
    icon: "nc-height",
    disabled,
    devices,
    slider: {
      min: 0,
      max: dvv("shapeBottomHeightSuffix") === "px" ? 500 : 100
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        },
        {
          title: "%",
          value: "%"
        }
      ]
    },
    value: {
      value: dvv("shapeBottomHeight"),
      suffix: dvv("shapeBottomHeightSuffix")
    },
    onChange: ({
      value: shapeBottomHeight,
      suffix: shapeBottomHeightSuffix
    }) => ({
      [dvk("shapeBottomHeight")]: shapeBottomHeight,
      [dvk("shapeBottomHeightSuffix")]: shapeBottomHeightSuffix
    })
  };
}

export function toolbarShapeBottomFlip({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeBottomFlip"),
    label: t("Flip"),
    type: "checkGroup",
    devices,
    disabled,
    choices: [
      {
        value: "shapeBottomHorizontal",
        icon: "nc-flip-horizontal"
      }
    ],
    value: {
      shapeBottomHorizontal: dvv("shapeBottomHorizontal") === "on"
    },
    onChange: ({ shapeBottomHorizontal }) => {
      return {
        [dvk("shapeBottomHorizontal")]: shapeBottomHorizontal ? "on" : "off"
      };
    }
  };
}

export function toolbarShapeBottomIndex({
  v,
  device,
  devices = "all",
  disabled = false,
  state = "normal"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeBottomIndex"),
    type: "radioGroup",
    label: t("Arrangement"),
    devices,
    disabled,
    choices: [
      {
        value: "auto",
        icon: "nc-send-to-back"
      },
      {
        value: "10",
        icon: "nc-bring-to-top"
      }
    ],
    value: dvv("shapeBottomIndex")
  };
}
