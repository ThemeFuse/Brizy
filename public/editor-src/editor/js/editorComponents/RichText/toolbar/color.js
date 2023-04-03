import { setIn } from "timm";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import {
  getColorPaletteColor,
  hexToRgba,
  makeStylePaletteCSSVar
} from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { NORMAL } from "visual/utils/stateMode";
import { encodeToString } from "visual/utils/string";

const getColorValue = ({ hex, opacity }) => hexToRgba(hex, opacity);

const shadowToString = (value, config) => {
  if (value.palette) {
    const { palette, opacity, horizontal, vertical, blur } = value;
    return `rgba(var(${makeStylePaletteCSSVar(
      palette,
      config
    )}),${opacity}) ${horizontal}px ${vertical}px ${blur}px`;
  }

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

const changeColor = (value) => {
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

  const selectType =
    value.bgColorType === "none" ? value.tempBgColorType : value.bgColorType;
  if (selectType === "gradient") {
    return {
      ...value,
      backgroundGradient: {
        ...DEFAULT_GRADIENT,
        startHex: value.bgColorHex,
        startOpacity: String(value.bgColorOpacity),
        finishOpacity: String(value.gradientColorOpacity),
        startPalette: value.bgColorPalette,
        finishPalette: value.gradientColorPalette,
        finishHex: value.gradientColorHex,
        startPointer: value.gradientStartPointer,
        finishPointer: value.gradientFinishPointer,
        activePointer: value.gradientActivePointer,
        type:
          value.gradientType === "linear"
            ? "linear-gradient"
            : "radial-gradient",
        linearAngle: value.gradientLinearDegree,
        radialPosition: value.gradientRadialDegree
      },
      color: null,
      opacity: null,
      colorPalette: value.bgColorPalette,
      bgColorType: "gradient"
    };
  } else
    return {
      ...value,
      bgColorType: "solid",
      backgroundGradient: null,
      color: !value.bgColorPalette ? value.bgColorHex : null,
      opacity: String(value.bgColorOpacity),
      colorPalette: value.bgColorPalette
    };
};

function getPopulationTabs({ populationColor }, onChange) {
  const translationsMap = {
    p: "P",
    h1: "H1",
    h2: "H2",
    h3: "H3",
    h4: "H4",
    h5: "H5",
    h6: "H6"
  };

  return Object.entries(populationColor).reduce((acc, [key, headerValue]) => {
    const { hex: hexPalette } =
      getColorPaletteColor(headerValue.colorPalette) || {};

    acc.push({
      id: translationsMap[key],
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
          onChange: (value) =>
            onChange({
              populationColor: getPopulationColor(populationColor, key, value)
            })
        },
        {
          type: "grid-dev",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              size: "auto",
              options: [
                {
                  id: "paragraphColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: hexPalette || headerValue.hex,
                    opacity: headerValue.opacity
                  },
                  onChange: (value) =>
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
      id: "colorTabs",
      type: "tabs-dev",
      tabs: getPopulationTabs({ populationColor }, onChange)
    }
  ];
}

function getSimpleColorOptions(v, { context }, onChange) {
  const {
    src = null,
    population = null,
    fileName = null,
    x = null,
    y = null,
    extension = null,
    width = null,
    height = null
  } = v.backgroundImage || {};
  const config = Config.getAll();

  const imageDynamicContentChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.image
  );

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
              id: "",
              type: "backgroundColor-dev",
              states: [NORMAL],
              config: {
                withNone: false
              },
              dependencies: (value) => {
                const bgColorPalette =
                  value.bgColorPalette !== v.bgColorPalette
                    ? value.bgColorPalette
                    : "";
                const bgColorHex =
                  value.bgColorPalette !== v.bgColorPalette &&
                  getColorPaletteColor(value.bgColorPalette)
                    ? getColorPaletteColor(value.bgColorPalette).hex
                    : value.bgColorHex;

                const gradientColorHex = value.gradientColorPalette
                  ? getColorPaletteColor(value.gradientColorPalette).hex
                  : value.gradientColorHex;
                onChange(
                  changeColor({
                    ...value,
                    bgColorHex,
                    gradientColorHex,
                    bgColorPalette
                  })
                );
              }
            }
          ]
        },
        {
          id: "tabShadow",
          label: t("Shadow"),
          options: [
            {
              id: "textShadow",
              type: "textShadow-dev",
              icon: "nc-bold",
              title: t("Text Shadow"),
              dependencies: ({
                textShadowBlur,
                textShadowColorHex,
                textShadowHorizontal,
                textShadowColorOpacity,
                textShadowColorPalette,
                textShadowVertical
              }) => {
                let shadow = {
                  hex: textShadowColorHex,
                  opacity: textShadowColorOpacity,
                  horizontal: textShadowHorizontal,
                  vertical: textShadowVertical,
                  blur: textShadowBlur
                };

                let shadowColorPalette = null;

                if (textShadowColorPalette) {
                  shadow = { ...shadow, palette: textShadowColorPalette };
                  shadowColorPalette = textShadowColorPalette;
                }

                onChange({
                  shadow: shadowToString(shadow, config),
                  shadowColorPalette
                });
              }
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
                fileName,
                extension
              },
              onChange: ({
                width,
                height,
                src,
                x,
                y,
                population,
                fileName,
                extension
              }) => {
                x = x || 50;
                y = y || 50;

                return onChange({
                  backgroundImage: {
                    src,
                    population,
                    fileName,
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

function getTextPopulationOptions() {
  return [
    {
      id: "tabsColor",
      className: "",
      type: "tabs-dev",
      tabs: [
        {
          id: "tabBg",
          label: t("Bg"),
          options: [
            {
              id: "",
              type: "backgroundColor-dev"
            }
          ]
        },
        {
          id: "tabShadow",
          label: t("Shadow"),
          options: [
            {
              id: "textShadow",
              type: "textShadow-dev"
            }
          ]
        },
        {
          id: "mask",
          label: t("Mask"),
          options: [
            {
              id: "bg",
              type: "imageUpload-dev"
            }
          ]
        }
      ]
    }
  ];
}

const getColorToolbar = (v, { device, context }, onChange) => {
  const { isPopulationBlock, populationColor } = v;

  let backgroundColor;
  if (v.textPopulation) {
    const { hex: colorHex } = getOptionColorHexByPalette(
      defaultValueValue({ v, key: "colorHex", device }),
      defaultValueValue({ v, key: "colorPalette", device })
    );
    backgroundColor = hexToRgba(colorHex, v.colorOpacity);
  } else {
    backgroundColor = getColorValue(v.color);
  }

  return {
    id: "toolbarColor",
    type: "popover-dev",
    config: {
      size: "auto",
      title: t("Colors"),
      icon: {
        style: {
          backgroundColor
        }
      }
    },
    devices: "desktop",
    roles: ["admin"],
    position: 20,
    options: isPopulationBlock
      ? getPopulationColorOptions({ populationColor }, onChange)
      : v.textPopulation
      ? getTextPopulationOptions()
      : getSimpleColorOptions(v, { device, context }, onChange)
  };
};

export default getColorToolbar;
