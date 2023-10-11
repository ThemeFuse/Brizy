import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail, getFeatures } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    showImage,
    showVideo,
    showAudio,
    showTitle,
    showDate,
    showCategory,
    showGroup,
    showSeries,
    showPreacher,
    showPassage,
    showMetaHeadings,
    showContent,
    sermonLatest,
    sermonRecentList,
    sermonSlug,
    category,
    group,
    series,
    features,
    nonfeatures,
    showMediaLinks,
    showPreview,
    detailPageButtonText,
    detailPage
  } = v;

  const attr = [
    `sermon_recent_list='${sermonRecentList}'`,
    `sermon_slug='${sermonSlug}'`,
    getAttr(showImage, "show_image"),
    getAttr(showVideo, "show_video"),
    getAttr(showAudio, "show_audio"),
    getAttr(showTitle, "show_title"),
    getAttr(showDate, "show_date"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showSeries, "show_series"),
    getAttr(showPreacher, "show_preacher"),
    getAttr(showPassage, "show_passage"),
    getAttr(showMetaHeadings, "show_meta_headings"),
    getAttr(showContent, "show_content"),
    getAttr(sermonLatest, "sermon_latest"),
    `category='${category}'`,
    `group='${group}'`,
    `series='${series}'`,
    getFeatures(features, "features"),
    getFeatures(nonfeatures, "nonfeatures"),
    getAttr(showMediaLinks, "show_media_links"),
    getAttr(showPreview, "show_preview"),
    `detail_page_button_text='${detailPageButtonText}'`,
    `detail_page='${getDetail(detailPage)}'`
  ];

  return makePlaceholder({
    content: "{{ekk_sermon_featured}}",
    attrStr: attr.join(" ")
  });
};
