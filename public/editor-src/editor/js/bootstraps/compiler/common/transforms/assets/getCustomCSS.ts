import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";

export const getCustomCSS = ($: cheerio.Root): string[] => {
  let styles = "";

  $(makeDataAttrString({ name: "custom-css" })).each(function (
    this: cheerio.Element
  ) {
    const $this = $(this);
    const id = $this.attr(makeAttr("custom-id")) || "";

    styles += $this.attr(makeAttr("custom-css"));

    const children = $this.children();
    children.attr(makeAttr("custom-id"), id);
    $this.replaceWith(children);
  });

  if (styles.length === 0) {
    return [];
  }

  return [styles];
};
