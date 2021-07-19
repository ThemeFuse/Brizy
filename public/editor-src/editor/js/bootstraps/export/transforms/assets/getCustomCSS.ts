import * as cheerio from "cheerio";

export const getCustomCSS = ($: cheerio.CheerioAPI): string[] => {
  let styles = "";

  $("[data-custom-css]").each(function(this: cheerio.Element) {
    const $this = $(this);
    const id = $this.attr("data-custom-id") || "";

    styles += $this.attr("data-custom-css");

    const children = $this.children();
    children.attr("data-custom-id", id);
    $this.replaceWith(children);
  });

  if (styles.length === 0) {
    return [];
  }

  return [`<style class="brz-style" id="custom-css">${styles}</style>`];
};
