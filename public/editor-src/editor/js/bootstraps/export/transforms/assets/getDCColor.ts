import * as cheerio from "cheerio";
import { uuid } from "visual/utils/uuid";
import { makeRichTextDCColorCSS } from "visual/utils/color";
import { decodeFromString } from "visual/utils/string";
import { Hex } from "visual/utils/color/Hex";
import { Opacity } from "visual/utils/cssProps/opacity";
import { Palette } from "visual/utils/color/Palette";

export const getDCColor = ($: cheerio.CheerioAPI): string[] => {
  const rules: string[] = [];
  const $richText = $(".brz-rich-text");

  $richText
    .find(".brz-tp__dc-block[data-color]")
    .each(function(this: cheerio.Element) {
      const $this = $(this);
      const color = $this.attr("data-color") || "";
      const decodedColor = decodeFromString<
        Record<string, { hex: Hex; opacity: Opacity; colorPalette: Palette }>
      >(color);
      const className = `dc-color-${uuid(5)}`;
      $this.addClass(className);
      $this.removeAttr("data-color");

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
  $richText.find("[data-color]").each(function(this: cheerio.Cheerio) {
    $(this).removeAttr("data-color");
  });

  if (rules.length === 0) {
    return [];
  }

  return [`<style class="brz-style" id="dc-color">${rules.join("")}</style>`];
};
