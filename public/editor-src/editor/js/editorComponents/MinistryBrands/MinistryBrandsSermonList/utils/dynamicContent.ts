import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail, getFeatures } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    itemsNumber,
    showTitle,
    showImages,
    showDate,
    showCategory,
    showGroup,
    showPreacher,
    showPassages,
    showMedia,
    showPreview,
    showVideo,
    showAudio,
    showSeries,
    showPagination,
    showMeta,
    group,
    category,
    series,
    detailPageButton,
    features,
    nonfeatures,
    detailPage,
    showMetaIcons
  } = v;

  const attr = [
    `howmany='${itemsNumber}'`,
    `group='${group}'`,
    `category='${category}'`,
    `series='${series}'`,
    getAttr(showTitle, "show_title"),
    getAttr(showPagination, "show_pagination"),
    getAttr(showGroup, "show_group"),
    getAttr(showPreacher, "show_preacher"),
    getAttr(showPassages, "show_passage"),
    getAttr(showPreview, "show_preview"),
    getAttr(showVideo, "show_inline_video"),
    getAttr(showAudio, "show_inline_audio"),
    getAttr(showDate, "show_date"),
    getAttr(showImages, "show_images"),
    getAttr(showSeries, "show_series"),
    getAttr(showCategory, "show_category"),
    getAttr(showMedia, "show_media_links"),
    getAttr(showMeta, "show_meta_headings"),
    getFeatures(features, "features"),
    getFeatures(nonfeatures, "nonfeatures"),
    getAttr(showMetaIcons, "show_meta_icons"),
    `detail_url='${getDetail(detailPage)}'`,
    `detail_page_button_text='${detailPageButton}'`,
    "sticky_space='0'"
  ];

  return makePlaceholder({
    content: "{{ekk_sermon_list}}",
    attrStr: attr.join(" ")
  });
};
