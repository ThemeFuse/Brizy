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
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    picker: {
      id: dvk("borderRadiusType"),
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
      value: dvv("borderRadiusType")
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
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    grouped: [
      {
        id: dvk("borderRadius"),
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
          value: dvv("borderRadius")
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
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    ungrouped: [
      {
        id: dvk("borderTopLeftRadius"),
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
          value: dvv("borderTopLeftRadius")
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
        id: dvk("borderTopRightRadius"),
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
          value: dvv("borderTopRightRadius")
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
        id: dvk("borderBottomRightRadius"),
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
          value: dvv("borderBottomRightRadius")
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
        id: dvk("borderBottomLeftRadius"),
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
          value: dvv("borderBottomLeftRadius")
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
