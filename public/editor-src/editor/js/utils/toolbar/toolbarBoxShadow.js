import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarBoxShadow2({
  v,
  device,
  disabled = false,
  state,
  states,
  onChangeType,
  onChangeHex,
  onChangePalette,
  prefix = "",
  devices = "all",
  choices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorHex = capByPrefix(boxShadow, "colorHex");
  const colorOpacity = capByPrefix(boxShadow, "colorOpacity");
  const colorPalette = capByPrefix(boxShadow, "colorPalette");
  const { hex } = getOptionColorHexByPalette(dvv(colorHex), dvv(colorPalette));

  const choicesAll = [
    { title: t("None"), value: "" },
    { title: t("Inset"), value: "inset" },
    { title: t("Outset"), value: "on" }
  ];

  const choicesInset = [
    { title: t("None"), value: "" },
    { title: t("Inset"), value: "inset" }
  ];

  const choicesOutset = [
    { title: t("None"), value: "" },
    { title: t("Outset"), value: "on" }
  ];

  return {
    devices,
    states,
    disabled,
    id: dvk(boxShadow),
    type: "colorPicker2",
    select: {
      choices:
        choices === "all"
          ? choicesAll
          : choices === "inset"
          ? choicesInset
          : choicesOutset
    },
    value: {
      hex,
      opacity: dvv(colorOpacity),
      palette: dvv(colorPalette),
      select: dvv(boxShadow)
    },
    onChange: ({
      hex,
      opacity,
      palette,
      select: boxShadowType,
      isChanged,
      opacityDragEnd
    }) => {
      const valuesBoxShadowType = {
        ...{ v, device, state, prefix, onChange: onChangeType },
        ...{ boxShadowType, isChanged }
      };

      const valuesBoxShadowHex = {
        ...{ v, device, state, prefix, onChange: onChangeHex },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };

      const valuesBoxShadowPalette = {
        ...{ v, device, state, prefix, onChange: onChangePalette },
        ...{ opacity, palette }
      };

      return isChanged === "select"
        ? saveOnChanges(valuesBoxShadowType)
        : isChanged === "hex" || isChanged === "opacity"
        ? saveOnChanges(valuesBoxShadowHex)
        : saveOnChanges(valuesBoxShadowPalette);
    }
  };
}

export function toolbarBoxShadowHexField2({
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
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const field = capByPrefix(boxShadow, "field");
  const colorHex = capByPrefix(boxShadow, "colorHex");
  const colorPalette = capByPrefix(boxShadow, "colorPalette");
  const colorOpacity = capByPrefix(boxShadow, "colorOpacity");
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

export function toolbarBoxShadowFields2({
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
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const fields = capByPrefix(boxShadow, "fields");
  const blur = capByPrefix(boxShadow, "blur");
  const spread = capByPrefix(boxShadow, "spread");
  const vertical = capByPrefix(boxShadow, "vertical");
  const horizontal = capByPrefix(boxShadow, "horizontal");

  return {
    devices,
    disabled,
    states,
    id: dvk(fields),
    type: "multiInput",
    config: {
      defaultIcon: ["nc-shadow"],
      icons: ["nc-blur", "nc-size", "nc-vertical", "nc-horizontal"]
    },
    value: [dvv(blur), dvv(spread), dvv(vertical), dvv(horizontal)],
    onChange: ([
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal
    ]) => {
      const values = {
        ...{ v, device, state, prefix, onChange },
        ...{
          boxShadowBlur,
          boxShadowSpread,
          boxShadowVertical,
          boxShadowHorizontal
        }
      };

      return saveOnChanges(values);
    }
  };
}
