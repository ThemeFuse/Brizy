import { getAttr, getDetail, getFeatures } from "../utils/helpers";
import { Value } from "./types";

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
    detailPage
  } = v;

  const _showTitle = getAttr(showTitle, "show_title");
  const _showPagination = getAttr(showPagination, "show_pagination");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showPreacher = getAttr(showPreacher, "show_preacher");
  const _showPassages = getAttr(showPassages, "show_passage");
  const _showPreview = getAttr(showPreview, "show_preview");
  const _showVideo = getAttr(showVideo, "show_inline_video");
  const _showAudio = getAttr(showAudio, "show_inline_audio");
  const _showDate = getAttr(showDate, "show_date");
  const _showImages = getAttr(showImages, "show_images");
  const _showSeries = getAttr(showSeries, "show_series");
  const _showCategory = getAttr(showCategory, "show_category");
  const _showMedia = getAttr(showMedia, "show_media_links");
  const _showMeta = getAttr(showMeta, "show_meta_headings");
  const _features = getFeatures(features, "features");
  const _nonfeatures = getFeatures(nonfeatures, "nonfeatures");

  const _detailPage = getDetail(detailPage);

  return `{{ekk_sermon_list 
              howmany='${itemsNumber}'
              group='${group}'
              category='${category}'
              series='${series}'
              ${_features}
              ${_nonfeatures}
              ${_showDate}
              ${_showPagination}
              ${_showImages}
              ${_showVideo}
              ${_showAudio}
              ${_showMedia}
              ${_showTitle}
              ${_showCategory}
              ${_showGroup}
              ${_showSeries}
              ${_showPreacher}
              ${_showPassages}
              ${_showMeta}
              ${_showPreview}
              detail_url='${_detailPage}'
              detail_page_button_text='${detailPageButton}'
              sticky_space='0'
          }}`;
};
