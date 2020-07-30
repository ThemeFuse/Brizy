import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarBorderRadius({
  v,
  device,
  devices = "all",
  state,
  onChangeGrouped,
  onChangeUngrouped,
  prefix = "",
  position = 60
}) {
  const borderRadiusType = capByPrefix(prefix, "borderRadiusType");

  return {
    type: "multiPicker",
    devices,
    position,
    picker: {
      id: borderRadiusType,
      label: t("Corner"),
      type: "radioGroup-dev",
      choices: [
        { value: "grouped", icon: "nc-corners-all" },
        { value: "ungrouped", icon: "nc-corners-individual" }
      ]
    },
    choices: {
      ...toolbarBorderRadiusGrouped({
        v,
        device,
        state,
        prefix,
        onChange: onChangeGrouped
      }),
      ...toolbarBorderRadiusUngrouped({
        v,
        device,
        state,
        prefix,
        onChange: onChangeUngrouped
      })
    }
  };
}

export function toolbarBorderRadiusGrouped({
  v,
  device,
  state,
  onChange,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const borderRadius = capByPrefix(prefix, "borderRadius");

  return {
    grouped: [
      {
        id: dvk(borderRadius),
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
          value: dvv(borderRadius)
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, prefix, onChange },
            ...{ value, sliderDragEnd }
          };
          return saveOnChanges(values);
        }
      }
    ]
  };
}

export function toolbarBorderRadiusUngrouped({
  v,
  device,
  state,
  onChange,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const borderTopLeftRadius = capByPrefix(prefix, "borderTopLeftRadius");
  const borderTopRightRadius = capByPrefix(prefix, "borderTopRightRadius");
  const borderBottomRightRadius = capByPrefix(
    prefix,
    "borderBottomRightRadius"
  );
  const borderBottomLeftRadius = capByPrefix(prefix, "borderBottomLeftRadius");

  return {
    ungrouped: [
      {
        id: dvk(borderTopLeftRadius),
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
          value: dvv(borderTopLeftRadius)
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, prefix, onChange },
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
        id: dvk(borderTopRightRadius),
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
          value: dvv(borderTopRightRadius)
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, prefix, onChange },
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
        id: dvk(borderBottomRightRadius),
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
          value: dvv(borderBottomRightRadius)
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, prefix, onChange },
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
        id: dvk(borderBottomLeftRadius),
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
          value: dvv(borderBottomLeftRadius)
        },
        onChange: ({ value }, { sliderDragEnd }) => {
          const values = {
            ...{ v, device, state, prefix, onChange },
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
