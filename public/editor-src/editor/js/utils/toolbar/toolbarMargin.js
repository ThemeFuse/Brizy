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
  position = 60,
  marginType = "default",
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
        marginType,
        onChange: onChangeGrouped
      }),
      ...toolbarMarginUngrouped({
        v,
        device,
        state,
        marginType,
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

export function toolbarMarginUngrouped({
  v,
  device,
  state,
  marginType,
  onChange
}) {
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
      marginType === "topBottom"
        ? {}
        : {
            id: dvk("marginRight"),
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
              value: dvv("marginRight"),
              suffix: dvv("marginRightSuffix")
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
      marginType === "topBottom"
        ? {}
        : {
            id: dvk("marginLeft"),
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
              value: dvv("marginLeft"),
              suffix: dvv("marginLeftSuffix")
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
