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
  const borderWidthTypeKey = defaultValueKey({
    key: "borderWidthType",
    device,
    state
  });
  const borderWidthTypeValue = defaultValueValue({
    v,
    key: "borderWidthType",
    device,
    state
  });

  return {
    type: "multiPicker",
    /*disabled:
      defaultValueValue({ v, key: "borderStyle", device, state }) === ""
        ? true
        : false,*/
    picker: {
      id: borderWidthTypeKey,
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
      value: borderWidthTypeValue
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
  const borderWidthKey = defaultValueKey({ key: "borderWidth", device, state });
  const borderWidthValue = defaultValueValue({
    v,
    key: "borderWidth",
    device,
    state
  });

  return {
    grouped: [
      {
        id: borderWidthKey,
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
          value: borderWidthValue
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
  const borderTopWidthKey = defaultValueKey({
    key: "borderTopWidth",
    device,
    state
  });
  const borderTopWidthValue = defaultValueValue({
    v,
    key: "borderTopWidth",
    device,
    state
  });

  const borderRightWidthKey = defaultValueKey({
    key: "borderRightWidth",
    device,
    state
  });
  const borderRightWidthValue = defaultValueValue({
    v,
    key: "borderRightWidth",
    device,
    state
  });

  const borderBottomWidthKey = defaultValueKey({
    key: "borderBottomWidth",
    device,
    state
  });
  const borderBottomWidthValue = defaultValueValue({
    v,
    key: "borderBottomWidth",
    device,
    state
  });

  const borderLeftWidthKey = defaultValueKey({
    key: "borderLeftWidth",
    device,
    state
  });
  const borderLeftWidthValue = defaultValueValue({
    v,
    key: "borderLeftWidth",
    device,
    state
  });

  return {
    ungrouped: [
      {
        id: borderTopWidthKey,
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
          value: borderTopWidthValue
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
        id: borderRightWidthKey,
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
          value: borderRightWidthValue
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
        id: borderBottomWidthKey,
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
          value: borderBottomWidthValue
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
        id: borderLeftWidthKey,
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
          value: borderLeftWidthValue
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

export function toolbarBorderWidthBorderColorPicker({
  v,
  device,
  state,
  onChange
}) {
  const borderWidthKey = defaultValueKey({
    key: "borderWidth",
    device,
    state
  });
  const borderWidthValue = defaultValueValue({
    v,
    key: "borderWidth",
    device,
    state
  });

  return {
    id: borderWidthKey,
    label: t("Size"),
    type: "inputNumber",
    min: 0,
    max: 360,
    value: borderWidthValue,
    onChange: value => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ value }
      };
      return saveOnChanges(values);
    }
  };
}
