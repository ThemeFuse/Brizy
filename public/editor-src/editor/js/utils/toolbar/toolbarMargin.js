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
  devices = "all",
  disabled = false,
  position = 60,
  onChangeGrouped,
  onChangeUngrouped
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("margin"),
    type: "multiPicker",
    position,
    devices,
    disabled,
    picker: {
      id: dvk("marginType"),
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
      value: dvv("marginType")
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

export function toolbarMarginGrouped({
  v,
  device,
  state,
  marginType,
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    grouped: [
      {
        id: dvk("margin"),
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
          value: dvv("margin"),
          suffix: dvv("marginSuffix")
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, marginType, onChange },
            ...{ value, suffix }
          };
          return saveOnChanges(values);
        }
      }
    ]
  };
}

export function toolbarMarginUngrouped({ v, device, state, onChange }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    ungrouped: [
      {
        id: dvk("marginTop"),
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
          value: dvv("marginTop"),
          suffix: dvv("marginTopSuffix")
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
          value: defaultValueValue({
            v,
            key: "marginRight",
            device,
            state
          }),
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
        id: dvk("marginBottom"),
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
          value: dvv("marginBottom"),
          suffix: dvv("marginBottomSuffix")
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
