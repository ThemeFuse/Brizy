import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import type { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    showFeaturedView,
    featuredViewOrder,
    featuredViewHeading,
    howManyFeatured,
    showFeaturedImages,
    showFeaturedPreview,
    showFeaturedTitle,
    showFeaturedDate,

    showListView,
    listViewOrder,
    listViewHeading,

    showCalendarView,
    calendarViewOrder,
    calendarViewHeading,
    howmanymonths,
    eventDetailPage,
    parentCategory,
    categoryFilterList,
    showCategoryFilter,
    categoryFilterParent,
    categoryFilterHeading,
    addCategoryFilterList,
    addCategoryFilterList2,
    addCategoryFilterList3,
    addCategoryFilter,
    addCategoryFilterParent,
    addCategoryFilterHeading,
    addCategoryFilter2,
    addCategoryFilter3,
    addCategoryFilterParent2,
    addCategoryFilterHeading2,
    addCategoryFilterParent3,
    addCategoryFilterHeading3,
    showGroupFilter,
    groupFilterHeading,
    showSearch,
    searchPlaceholder,
    dateFormat
  } = v;

  const attr = [
    getAttr(showFeaturedView, "show_featured_view"),
    `view_order_featured='${featuredViewOrder}'`,
    `view_featured_heading='${featuredViewHeading}'`,
    `howmanyfeatured='${howManyFeatured}'`,
    getAttr(showFeaturedImages, "show_images_featured"),
    getAttr(showFeaturedPreview, "show_preview_featured"),
    getAttr(showFeaturedTitle, "show_title_featured"),
    getAttr(showFeaturedDate, "show_date_featured"),
    getAttr(showListView, "show_list_view"),
    `view_order_list='${listViewOrder}'`,
    `view_list_heading='${listViewHeading}'`,
    getAttr(showCalendarView, "show_calendar_view"),
    `view_order_calendar='${calendarViewOrder}'`,
    `view_calendar_heading='${calendarViewHeading}'`,
    `howmanymonths='${howmanymonths}'`,
    `detail_page='${getDetail(eventDetailPage)}'`,
    `parent_category='${parentCategory}'`,
    `category_filter_list='${categoryFilterList}'`,
    getAttr(showCategoryFilter, "show_category_filter"),
    `category_filter_parent='${categoryFilterParent}'`,
    `category_filter_heading='${categoryFilterHeading}'`,
    `category_filter_list_add1='${addCategoryFilterList}'`,
    `category_filter_list_add2='${addCategoryFilterList2}'`,
    `category_filter_list_add3='${addCategoryFilterList3}'`,
    getAttr(addCategoryFilter, "show_category_filter_add1"),
    `category_filter_parent_add1='${addCategoryFilterParent}'`,
    `category_filter_heading_add1='${addCategoryFilterHeading}'`,
    getAttr(addCategoryFilter2, "show_category_filter_add2"),
    getAttr(addCategoryFilter3, "show_category_filter_add3"),
    `category_filter_parent_add2='${addCategoryFilterParent2}'`,
    `category_filter_heading_add2='${addCategoryFilterHeading2}'`,
    `category_filter_parent_add3='${addCategoryFilterParent3}'`,
    `category_filter_heading_add3='${addCategoryFilterHeading3}'`,
    getAttr(showGroupFilter, "show_group_filter"),
    `group_filter_heading='${groupFilterHeading}'`,
    getAttr(showSearch, "show_search"),
    `search_placeholder='${searchPlaceholder}'`,
    `date_format='${dateFormat}'`
  ];

  return makePlaceholder({
    content: "{{ekk_event_layout}}",
    attrStr: attr.join(" ")
  });
};
