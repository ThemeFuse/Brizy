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
  const borderRadiusTypeKey = defaultValueKey({
    key: "borderRadiusType",
    device,
    state
  });
  const borderRadiusTypeValue = defaultValueValue({
    v,
    key: "borderRadiusType",
    device,
    state
  });

  return {
    type: "multiPicker",
    picker: {
      id: borderRadiusTypeKey,
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
      value: borderRadiusTypeValue
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
  const borderRadiusKey = defaultValueKey({
    key: "borderRadius",
    device,
    state
  });
  const borderRadiusValue = defaultValueValue({
    v,
    key: "borderRadius",
    device,
    state
  });

  return {
    grouped: [
      {
        id: borderRadiusKey,
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
          value: borderRadiusValue
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
  const borderTopLeftRadiusKey = defaultValueKey({
    key: "borderTopLeftRadius",
    device,
    state
  });
  const borderTopLeftRadiusValue = defaultValueValue({
    v,
    key: "borderTopLeftRadius",
    device,
    state
  });

  const borderTopRightRadiusKey = defaultValueKey({
    key: "borderTopRightRadius",
    device,
    state
  });
  const borderTopRightRadiusValue = defaultValueValue({
    v,
    key: "borderTopRightRadius",
    device,
    state
  });

  const borderBottomLeftRadiusKey = defaultValueKey({
    key: "borderBottomLeftRadius",
    device,
    state
  });
  const borderBottomLeftRadiusValue = defaultValueValue({
    v,
    key: "borderBottomLeftRadius",
    device,
    state
  });

  const borderBottomRightRadiusKey = defaultValueKey({
    key: "borderBottomRightRadius",
    device,
    state
  });
  const borderBottomRightRadiusValue = defaultValueValue({
    v,
    key: "borderBottomRightRadius",
    device,
    state
  });

  return {
    ungrouped: [
      {
        id: borderTopLeftRadiusKey,
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
          value: borderTopLeftRadiusValue
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
        id: borderTopRightRadiusKey,
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
          value: borderTopRightRadiusValue
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
        id: borderBottomRightRadiusKey,
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
          value: borderBottomRightRadiusValue
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
        id: borderBottomLeftRadiusKey,
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
          value: borderBottomLeftRadiusValue
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
