import { getIn } from "timm";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { attachMenu } from "visual/editorComponents/Page/utils/helpers/normalize";
import {
  changeColor,
  getColorValues,
  getShadowData,
  patchImagePopulation
} from "visual/editorComponents/RichText/toolbar/color";
import { ColorOption } from "visual/editorComponents/RichText/toolbar/types";
import Config from "visual/global/Config";
import { copiedElementNoRefsSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { hexToRgba } from "visual/utils/color";
import { detectOS } from "visual/utils/dom/detectOS";
import defaultValue from "../defaultValue.json";
import { hasSomeKey } from "visual/utils/reader/object";
import { Patch, patchTextTransform } from "./dependencies";
import { isStory } from "visual/utils/models";
import configRules from "visual/config/rules";
import { DeviceMode } from "visual/types";

type CopiedElementRef = {
  path: string[];
  value: ElementModelType;
};

type Value = {
  [key: string]: unknown;
};

type InnerElementType = {
  type: string;
  value: Value;
};

export const prefixes = [
  "typography",
  "color",
  "bgColor",
  "bgImage",
  "bgPosition",
  "background",
  "shadow",
  "gradient",
  "textBgColor",
  "textShadow",
  "textBackground",
  "textGradient",
  "image"
];

export const handleRenderText = (key: string[]) => () => {
  const os = detectOS();
  const isMac = os === "MacOS";
  const nestedKeys = key.join(" + ");
  return isMac ? `⌘ + ${nestedKeys}` : `ctrl + ${nestedKeys}`;
};

export const getInnerElement = (): InnerElementType | null => {
  let copiedElement;
  const { path, value } = copiedElementNoRefsSelector(
    getStore().getState()
  ) as unknown as CopiedElementRef;

  const config = Config.getAll();

  if (value && path.length > 0) {
    copiedElement = getIn(attachMenu({ model: value, config }), path);
  }

  if (!copiedElement) return null;

  const innerElement = getIn(copiedElement, ["items", 0]) as
    | InnerElementType
    | undefined;

  return innerElement ?? null;
};

const getStyles = (
  component: InnerElementType["value"],
  prefixes: string[]
) => {
  return Object.entries(component).reduce((styles: Value, [key, value]) => {
    const hasPrefix = prefixes.some((prefix) => key.includes(prefix));

    if (hasPrefix) styles[key] = value;
    return styles;
  }, {});
};

const convertStylesFromDCToCustom = (styles: Value, v: Value) => {
  const config = Config.getAll();
  const shadowData = getShadowData(styles, config);

  return {
    ...styles,
    ...shadowData,
    ...changeColor(getColorValues(v, styles), ColorOption.Color, config),
    ...changeColor(
      getColorValues(v, styles, "text"),
      ColorOption.Background,
      config,
      "text"
    )
  };
};

const patchDCValue = (values: Value) => {
  const {
    bgImageExtension,
    bgImageFileName,
    bgImageSrc,
    bgImageHeight,
    bgImageWidth,
    bgPositionX,
    bgPositionY
  } = values;

  const backgroundImage = {
    imageSrc: bgImageSrc,
    imageFileName: bgImageFileName,
    imageExtension: bgImageExtension,
    imageWidth: bgImageWidth,
    imageHeight: bgImageHeight,
    imagePositionX: bgPositionX,
    imagePositionY: bgPositionY
  };

  return {
    ...values,
    backgroundImage,
    bgImageExtension,
    bgImageFileName,
    bgImageSrc,
    bgImageHeight,
    bgImageWidth,
    bgPositionX,
    bgPositionY
  };
};

const patchCustomValue = (values: Value, v: Value) => {
  const {
    bgColorHex,
    bgColorOpacity,
    textBgColorHex,
    textBgColorOpacity,
    imageSrc = v.imageSrc,
    imageFileName = v.imageFileName,
    imageExtension = v.imageExtension,
    imagePositionX = v.imagePositionX,
    imagePositionY = v.imagePositionY,
    imageWidth = v.imageWidth,
    imageHeight = v.imageHeight,
    imagePopulation,
    imagePopulationEntityType,
    imagePopulationEntityId
  } = values;

  const color = hexToRgba(bgColorHex, bgColorOpacity) ?? "";
  const background = hexToRgba(textBgColorHex, textBgColorOpacity) ?? "";
  const shadowData = getShadowData(values, Config.getAll());

  const backgroundImage = imagePopulation
    ? patchImagePopulation(v, {
        imagePopulation,
        imagePopulationEntityType,
        imagePopulationEntityId
      })
    : {
        imageSrc,
        imageFileName,
        imageExtension,
        imagePositionX,
        imagePositionY,
        imageWidth,
        imageHeight
      };

  const bgImage = {
    bgImageExtension: imageExtension ?? v.bgImageExtension,
    bgImageFileName: imageFileName ?? v.bgImageFileName,
    bgImageHeight: imageHeight ?? v.bgImageHeight,
    bgImageSrc: imageSrc ?? v.bgImageSrc,
    bgImageWidth: imageWidth ?? v.bgImageWidth,
    bgPositionX: imagePositionX ?? v.bgPositionX,
    bgPositionY: imagePositionY ?? v.bgPositionY
  };

  return {
    ...values,
    ...shadowData,
    ...bgImage,
    color,
    background,
    backgroundImage
  };
};

const getExtraStyles = (styles: Patch, device: DeviceMode) => {
  const hasTextTransformStyle = hasSomeKey(
    [
      "typographyBold",
      "typographyItalic",
      "typographyUnderline",
      "typographyStrike",
      "typographyUppercase",
      "typographyLowercase"
    ],
    styles
  );

  return hasTextTransformStyle ? patchTextTransform(styles, device) : styles;
};

export const handlePasteStyles = ({
  innerElement,
  onChange,
  v,
  device
}: {
  innerElement: InnerElementType;
  onChange: (v: Value) => void;
  v: ElementModel;
  device: DeviceMode;
}) => {
  const { textPopulation } = innerElement.value;
  const values = getStyles(innerElement.value, prefixes);
  const extraStyles = getExtraStyles(values, device);

  if (extraStyles) {
    if (textPopulation) {
      const dcValues = patchDCValue(extraStyles);
      return onChange(convertStylesFromDCToCustom(dcValues, v));
    }

    const customValues = patchCustomValue(extraStyles, v);
    onChange(customValues);
  }
};

export const handleClearFormatting = (onChange: (v: Value) => void) => {
  const {
    bgColorType,
    bgColorHex,
    bgColorOpacity,
    bgColorPalette,
    textShadowColorPalette,
    bgImageWidth,
    bgImageHeight,
    textBgColorHex,
    textBgColorType,
    textBgColorOpacity,
    textBgColorPalette
  } = defaultValue.style;
  const {
    bgImageExtension,
    bgImageFileName,
    images: { bgImageSrc }
  } = defaultValue.content;

  const config = Config.getAll();
  const color = changeColor(
    {
      bgColorType,
      bgColorHex,
      bgColorOpacity,
      bgColorPalette
    },
    ColorOption.Color,
    config
  );

  const textBgColor = changeColor(
    {
      textBgColorHex,
      textBgColorType,
      textBgColorOpacity,
      textBgColorPalette
    },
    ColorOption.Background,
    config
  );

  const backgroundImage = {
    imageSrc: bgImageSrc,
    imageFileName: bgImageFileName,
    imageExtension: bgImageExtension,
    imageWidth: bgImageWidth,
    imageHeight: bgImageHeight,
    imagePositionX: 50,
    imagePositionY: 50
  };

  onChange({
    ...defaultValue.style,
    ...(isStory(config) && { width: configRules["story-richText"].width }),
    ...color,
    ...textBgColor,
    background: null,
    shadow: null,
    shadowColorPalette: textShadowColorPalette,
    backgroundImage,
    typographyFontStyle: "paragraph"
  });
};
