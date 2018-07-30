const linkClassNames = ["link--anchor", "link--external", "is-empty"];

export default function changeRichTextLinks($) {
  $(".brz-rich-text")
    .find("a[data-href]")
    .each(function() {
      const $this = $(this);
      const html = $this.html();
      const className = $this.attr("class") || "";
      const style = $this.attr("style") || "";
      const href = $this.attr("data-href");
      const data = JSON.parse(decodeURIComponent(href));
      const url = data[data.type];
      const target =
        data.type === "external" && data.externalBlank === "on"
          ? `target="_blank"`
          : "";
      const rel =
        data.type === "external" && data.externalRel === "on"
          ? `rel="nofollow"`
          : "";

      if (url) {
        $this.replaceWith(
          `<a href="${url}" ${target} ${rel} style="${style}" class="${className}">${html}</a>`
        );
      } else {
        const classNames = linkClassNames.join(" ");
        $this.replaceWith(`<span class="brz-span">${html}</span>`);
        $this.removeClass(classNames);
        $this.removeAttr("data-href");
      }
    });
}
