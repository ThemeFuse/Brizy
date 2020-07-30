import { setIn } from "timm";
import { hexToRgba, getColorPaletteColor } from "visual/utils/color";
import { encodeToString } from "visual/utils/string";
import { getDynamicContentChoices } from "visual/utils/options";
import { t } from "visual/utils/i18n";

import {
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarGradientType,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree
} from "visual/utils/toolbar";

const imageDynamicContentChoices = getDynamicContentChoices("image");

const getColorValue = ({ hex, opacity }) => hexToRgba(hex, opacity);

const shadowToString = value => {
  return `${getColorValue({
    hex: value.hex,
    opacity: value.opacity
  })} ${value.horizontal}px ${value.vertical}px ${value.blur}px`;
};

const getPopulationColor = (populationColor, type, value) => {
  if (value.isChanged === "hex") {
    const newValue = setIn(populationColor, [type, "hex"], value.hex);
    return encodeToString(setIn(newValue, [type, "colorPalette"], null));
  }

  if (value.isChanged === "opacity") {
    return encodeToString(
      setIn(populationColor, [type, "opacity"], value.opacity)
    );
  }

  const newValue = setIn(
    populationColor,
    [type, "colorPalette"],
    value.palette
  );
  return encodeToString(setIn(newValue, [type, "hex"], null));
};

const changeShadow = (shadow, value) => {
  const DEFAULT_SHADOW = {
    hex: "#000000",
    opacity: 1,
    vertical: 5,
    horizontal: 5,
    blur: 5
  };

  const newShadow = Object.assign({}, DEFAULT_SHADOW, shadow);

  switch (value.isChanged) {
    case "select":
      return {
        shadow: value.select === "none" ? null : shadowToString(newShadow),
        shadowColorPalette: null
      };
    case "hex":
      return {
        shadow: shadowToString({
          ...newShadow,
          hex: value.hex
        }),
        shadowColorPalette: null
      };
    case "opacity":
      return {
        shadow: shadowToString({
          ...newShadow,
          opacity: value.opacity
        })
      };
    default: {
      const { hex } = getColorPaletteColor(value.palette);

      return {
        shadow: shadowToString({
          ...newShadow,
          hex
        }),
        shadowColorPalette: value.palette
      };
    }
  }
};

const changeColor = (backgroundGradient, value) => {
  const DEFAULT_GRADIENT = {
    type: "linear-gradient",
    radialPosition: 90,
    linearAngle: 90,
    startPointer: 0,
    finishPointer: 100,
    activePointer: "startPointer",
    startHex: "#239ddb",
    finishHex: "#009900",
    startOpacity: 1,
    finishOpacity: 0.8,
    startPalette: "",
    finishPalette: ""
  };

  const bgGradient = {
    ...DEFAULT_GRADIENT,
    ...backgroundGradient
  };

  switch (value.isChanged) {
    case "select":
      if (value.select === "gradient") {
        return {
          backgroundGradient: {
            ...bgGradient,
            startHex: value.hex,
            startOpacity: value.opacity,
            startPalette: value.palette
          },
          color: null,
          opacity: null,
          colorPalette: ""
        };
      } else {
        return {
          backgroundGradient: null,
          color: value.hex,
          opacity: value.opacity,
          colorPalette: value.palette
        };
      }

    case "hex":
      if (value.select === "gradient") {
        const newColor =
          value.activePointer === "startPointer"
            ? { startHex: value.hex }
            : { finishHex: value.hex };

        const newPalette =
          value.activePointer === "startPointer"
            ? { startPalette: "" }
            : { finishPalette: "" };

        return {
          backgroundGradient: {
            ...bgGradient,
            ...newColor,
            ...newPalette
          }
        };
      } else {
        return {
          color: value.hex,
          colorPalette: ""
        };
      }
    case "opacity":
      if (value.select === "gradient") {
        const newPointer =
          value.activePointer === "startPointer"
            ? { startOpacity: String(value.opacity) }
            : { finishOpacity: String(value.opacity) };

        return {
          backgroundGradient: {
            ...bgGradient,
            ...newPointer
          }
        };
      } else {
        return { opacity: String(value.opacity) };
      }
    case "activePointer":
      return {
        backgroundGradient: {
          ...bgGradient,
          activePointer: value.activePointer
        }
      };
    case "startPointer":
      return {
        backgroundGradient: {
          ...bgGradient,
          startPointer: value.startPointer
        }
      };
    case "finishPointer":
      return {
        backgroundGradient: {
          ...bgGradient,
          finishPointer: value.finishPointer
        }
      };
    case "palette":
      if (value.select === "gradient") {
        const palette =
          value.activePointer === "startPointer"
            ? value.palette
            : value.palette;

        const { hex } = getColorPaletteColor(palette);

        const newHex =
          value.activePointer === "startPointer"
            ? { startHex: hex }
            : { finishHex: hex };

        const newPalette =
          value.activePointer === "startPointer"
            ? { startPalette: value.palette }
            : { finishPalette: value.palette };

        return {
          backgroundGradient: {
            ...bgGradient,
            ...newHex,
            ...newPalette
          }
        };
      } else {
        return {
          color: null,
          colorPalette: value.palette
        };
      }
  }
};

const changeColorFields = (backgroundGradient, value) => {
  if (backgroundGradient && !backgroundGradient.startHex) {
    return {
      color: value.hex,
      colorPalette: ""
    };
  } else if (
    backgroundGradient &&
    backgroundGradient.activePointer === "startPointer"
  ) {
    return {
      backgroundGradient: {
        ...backgroundGradient,
        startHex: value.hex
      }
    };
  } else if (
    backgroundGradient &&
    backgroundGradient.activePointer === "finishPointer"
  ) {
    return {
      backgroundGradient: {
        ...backgroundGradient,
        finishHex: value.hex
      }
    };
  } else if (!backgroundGradient) {
    return {
      color: value.hex,
      colorPalette: null
    };
  }
};

const changeGradientType = (backgroundGradient, value) => {
  return {
    backgroundGradient: {
      ...backgroundGradient,
      type: value === "linear" ? "linear-gradient" : "radial-gradient"
    }
  };
};

const changeLinearDegree = (backgroundGradient, value) => {
  return {
    backgroundGradient: {
      ...backgroundGradient,
      linearAngle: value
    }
  };
};

const changeRadialDegree = (backgroundGradient, value) => {
  return {
    backgroundGradient: {
      ...backgroundGradient,
      radialPosition: value
    }
  };
};

function getPopulationTabs({ populationColor }, onChange) {
  const translationsMap = {
    p: t("P"),
    h1: t("H1"),
    h2: t("H2"),
    h3: t("H3"),
    h4: t("H4"),
    h5: t("H5"),
    h6: t("H6")
  };

  return Object.entries(populationColor).reduce((acc, [key, headerValue]) => {
    const { hex: hexPalette } =
      getColorPaletteColor(headerValue.colorPalette) || {};
    acc.push({
      label: translationsMap[key],
      options: [
        {
          id: "paragraphColor",
          type: "colorPicker2",
          select: {
            show: false
          },
          value: {
            hex: hexPalette || headerValue.hex,
            opacity: headerValue.opacity,
            palette: headerValue.colorPalette
          },
          onChange: value =>
            onChange({
              populationColor: getPopulationColor(populationColor, key, value)
            })
        },
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 41,
              options: [
                {
                  id: "paragraphColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: hexPalette || headerValue.hex,
                    opacity: headerValue.opacity
                  },
                  onChange: value =>
                    onChange(getPopulationColor(populationColor, key, value))
                }
              ]
            }
          ]
        }
      ]
    });

    return acc;
  }, []);
}

function getPopulationColorOptions({ populationColor }, onChange) {
  return [
    {
      id: "color",
      type: "tabs-dev",
      config: { position: "left" },
      tabs: [
        {
          icon: "nc-circle",
          title: t("Normal"),
          options: [
            {
              id: "colorTabs",
              className: "",
              type: "tabs-dev",
              tabs: getPopulationTabs({ populationColor }, onChange)
            }
          ]
        }
      ]
    }
  ];
}

function getSimpleColorOptions(v, { device }, onChange) {
  const {
    src = null,
    population = null,
    x = null,
    y = null,
    extension = null,
    width = null,
    height = null
  } = v.backgroundImage || {};

  const {
    type,
    radialPosition,
    linearAngle,
    startPointer,
    finishPointer,
    activePointer,
    startHex,
    finishHex,
    startOpacity,
    finishOpacity,
    startPalette,
    finishPalette
  } = v.backgroundGradient || {};

  let colorV = {};
  let colorFieldsV = {};

  // is gradient
  if (startHex) {
    const startIsActive = activePointer === "startPointer";

    colorV = {
      colorType: "gradient",
      colorHex: startHex,
      colorOpacity: startOpacity,
      colorPalette: startPalette,

      gradientStartPointer: startPointer,
      gradientFinishPointer: finishPointer,
      gradientActivePointer: activePointer,

      gradientColorHex: finishHex,
      gradientColorOpacity: finishOpacity,
      gradientColorPalette: finishPalette
    };

    colorFieldsV = {
      colorHex: startIsActive ? startHex : finishHex,
      colorPalette: startIsActive ? startPalette : finishPalette
    };
  } else {
    colorV = {
      colorType: "solid",
      colorHex: v.color.hex,
      colorOpacity: v.color.opacity,
      colorPalette: v.colorPalette
    };

    colorFieldsV = {
      colorHex: v.color.hex,
      colorPalette: v.colorPalette
    };
  }

  const linearV = {
    gradientLinearDegree: linearAngle
  };

  const radialV = {
    gradientRadialDegree: radialPosition
  };

  const gradientType = {
    gradientType: type === "linear-gradient" ? "linear" : "radial"
  };

  return [
    {
      id: "colorTabs",
      type: "tabs-dev",
      tabs: [
        {
          id: "tabText",
          label: t("Color"),
          options: [
            {
              ...toolbarBgColor2({
                v: colorV,
                prefix: "",
                device,
                state: "normal"
              }),
              onChange: value =>
                onChange(changeColor(v.backgroundGradient, value))
            },
            {
              type: "grid",
              className: "brz-ed-grid__color-fileds",
              columns: [
                {
                  width: 30,
                  options: [
                    {
                      ...toolbarBgColorHexField2({
                        v: colorFieldsV,
                        device,
                        state: "normal",
                        prefix: ""
                      }),
                      onChange: value =>
                        onChange(changeColorFields(v.backgroundGradient, value))
                    }
                  ]
                },
                {
                  width: 52,
                  options: [
                    {
                      ...toolbarGradientType({
                        v: gradientType,
                        device,
                        state: "normal",
                        className:
                          "brz-ed__select--transparent brz-ed__select--align-right",
                        disabled: !startHex
                      }),
                      onChange: value =>
                        onChange(
                          changeGradientType(v.backgroundGradient, value)
                        )
                    }
                  ]
                },
                {
                  width: 18,
                  options: [
                    {
                      ...toolbarGradientLinearDegree({
                        v: linearV,
                        device,
                        state: "normal",
                        disabled: !startHex || type === "radial-gradient"
                      }),
                      onChange: value =>
                        onChange(
                          changeLinearDegree(v.backgroundGradient, value)
                        )
                    },
                    {
                      ...toolbarGradientRadialDegree({
                        v: radialV,
                        device,
                        state: "normal",
                        disabled: !startHex || type === "linear-gradient"
                      }),
                      onChange: value =>
                        onChange(
                          changeRadialDegree(v.backgroundGradient, value)
                        )
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "tabShadow",
          label: t("Shadow"),
          options: [
            {
              id: "color",
              type: "colorPicker2",
              select: {
                show: true,
                choices: [
                  {
                    title: t("Shadow"),
                    value: "shadow"
                  },
                  {
                    title: t("None"),
                    value: "none"
                  }
                ]
              },
              value: {
                select: v.shadow.hex ? "shadow" : "none",
                hex: v.shadow.hex,
                opacity: v.shadow.opacity,
                palette: v.shadowColorPalette
              },
              onChange: value => onChange(changeShadow(v.shadow, value))
            },
            {
              type: "grid",
              className: "brz-ed-grid__color-fileds",
              columns: [
                {
                  width: 50,
                  options: [
                    {
                      id: "bgColorFields",
                      type: "colorFields",
                      position: 30,
                      value: {
                        hex: v.shadow.hex,
                        opacity: v.shadow.opacity
                      },
                      onChange: value => onChange(changeShadow(v.shadow, value))
                    }
                  ]
                },
                {
                  width: 50,
                  options: [
                    {
                      id: "texShadow",
                      type: "multiInput",
                      config: {
                        defaultIcon: ["nc-shadow"],
                        icons: ["nc-blur", "nc-vertical", "nc-horizontal"]
                      },
                      value: [
                        v.shadow.blur,
                        v.shadow.vertical,
                        v.shadow.horizontal
                      ],
                      onChange: ([blur, vertical, horizontal]) => {
                        return onChange({
                          shadow: shadowToString({
                            ...v.shadow,
                            blur,
                            vertical,
                            horizontal
                          })
                        });
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "tabImage",
          label: t("Mask"),
          options: [
            {
              id: "image",
              label: t("Image"),
              type: "imageSetter",
              population: {
                show: imageDynamicContentChoices.length > 0,
                choices: imageDynamicContentChoices
              },
              value: {
                src,
                population,
                width,
                height,
                x,
                y,
                extension
              },
              onChange: ({
                width,
                height,
                src,
                x,
                y,
                population,
                extension
              }) => {
                x = x || 50;
                y = y || 50;

                return onChange({
                  backgroundImage: {
                    src,
                    population,
                    x,
                    y,
                    extension,
                    width,
                    height
                  }
                });
              }
            }
          ]
        }
      ]
    }
  ];
}

const getColorToolbar = (v, { device }, onChange) => {
  const { isPopulationBlock, populationColor } = v;

  return {
    id: "toolbarColor",
    type: "popover-dev",
    config: {
      size: "auto",
      title: t("Colors"),
      icon: {
        style: {
          backgroundColor: getColorValue(v.color)
        }
      }
    },
    devices: "desktop",
    roles: ["admin"],
    position: 20,
    options: isPopulationBlock
      ? getPopulationColorOptions({ populationColor }, onChange)
      : getSimpleColorOptions(v, { device }, onChange)
  };
};

export default getColorToolbar;
