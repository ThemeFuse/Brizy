import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBorderRadius({
  v,
  device,
  state,
  onChangeGrouped,
  onChangeUngrouped
}) {
  return {
    type: "multiPicker",
    picker: {
      id: defaultValueKey({ key: "borderRadiusType", device, state }),
      label: t("Corner"),
      type: "radioGroup",
      choices: [
        {
          value: "grouped",
          icon: "nc-corners-all"
        },
        {
          value: "ungrouped",
          icon: "nc-corners-individual"
        }
      ],
      value: defaultValueValue({ v, key: "borderRadiusType", device, state })
    },
    choices: {
      ...toolbarBorderRadiusGrouped({
        v,
        device,
        state,
        onChange: onChangeGrouped
      }),
      ...toolbarBorderRadiusUngrouped({
        v,
        device,
        state,
        onChange: onChangeUngrouped
      })
    }
  };
}

export function toolbarBorderRadiusGrouped({ v, device, state, onChange }) {
  return {
    grouped: [
      {
        id: defaultValueKey({ key: "borderRadius", device, state }),
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
          value: defaultValueValue({ v, key: "borderRadius", device, state })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{ value, sliderDragEnd }
          };
          return saveOnChanges(values);
        }
      }
    ]
  };
}

export function toolbarBorderRadiusUngrouped({ v, device, state, onChange }) {
  return {
    ungrouped: [
      {
        id: defaultValueKey({ key: "borderTopLeftRadius", device, state }),
        icon: "nc-corners-top-left",
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
            key: "borderTopLeftRadius",
            device,
            state
          })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "borderTopLeftRadius",
              value,
              sliderDragEnd
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "borderTopRightRadius", device, state }),
        icon: "nc-corners-top-right",
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
            key: "borderTopRightRadius",
            device,
            state
          })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "borderTopRightRadius",
              value,
              sliderDragEnd
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "borderBottomRightRadius", device, state }),
        icon: "nc-corners-bottom-right",
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
            key: "borderBottomRightRadius",
            device,
            state
          })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "borderBottomRightRadius",
              value,
              sliderDragEnd
            }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: defaultValueKey({ key: "borderBottomLeftRadius", device, state }),
        icon: "nc-corners-bottom-left",
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
            key: "borderBottomLeftRadius",
            device,
            state
          })
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, onChange },
            ...{
              current: "borderBottomLeftRadius",
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
