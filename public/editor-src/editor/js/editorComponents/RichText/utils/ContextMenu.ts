import { Num, Str } from "@brizy/readers";
import { getIn } from "timm";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import configRules from "visual/config/rules";
import { attachMenu } from "visual/editorComponents/Page/utils/helpers/normalize";
import {
  ConfigCommon,
  MenuData
} from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode, isStory } from "visual/providers/EditorModeProvider";
import { copiedElementNoRefsSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import { hexToRgba } from "visual/utils/color";
import { detectOS } from "visual/utils/dom/detectOS";
import { hasSomeKey } from "visual/utils/reader/object";
import { capByPrefix } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import defaultValue from "../defaultValue.json";
import {
  changeColor,
  getShadowData,
  patchImagePopulation
} from "../toolbar/color";
import { ColorOption } from "../toolbar/types";
import { Patch, patchTextTransform } from "./dependencies";

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

export const handleRenderText = (key: string[]) => () => {
  const os = detectOS();
  const isMac = os === "MacOS";
  const nestedKeys = key.join(" + ");
  return isMac ? `⌘ + ${nestedKeys}` : `ctrl + ${nestedKeys}`;
};

export const getInnerElement = (
  state: ReduxState,
  menuData: MValue<MenuData[]>
): InnerElementType | null => {
  let copiedElement;
  const { path, value } = copiedElementNoRefsSelector(
    state
  ) as unknown as CopiedElementRef;

  if (value && path.length > 0) {
    copiedElement = getIn(attachMenu({ model: value, menuData }), path);
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

const convertStylesFromDCToCustom = (dcValue: Value, config: ConfigCommon) => {
  const shadowData = getShadowData(dcValue, config);

  return {
    ...dcValue,
    ...shadowData,
    ...changeColor(dcValue, ColorOption.Color, config),
    ...changeColor(dcValue, ColorOption.Background, config, "text")
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

const patchCustomValue = (values: Value, v: Value, config: ConfigCommon) => {
  const {
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
  const bgColorHex = Str.read(values.bgColorHex);
  const bgColorOpacity = Num.read(values.bgColorOpacity) ?? 1;
  const textBgColorHex = Str.read(values.textBgColorHex);
  const textBgColorOpacity = Num.read(values.textBgColorOpacity) ?? 1;

  const color = bgColorHex ? hexToRgba(bgColorHex, bgColorOpacity) : "";
  const background = textBgColorHex
    ? hexToRgba(textBgColorHex, textBgColorOpacity)
    : "";
  const shadowData = getShadowData(values, config);

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

const getPrefixes = (device: DeviceMode) => {
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
    "textGradient",
    "image",
    "contentHorizontalAlign"
  ];

  if (device === "desktop") {
    return prefixes;
  }

  return prefixes.map((prefix) => capByPrefix(device, prefix));
};

export const handlePasteStyles = ({
  innerElement,
  onChange,
  v,
  device,
  config
}: {
  innerElement: InnerElementType;
  onChange: (v: Value) => void;
  v: ElementModel;
  device: DeviceMode;
  config: ConfigCommon;
}) => {
  const { textPopulation } = innerElement.value;
  const prefixes = getPrefixes(device);

  const values = getStyles(innerElement.value, prefixes);
  const extraStyles = getExtraStyles(values, device);

  if (extraStyles) {
    if (textPopulation) {
      return onChange(
        convertStylesFromDCToCustom(patchDCValue(extraStyles), config)
      );
    }

    const customValues = patchCustomValue(extraStyles, v, config);
    onChange(customValues);
  }
};

export const handleClearFormatting = ({
  onChange,
  editorMode,
  config
}: {
  onChange: (v: Value) => void;
  editorMode: EditorMode;
  config: ConfigCommon;
}) => {
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
    ...(isStory(editorMode) && { width: configRules["story-richText"].width }),
    ...color,
    ...textBgColor,
    background: null,
    shadow: null,
    shadowColorPalette: textShadowColorPalette,
    backgroundImage,
    typographyFontStyle: "paragraph"
  });
};
