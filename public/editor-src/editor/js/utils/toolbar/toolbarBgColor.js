import { t } from "visual/utils/i18n";
import { capByPrefix } from "visual/utils/string";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBgColor2({
  v,
  device,
  state,
  devices = "all",
  disabled = false,
  prefix = "bg",
  showSelect = true,
  onChangeType,
  onChangeHex,
  onChangePalette,
  onChangeGradientHex,
  onChangeGradientPalette,
  onChangeGradient
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const bgColorTypeValue = dvv(capByPrefix(prefix, "colorType"));

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv(capByPrefix(prefix, "colorHex")),
    dvv(capByPrefix(prefix, "colorPalette"))
  );

  const { hex: gradientColorHex } = getOptionColorHexByPalette(
    dvv("gradientColorHex"),
    dvv("gradientColorPalette")
  );

  const activePointerValue = dvv("gradientActivePointer");

  return {
    id: dvk(capByPrefix(prefix, "color")),
    type: "colorPicker2",
    disabled,
    devices,
    select: {
      show: showSelect,
      choices: [
        {
          title: t("Solid"),
          value: "solid"
        },
        {
          title: t("Gradient"),
          value: "gradient"
        }
      ]
    },
    gradient: {
      show: bgColorTypeValue === "gradient"
    },
    value: {
      hex: bgColorHex,
      opacity: dvv(capByPrefix(prefix, "colorOpacity")),
      palette: dvv(capByPrefix(prefix, "colorPalette")),

      select: bgColorTypeValue,

      gradientColorHex,
      gradientColorOpacity: dvv("gradientColorOpacity"),
      gradientColorPalette: dvv("gradientColorPalette"),

      startPointer: dvv("gradientStartPointer"),
      finishPointer: dvv("gradientFinishPointer"),
      activePointer: activePointerValue
    },
    onChange: ({
      hex,
      opacity,
      palette,
      select: bgColorType,
      opacityDragEnd,
      startPointer,
      finishPointer,
      activePointer,
      isChanged
    }) => {
      const valuesBgColorType = {
        ...{ v, device, state, prefix, onChange: onChangeType },
        ...{
          bgColorType
        }
      };

      const valuesBgColorHex = {
        ...{
          v,
          device,
          state,
          prefix:
            activePointer === "startPointer" || bgColorTypeValue === "solid"
              ? prefix
              : "gradient",
          onChange:
            activePointer === "startPointer" || bgColorTypeValue === "solid"
              ? onChangeHex
              : onChangeGradientHex
        },
        ...{
          hex,
          opacity,
          isChanged,
          opacityDragEnd
        }
      };

      const valuesBgColorPalette = {
        ...{
          v,
          device,
          state,
          prefix:
            activePointer === "startPointer" || bgColorTypeValue === "solid"
              ? prefix
              : "gradient",
          onChange:
            activePointer === "startPointer" || bgColorTypeValue === "solid"
              ? onChangePalette
              : onChangeGradientPalette
        },
        ...{
          opacity,
          palette
        }
      };

      const valuesGradientRange = {
        ...{ v, device, state, prefix, onChange: onChangeGradient },
        ...{
          startPointer,
          finishPointer,
          activePointer
        }
      };

      return isChanged === "select"
        ? saveOnChanges(valuesBgColorType)
        : isChanged === "hex" || isChanged === "opacity"
        ? saveOnChanges(valuesBgColorHex)
        : isChanged === "palette"
        ? saveOnChanges(valuesBgColorPalette)
        : saveOnChanges(valuesGradientRange);
    }
  };
}

export function toolbarBgColorHexField2({
  v,
  device,
  state,
  devices = "all",
  prefix = "bg",
  className = "",
  disabled = false,
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv(capByPrefix(prefix, "colorHex")),
    dvv(capByPrefix(prefix, "colorPalette"))
  );

  return {
    id: dvk(capByPrefix(prefix, "colorField")),
    type: "colorFields",
    devices,
    disabled,
    className,
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
