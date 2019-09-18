import { uuid } from "visual/utils/uuid";
import { makeRichTextDCColorCSS } from "visual/utils/color";
import { decodeFromString } from "visual/utils/string";

function changeRichTextDCColor($) {
  let rules = [];
  $(".brz-rich-text")
    .find(".brz-tp__dc-block[data-color]")
    .each(function() {
      const $this = $(this);
      const color = $this.attr("data-color");
      const decodedColor = decodeFromString(color);
      const className = `dc-color-${uuid(5)}`;
      $this.addClass(className);
      $this.removeAttr("data-color");

      const currentRule = Object.entries(decodedColor)
        .reduce((acc, [key, value]) => {
          const newClassName = `.${className} ${key}`;
          acc.push(makeRichTextDCColorCSS(newClassName, value));

          return acc;
        }, [])
        .join("");

      rules.push(currentRule);
    });

  // HACK.Sometimes usual paragraph has data-color attribute
  $(".brz-rich-text")
    .find("[data-color]")
    .each(function() {
      $(this).removeAttr("data-color");
    });

  $("head").append(`<style id="dc-color">${rules.join("")}</style>`);
}

export default changeRichTextDCColor;
