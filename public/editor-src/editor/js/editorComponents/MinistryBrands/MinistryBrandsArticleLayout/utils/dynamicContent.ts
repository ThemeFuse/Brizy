import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import type { Value } from "./types";

export const getPlaceholder = (v: Value): string => {
  const {
    detailButtonText,
    detailPage,
    countPerPage,
    showImages,
    showVideo,
    showAudio,
    showMediaLinks,
    showTitle,
    showDate,
    showCategory,
    showGroups,
    showSeries,
    showAuthor,
    showMetaHeadings,
    showPreview,
    showPagination,
    showSearch,
    showCategoryFilter,
    showGroupFilter,
    showSeriesFilter,
    showAuthorFilter,
    addCategoryFilter,
    addCategoryFilter2,
    addCategoryFilter3,
    parentCategory,
    categoryFilterParent,
    categoryFilterHeading,
    groupFilterHeading,
    seriesFilterHeading,
    authorFilterHeading,
    searchPlaceholder,
    addCategoryFilterParent,
    addCategoryFilterHeading,
    addCategoryFilterParent2,
    addCategoryFilterHeading2,
    addCategoryFilterParent3,
    addCategoryFilterHeading3,
    showMetaIcons
  } = v;

  const attr = [
    `howmany='${countPerPage}'`,
    `detail_page='${getDetail(detailPage)}'`,
    `detail_page_button_text='${detailButtonText}'`,

    getAttr(showImages, "show_images"),
    getAttr(showVideo, "show_video"),
    getAttr(showAudio, "show_audio"),
    getAttr(showMediaLinks, "show_media_links"),
    getAttr(showTitle, "show_title"),
    getAttr(showDate, "show_date"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroups, "show_group"),
    getAttr(showSeries, "show_series"),
    getAttr(showAuthor, "show_author"),
    getAttr(showMetaHeadings, "show_meta_headings"),
    getAttr(showPreview, "show_preview"),
    getAttr(showPagination, "show_pagination"),
    getAttr(showMetaIcons, "show_meta_icons"),

    getAttr(showCategoryFilter, "show_category_filter"),
    getAttr(showGroupFilter, "show_group_filter"),
    getAttr(showSeriesFilter, "show_series_filter"),
    getAttr(showAuthorFilter, "show_author_filter"),
    getAttr(showSearch, "show_search"),

    getAttr(addCategoryFilter, "show_category_filter_add1"),
    getAttr(addCategoryFilter2, "show_category_filter_add2"),
    getAttr(addCategoryFilter3, "show_category_filter_add3"),

    `parent_category='${parentCategory}'`,
    `category_filter_parent='${categoryFilterParent}'`,
    `category_filter_heading='${categoryFilterHeading}'`,

    `group_filter_heading='${groupFilterHeading}'`,
    `series_filter_heading='${seriesFilterHeading}'`,
    `author_filter_heading='${authorFilterHeading}'`,

    `search_placeholder='${searchPlaceholder}'`,

    `category_filter_parent_add1='${addCategoryFilterParent}'`,
    `category_filter_heading_add1='${addCategoryFilterHeading}'`,
    `category_filter_parent_add2='${addCategoryFilterParent2}'`,
    `category_filter_heading_add2='${addCategoryFilterHeading2}'`,
    `category_filter_parent_add3='${addCategoryFilterParent3}'`,
    `category_filter_heading_add3='${addCategoryFilterHeading3}'`
  ];

  return makePlaceholder({
    content: "{{ekk_article_layout}}",
    attrStr: attr.join(" ")
  });
};
