import { xss } from "visual/utils/xss";

export function XSS($: cheerio.Root): void {
  const $richText = $(".brz-rich-text");
  const $links = $(".brz-a");

  // inline <script>
  // <a href="javscript:alert(a)></a>"
  $richText.each(function (this: cheerio.Element) {
    const $this = $(this);
    const html = $this.parent().html();

    if (html) {
      $this.replaceWith(xss(html, "escape"));
    }
  });

  $links.each(function (this: cheerio.Element) {
    const $this = $(this);
    const href = $this.attr("href")?.toLowerCase();

    if (href?.trim().startsWith("javascript")) {
      $this.attr("href", "");
    }
  });
}
