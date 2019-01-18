import { getBlockById } from "visual/utils/blocks";

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

      const target =
        newData.type === "external" && newData.externalBlank === "on"
          ? `target="_blank"`
          : "";
      const rel =
        newData.type === "external" && newData.externalRel === "on"
          ? `rel="nofollow"`
          : "";

      let url = newData[data.type];
      if (url) {
        $this.replaceWith(
          `<a
            href="${getLinkContentByType(data.type, url)}"
            ${target}
            ${rel}
            style="${style}"
            class="${className}"
            data-brz-link-type="${data.type}"
          >${html}</a>`
        );
      } else {
        const classNames = linkClassNames.join(" ");
        const newClassNames = className
          .split(" ")
          .filter(name => !linkClassNames.includes(name))
          .join(" ");

        $this.replaceWith(
          `<span class="${newClassNames} brz-span" style="${style}">${html}</span>`
        );
      }
    });

  // replace DynamicContent
  $(".brz-rich-text")
    .find("[data-population]")
    .each(function() {
      const $this = $(this);
      const population = $this.attr("data-population");
      const $blockDynamicContentElem = $this.closest(".brz-tp__dc-block");
      let $elem;
      if ($blockDynamicContentElem.length) {
        $elem = $blockDynamicContentElem;
        const classNames = $elem
          .attr("class")
          .split(" ")
          .filter(
            className =>
              className.startsWith("brz-tp__dc-block") ||
              className.startsWith("brz-mt") ||
              className.startsWith("dc-color") ||
              className.startsWith("brz-mb")
          )
          .join(" ");
        $elem.attr("class", classNames);
      } else {
        $elem = $this;
      }

      $elem.html(`{{${population}}}`);
    });
}

function getLinkContentByType(type, href) {
  switch (type) {
    case "anchor":
      href = href.replace("#", "");
      const block = getBlockById(href);
      const anchorName = (block && block.value.anchorName) || href;

      return `#${anchorName}`;
    case "popup":
    case "lightBox":
    case "external":
      return href;
  }

  return href;
}
