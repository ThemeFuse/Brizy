export const addDataColorAttribute = (
  $: cheerio.Root,
  $richText: cheerio.Cheerio
) => {
  $richText.find(".brz-tp__dc-block").each(function (this: cheerio.Cheerio) {
    const $this = $(this);
    const dataColor = $this.find("[data-color]").attr("data-color");
    if (dataColor) {
      $this.attr("data-color", dataColor);
    }
  });
};
