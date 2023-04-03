import Config from "visual/global/Config";
import { pageDataNoRefsSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { imagePopulationUrl, imageUrl, svgUrl } from "visual/utils/image";

const isWP = Config.get("wp");

const linkClassNames = [
  "link--anchor",
  "link--external",
  "link--popup",
  "is-empty"
];

const isSVG = (extension) => extension === "svg";

export default function changeRichText($) {
  // Change Links
  $(".brz-rich-text")
    .find("a[data-href]")
    .filter(function () {
      const attr = $(this).attr("data-href");
      return attr.trim().length > 0;
    })
    .each(function () {
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
          ? "target='_blank'"
          : "";
      const rel =
        newData.type === "external" && newData.externalRel === "on"
          ? "rel='nofollow'"
          : "";

      let url = newData[data.type];

      if (data.type === "linkToSlide") {
        $this.replaceWith(
          `<a
          href="#"
          style="${style}"
          class="${className}"
          data-brz-link-story="${newData.linkToSlide}"
          >${html}</a>`
        );
      } else if (url) {
        $this.replaceWith(
          `<a
            href='${getLinkContentByType(data.type, url)}'
            ${target}
            ${rel}
            style="${style}"
            class="${className}"
            data-brz-link-type="${data.type}"
          >${html}</a>`
        );
      } else {
        const newClassNames = className
          .split(" ")
          .filter((name) => !linkClassNames.includes(name))
          .join(" ");

        $this.replaceWith(
          `<span class="${newClassNames} brz-span" style="${style}">${html}</span>`
        );
      }
    });

  // replace DynamicContent
  $(".brz-rich-text")
    .find("[data-population]")
    .each(function () {
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
            (className) =>
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

      const dynamicContentOption = Config.getAll()?.dynamicContentOption;
      const useCustomPlaceholder =
        dynamicContentOption?.richText?.useCustomPlaceholder;

      let _population;

      if (useCustomPlaceholder) {
        _population = population;
        // Removed extra attribute
        $elem.removeAttr("data-population");
      } else {
        _population = `{{${population}}}`;
      }

      // Override current html with placeholder
      $elem.html(_population);
    });

  // replace Image
  $(".brz-rich-text")
    .find(".brz-text-mask, .brz-population-mask")
    .each(function () {
      const $this = $(this);
      const src = $this.attr("data-image_src");
      const population = $this.attr("data-image_population");
      const extension = $this.attr("data-image_extension");
      const fileName = $this.attr("data-image_file_name") ?? "image";

      const imgUrl = isSVG(extension)
        ? svgUrl(src, { fileName })
        : imageUrl(src, { fileName });

      const css = $this.css();
      const newCSS = Object.entries(css).reduce((acc, [property, value]) => {
        // cheeriojs have bug for background-image: url("someurl")
        // this is small fix for this case
        if (!property.includes("http")) {
          acc[property] = value;
        }

        return acc;
      }, {});

      $this.removeAttr("style");

      if (population) {
        $this.css({
          ...newCSS,
          "background-image": `url('${imagePopulationUrl(population)}')`
        });
      } else if (imgUrl)
        $this.css({
          ...newCSS,
          "background-image": `url('${imgUrl}')`
        });

      $this.removeAttr("data-image_src");
      $this.removeAttr("data-image_width");
      $this.removeAttr("data-image_height");
      $this.removeAttr("data-image_extension");
      $this.removeAttr("data-image_file_name");
      $this.removeAttr("data-image_population");
    });
}

function getLinkContentByType(type, href) {
  switch (type) {
    case "anchor": {
      href = href.replace("#", "");
      const pageDataNoRefs = pageDataNoRefsSelector(getStore().getState());
      const pageBlocks = pageDataNoRefs.items || [];
      const blockByHref = pageBlocks.find((block) => block.value._id === href);
      const anchorName = (blockByHref && blockByHref.value.anchorName) || href;

      return `#${anchorName}`;
    }
    case "upload": {
      const { customFile } = Config.get("urls");
      const [name] = href.split("|||", 1);

      return isWP ? `${customFile}${name}` : `${customFile}/${name}`;
    }
    case "popup":
    case "lightBox":
    case "external":
    case "story":
      return href;
  }

  return href;
}
