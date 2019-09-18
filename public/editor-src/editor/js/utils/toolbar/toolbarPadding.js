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
  devices = "all",
  position = 50,
  onChangeGrouped,
  onChangeUngrouped
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
          value: dvv("padding"),
          suffix: dvv("paddingSuffix")
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
          value: dvv("paddingTop"),
          suffix: dvv("paddingTopSuffix")
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
          value: dvv("paddingRight"),
          suffix: dvv("paddingRightSuffix")
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
          value: dvv("paddingBottom"),
          suffix: dvv("paddingBottomSuffix")
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
          value: dvv("paddingLeft"),
          suffix: dvv("paddingLeftSuffix")
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
