import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail, getFeatures } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    showImage,
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
    showMetaIcons,
    showLatestArticles,
    recentArticles,
    articleSlug,
    category,
    group,
    features,
    nonfeatures,
    showPreview,
    detailPageButtonText,
    detailPage,
    showContent
  } = v;

  const attr = [
    `category='${category}'`,
    `group='${group}'`,
    `recentArticles='${recentArticles}'`,
    `article_slug='${articleSlug}'`,
    getAttr(showLatestArticles, "show_latest_articles"),
    getFeatures(features, "features"),
    getFeatures(nonfeatures, "nonfeatures"),
    getAttr(showImage, "show_image"),
    getAttr(showVideo, "show_video"),
    getAttr(showAudio, "show_audio"),
    getAttr(showMediaLinks, "show_media_links"),
    getAttr(showTitle, "show_title"),
    getAttr(showDate, "show_date"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showAuthor, "show_author"),
    getAttr(showSeries, "show_series"),
    getAttr(showMetaHeadings, "show_meta_headings"),
    getAttr(showMetaIcons, "show_meta_icons"),
    getAttr(showPreview, "show_preview"),
    getAttr(showContent, "show_content"),
    `detail_page_button_text='${detailPageButtonText}'`,
    `detail_page='${getDetail(detailPage)}'`
  ];

  return makePlaceholder({
    content: "{{ekk_article_featured}}",
    attrStr: attr.join(" ")
  });
};
