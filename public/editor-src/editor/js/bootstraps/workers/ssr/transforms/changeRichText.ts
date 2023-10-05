import { Type as LinkType } from "visual/component/Link/types/Type";
import Config, { Config as Conf, isWp } from "visual/global/Config";
import { SizeType } from "visual/global/Config/types/configs/common";
import { pageDataNoRefsSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Block } from "visual/types";
import { getImageUrl, imagePopulationUrl, defaultImagePopulation } from "visual/utils/image";

const linkClassNames = [
  "link--anchor",
  "link--external",
  "link--popup",
  "is-empty"
];

export const changeRichText = ($: cheerio.Root): void => {
  const config = Config.getAll();
  const $richText = $(".brz-rich-text");
  const dynamicContent = Config.getAll()?.dynamicContent;
  const useCustomPlaceholder = dynamicContent?.useCustomPlaceholder ?? false;

  // Change Links
  $richText
    .find("a[data-href]")
    .filter(function (this: cheerio.Cheerio) {
      const attr = $(this).attr("data-href") ?? "";
      return attr.trim().length > 0;
    })
    .each(function (this: cheerio.Cheerio) {
      const $this = $(this);
      const html = $this.html();
      const className = $this.attr("class") || "";
      const style = $this.attr("style") || "";
      const href = $this.attr("data-href") ?? "";
      const data = JSON.parse(decodeURIComponent(href));
      const externalLink: Record<string, string> = {
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
      const link = $(`<a>${html}</a>`);

      link.attr("class", className);

      if (style) {
        link.attr("style", style);
      }

      if (data.type === "linkToSlide") {
        link.attr("href", "#");
        link.attr("data-brz-link-story", newData.linkToSlide);

        $this.replaceWith(link);
      } else if (url) {
        link.attr("href", getLinkContentByType(data.type, url, config));
        link.attr("data-brz-link-type", data.type);

        if (newData.type === "external" && newData.externalBlank === "on") {
          link.attr("target", "_blank");
        }
        if (newData.type === "external" && newData.externalRel === "on") {
          link.attr("rel", "nofollow");
        }
        $this.replaceWith(link);
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
  $richText.find("[data-population]").each(function (this: cheerio.Cheerio) {
    const $this = $(this);
    const population = $this.attr("data-population");
    const $blockDynamicContentElem = $this.closest(".brz-tp__dc-block");
    let $elem: cheerio.Cheerio | undefined = undefined;

    if ($blockDynamicContentElem.length) {
      $elem = $blockDynamicContentElem;

      const classNames =
        $elem
          ?.attr("class")
          ?.split(" ")
          .filter(
            (className) =>
              className.startsWith("brz-tp__dc-block") ||
              className.startsWith("brz-mt") ||
              className.startsWith("dc-color") ||
              className.startsWith("brz-mb")
          )
          .join(" ") ?? "";
      $elem.attr("class", classNames);
    } else {
      $elem = $this;
    }

    let _population;

    if (useCustomPlaceholder) {
      _population = population;
      // Removed extra attribute
      $elem.removeAttr("data-population");
    } else {
      _population = `{{${population}}}`;
    }

    // Override current html with placeholder
    if (_population) {
      $elem.html(_population);
    }
  });

  // replace Image
  $richText
    .find(".brz-text-mask, .brz-population-mask")
    .each(function (this: cheerio.Cheerio) {
      const $this = $(this);
      const src = $this.attr("data-image_src") ?? "";
      const population = $this.attr("data-image_population");
      const fileName = $this.attr("data-image_file_name") ?? "image";

      const imgUrl = getImageUrl({
        fileName,
        uid: src,
        sizeType: SizeType.custom
      });

      // required some property
      const css = $this.css();
      const newCSS = Object.entries(css).reduce((acc, [property, value]) => {
        // cheeriojs have bug for background-image: url("someurl")
        // this is small fix for this case
        if (!property.includes("http")) {
          acc[property] = value;
        }

        return acc;
      }, {} as Record<string, string>);

      $this.removeAttr("style");

      if (population) {
        $this.css({
          ...newCSS,
          "background-image": `url('${imagePopulationUrl(population, {
            ...defaultImagePopulation,
            useCustomPlaceholder
          })}')`
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
};

function getLinkContentByType(
  type: LinkType,
  href: string,
  config: Conf
): string {
  switch (type) {
    case "anchor": {
      href = href.replace("#", "");
      const pageDataNoRefs = pageDataNoRefsSelector(getStore().getState());
      const pageBlocks: Array<Block> = pageDataNoRefs.items || [];
      const blockByHref = pageBlocks.find((block) => block.value._id === href);
      const anchorName = (blockByHref && blockByHref.value.anchorName) || href;

      return `#${anchorName}`;
    }
    case "upload": {
      const { customFile } = config.urls;
      const [name] = href.split("|||", 1);

      return isWp(config) ? `${customFile}${name}` : `${customFile}/${name}`;
    }
    case "popup":
    case "lightBox":
    case "external":
    case "story":
    case "action":
    case "page":
      return href;
  }
}
