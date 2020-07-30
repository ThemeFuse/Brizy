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
  marginType,
  onChangeGrouped,
  onChangeUngrouped
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: "margin",
    type: "group-dev",
    position,
    devices,
    disabled,
    options: [
      {
        id: "marginType",
        label: t("Margin"),
        type: "radioGroup-dev",
        choices: [
          { value: "grouped", icon: "nc-styling-all" },
          { value: "ungrouped", icon: "nc-styling-individual" }
        ]
      },
      {
        id: dvk("margin"),
        type: "slider",
        disabled: dvv("marginType") !== "grouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("margin"),
          suffix: dvv("marginSuffix")
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, marginType, onChange: onChangeGrouped },
            ...{ value, suffix }
          };
          return saveOnChanges(values);
        }
      },
      {
        id: dvk("marginTop"),
        icon: "nc-styling-top",
        type: "slider",
        disabled: dvv("marginType") !== "ungrouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("marginTop"),
          suffix: dvv("marginTopSuffix")
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange: onChangeUngrouped },
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
        id: dvk("marginRight"),
        icon: "nc-styling-right",
        type: "slider",
        disabled: dvv("marginType") !== "ungrouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("marginRight"),
          suffix: dvv("marginRightSuffix")
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange: onChangeUngrouped },
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
        disabled: dvv("marginType") !== "ungrouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("marginBottom"),
          suffix: dvv("marginBottomSuffix")
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange: onChangeUngrouped },
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
        id: dvk("marginLeft"),
        icon: "nc-styling-left",
        type: "slider",
        disabled: dvv("marginType") !== "ungrouped",
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
            { title: "px", value: "px" },
            { title: "%", value: "%" }
          ]
        },
        value: {
          value: dvv("marginLeft"),
          suffix: dvv("marginLeftSuffix")
        },
        onChange: ({ value, suffix }) => {
          const values = {
            ...{ v, device, state, onChange: onChangeUngrouped },
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
