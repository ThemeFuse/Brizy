import { makeRichTextDCColorCSS } from "visual/utils/color";
import { Hex } from "visual/utils/color/Hex";
import { Palette } from "visual/utils/color/Palette";
import { Opacity } from "visual/utils/cssProps/opacity";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { decodeFromString } from "visual/utils/string";
import { uuid } from "visual/utils/uuid";

interface DecodedColor {
  [k: string]: {
    hex: Hex | undefined;
    opacity: Opacity | undefined;
    colorPalette: Palette[] | undefined;
  };
}

export const getDCColor = ($: cheerio.Root): string[] => {
  const rules: string[] = [];
  const $richText = $(".brz-rich-text");

  $richText
    .find(`.brz-tp__dc-block[${makeAttr("color")}]`)
    .each(function (this: cheerio.Element) {
      const $this = $(this);
      const color = $this.attr(makeAttr("color")) || "";
      const decodedColor = decodeFromString<DecodedColor>(color);
      const className = `dc-color-${uuid(5)}`;
      $this.addClass(className);
      $this.removeAttr(makeAttr("color"));

      const currentRule: string = Object.entries(decodedColor)
        .reduce((acc, [key, value]) => {
          const newClassName = `.${className} ${key}`;
          acc.push(makeRichTextDCColorCSS(newClassName, value));

          return acc;
        }, [] as string[])
        .join("");

      rules.push(currentRule);
    });

  // HACK.Sometimes usual paragraph has data-color attribute
  $richText
    .find(makeDataAttrString({ name: "color" }))
    .each(function (this: cheerio.Cheerio) {
      $(this).removeAttr(makeAttr("color"));
    });

  if (rules.length === 0) {
    return [];
  }

  return rules;
};
