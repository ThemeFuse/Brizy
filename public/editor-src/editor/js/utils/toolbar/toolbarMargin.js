import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarMargin({
  v,
  device,
  state,
  position = 60,
  onChangeGrouped,
  onChangeUngrouped
}) {
  return {
    id: "margin",
    type: "multiPicker",
    position,
    picker: {
      id: defaultValueKey({ key: "marginType", device, state }),
      label: t("Margin"),
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
      value: defaultValueValue({ v, key: "marginType", device, state })
    },
    choices: {
      ...toolbarMarginGrouped({
        v,
        device,
        state,
        onChange: onChangeGrouped
      }),
      ...toolbarMarginUngrouped({
        v,
        device,
        state,
        onChange: onChangeUngrouped
      })
    }
  };
}

export function toolbarMarginGrouped({ v, device, state, onChange }) {
  return {
    grouped: [
      {
        id: defaultValueKey({ key: "margin", device, state }),
        type: "slider",
        slider: {
          min: -100,
          max: 100
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
          value: defaultValueValue({ v, key: "margin", device, state }),
          suffix: defaultValueValue({ v, key: "marginSuffix", device, state })
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

export function toolbarMarginUngrouped({ v, device, state, onChange }) {
  return {
    ungrouped: [
      {
        id: defaultValueKey({ key: "marginTop", device, state }),
        icon: "nc-styling-top",
        type: "slider",
        slider: {
          min: -100,
          max: 100
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
          value: defaultValueValue({ v, key: "marginTop", device, state }),
          suffix: defaultValueValue({
            v,
            key: "marginTopSuffix",
            device,
            state
          })
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "marginTop",
              value,
              suffix
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "marginRight", device, state }),
        icon: "nc-styling-right",
        type: "slider",
        slider: {
          min: -100,
          max: 100
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
          value: defaultValueValue({ v, key: "marginRight", device, state }),
          suffix: defaultValueValue({
            v,
            key: "marginRightSuffix",
            device,
            state
          })
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "marginRight",
              value,
              suffix
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "marginBottom", device, state }),
        icon: "nc-styling-bottom",
        type: "slider",
        slider: {
          min: -100,
          max: 100
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
          value: defaultValueValue({ v, key: "marginBottom", device, state }),
          suffix: defaultValueValue({
            v,
            key: "marginBottomSuffix",
            device,
            state
          })
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "marginBottom",
              value,
              suffix
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "marginLeft", device, state }),
        icon: "nc-styling-left",
        type: "slider",
        slider: {
          min: -100,
          max: 100
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
          value: defaultValueValue({ v, key: "marginLeft", device, state }),
          suffix: defaultValueValue({
            v,
            key: "marginLeftSuffix",
            device,
            state
          })
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "marginLeft",
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
