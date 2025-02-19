import * as cheerio from "cheerio";
import { Type as LinkType } from "visual/component/Link/types/Type";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { SizeType } from "visual/global/Config/types/configs/common";
import { configSelector, pageDataNoRefsSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { Block } from "visual/types/Block";
import { customFileUrl } from "visual/utils/customFile";
import { makePlaceholder } from "visual/utils/dynamicContent";
import {
  defaultImagePopulation,
  getImageUrl,
  imagePopulationUrl
} from "visual/utils/image";
import * as Str from "visual/utils/reader/string";

const linkClassNames = [
  "link--anchor",
  "link--external",
  "link--popup",
  "is-empty"
];

const addDataColorAttribute = ($: cheerio.Root, $richText: cheerio.Cheerio) => {
  $richText.find(".brz-tp__dc-block").each(function (this: cheerio.Cheerio) {
    const $this = $(this);
    const dataColor = $this.find("[data-color]").attr("data-color");
    if (dataColor) {
      $this.attr("data-color", dataColor);
    }
  });
};

export const changeRichText = (html: string, store: Store): string => {
  //@ts-expect-error: cheerio Load() can take 3 args https://cheerio.js.org/docs/api/functions/load
  const $ = cheerio.load(html, null, false);
  const $richText = $.root();
  const pageDataNoRefs = pageDataNoRefsSelector(store.getState());
  const pageBlocks: Array<Block> = pageDataNoRefs.items || [];

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
      const { population, populationEntityId, populationEntityType } =
        data ?? {};
      const populationAttr: { entityId?: string; entityType?: string } = {};

      if (populationEntityId) {
        populationAttr.entityId = populationEntityId;
      }
      if (populationEntityType) {
        populationAttr.entityType = populationEntityType;
      }

      const externalLink: Record<string, string> = {
        external: data.external,
        population: population
          ? makePlaceholder({
              content: population,
              attr: populationAttr
            })
          : ""
      };
      const internalLink: Record<string, string> = {
        page: data.internal
      };
      const newData = {
        ...data,
        // when we added dynamic content old links
        // did not have data.externalType
        // so temporarily defaulted to external
        external: data.externalType
          ? externalLink[data.externalType]
          : externalLink.external,
        page: data.internalType
          ? internalLink[data.internalType]
          : internalLink.page
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
        const config = configSelector(store.getState());
        link.attr(
          "href",
          getLinkContentByType(
            {
              type: data.type,
              href: url,
              pageBlocks
            },
            config
          )
        );
        link.attr("data-brz-link-type", data.type);

        if (
          (newData.type === "external" && newData.externalBlank === "on") ||
          (newData.type === "page" && newData.internalBlank === "on")
        ) {
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

  addDataColorAttribute($, $richText);

  // replace DynamicContent
  $richText.find("[data-population]").each(function (this: cheerio.Cheerio) {
    const $this = $(this);
    const population = Str.read($this.attr("data-population"));
    const $blockDynamicContentElem = $this.closest(".brz-tp__dc-block");
    let $elem: cheerio.Cheerio | undefined = undefined;

    if ($blockDynamicContentElem.length) {
      $elem = $blockDynamicContentElem;
    } else {
      $elem = $this;
    }

    if (population) {
      // Override current html with placeholder
      $elem.html(population);
      $elem.removeAttr("data-population");
    }
  });

  // replace Image
  $richText.find(".brz-text-mask, .brz-population-mask").each(function (
    this: cheerio.Cheerio
  ) {
    const $this = $(this);
    const src = $this.attr("data-image_src") ?? "";
    const population = $this.attr("data-image_population");
    const fileName = $this.attr("data-image_file_name") ?? "image";
    const config = configSelector(store.getState());

    const imgUrl = getImageUrl(
      {
        fileName,
        uid: src,
        sizeType: SizeType.custom
      },
      config
    );

    // required some property
    const css = $this.css();
    const newCSS = Object.entries(css).reduce(
      (acc, [property, value]) => {
        // cheeriojs have bug for background-image: url("someurl")
        // this is small fix for this case
        if (!property.includes("http")) {
          acc[property] = value;
        }

        return acc;
      },
      {} as Record<string, string>
    );

    $this.removeAttr("style");

    if (population) {
      $this.css({
        ...newCSS,
        "background-image": `url('${imagePopulationUrl(population, {
          ...defaultImagePopulation
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

  return $.root().html() ?? "";
};

type Data = {
  type: LinkType;
  href: string;
  pageBlocks: Array<Block>;
};

function getLinkContentByType(data: Data, config: ConfigCommon): string {
  // eslint-disable-next-line prefer-const
  let { type, href, pageBlocks } = data;

  switch (type) {
    case "anchor": {
      href = href.replace("#", "");
      const blockByHref = pageBlocks.find((block) => block.value._id === href);

      // Use the key:href(UID of the block) to ensure the `random_id`
      // remains consistent across sections.
      const uidPlaceholder = makePlaceholder({
        content: "{{ random_id }}",
        attr: { key: href }
      });
      const anchorName =
        (blockByHref && blockByHref.value.anchorName) ||
        `${uidPlaceholder}_${href}`;

      return `#${anchorName}`;
    }
    case "upload": {
      return customFileUrl(href, config) ?? "";
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
