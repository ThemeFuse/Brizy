import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { makeRichTextDCColorCSS } from "visual/utils/color";
import { Opacity } from "visual/utils/cssProps/opacity";
import { decodeFromString } from "visual/utils/string";
import { uuid } from "visual/utils/uuid";

interface DecodedColor {
  [k: string]: {
    hex: string | undefined;
    opacity: Opacity | undefined;
    colorPalette: string | undefined;
  };
}

export const getDCColor = ($: cheerio.Root, config: ConfigCommon): string[] => {
  const rules: string[] = [];
  const $richText = $(".brz-rich-text");

  $richText.find(".brz-tp__dc-block[data-color]").each(function (
    this: cheerio.Element
  ) {
    const $this = $(this);
    const color = $this.attr("data-color") || "";
    const decodedColor = decodeFromString<DecodedColor>(color);
    const className = `dc-color-${uuid(5)}`;
    $this.addClass(className);
    $this.removeAttr("data-color");

    const currentRule: string = Object.entries(decodedColor)
      .reduce((acc, [key, value]) => {
        const newClassName = `.${className} ${key}`;
        const css = makeRichTextDCColorCSS(newClassName, value, config);

        if (css) {
          acc.push(css);
        }

        return acc;
      }, [] as string[])
      .join("");

    rules.push(currentRule);
  });

  // HACK.Sometimes usual paragraph has data-color attribute
  $richText.find("[data-color]").each(function (this: cheerio.Cheerio) {
    $(this).removeAttr("data-color");
  });

  if (rules.length === 0) {
    return [];
  }

  return rules;
};
