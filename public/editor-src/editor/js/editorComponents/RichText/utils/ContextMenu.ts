import { getIn } from "timm";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { attachMenu } from "visual/editorComponents/Page/utils/helpers/normalize";
import {
  changeColor,
  getColorValues,
  patchImage,
  shadowToString
} from "visual/editorComponents/RichText/toolbar/color";
import { ColorOption } from "visual/editorComponents/RichText/toolbar/types";
import Config from "visual/global/Config";
import { copiedElementNoRefsSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { detectOS } from "visual/utils/dom/detectOS";
import { pipe } from "visual/utils/fp";
import { read as readNum } from "visual/utils/reader/number";
import { hasKey, isObject } from "visual/utils/reader/object";
import { read as readStr } from "visual/utils/reader/string";

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

type Shadow = {
  hex: string;
  opacity: number;
  horizontal: number;
  vertical: number;
  blur: number;
  palette?: string;
};

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

  const innerElement = getIn(copiedElement, ["value", "items", 0]) as
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
  const {
    textShadowColorHex,
    textShadowColorOpacity,
    textShadowColorPalette,
    textShadowHorizontal,
    textShadowVertical,
    textShadowBlur
  } = styles;

  let shadow: Shadow = {
    hex: readStr(textShadowColorHex) ?? "",
    opacity: readNum(textShadowColorOpacity) ?? 1,
    horizontal: readNum(textShadowHorizontal) ?? 0,
    vertical: readNum(textShadowVertical) ?? 0,
    blur: readNum(textShadowBlur) ?? 0
  };

  let shadowColorPalette = null;

  if (textShadowColorPalette) {
    shadow = { ...shadow, palette: readStr(textShadowColorPalette) };
    shadowColorPalette = textShadowColorPalette;
  }

  return {
    ...styles,
    shadow: shadowToString(shadow, config),
    shadowColorPalette,
    ...changeColor(getColorValues(v, styles), ColorOption.Color, config),
    ...changeColor(
      getColorValues(v, styles, "text"),
      ColorOption.Background,
      config,
      "text"
    ),
    backgroundImage: patchImage(v, styles, "bg")
  };
};

const convertStylesFromCustomToDC = (styles: Value, v: Value) => {
  if (hasKey("backgroundImage", styles) && isObject(styles.backgroundImage)) {
    const { backgroundImage } = styles;

    const {
      imageExtension = v.imageExtension,
      imageFileName = v.imageFileName,
      imageSrc = v.imageSrc,
      imageHeight = v.imageHeight,
      imageWidth = v.imageWidth,
      imagePositionX = v.imagePositionX,
      imagePositionY = v.imagePositionY
    } = backgroundImage;

    return {
      ...styles,
      bgImageExtension: imageExtension ?? v.bgImageExtension,
      bgImageFileName: imageFileName ?? v.bgImageFileName,
      bgImageHeight: imageHeight ?? v.bgImageHeight,
      bgImageSrc: imageSrc ?? v.bgImageSrc,
      bgImageWidth: imageWidth ?? v.bgImageWidth,
      bgPositionX: imagePositionX ?? v.bgPositionX,
      bgPositionY: imagePositionY ?? v.bgPositionY
    };
  }
  return styles;
};

export const handlePasteStyles = (
  innerElement: InnerElementType,
  onChange: (v: Value) => void,
  v: ElementModel
) => {
  const prefixes = [
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
    "textGradient"
  ];
  const { textPopulation } = innerElement.value;

  const values = pipe<string[], Value, Value>(
    (value) => getStyles(innerElement.value, value),
    (value) => convertStylesFromCustomToDC(value, v)
  )(prefixes);

  if (values) {
    if (textPopulation) {
      return onChange(convertStylesFromDCToCustom(values, v));
    }

    onChange(values);
  }
};
