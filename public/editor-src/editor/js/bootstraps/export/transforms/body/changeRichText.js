const linkClassNames = ["link--anchor", "link--external", "is-empty"];

export default function changeRichText($) {
  // Change Links
  $(".brz-rich-text")
    .find("a[data-href]")
    .each(function() {
      const $this = $(this);
      const html = $this.html();
      const className = $this.attr("class") || "";
      const style = $this.attr("style") || "";
      const href = $this.attr("data-href");
      const data = JSON.parse(decodeURIComponent(href));
      const externalLink = {
        external: data.external,
        population: data.population
      };
      const newData = {
        ...data,
        // when we added dynamic content old links
        // did not have data.externalType
        // so temporarily defaulted to external
        external: data.externalType
          ? externalLink[data.externalType]
          : externalLink.external
      };
      const url = newData[data.type];
      const target =
        newData.type === "external" && newData.externalBlank === "on"
          ? `target="_blank"`
          : "";
      const rel =
        newData.type === "external" && newData.externalRel === "on"
          ? `rel="nofollow"`
          : "";

      if (url) {
        $this.replaceWith(
          `<a
            href="${url}"
            ${target}
            ${rel}
            style="${style}"
            class="${className}"
            data-brz-link-type="${data.type}"
          >
            ${html}
          </a>`
        );
      } else {
        const classNames = linkClassNames.join(" ");
        $this.replaceWith(`<span class="brz-span">${html}</span>`);
        $this.removeClass(classNames);
        $this.removeAttr("data-href");
      }
    });

  // replace DynamicContent
  $(".brz-rich-text")
    .find("[data-population]")
    .each(function() {
      const $this = $(this);
      const population = $this.attr("data-population");
      $this.html(`{{${population}}}`);
    });
}
