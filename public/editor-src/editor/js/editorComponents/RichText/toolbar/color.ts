import { Num, Str } from "@brizy/readers";
import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { Config } from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import { DeviceMode } from "visual/types";
import {
  getColorToolbar as getColor,
  hexToRgba,
  makeStylePaletteCSSVar
} from "visual/utils/color";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { read as readNum } from "visual/utils/reader/number";
import { read as readStr } from "visual/utils/reader/string";
import { NORMAL } from "visual/utils/stateMode";
import { capByPrefix } from "visual/utils/string";
import { BackgroundImage, Patch, Value } from "../types";
import { PopulationColor, getPopulationColor } from "../utils/dependencies";
import { ColorOption } from "./types";
import { colorValues, gradientValues } from "./utils";

type OnChange = (data: Patch) => void;

const getColorValue = ({ hex, opacity }: { hex: string; opacity: number }) =>
  hexToRgba(hex, opacity);

export const shadowToString = (
  value: {
    palette: string;
    opacity: number;
    horizontal: number;
    vertical: number;
    blur: number;
    hex: string;
  },
  config: ConfigCommon
) => {
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

export const changeColor = (
  value: Partial<Value>,
  type: ColorOption,
  config: Config,
  prefix = "",
  device: DeviceMode = "desktop"
) => {
  const selectTypeKey = capByPrefix(prefix, "bgColorType");
  const selectType =
    value[defaultValueKey({ key: selectTypeKey, device, state: "normal" })];
  const v = value;

  switch (selectType) {
    case "gradient":
      return Object.assign({}, v, gradientValues(type, value, prefix, device));
    case "solid":
      return Object.assign(
        {},
        v,
        colorValues({ type, value, config, prefix, device })
      );
    default:
      return Object.assign(
        {},
        v,
        gradientValues(type, value, prefix, device),
        colorValues({ type, value, config, prefix, device })
      );
  }
};

function getPopulationTabs(
  { populationColor }: { populationColor: PopulationColor },
  onChange: OnChange
) {
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
        dependencies: (data: Value) =>
          onChange({
            ...data,
            populationColor: getPopulationColor(populationColor, key, data)
          })
      }
    ]
  }));
}

function getPopulationColorOptions(
  { populationColor }: { populationColor: PopulationColor },
  onChange: OnChange
) {
  return [
    {
      id: "colorTabs",
      type: "tabs",
      devices: "desktop",
      tabs: getPopulationTabs({ populationColor }, onChange)
    }
  ];
}

export function patchImage(v: Value, patch: Value, prefix = "") {
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
    imageSrc: Str.read(imageSrc) ?? "",
    imageFileName: Str.read(imageFileName) ?? "",
    imageExtension: Str.read(imageExtension) ?? "",
    imageWidth: Num.read(imageWidth) ?? 0,
    imageHeight: Num.read(imageHeight) ?? 0,
    imagePositionX: Num.read(imagePositionX) ?? 0,
    imagePositionY: Num.read(imagePositionY) ?? 0
  };
}

export function patchImagePopulation(v: Value, patch: Partial<Value>) {
  const {
    imagePopulation,
    imagePopulationEntityId,
    imagePopulationEntityType
  } = patch;
  const imageData: Partial<BackgroundImage> = {
    imageSrc: Str.read(v.imageSrc) ?? "",
    imageFileName: Str.read(v.imageFileName) ?? "",
    imageExtension: Str.read(v.imageExtension) ?? "",
    imageWidth: Num.read(v.imageWidth) ?? 0,
    imageHeight: Num.read(v.imageHeight) ?? 0,
    imagePositionX: Num.read(v.imagePositionX) ?? 0,
    imagePositionY: Num.read(v.imagePositionY) ?? 0
  };
  const populationAttr: { entityId?: string; entityType?: string } = {};

  if (Str.is(imagePopulationEntityId)) {
    populationAttr.entityId = imagePopulationEntityId;
  }
  if (Str.is(imagePopulationEntityType)) {
    populationAttr.entityType = imagePopulationEntityType;
  }

  const population = imagePopulation
    ? makePlaceholder({
        content: Str.read(imagePopulation) ?? "",
        attr: populationAttr
      })
    : undefined;

  return {
    ...imageData,
    imagePopulationEntityType: Str.read(imagePopulationEntityType),
    imagePopulationEntityId: Str.read(imagePopulationEntityId),
    imagePopulation: population
  };
}

export const getShadowData = (value: Partial<Value>, config: ConfigCommon) => {
  const {
    textShadowColorHex,
    textShadowColorOpacity,
    textShadowColorPalette,
    textShadowHorizontal,
    textShadowVertical,
    textShadowBlur
  } = value;

  let shadow: {
    hex: string;
    opacity: number;
    horizontal: number;
    vertical: number;
    blur: number;
    palette: string;
  } = {
    hex: readStr(textShadowColorHex) ?? "",
    opacity: readNum(textShadowColorOpacity) ?? 1,
    horizontal: readNum(textShadowHorizontal) ?? 0,
    vertical: readNum(textShadowVertical) ?? 0,
    blur: readNum(textShadowBlur) ?? 0,
    palette: ""
  };

  if (Str.is(textShadowColorPalette)) {
    shadow = { ...shadow, palette: textShadowColorPalette };
  }

  return {
    shadow: shadowToString(shadow, config),
    shadowColorPalette: textShadowColorPalette
  };
};

function getSimpleColorOptions(
  v: Value,
  {
    context,
    device
  }: { context: EditorComponentContextValue; device: DeviceMode },
  onChange: OnChange,
  config: Config
) {
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
              dependencies: (value: Value) => {
                onChange(
                  changeColor(value, ColorOption.Color, config, "", device)
                );
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
              dependencies: (value: Value) => {
                onChange(
                  changeColor(
                    value,
                    ColorOption.Background,
                    config,
                    "text",
                    device
                  )
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
              devices: "desktop",
              dependencies: ({
                textShadowBlur,
                textShadowColorHex,
                textShadowHorizontal,
                textShadowColorOpacity,
                textShadowColorPalette,
                textShadowVertical
              }: Value) => {
                let shadow = {
                  hex: textShadowColorHex,
                  opacity: textShadowColorOpacity,
                  horizontal: textShadowHorizontal,
                  vertical: textShadowVertical,
                  blur: textShadowBlur,
                  palette: ""
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
              devices: "desktop",
              option: {
                id: "",
                type: "imageUpload",
                config: {
                  edit: device === "desktop",
                  disableSizes: true,
                  pointer: isPointerEnabled
                },
                dependencies: (patch: Value) => {
                  onChange({ backgroundImage: patchImage(v, patch) });
                }
              },
              dependencies: (patch: Value) => {
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

function getTextPopulationOptions(
  config: Config,
  { onChange, device }: { onChange: OnChange; device: DeviceMode }
) {
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
              dependencies: (value: Value) => {
                onChange(
                  changeColor(value, ColorOption.Color, config, "", device)
                );
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

const getColorToolbar = (
  v: Value,
  {
    device,
    context
  }: { device: DeviceMode; context: EditorComponentContextValue },
  onChange: OnChange,
  config: Config
) => {
  const {
    isPopulationBlock,
    populationColor,
    colorOpacity,
    textPopulation,
    color
  } = v;

  let backgroundColor;

  const dvv = (k: string) => defaultValueValue({ v, key: k, device });

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
    roles: ["admin"],
    position: 20,
    options: isPopulationBlock
      ? getPopulationColorOptions(
          { populationColor: populationColor as PopulationColor },
          onChange
        )
      : v.textPopulation
        ? getTextPopulationOptions(config, { onChange, device })
        : getSimpleColorOptions(v, { device, context }, onChange, config)
  };
};

export default getColorToolbar;
