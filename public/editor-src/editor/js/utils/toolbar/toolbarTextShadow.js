import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarTextShadow({
  v,
  device,
  disabled = false,
  state,
  states,
  onChangeType,
  onChangeHex,
  onChangePalette,
  prefix = "",
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const colorHex = capByPrefix(textShadow, "colorHex");
  const colorOpacity = capByPrefix(textShadow, "colorOpacity");
  const colorPalette = capByPrefix(textShadow, "colorPalette");
  const { hex } = getOptionColorHexByPalette(dvv(colorHex), dvv(colorPalette));

  return {
    devices,
    states,
    disabled,
    id: dvk(textShadow),
    type: "colorPicker2",
    select: {
      show: true,
      choices: [
        {
          title: t("Shadow"),
          value: "on"
        },
        {
          title: t("None"),
          value: ""
        }
      ]
    },
    value: {
      hex,
      opacity: dvv(colorOpacity),
      palette: dvv(colorPalette),
      select: dvv(textShadow)
    },
    onChange: ({
      hex,
      opacity,
      palette,
      select: textShadowType,
      isChanged,
      opacityDragEnd
    }) => {
      const valuesTextShadowType = {
        ...{ v, device, state, prefix, onChange: onChangeType },
        ...{ textShadowType, isChanged }
      };

      const valuesTextShadowHex = {
        ...{ v, device, state, prefix, onChange: onChangeHex },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };

      const valuesTextShadowPalette = {
        ...{ v, device, state, prefix, onChange: onChangePalette },
        ...{ opacity, palette }
      };

      return isChanged === "select"
        ? saveOnChanges(valuesTextShadowType)
        : isChanged === "hex" || isChanged === "opacity"
        ? saveOnChanges(valuesTextShadowHex)
        : saveOnChanges(valuesTextShadowPalette);
    }
  };
}

export function toolbarTextShadowHexField2({
  v,
  device,
  disabled = false,
  state,
  states,
  onChange,
  prefix = "",
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const field = capByPrefix(textShadow, "field");
  const colorHex = capByPrefix(textShadow, "colorHex");
  const colorPalette = capByPrefix(textShadow, "colorPalette");
  const colorOpacity = capByPrefix(textShadow, "colorOpacity");
  const { hex } = getOptionColorHexByPalette(dvv(colorHex), dvv(colorPalette));

  return {
    devices,
    disabled,
    id: dvk(field),
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

export function toolbarTextShadowFields2({
  v,
  device,
  disabled = false,
  state,
  states,
  onChange,
  prefix = "",
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const fields = capByPrefix(textShadow, "fields");
  const blur = capByPrefix(textShadow, "blur");
  const vertical = capByPrefix(textShadow, "vertical");
  const horizontal = capByPrefix(textShadow, "horizontal");

  return {
    devices,
    disabled,
    states,
    id: dvk(fields),
    type: "multiInput",
    config: {
      defaultIcon: ["nc-shadow"],
      icons: ["nc-blur", "nc-vertical", "nc-horizontal"]
    },
    value: [dvv(blur), dvv(vertical), dvv(horizontal)],
    onChange: ([textShadowBlur, textShadowVertical, textShadowHorizontal]) => {
      const values = {
        ...{ v, device, state, prefix, onChange },
        ...{
          textShadowBlur,

          textShadowVertical,
          textShadowHorizontal
        }
      };

      return saveOnChanges(values);
    }
  };
}
