import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarPaddingFourFields({
  v,
  device,
  state,
  devices,
  position
}) {
  return toolbarPadding({
    v,
    device,
    state,
    devices,
    position
  });
}

export function toolbarPaddingFourFieldsPxSuffix({
  v,
  device,
  state,
  devices,
  position
}) {
  return toolbarPadding({
    v,
    device,
    state,
    devices,
    position,
    suffixChoices: [
      {
        title: "px",
        value: "px"
      }
    ]
  });
}

function toolbarPadding({
  v,
  device,
  state,
  devices = "all",
  position = 50,
  childs = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
  suffixChoices = [
    {
      title: "px",
      value: "px"
    },
    {
      title: "%",
      value: "%"
    }
  ]
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("padding"),
    type: "multiPicker",
    devices,
    position,
    picker: {
      id: dvk("paddingType"),
      label: t("Padding"),
      type: "radioGroup",
      choices: [
        {
          value: "grouped",
          icon: "nc-styling-all"
        },
        {
          value: "ungrouped",
          icon: "nc-styling-individual"
        }
      ],
      value: dvv("paddingType")
    },
    choices: {
      ...toolbarPaddingGrouped({
        v,
        device,
        state,
        childs,
        suffixChoices,
        onChange: ["onChangePaddingGrouped"]
      }),
      ...toolbarPaddingUngrouped({
        v,
        device,
        state,
        childs,
        suffixChoices,
        onChange: ["onChangePaddingUngrouped"]
      })
    }
  };
}

function toolbarPaddingGrouped({
  v,
  device,
  state,
  childs,
  suffixChoices,
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    grouped: [
      {
        id: dvk("padding"),
        type: "slider",
        slider: {
          min: 0,
          max: 100
        },
        input: {
          show: true,
          min: 0
        },
        suffix: {
          show: true,
          choices: suffixChoices
        },
        value: {
          value: dvv("padding"),
          suffix: dvv("paddingSuffix")
        },
        onChange: ({ value, suffix }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, childs, onChange },
            ...{ value, suffix, sliderDragEnd }
          };
          return saveOnChanges(values);
        }
      }
    ]
  };
}

function toolbarPaddingUngrouped({
  v,
  device,
  state,
  childs,
  suffixChoices,
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    ungrouped: [
      {
        id: dvk("paddingTop"),
        icon: "nc-styling-top",
        type: "slider",
        slider: {
          min: 0,
          max: 100
        },
        input: {
          show: true,
          min: 0
        },
        suffix: {
          show: true,
          choices: suffixChoices
        },
        value: {
          value: dvv("paddingTop"),
          suffix: dvv("paddingTopSuffix")
        },
        onChange: ({ value, suffix }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, childs, onChange },
            ...{
              current: "paddingTop",
              value,
              suffix,
              sliderDragEnd
            }
          };
          return saveOnChanges(values);
        }
      },
      childs.includes("paddingRight")
        ? {
            id: dvk("paddingRight"),
            icon: "nc-styling-right",
            type: "slider",
            slider: {
              min: 0,
              max: 100
            },
            input: {
              show: true,
              min: 0
            },
            suffix: {
              show: true,
              choices: suffixChoices
            },
            value: {
              value: dvv("paddingRight"),
              suffix: dvv("paddingRightSuffix")
            },
            onChange: ({ value, suffix }, { sliderDragEnd }) => {
              const values = {
                ...{ v, device, state, childs, onChange },
                ...{
                  current: "paddingRight",
                  value,
                  suffix,
                  sliderDragEnd
                }
              };
              return saveOnChanges(values);
            }
          }
        : {},
      {
        id: dvk("paddingBottom"),
        icon: "nc-styling-bottom",
        type: "slider",
        slider: {
          min: 0,
          max: 100
        },
        input: {
          show: true,
          min: 0
        },
        suffix: {
          show: true,
          choices: suffixChoices
        },
        value: {
          value: dvv("paddingBottom"),
          suffix: dvv("paddingBottomSuffix")
        },
        onChange: ({ value, suffix }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, childs, onChange },
            ...{
              current: "paddingBottom",
              value,
              suffix,
              sliderDragEnd
            }
          };
          return saveOnChanges(values);
        }
      },
      childs.includes("paddingLeft")
        ? {
            id: dvk("paddingLeft"),
            icon: "nc-styling-left",
            type: "slider",
            slider: {
              min: 0,
              max: 100
            },
            input: {
              show: true,
              min: 0
            },
            suffix: {
              show: true,
              choices: suffixChoices
            },
            value: {
              value: dvv("paddingLeft"),
              suffix: dvv("paddingLeftSuffix")
            },
            onChange: ({ value, suffix }, { sliderDragEnd }) => {
              const values = {
                ...{ v, device, state, childs, onChange },
                ...{
                  current: "paddingLeft",
                  value,
                  suffix,
                  sliderDragEnd
                }
              };
              return saveOnChanges(values);
            }
          }
        : {}
    ]
  };
}
