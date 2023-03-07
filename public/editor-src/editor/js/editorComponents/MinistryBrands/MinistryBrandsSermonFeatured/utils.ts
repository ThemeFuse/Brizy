import { getAttr, getDetail, getFeatures } from "../utils/helpers";
import { Value } from "./types";

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

  const _showImage = getAttr(showImage, "show_image");
  const _showVideo = getAttr(showVideo, "show_video");
  const _showAudio = getAttr(showAudio, "show_audio");
  const _showTitle = getAttr(showTitle, "show_title");
  const _showDate = getAttr(showDate, "show_date");
  const _showCategory = getAttr(showCategory, "show_category");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showSeries = getAttr(showSeries, "show_series");
  const _showPreacher = getAttr(showPreacher, "show_preacher");
  const _showPassage = getAttr(showPassage, "show_passage");
  const _showMetaHeadings = getAttr(showMetaHeadings, "show_meta_headings");
  const _showContent = getAttr(showContent, "show_content");
  const _showMediaLinks = getAttr(showMediaLinks, "show_media_links");
  const _showPreview = getAttr(showPreview, "show_preview");
  const _sermonLatest = getAttr(sermonLatest, "sermon_latest");

  const _features = getFeatures(features, "features");
  const _nonfeatures = getFeatures(nonfeatures, "nonfeatures");

  const _detailPage = getDetail(detailPage);

  return `{{ekk_sermon_featured
              sermon_recent_list='${sermonRecentList}'
              sermon_slug='${sermonSlug}'
              ${_showImage}
              ${_showVideo}
              ${_showAudio}
              ${_showTitle}
              ${_showDate}
              ${_showCategory}
              ${_showGroup}
              ${_showSeries}
              ${_showPreacher}
              ${_showPassage}
              ${_showMetaHeadings}
              ${_showContent}
              ${_sermonLatest}
              category='${category}'
              group='${group}'
              series='${series}'
              ${_features}
              ${_nonfeatures}
              ${_showMediaLinks}
              ${_showPreview}
              detail_page_button_text='${detailPageButtonText}'
              detail_page='${_detailPage}'
          }}`;
};
