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

export const handlePasteStyles = (
  innerElement: InnerElementType,
  onChange: (v: Value) => void,
  v: ElementModel
) => {
  const { textPopulation } = innerElement.value;
  const values = getStyles(innerElement.value, prefixes);

  if (values) {
    if (textPopulation) {
      const dcValues = patchDCValue(values);
      return onChange(convertStylesFromDCToCustom(dcValues, v));
    }

    const customValues = patchCustomValue(values, v);
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
    bgImageHeight
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
    ...color,
    background: null,
    shadow: null,
    shadowColorPalette: textShadowColorPalette,
    backgroundImage,
    typographyFontStyle: "paragraph"
  });
};
