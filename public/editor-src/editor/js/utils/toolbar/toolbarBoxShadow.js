import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBoxShadowHexAndOpacity({ v, device, state, onChange }) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device, state }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device, state })
  );

  return {
    id: defaultValueKey({ key: "boxShadowColorHex", device, state }),
    type: "colorPicker",
    value: {
      hex,
      opacity: defaultValueValue({
        v,
        key: "boxShadowColorOpacity",
        device,
        state
      })
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

export function toolbarBoxShadowPalette({ v, device, state, onChange }) {
  return {
    id: defaultValueKey({ key: "boxShadowColorPalette", device, state }),
    type: "colorPalette",
    value: defaultValueValue({
      v,
      key: "boxShadowColorPalette",
      device,
      state
    }),
    onChange: palette => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ palette }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarBoxShadowFields({ v, device, state, onChange }) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device, state }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device, state })
  );

  return {
    id: defaultValueKey({ key: "boxShadowColorFields", device, state }),
    type: "colorFields",
    value: {
      hex,
      opacity: defaultValueValue({
        v,
        key: "boxShadowColorOpacity",
        device,
        state
      })
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

export function toolbarBoxShadowBlur({ v, device, state }) {
  return {
    id: defaultValueKey({ key: "boxShadowBlur", device, state }),
    type: "slider",
    icon: "nc-blur",
    slider: {
      min: 0
    },
    input: {
      show: true,
      min: 0
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        }
      ]
    },
    value: {
      value: defaultValueValue({
        v,
        key: "boxShadowBlur",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "boxShadowBlur", device, state })]: value,
      [defaultValueKey({ key: "boxShadowColorOpacity", device, state })]:
        defaultValueValue({
          v,
          key: "boxShadowColorOpacity",
          device,
          state
        }) === 0
          ? defaultValueValue({
              v,
              key: "tempBoxShadowColorOpacity",
              device,
              state
            })
          : defaultValueValue({
              v,
              key: "boxShadowColorOpacity",
              device,
              state
            }),
      [defaultValueKey({ key: "boxShadow", device, state })]: "on"
    })
  };
}

export function toolbarBoxShadowSpread({ v, device, state }) {
  return {
    id: defaultValueKey({ key: "boxShadowSpread", device, state }),
    type: "slider",
    icon: "nc-size",
    slider: {
      min: -100,
      max: 100
    },
    input: {
      show: true,
      min: 0
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        }
      ]
    },
    value: {
      value: defaultValueValue({
        v,
        key: "boxShadowSpread",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "boxShadowSpread", device, state })]: value,
      [defaultValueKey({ key: "boxShadowColorOpacity", device, state })]:
        defaultValueValue({
          v,
          key: "boxShadowColorOpacity",
          device,
          state
        }) === 0
          ? defaultValueValue({
              v,
              key: "tempBoxShadowColorOpacity",
              device,
              state
            })
          : defaultValueValue({
              v,
              key: "boxShadowColorOpacity",
              device,
              state
            }),
      [defaultValueKey({ key: "boxShadow", device, state })]: "on"
    })
  };
}

export function toolbarBoxShadowVertical({ v, device, state }) {
  return {
    id: defaultValueKey({ key: "boxShadowVertical", device, state }),
    type: "slider",
    icon: "nc-vertical",
    slider: {
      min: -100,
      max: 100
    },
    input: {
      show: true,
      min: -100,
      max: 100
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        }
      ]
    },
    value: {
      value: defaultValueValue({
        v,
        key: "boxShadowVertical",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "boxShadowVertical", device, state })]: value,
      [defaultValueKey({ key: "boxShadowColorOpacity", device, state })]:
        defaultValueValue({
          v,
          key: "boxShadowColorOpacity",
          device,
          state
        }) === 0
          ? defaultValueValue({
              v,
              key: "tempBoxShadowColorOpacity",
              device,
              state
            })
          : defaultValueValue({
              v,
              key: "boxShadowColorOpacity",
              device,
              state
            }),
      [defaultValueKey({ key: "boxShadow", device, state })]: "on"
    })
  };
}

export function toolbarBoxShadowHorizontal({ v, device, state }) {
  return {
    id: defaultValueKey({ key: "boxShadowHorizontal", device, state }),
    type: "slider",
    icon: "nc-horizontal",
    slider: {
      min: -100,
      max: 100
    },
    input: {
      show: true,
      min: -100,
      max: 100
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        }
      ]
    },
    value: {
      value: defaultValueValue({
        v,
        key: "boxShadowHorizontal",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "boxShadowHorizontal", device, state })]: value,
      [defaultValueKey({ key: "boxShadowColorOpacity", device, state })]:
        defaultValueValue({
          v,
          key: "boxShadowColorOpacity",
          device,
          state
        }) === 0
          ? defaultValueValue({
              v,
              key: "tempBoxShadowColorOpacity",
              device,
              state
            })
          : defaultValueValue({
              v,
              key: "boxShadowColorOpacity",
              device,
              state
            }),
      [defaultValueKey({ key: "boxShadow", device, state })]: "on"
    })
  };
}

export function toolbarBoxShadow({ v, device, state }) {
  const boxShadowBlur = defaultValueValue({
    v,
    key: "boxShadowBlur",
    device,
    state
  });
  const boxShadowSpread = defaultValueValue({
    v,
    key: "boxShadowSpread",
    device,
    state
  });
  const boxShadowVertical = defaultValueValue({
    v,
    key: "boxShadowVertical",
    device,
    state
  });
  const boxShadowHorizontal = defaultValueValue({
    v,
    key: "boxShadowHorizontal",
    device,
    state
  });

  return {
    id: defaultValueKey({ key: "boxShadow", device, state }),
    type: "multiInput",
    config: {
      defaultIcon: ["nc-shadow"],
      icons: ["nc-blur", "nc-size", "nc-vertical", "nc-horizontal"]
    },
    value: [
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal
    ],
    onChange: ([
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal
    ]) => ({
      [defaultValueKey({
        key: "boxShadow",
        device,
        state
      })]: "on",

      [defaultValueKey({
        key: "boxShadowBlur",
        device,
        state
      })]: boxShadowBlur,
      [defaultValueKey({
        key: `tempBoxShadowBlur`,
        device,
        state
      })]: boxShadowBlur,

      [defaultValueKey({
        key: "boxShadowSpread",
        device,
        state
      })]: boxShadowSpread,
      [defaultValueKey({
        key: `tempBoxShadowSpread`,
        device,
        state
      })]: boxShadowSpread,

      [defaultValueKey({
        key: "boxShadowVertical",
        device,
        state
      })]: boxShadowVertical,
      [defaultValueKey({
        key: `tempBoxShadowVertical`,
        device,
        state
      })]: boxShadowVertical,

      [defaultValueKey({
        key: "boxShadowHorizontal",
        device,
        state
      })]: boxShadowHorizontal,
      [defaultValueKey({
        key: `tempBoxShadowHorizontal`,
        device,
        state
      })]: boxShadowHorizontal
    })
  };
}
