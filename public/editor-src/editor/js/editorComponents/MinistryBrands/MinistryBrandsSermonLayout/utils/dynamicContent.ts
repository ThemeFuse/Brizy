import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import { Value } from "../types";

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
    searchFilterPlacehoder,
    defaultCategory
  } = v;

  const attr = [
    getAttr(showImages, "show_images"),
    getAttr(showPagination, "show_pagination"),
    getAttr(showVideo, "show_video"),
    getAttr(showAudio, "show_audio"),
    getAttr(showMediaLinks, "show_media_links"),
    getAttr(showTitle, "show_title"),
    getAttr(showDate, "show_date"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showSeries, "show_series"),
    getAttr(showPreacher, "show_preacher"),
    getAttr(showPassage, "show_passage"),
    getAttr(showMeta, "show_meta_headings"),
    getAttr(showPreview, "show_preview"),
    getAttr(showGroupFilter, "show_group_filter"),
    getAttr(showCategoryFilter, "show_category_filter"),
    getAttr(showSeriesFilter, "show_series_filter"),
    getAttr(showSpeakerFilter, "show_speaker_filter"),
    getAttr(showSearchFilter, "show_search"),
    `detail_page='${getDetail(detailPage)}'`,
    `detail_page_button_text='${detailPageButtonText}'`,
    `group_filter_heading='${groupFilterHeading}'`,
    `category_filter_heading='${categoryFilterHeading}'`,
    `defaultCategory='${defaultCategory}'`,
    `series_filter_heading='${seriesFilterHeading}'`,
    `speaker_filter_heading='${speakerFilterHeading}'`,
    `search_placeholder='${searchFilterPlacehoder}'`,
    `howmany='${howmany}'`
  ];

  return makePlaceholder({
    content: "{{ekk_sermon_layout}}",
    attrStr: attr.join(" ")
  });
};
