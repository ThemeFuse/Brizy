import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBorderWidth({
  v,
  device,
  state,
  onChangeGrouped,
  onChangeUngrouped
}) {
  return {
    type: "multiPicker",
    /*disabled:
      defaultValueValue({ v, key: "borderStyle", device, state }) === ""
        ? true
        : false,*/
    picker: {
      id: defaultValueKey({ key: "borderWidthType", device, state }),
      label: t("Border"),
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
      value: defaultValueValue({ v, key: "borderWidthType", device, state })
    },
    choices: {
      ...toolbarBorderWidthGrouped({
        v,
        device,
        state,
        onChange: onChangeGrouped
      }),
      ...toolbarBorderWidthUngrouped({
        v,
        device,
        state,
        onChange: onChangeUngrouped
      })
    }
  };
}

export function toolbarBorderWidthGrouped({ v, device, state, onChange }) {
  return {
    grouped: [
      {
        id: defaultValueKey({ key: "borderWidth", device, state }),
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
            }
          ]
        },
        value: {
          value: defaultValueValue({ v, key: "borderWidth", device, state })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange: onChange },
            ...{ value, sliderDragEnd }
          };
          return saveOnChanges(values);
        }
      }
    ]
  };
}

export function toolbarBorderWidthUngrouped({ v, device, state, onChange }) {
  return {
    ungrouped: [
      {
        id: defaultValueKey({ key: "borderTopWidth", device, state }),
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
            }
          ]
        },
        value: {
          value: defaultValueValue({ v, key: "borderTopWidth", device, state })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "borderTopWidth",
              value,
              sliderDragEnd
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "borderRightWidth", device, state }),
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
            }
          ]
        },
        value: {
          value: defaultValueValue({
            v,
            key: "borderRightWidth",
            device,
            state
          })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "borderRightWidth",
              value,
              sliderDragEnd
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "borderBottomWidth", device, state }),
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
            }
          ]
        },
        value: {
          value: defaultValueValue({
            v,
            key: "borderBottomWidth",
            device,
            state
          })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "borderBottomWidth",
              value,
              sliderDragEnd
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "borderLeftWidth", device, state }),
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
            }
          ]
        },
        value: {
          value: defaultValueValue({
            v,
            key: "borderLeftWidth",
            device,
            state
          })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "borderLeftWidth",
              value,
              sliderDragEnd
            }
          };
          return saveOnChanges(values);
        }
      }
    ]
  };
}
