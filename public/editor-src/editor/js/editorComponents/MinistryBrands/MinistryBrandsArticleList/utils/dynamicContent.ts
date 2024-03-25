import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail, getFeatures } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    category,
    group,
    series,
    itemsNumber,
    showPagination,
    features,
    nonfeatures,
    showImages,
    showVideo,
    showAudio,
    showMediaLinks,
    showTitle,
    showDate,
    showCategory,
    showGroup,
    showSeries,
    showAuthor,
    showMetaHeadings,
    showPreview,
    detailPageButtonText,
    detailPage,
    showMetaIcons
  } = v;

  const attr = [
    `howmany='${itemsNumber}'`,
    getAttr(showImages, "show_images"),
    getAttr(showTitle, "show_title"),
    getAttr(showDate, "show_date"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showMetaHeadings, "show_meta_headings"),
    getAttr(showPreview, "show_preview"),
    getAttr(showPagination, "show_pagination"),
    getAttr(showVideo, "show_video"),
    getAttr(showAudio, "show_audio"),
    getAttr(showMediaLinks, "show_media_links"),
    getAttr(showDate, "show_date"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showSeries, "show_series"),
    getAttr(showAuthor, "show_author"),
    getAttr(showMetaIcons, "show_meta_icons"),
    `category='${category}'`,
    `series='${series}'`,
    getFeatures(features, "features"),
    getFeatures(nonfeatures, "nonfeatures"),
    `group='${group}'`,
    `detail_page='${getDetail(detailPage)}'`,
    `detail_page_button_text='${detailPageButtonText}'`
  ];

  return makePlaceholder({
    content: "{{ekk_article_list}}",
    attrStr: attr.join(" ")
  });
};
