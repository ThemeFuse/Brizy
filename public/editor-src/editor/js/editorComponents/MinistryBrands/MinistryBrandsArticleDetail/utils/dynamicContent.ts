import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    showImage,
    showVideo,
    showAudio,
    showMediaLinksVideo,
    showMediaLinksAudio,
    showMediaLinksDownload,
    showMediaLinksNotes,
    showTitle,
    showDate,
    showCategory,
    showGroup,
    showSeries,
    showAuthor,
    showMetaHeadings,
    showContent,
    recentArticles,
    showPreviousPage,
    showMetaIcons
  } = v;

  const attr = [
    getAttr(showImage, "show_image"),
    getAttr(showVideo, "show_video"),
    getAttr(showAudio, "show_audio"),
    getAttr(showMediaLinksVideo, "show_media_links_video"),
    getAttr(showMediaLinksAudio, "show_media_links_audio"),
    getAttr(showMediaLinksDownload, "show_media_links_download"),
    getAttr(showMediaLinksNotes, "show_media_links_notes"),
    getAttr(showTitle, "show_title"),
    getAttr(showDate, "show_date"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showSeries, "show_series"),
    getAttr(showAuthor, "show_author"),
    getAttr(showMetaHeadings, "show_meta_headings"),
    getAttr(showContent, "show_content"),
    getAttr(showPreviousPage, "previous_page"),
    getAttr(showMetaIcons, "show_meta_icons"),
    `articles_recent='${recentArticles}'`
  ];

  return makePlaceholder({
    content: "{{ekk_article_detail}}",
    attrStr: attr.join(" ")
  });
};
