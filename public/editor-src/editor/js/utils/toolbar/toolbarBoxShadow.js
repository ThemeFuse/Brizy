import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBoxShadow2({
  v,
  device,
  state,
  devices = "all",
  choices = "all",
  onChangeType,
  onChangeHex,
  onChangePalette
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv("boxShadowColorHex"),
    dvv("boxShadowColorPalette")
  );

  const choicesAll = [
    {
      title: t("None"),
      value: ""
    },
    {
      title: t("Inset"),
      value: "inset"
    },
    {
      title: t("Outset"),
      value: "on"
    }
  ];

  const choicesInset = [
    {
      title: t("None"),
      value: ""
    },
    {
      title: t("Inset"),
      value: "inset"
    }
  ];

  const choicesOutset = [
    {
      title: t("None"),
      value: ""
    },
    {
      title: t("Outset"),
      value: "on"
    }
  ];

  return {
    id: dvk("boxShadow"),
    type: "colorPicker2",
    devices,
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
      opacity: dvv("boxShadowColorOpacity"),
      palette: dvv("boxShadowColorPalette"),
      select: dvv("boxShadow")
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
        ...{ v, device, state, onChange: onChangeType },
        ...{
          boxShadowType,
          isChanged
        }
      };

      const valuesBoxShadowHex = {
        ...{
          v,
          device,
          state,
          onChange: onChangeHex
        },
        ...{
          hex,
          opacity,
          isChanged,
          opacityDragEnd
        }
      };

      const valuesBoxShadowPalette = {
        ...{
          v,
          device,
          state,
          onChange: onChangePalette
        },
        ...{
          opacity,
          palette
        }
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
  state,
  devices = "all",
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv("boxShadowColorHex"),
    dvv("boxShadowColorPalette")
  );

  return {
    id: dvk("boxShadowColorField"),
    type: "colorFields",
    devices,
    value: {
      hex,
      opacity: dvv("boxShadowColorOpacity")
    },
    onChange: ({ hex }) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ hex }
      };

      return saveOnChanges(values);
    }
  };
}

export function toolbarBoxShadowFields2({
  v,
  device,
  state,
  devices = "all",
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("boxShadowFields"),
    type: "multiInput",
    devices,
    config: {
      defaultIcon: ["nc-shadow"],
      icons: ["nc-blur", "nc-size", "nc-vertical", "nc-horizontal"]
    },
    value: [
      dvv("boxShadowBlur"),
      dvv("boxShadowSpread"),
      dvv("boxShadowVertical"),
      dvv("boxShadowHorizontal")
    ],
    onChange: ([
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal
    ]) => {
      const values = {
        ...{ v, device, state, onChange },
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
