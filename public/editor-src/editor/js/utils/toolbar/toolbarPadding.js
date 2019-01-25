import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarPadding({
  v,
  device,
  state,
  position = 50,
  onChangeGrouped,
  onChangeUngrouped
}) {
  return {
    id: "padding",
    type: "multiPicker",
    position,
    picker: {
      id: defaultValueKey({ key: "paddingType", device, state }),
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
      value: defaultValueValue({ v, key: "paddingType", device, state })
    },
    choices: {
      ...toolbarPaddingGrouped({
        v,
        device,
        state,
        onChange: onChangeGrouped
      }),
      ...toolbarPaddingUngrouped({
        v,
        device,
        state,
        onChange: onChangeUngrouped
      })
    }
  };
}

export function toolbarPaddingGrouped({ v, device, state, onChange }) {
  return {
    grouped: [
      {
        id: defaultValueKey({ key: "padding", device, state }),
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
          value: defaultValueValue({ v, key: "padding", device, state }),
          suffix: defaultValueValue({ v, key: "paddingSuffix", device, state })
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{ value, suffix }
          };
          return saveOnChanges(values);
        }
      }
    ]
  };
}

export function toolbarPaddingUngrouped({ v, device, state, onChange }) {
  return {
    ungrouped: [
      {
        id: defaultValueKey({ key: "paddingTop", device, state }),
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
          value: defaultValueValue({ v, key: "paddingTop", device, state }),
          suffix: defaultValueValue({
            v,
            key: "paddingTopSuffix",
            device,
            state
          })
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "paddingTop",
              value,
              suffix
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "paddingRight", device, state }),
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
          value: defaultValueValue({ v, key: "paddingRight", device, state }),
          suffix: defaultValueValue({
            v,
            key: "paddingRightSuffix",
            device,
            state
          })
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "paddingRight",
              value,
              suffix
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "paddingBottom", device, state }),
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
          value: defaultValueValue({ v, key: "paddingBottom", device, state }),
          suffix: defaultValueValue({
            v,
            key: "paddingBottomSuffix",
            device,
            state
          })
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "paddingBottom",
              value,
              suffix
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "paddingLeft", device, state }),
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
          value: defaultValueValue({ v, key: "paddingLeft", device, state }),
          suffix: defaultValueValue({
            v,
            key: "paddingLeftSuffix",
            device,
            state
          })
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "paddingLeft",
              value,
              suffix
            }
          };
          return saveOnChanges(values);
        }
      }
    ]
  };
}
