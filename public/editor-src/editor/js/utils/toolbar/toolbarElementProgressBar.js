import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarElementProgressBarPercentage({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "percentage", device, state }),
    label: t("Percentage"),
    type: "slider",
    devices,
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
      value: defaultValueValue({
        v,
        key: "percentage",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "percentage", device, state })]: value
    })
  };
}

export function toolbarElementProgressBarShowPercentage({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: "showPercentage",
    devices,
    label: t("Show Percentage"),
    type: "switch",
    value: defaultValueValue({
      v,
      key: "showPercentage",
      device,
      state
    })
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
