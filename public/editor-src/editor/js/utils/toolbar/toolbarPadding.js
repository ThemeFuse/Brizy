import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarPaddingFourFields({
  v,
  device,
  state,
  devices,
  position,
  prefix = "",
  disabled = false
}) {
  return toolbarPadding({
    v,
    device,
    state,
    devices,
    position,
    prefix,
    disabled
  });
}

export function toolbarPaddingFourFieldsPxSuffix({
  v,
  device,
  state,
  devices,
  position,
  prefix = "",
  disabled = false
}) {
  return toolbarPadding({
    v,
    device,
    state,
    devices,
    position,
    prefix,
    disabled,
    suffixChoices: [{ title: "px", value: "px" }]
  });
}

function toolbarPadding({
  v,
  device,
  state,
  prefix = "",
  devices = "all",
  disabled = false,
  position = 50,
  childs = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
  suffixChoices = [
    { title: "px", value: "px" },
    { title: "%", value: "%" }
  ]
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const padding = capByPrefix(prefix, "padding");
  const paddingType = capByPrefix(padding, "type");

  return {
    id: padding,
    type: "group-dev",
    devices,
    position,
    disabled,
    options: [
      {
        id: paddingType,
        label: t("Padding"),
        type: "radioGroup-dev",
        choices: [
          { value: "grouped", icon: "nc-styling-all" },
          { value: "ungrouped", icon: "nc-styling-individual" }
        ]
      },
      toolbarPaddingGrouped({
        v,
        device,
        state,
        childs,
        suffixChoices,
        prefix,
        disabled: dvv(paddingType) !== "grouped",
        onChange: ["onChangePaddingGrouped"]
      }),
      ...toolbarPaddingUngrouped({
        v,
        device,
        state,
        childs,
        suffixChoices,
        prefix,
        disabled: dvv(paddingType) !== "ungrouped",
        onChange: ["onChangePaddingUngrouped"]
      })
    ]
  };
}

function toolbarPaddingGrouped({
  v,
  device,
  state,
  childs,
  suffixChoices,
  onChange,
  disabled = false,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const padding = capByPrefix(prefix, "padding");
  const paddingSuffix = capByPrefix(padding, "suffix");

  return {
    id: dvk(padding),
    type: "slider",
    disabled,
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
      choices: suffixChoices
    },
    value: {
      value: dvv(padding),
      suffix: dvv(paddingSuffix)
    },
    onChange: ({ value, suffix }, { sliderDragEnd }) => {
      const values = {
        ...{ v, device, state, childs, onChange, prefix },
        ...{ value, suffix, sliderDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}

function toolbarPaddingUngrouped({
  v,
  device,
  state,
  childs,
  suffixChoices,
  onChange,
  disabled = false,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const paddingTop = capByPrefix(prefix, "paddingTop");
  const paddingTopSuffix = capByPrefix(paddingTop, "suffix");
  const paddingRight = capByPrefix(prefix, "paddingRight");
  const paddingRightSuffix = capByPrefix(paddingRight, "suffix");
  const paddingBottom = capByPrefix(prefix, "paddingBottom");
  const paddingBottomSuffix = capByPrefix(paddingBottom, "suffix");
  const paddingLeft = capByPrefix(prefix, "paddingLeft");
  const paddingLeftSuffix = capByPrefix(paddingLeft, "suffix");

  return [
    {
      id: dvk(paddingTop),
      icon: "nc-styling-top",
      type: "slider",
      disabled,
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
        choices: suffixChoices
      },
      value: {
        value: dvv(paddingTop),
        suffix: dvv(paddingTopSuffix)
      },
      onChange: ({ value, suffix }, { sliderDragEnd }) => {
        const values = {
          ...{ v, device, state, childs, onChange, prefix },
          ...{
            current: "paddingTop",
            value,
            suffix,
            sliderDragEnd
          }
        };
        return saveOnChanges(values);
      }
    },
    childs.includes("paddingRight")
      ? {
          id: dvk(paddingRight),
          icon: "nc-styling-right",
          type: "slider",
          disabled,
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
            choices: suffixChoices
          },
          value: {
            value: dvv(paddingRight),
            suffix: dvv(paddingRightSuffix)
          },
          onChange: ({ value, suffix }, { sliderDragEnd }) => {
            const values = {
              ...{ v, device, state, childs, onChange, prefix },
              ...{
                current: "paddingRight",
                value,
                suffix,
                sliderDragEnd
              }
            };
            return saveOnChanges(values);
          }
        }
      : {},
    {
      id: dvk(paddingBottom),
      icon: "nc-styling-bottom",
      type: "slider",
      disabled,
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
        choices: suffixChoices
      },
      value: {
        value: dvv(paddingBottom),
        suffix: dvv(paddingBottomSuffix)
      },
      onChange: ({ value, suffix }, { sliderDragEnd }) => {
        const values = {
          ...{ v, device, state, childs, onChange, prefix },
          ...{
            current: "paddingBottom",
            value,
            suffix,
            sliderDragEnd
          }
        };
        return saveOnChanges(values);
      }
    },
    childs.includes("paddingLeft")
      ? {
          id: dvk(paddingLeft),
          icon: "nc-styling-left",
          type: "slider",
          disabled,
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
            choices: suffixChoices
          },
          value: {
            value: dvv(paddingLeft),
            suffix: dvv(paddingLeftSuffix)
          },
          onChange: ({ value, suffix }, { sliderDragEnd }) => {
            const values = {
              ...{ v, device, state, childs, onChange, prefix },
              ...{
                current: "paddingLeft",
                value,
                suffix,
                sliderDragEnd
              }
            };
            return saveOnChanges(values);
          }
        }
      : {}
  ];
}
