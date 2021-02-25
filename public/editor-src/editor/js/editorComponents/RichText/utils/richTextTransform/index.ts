/* eslint-disable @typescript-eslint/no-use-before-define */
import { uuid } from "visual/utils/uuid";
import cheerio from "cheerio";
import _ from "underscore";
import { renderStyles, css1 } from "visual/utils/cssStyle";
import { defaultValueKey } from "visual/utils/onChange";
import { getFontStyle } from "visual/utils/fonts";
import { read as readNumber } from "visual/utils/reader/number";

import { ElementModel } from "visual/component/Elements/Types";
import { DeviceMode } from "visual/types";
import { FontStyle } from "visual/types";
import { DesktopFontsKey, FontKey, SingleStyles } from "./types";

const styles = {
  ".brz &&:hover": {
    standart: [
      "cssStyleColor",
      "cssStyleElementRichTextMartinTop",
      "cssStyleElementRichTextMartinBottom",
      "cssStyleContentAlign",
      "cssStyleTypography2FontFamily",
      "cssStyleTypography2FontSize",
      "cssStyleTypography2LineHeight",
      "cssStyleTypography2FontWeight",
      "cssStyleTypography2LetterSpacing"
    ]
  }
};

export default function changeRichTextFonts(
  elementId: string,
  html: string
): string {
  const $ = cheerio.load(`<div class="brz-temp-div">${html}</div>`);
  $(":header, p, pre, li, div:not(.brz-temp-div)").each((i, elem) => {
    const styles = getStyles(elementId, $(elem));

    const { className } = css1(styles.id, styles.css);
    const extraClassNames = getExtraClassNames($(elem));

    $(elem).attr("class", [className, ...extraClassNames].join(" "));
  });

  const $elem = $(".brz-temp-div") as cheerio.Cheerio;

  return $elem.html() as string;
}

function getExtraClassNames($elem: cheerio.Cheerio): string[] {
  const extraClassNames = [];

  if ($elem.is("*[class*='brz-tp__dc-block']")) {
    extraClassNames.push("brz-tp__dc-block");
  }

  if ($elem.is("*[class*='brz-tp__dc-block-st1']")) {
    extraClassNames.push("brz-tp__dc-block-st1");
  }

  return extraClassNames;
}

export function getValue(
  $this: cheerio.Cheerio
): {
  v: ElementModel;
  vs: ElementModel;
  vd: ElementModel;
} {
  const desktopHasTypography = $this.is("*[class*='brz-tp-lg']");
  const tabletHasTypography = $this.is("*[class*='brz-tp-sm']");
  const mobileHasTypography = $this.is("*[class*='brz-tp-xs']");

  const hasNewFontStyle =
    desktopHasTypography || tabletHasTypography || mobileHasTypography;

  let v: ElementModel = {};

  if (hasNewFontStyle) {
    v = {
      ...(mobileHasTypography && getTypographyStyles($this, "mobile")),
      ...(tabletHasTypography && getTypographyStyles($this, "tablet")),
      ...(desktopHasTypography && getTypographyStyles($this, "desktop"))
    };
  } else if ($this.is("*[class*='brz-tp']")) {
    const fontStyleKey = getValueByClassName($this, "brz-tp");
    const fontStyle = getFontStyle(fontStyleKey) || {};

    v = _.pick(
      fontStyle,
      ...getFontKeysByDevice("desktop"),
      ...getFontKeysByDevice("tablet"),
      ...getFontKeysByDevice("mobile"),
      "fontFamily",
      "fontFamilyType"
    );
  }

  if ($this.is("*[class*='brz-fs-lg']")) {
    const desktopV = getStylesByDevice($this, "desktop");
    v = {
      ...v,
      ...desktopV,
      fontFamily: getValueByClassName($this, "brz-ff"),
      fontFamilyType: getValueByClassName($this, "brz-ft")
    };
  }

  if ($this.is("*[class*='brz-fs-sm']")) {
    const tabletV = getStylesByDevice($this, "tablet");
    v = { ...v, ...tabletV };
  }

  if ($this.is("*[class*='brz-fs-xs']")) {
    const mobileV = getStylesByDevice($this, "mobile");
    v = { ...v, ...mobileV };
  }

  if ($this.is("*[class*='brz-bcp']")) {
    v.colorPalette = getValueByClassName($this, "brz-bcp");
  }

  v = {
    ...v,
    contentHorizontalAlign: $this.is("*[class*='brz-text-lg']")
      ? getValueByClassName($this, "brz-text-lg")
      : "left",
    tabletContentHorizontalAlign: $this.is("*[class*='brz-text-sm']")
      ? getValueByClassName($this, "brz-text-sm")
      : null,
    mobileContentHorizontalAlign: $this.is("*[class*='brz-text-xs']")
      ? getValueByClassName($this, "brz-text-xs")
      : null,

    marginTop: $this.is("*[class*='brz-mt-lg']")
      ? quillStringToNumber(getValueByClassName($this, "brz-mt-lg"))
      : 0,
    tabletMarginTop: $this.is("*[class*='brz-mt-sm']")
      ? quillStringToNumber(getValueByClassName($this, "brz-mt-sm"))
      : null,
    mobileMarginTop: $this.is("*[class*='brz-mt-xs']")
      ? quillStringToNumber(getValueByClassName($this, "brz-mt-xs"))
      : null,

    marginBottom: $this.is("*[class*='brz-mb-lg']")
      ? quillStringToNumber(getValueByClassName($this, "brz-mb-lg"))
      : 0,
    tabletMarginBottom: $this.is("*[class*='brz-mb-sm']")
      ? quillStringToNumber(getValueByClassName($this, "brz-mb-sm"))
      : null,
    mobileMarginBottom: $this.is("*[class*='brz-mb-xs']")
      ? quillStringToNumber(getValueByClassName($this, "brz-mb-xs"))
      : null,

    // old projects doesn't have this value
    // we set "px" for them
    fontSizeSuffix: v.fontSizeSuffix ?? "px",
    tabletFontSizeSuffix: v.tabletFontSizeSuffix ?? "px",
    mobileFontSizeSuffix: v.mobileFontSizeSuffix ?? "px"
  };

  const vs = {};
  const vd = {};

  return { v, vs, vd };
}

export function getStyles(
  elementId: string,
  $elem: cheerio.Cheerio
): {
  id: string;
  css: string;
} {
  const value = getValue($elem);
  const styleText = renderStyles({ ...value, props: {}, styles });

  return {
    // uuid(5) - there can be multiple paragraphs into one richTextShortcode
    // so we need different classnames for them
    id: `${elementId}-${uuid(5)}`,
    css: styleText[2]
  };
}

function getTypographyStyles(
  $elem: cheerio.Cheerio,
  device: DeviceMode
): Partial<FontStyle> {
  const className = getFontClassName("fontStyle", device);

  const fontStyleKey = getValueByClassName($elem, className);
  const fontStyle: FontStyle = getFontStyle(fontStyleKey) || {};

  return _.pick<FontStyle, FontKey | SingleStyles>(
    fontStyle,
    ...getFontKeysByDevice(device),
    "fontFamily",
    "fontFamilyType"
  );
}

// ! add function from zoom(reader)
function quillStringToNumber(num: unknown): number | unknown {
  const value = String(num)
    .replace("m_", "-")
    .replace("_", ".");

  const number = readNumber(value);
  if (number) {
    return number;
  }

  return num;
}

function getStylesByDevice(
  $elem: cheerio.Cheerio,
  device: DeviceMode
): ElementModel {
  return getDesktopFontList().reduce((acc, fontKey) => {
    const className = getFontClassName(fontKey, device);
    const intermediateClassName = getFontClassName(fontKey, device, true);

    const key = getFontKeyByDevice(fontKey, device);
    const value =
      getValueByClassName($elem, intermediateClassName) ??
      getValueByClassName($elem, className);

    return {
      ...acc,
      [key]: quillStringToNumber(value)
    };
  }, {});
}

function getDesktopFontList(): DesktopFontsKey[] {
  return [
    "fontSize",
    "fontSizeSuffix",
    "fontWeight",
    "lineHeight",
    "letterSpacing"
  ];
}

function getFontKeysByDevice(device: DeviceMode = "desktop"): FontKey[] {
  return getDesktopFontList().map(key => getFontKeyByDevice(key, device));
}

function getFontKeyByDevice(
  key: DesktopFontsKey,
  device: DeviceMode = "desktop"
): FontKey {
  const dvk = (key: DesktopFontsKey, device: DeviceMode = "desktop"): FontKey =>
    defaultValueKey({ key, device, state: "normal" }) as FontKey;

  return dvk(key, device);
}

function getFontClassName(
  key: DesktopFontsKey | "fontStyle",
  device: DeviceMode = "desktop",
  isIntermediate = false
): string {
  const classNamesRoots = {
    fontStyle: "brz-tp",
    fontSize: "brz-fs",
    lineHeight: "brz-lh",
    letterSpacing: "brz-ls",
    fontSizeSuffix: "brz-fss",
    fontWeight: "brz-fw",
    horizontalAlign: "brz-text",
    marginTop: "brz-mt",
    marginBottom: "brz-mb"
  };

  const deviceSuffix = {
    desktop: "lg",
    tablet: "sm",
    mobile: "xs"
  };

  const root = classNamesRoots[key];
  const suffix = deviceSuffix[device];
  const intermediateSuffix = isIntermediate ? "-im" : "";

  return `${root}-${suffix}${intermediateSuffix}`;
}

function getValueByClassName(
  $elem: cheerio.Cheerio,
  classNameRoot: string
): string | null {
  const regex = new RegExp(
    // eslint-disable-next-line no-useless-escape
    `${classNameRoot}-(.+?)(?: |$)`
  );
  const className = $elem.attr("class") || "";
  const value = className.match(regex);

  return value?.[1] ?? null;
}
