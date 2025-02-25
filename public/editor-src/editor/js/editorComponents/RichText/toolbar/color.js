import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import { hexToRgba, makeStylePaletteCSSVar } from "visual/utils/color";
import { getColorToolbar as getColor } from "visual/utils/color";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { read as readNum } from "visual/utils/reader/number";
import { read as readStr } from "visual/utils/reader/string";
import { NORMAL } from "visual/utils/stateMode";
import { capByPrefix } from "visual/utils/string";
import { getPopulationColor } from "../utils/dependencies";
import { ColorOption } from "./types";
import { colorValues, gradientValues } from "./utils";

const getColorValue = ({ hex, opacity }) => hexToRgba(hex, opacity);

export const shadowToString = (value, config) => {
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

export const changeColor = (value, type, config, prefix = "") => {
  const selectType = value[capByPrefix(prefix, "bgColorType")];
  const v = value;

  switch (selectType) {
    case "gradient":
      return Object.assign({}, v, gradientValues(type, value, prefix));
    case "solid":
      return Object.assign({}, v, colorValues(type, value, config, prefix));
    default:
      return Object.assign(
        {},
        v,
        gradientValues(type, value, prefix),
        colorValues(type, value, config, prefix)
      );
  }
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

  return Object.entries(translationsMap).map(([key, value]) => ({
    id: value,
    label: value,
    options: [
      {
        id: `paragraphColor${value}`,
        type: "colorPicker",
        dependencies: (data) =>
          onChange({
            ...data,
            populationColor: getPopulationColor(populationColor, key, data)
          })
      }
    ]
  }));
}

function getPopulationColorOptions({ populationColor }, onChange) {
  return [
    {
      id: "colorTabs",
      type: "tabs",
      tabs: getPopulationTabs({ populationColor }, onChange)
    }
  ];
}

export function patchImage(v, patch, prefix = "") {
  const imageSrc = patch[capByPrefix(prefix, "imageSrc")] ?? v.imageSrc;
  const imageExtension =
    patch[capByPrefix(prefix, "imageExtension")] ?? v.imageExtension;
  const imageFileName =
    patch[capByPrefix(prefix, "imageFileName")] ?? v.imageFileName;
  const imageHeight =
    patch[capByPrefix(prefix, "imageHeight")] ?? v.imageHeight;
  const imageWidth = patch[capByPrefix(prefix, "imageWidth")] ?? v.imageWidth;
  const positionX = patch[capByPrefix(prefix, "positionX")] ?? v.imagePositionX;
  const positionY = patch[capByPrefix(prefix, "positionY")] ?? v.imagePositionY;

  const imagePositionX = positionX || 50;
  const imagePositionY = positionY || 50;

  return {
    imageSrc,
    imageFileName,
    imageExtension,
    imageWidth,
    imageHeight,
    imagePositionX,
    imagePositionY
  };
}

export function patchImagePopulation(v, patch) {
  const {
    imagePopulation,
    imagePopulationEntityId,
    imagePopulationEntityType
  } = patch;
  const imageData = {
    imageSrc: v.imageSrc,
    imageFileName: v.imageFileName,
    imageExtension: v.imageExtension,
    imageWidth: v.imageWidth,
    imageHeight: v.imageHeight,
    imagePositionX: v.imagePositionX,
    imagePositionY: v.imagePositionY
  };
  const populationAttr = {};

  if (imagePopulationEntityId) {
    populationAttr.entityId = imagePopulationEntityId;
  }
  if (imagePopulationEntityType) {
    populationAttr.entityType = imagePopulationEntityType;
  }

  const population = imagePopulation
    ? makePlaceholder({ content: imagePopulation, attr: populationAttr })
    : undefined;

  return {
    ...imageData,
    imagePopulationEntityType,
    imagePopulationEntityId,
    imagePopulation: population
  };
}

export const getShadowData = (value, config) => {
  const {
    textShadowColorHex,
    textShadowColorOpacity,
    textShadowColorPalette,
    textShadowHorizontal,
    textShadowVertical,
    textShadowBlur
  } = value;

  let shadow = {
    hex: readStr(textShadowColorHex) ?? "",
    opacity: readNum(textShadowColorOpacity) ?? 1,
    horizontal: readNum(textShadowHorizontal) ?? 0,
    vertical: readNum(textShadowVertical) ?? 0,
    blur: readNum(textShadowBlur) ?? 0
  };

  if (textShadowColorPalette) {
    shadow = { ...shadow, palette: textShadowColorPalette };
  }

  return {
    shadow: shadowToString(shadow, config),
    shadowColorPalette: textShadowColorPalette
  };
};

function getSimpleColorOptions(v, { context, device }, onChange, config) {
  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image,
    config: { show: true }
  });

  const isPointerEnabled = isBackgroundPointerEnabled(config, "richText");

  return [
    {
      id: "colorTabs",
      type: "tabs",
      tabs: [
        {
          id: "tabText",
          label: t("Color"),
          options: [
            {
              id: "",
              type: "backgroundColor",
              states: [NORMAL],
              config: {
                withNone: false
              },
              dependencies: (value) => {
                onChange(changeColor(value, ColorOption.Color, config));
              }
            }
          ]
        },
        {
          id: "tabBg",
          label: t("Bg. Color"),
          options: [
            {
              id: "text",
              type: "backgroundColor",
              icon: "nc-bold",
              title: t("Text Bg. Color"),
              dependencies: (value) => {
                onChange(
                  changeColor(value, ColorOption.Background, config, "text")
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
              type: "textShadow",
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
                  shadowColorPalette,
                  textShadowBlur,
                  textShadowColorHex,
                  textShadowHorizontal,
                  textShadowColorOpacity,
                  textShadowColorPalette,
                  textShadowVertical
                });
              }
            }
          ]
        },
        {
          id: "tabImage",
          label: t("Mask"),
          options: [
            // Use population option type instead of using the `legacy-population` config for imageUpload,
            // because the population id and imageUpload id are different.
            {
              id: "image",
              type: "population",
              label: t("Image"),
              config: imageDynamicContentChoices,
              fallback: {
                id: keyToDCFallback2Key("image"),
                type: "imageUpload"
              },
              option: {
                id: "",
                type: "imageUpload",
                config: {
                  edit: device === "desktop",
                  disableSizes: true,
                  pointer: isPointerEnabled
                },
                dependencies: (patch) => {
                  onChange({ backgroundImage: patchImage(v, patch) });
                }
              },
              dependencies: (patch) => {
                onChange({
                  ...patch,
                  backgroundImage: patchImagePopulation(v, patch)
                });
              }
            }
          ]
        }
      ]
    }
  ];
}

function getTextPopulationOptions(config, onChange) {
  const isPointerEnabled = isBackgroundPointerEnabled(config, "richText");

  return [
    {
      id: "tabsColor",
      className: "",
      type: "tabs",
      tabs: [
        {
          id: "tabText",
          label: t("Color"),
          options: [
            {
              id: "",
              type: "backgroundColor",
              states: [NORMAL],
              dependencies: (value) => {
                onChange(changeColor(value, ColorOption.Color, config));
              }
            }
          ]
        },
        {
          id: "tabBg",
          label: t("Bg. Color"),
          options: [
            {
              id: "text",
              type: "backgroundColor",
              states: [NORMAL]
            }
          ]
        },
        {
          id: "tabShadow",
          label: t("Shadow"),
          options: [
            {
              id: "textShadow",
              type: "textShadow"
            }
          ]
        },
        {
          id: "mask",
          label: t("Mask"),
          options: [
            {
              id: "bg",
              type: "imageUpload",
              label: t("Image"),
              config: {
                pointer: isPointerEnabled
              }
            }
          ]
        }
      ]
    }
  ];
}

const getColorToolbar = (v, { device, context }, onChange, config) => {
  const {
    isPopulationBlock,
    populationColor,
    colorOpacity,
    textPopulation,
    color
  } = v;

  let backgroundColor;

  const dvv = (key) => defaultValueValue({ v, key, device });

  if (textPopulation) {
    backgroundColor = getColor(
      dvv("bgColorPalette"),
      dvv("bgColorHex"),
      colorOpacity
    );
  } else {
    // something the color is not defined
    backgroundColor = getColorValue(color ?? {});
  }

  return {
    id: "toolbarColor",
    type: "popover",
    config: {
      size: "medium",
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
        ? getTextPopulationOptions(config, onChange)
        : getSimpleColorOptions(v, { device, context }, onChange, config)
  };
};

export default getColorToolbar;
