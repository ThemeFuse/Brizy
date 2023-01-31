import { getAttr } from "../utils/helpers";
import { Value } from "./types";

export const getPlaceholder = (v: Value) => {
  const {
    showImages,
    showPagination,
    showVideo,
    showAudio,
    showMediaLinks,
    showTitle,
    showDate,
    showCategory,
    showGroup,
    showSeries,
    showPreacher,
    showPassage,
    showMeta,
    showPreview,
    showGroupFilter,
    showCategoryFilter,
    showSeriesFilter,
    showSpeakerFilter,
    showSearchFilter,
    detailPage,
    detailPageButtonText,
    howmany,

    groupFilterHeading,
    categoryFilterHeading,
    seriesFilterHeading,
    speakerFilterHeading,
    searchFilterPlacehoder
  } = v;

  const _showImages = getAttr(showImages, "show_images");
  const _showPagination = getAttr(showPagination, "show_pagination");
  const _showVideo = getAttr(showVideo, "show_video");
  const _showAudio = getAttr(showAudio, "show_audio");
  const _showMediaLinks = getAttr(showMediaLinks, "show_media_links");
  const _showTitle = getAttr(showTitle, "show_title");
  const _showDate = getAttr(showDate, "show_date");
  const _showCategory = getAttr(showCategory, "show_category");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showSeries = getAttr(showSeries, "show_series");
  const _showPreacher = getAttr(showPreacher, "show_preacher");
  const _showPassage = getAttr(showPassage, "show_passage");
  const _showMeta = getAttr(showMeta, "show_meta_headings");
  const _showPreview = getAttr(showPreview, "show_preview");
  const _showGroupFilter = getAttr(showGroupFilter, "show_group_filter");
  const _showCategoryFilter = getAttr(
    showCategoryFilter,
    "show_category_filter"
  );
  const _showSeriesFilter = getAttr(showSeriesFilter, "show_series_filter");
  const _showSpeakerFilter = getAttr(showSpeakerFilter, "show_speaker_filter");
  const _showSearchFilter = getAttr(showSearchFilter, "show_search");

  return `{{ ekk_sermon_layout ${_showImages} ${_showPagination} ${_showVideo} ${_showAudio} ${_showMediaLinks} ${_showTitle} ${_showDate} ${_showCategory} ${_showGroup} ${_showSeries} ${_showPreacher} ${_showPassage} ${_showMeta} ${_showPreview} ${_showGroupFilter} ${_showCategoryFilter} ${_showSeriesFilter} ${_showSpeakerFilter} ${_showSearchFilter} detail_page='${detailPage}' detail_page_button_text='${detailPageButtonText}' group_filter_heading='${groupFilterHeading}' category_filter_heading='${categoryFilterHeading}' series_filter_heading='${seriesFilterHeading}' speaker_filter_heading='${speakerFilterHeading}' search_placeholder='${searchFilterPlacehoder}' howmany='${howmany}' }}`;
};
