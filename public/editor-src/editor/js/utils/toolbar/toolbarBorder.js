import { t } from "visual/utils/i18n";
import { capByPrefix } from "visual/utils/string";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBorder2({
  v,
  device,
  state,
  devices = "all",
  prefix = "border",
  showSelect = true,
  choices = [
    {
      title: t("None"),
      value: ""
    },
    {
      value: "solid",
      icon: "nc-solid"
    },
    {
      value: "dashed",
      icon: "nc-dashed"
    },
    {
      value: "dotted",
      icon: "nc-dotted"
    }
  ],
  onChangeStyle,
  onChangeHex,
  onChangePalette
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv(capByPrefix(prefix, "colorHex")),
    dvv(capByPrefix(prefix, "colorPalette"))
  );

  return {
    id: dvk(capByPrefix(prefix, "color")),
    type: "colorPicker2",
    devices,
    select: {
      show: showSelect,
      choices
    },
    value: {
      hex,
      opacity: dvv(capByPrefix(prefix, "colorOpacity")),
      palette: dvv(capByPrefix(prefix, "colorPalette")),
      select: dvv(capByPrefix(prefix, "style"))
    },
    onChange: ({
      hex,
      opacity,
      palette,
      select: borderStyle,
      isChanged,
      opacityDragEnd
    }) => {
      const valuesBorderColorStyle = {
        ...{
          v,
          device,
          state,
          prefix,
          onChange: onChangeStyle
        },
        ...{ borderStyle, isChanged }
      };

      const valuesBorderColorHex = {
        ...{
          v,
          device,
          state,
          prefix,
          onChange: onChangeHex
        },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };

      const valuesBorderColorPalette = {
        ...{
          v,
          device,
          state,
          prefix,
          onChange: onChangePalette
        },
        ...{ opacity, palette }
      };

      return isChanged === "select"
        ? saveOnChanges(valuesBorderColorStyle)
        : isChanged === "hex" || isChanged === "opacity"
        ? saveOnChanges(valuesBorderColorHex)
        : saveOnChanges(valuesBorderColorPalette);
    }
  };
}

export function toolbarBorderColorHexField2({
  v,
  device,
  state,
  devices = "all",
  prefix = "border",
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv(capByPrefix(prefix, "colorHex")),
    dvv(capByPrefix(prefix, "colorPalette"))
  );

  return {
    id: dvk(capByPrefix(prefix, "borderColorField")),
    type: "colorFields",
    devices,
    value: {
      hex,
      opacity: dvv(capByPrefix(prefix, "colorOpacity"))
    },
    onChange: ({ hex }) => {
      const values = {
        ...{ v, device, state, prefix, onChange },
        ...{ hex }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarBorderWidthOneField2({
  v,
  device,
  state,
  devices = "all",
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("borderWidth"),
    label: t("Size"),
    type: "inputNumber",
    devices,
    min: 0,
    max: 360,
    value: dvv("borderWidth"),
    onChange: value => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ value }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarBorderWidthFourFields2({
  v,
  device,
  state,
  devices = "all",
  onChangeType,
  onChangeGrouped,
  onChangeUngrouped
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const borderWidthKeys = {
    grouped: ["borderWidth"],
    ungrouped: [
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
      "borderLeftWidth"
    ]
  };

  return {
    id: dvk("borderWidth"),
    type: "multiInputPicker",
    label: dvv("borderWidthType") === "grouped" ? t("Size") : false,
    devices,
    value: {
      type: dvv("borderWidthType"),
      grouped: [dvv("borderWidth")],
      ungrouped: [
        dvv("borderTopWidth"),
        dvv("borderRightWidth"),
        dvv("borderBottomWidth"),
        dvv("borderLeftWidth")
      ]
    },
    onChange: ({ type, isChanged, isChangedIndex, ...others }) => {
      const valuesType = {
        ...{
          v,
          device,
          state,
          onChange: onChangeType
        },
        ...{ type }
      };

      const valuesValue = {
        ...{
          v,
          device,
          state,
          onChange: type === "grouped" ? onChangeGrouped : onChangeUngrouped
        },
        ...{
          current: borderWidthKeys[type][isChangedIndex],
          value: others[type][isChangedIndex]
        }
      };

      return isChanged === "type"
        ? saveOnChanges(valuesType)
        : saveOnChanges(valuesValue);
    }
  };
}
