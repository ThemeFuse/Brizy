import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarElementProgressBarPercentage({ v, device }) {
  return {
    id: "percentage",
    label: t("Percentage"),
    type: "slider",
    slider: {
      min: 1,
      max: 100
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "%",
          value: "%"
        }
      ]
    },
    value: {
      value: v.percentage
    },
    onChange: ({ value: percentage }) => ({
      percentage
    })
  };
}

export function toolbarElementProgressBarShowPercentage({ v }) {
  return {
    id: "showPercentage",
    label: t("Show Percentage"),
    type: "switch",
    value: v.showPercentage
  };
}

export function toolbarElementProgressBarBg2ColorHexAndOpacity({
  v,
  device,
  state,
  onChange
}) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bg2ColorHex", device, state }),
    defaultValueValue({ v, key: "bg2ColorPalette", device, state })
  );

  return {
    id: defaultValueKey({ key: "bg2Color", device, state }),
    type: "colorPicker",
    value: {
      hex,
      opacity: defaultValueValue({ v, key: "bg2ColorOpacity", device, state })
    },
    onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarElementProgressBarBg2ColorPalette({
  v,
  device,
  state,
  onChange
}) {
  return {
    id: defaultValueKey({ key: "bg2ColorPalette", device, state }),
    type: "colorPalette",
    value: defaultValueValue({ v, key: "bg2ColorPalette", device, state }),
    onChange: palette => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ palette }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarElementProgressBarBg2ColorFields({
  v,
  device,
  state,
  onChange
}) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bg2ColorHex", device, state }),
    defaultValueValue({ v, key: "bg2ColorPalette", device, state })
  );

  return {
    id: defaultValueKey({ key: "bg2ColorFields", device, state }),
    type: "colorFields",
    value: {
      hex,
      opacity: defaultValueValue({ v, key: "bg2ColorOpacity", device, state })
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
