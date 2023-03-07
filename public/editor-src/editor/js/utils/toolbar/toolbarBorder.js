import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { capByPrefix } from "visual/utils/string";

export function toolbarBorder2({
  v,
  device,
  state,
  states,
  onChangeStyle,
  onChangeHex,
  onChangePalette,
  devices = "all",
  prefix = "",
  showSelect = true,
  choices = [
    { title: t("None"), value: "" },
    { value: "solid", icon: "nc-solid" },
    { value: "dashed", icon: "nc-dashed" },
    { value: "dotted", icon: "nc-dotted" }
  ]
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");
  const color = capByPrefix(border, "color");
  const colorHex = capByPrefix(border, "colorHex");
  const colorOpacity = capByPrefix(border, "colorOpacity");
  const colorPalette = capByPrefix(border, "colorPalette");
  const style = capByPrefix(border, "style");
  const { hex } = getOptionColorHexByPalette(dvv(colorHex), dvv(colorPalette));

  return {
    devices,
    id: dvk(color),
    type: "colorPicker2",
    states,
    select: {
      show: showSelect,
      choices
    },
    value: {
      hex,
      opacity: dvv(colorOpacity),
      palette: dvv(colorPalette),
      select: dvv(style)
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
  states,
  onChange,
  devices = "all",
  prefix = ""
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");
  const colorHex = capByPrefix(border, "colorHex");
  const colorOpacity = capByPrefix(border, "colorOpacity");
  const colorPalette = capByPrefix(border, "colorPalette");
  const { hex } = getOptionColorHexByPalette(dvv(colorHex), dvv(colorPalette));

  return {
    devices,
    id: dvk(capByPrefix(border, "colorField")),
    type: "colorFields",
    states,
    value: {
      hex,
      opacity: dvv(colorOpacity)
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

export function toolbarBorderWidthOneField2({ devices = "all", prefix = "" }) {
  const border = capByPrefix(prefix, "border");
  const width = capByPrefix(border, "width");

  return {
    id: width,
    type: "number-dev",
    label: t("Size"),
    config: {
      min: 0,
      max: 360
    },
    devices: devices
  };
}

export function toolbarBorderWidthFourFields2({
  v,
  device,
  state,
  states,
  onChangeType,
  onChangeGrouped,
  onChangeUngrouped,
  devices = "all",
  prefix = ""
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");
  const width = capByPrefix(border, "width");
  const type = capByPrefix(width, "type");
  const topWidth = capByPrefix(border, "topWidth");
  const rightWidth = capByPrefix(border, "rightWidth");
  const bottomWidth = capByPrefix(border, "bottomWidth");
  const leftWidth = capByPrefix(border, "leftWidth");
  const widthKeys = {
    grouped: [width],
    ungrouped: [topWidth, rightWidth, bottomWidth, leftWidth]
  };

  return {
    devices,
    id: dvk(width),
    type: "multiInputPicker",
    states,
    label: dvv(type) === "grouped" && t("Size"),
    value: {
      type: dvv(type),
      grouped: [dvv(width)],
      ungrouped: [
        dvv(topWidth),
        dvv(rightWidth),
        dvv(bottomWidth),
        dvv(leftWidth)
      ]
    },
    onChange: ({ type, isChanged, isChangedIndex, ...others }) => {
      const valuesType = {
        ...{
          v,
          device,
          state,
          prefix,
          onChange: onChangeType
        },
        ...{ type }
      };

      const valuesValue = {
        ...{
          v,
          device,
          state,
          prefix,
          onChange: type === "grouped" ? onChangeGrouped : onChangeUngrouped
        },
        ...{
          current: widthKeys[type][isChangedIndex],
          value: others[type][isChangedIndex]
        }
      };

      return isChanged === "type"
        ? saveOnChanges(valuesType)
        : saveOnChanges(valuesValue);
    }
  };
}
