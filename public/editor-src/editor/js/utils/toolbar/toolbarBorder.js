import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

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
