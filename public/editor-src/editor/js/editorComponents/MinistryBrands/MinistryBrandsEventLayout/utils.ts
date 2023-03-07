import { changeContentVisibility, getAttr, getDetail } from "../utils/helpers";
import type { Value } from "./types";

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
    searchPlaceholder
  } = v;

  const _showFeaturedView = getAttr(showFeaturedView, "show_featured_view");
  const _showFeaturedImages = getAttr(
    showFeaturedImages,
    "show_images_featured"
  );
  const _showFeaturedPreview = getAttr(
    showFeaturedPreview,
    "show_preview_featured"
  );
  const _showFeaturedTitle = getAttr(showFeaturedTitle, "show_title_featured");
  const _showFeaturedDate = getAttr(showFeaturedDate, "show_date_featured");

  const _showListView = getAttr(showListView, "show_list_view");

  const _showCalendarView = getAttr(showCalendarView, "show_calendar_view");

  const _showCategoryFilter = getAttr(
    showCategoryFilter,
    "show_category_filter"
  );
  const _showCategoryFilterAdd1 = getAttr(
    addCategoryFilter,
    "show_category_filter_add1"
  );
  const _showCategoryFilterAdd2 = getAttr(
    addCategoryFilter2,
    "show_category_filter_add2"
  );
  const _showCategoryFilterAdd3 = getAttr(
    addCategoryFilter3,
    "show_category_filter_add3"
  );

  const _showGroupFilter = getAttr(showGroupFilter, "show_group_filter");
  const _showSearch = getAttr(showSearch, "show_search");

  const _eventDetailPage = getDetail(eventDetailPage);

  return `{{ ekk_event_layout 
    ${_showFeaturedView}
    view_order_featured='${featuredViewOrder}'
    view_featured_heading='${featuredViewHeading}'
    howmanyfeatured='${howManyFeatured}' 
    ${_showFeaturedImages}
    ${_showFeaturedPreview}
    ${_showFeaturedTitle}
    ${_showFeaturedDate} 
    ${_showListView}
    view_order_list='${listViewOrder}'
    view_list_heading='${listViewHeading}' 
    ${_showCalendarView}
    view_order_calendar='${calendarViewOrder}'
    view_calendar_heading='${calendarViewHeading}' 
    howmanymonths='${howmanymonths}' 
    detail_page='${_eventDetailPage}'
    parent_category='${parentCategory}'
    category_filter_list='${categoryFilterList}'
    ${_showCategoryFilter}
    category_filter_parent='${categoryFilterParent}'
    category_filter_heading='${categoryFilterHeading}'
    category_filter_list_add1='${addCategoryFilterList}'
    category_filter_list_add2='${addCategoryFilterList2}'
    category_filter_list_add3='${addCategoryFilterList3}'
    ${_showCategoryFilterAdd1}
    category_filter_parent_add1='${addCategoryFilterParent}'
    category_filter_heading_add1='${addCategoryFilterHeading}'
    ${_showCategoryFilterAdd2}
    ${_showCategoryFilterAdd3}
    category_filter_parent_add2='${addCategoryFilterParent2}'
    category_filter_heading_add2='${addCategoryFilterHeading2}'
    category_filter_parent_add3='${addCategoryFilterParent3}'
    category_filter_heading_add3='${addCategoryFilterHeading3}'
    ${_showGroupFilter}
    group_filter_heading='${groupFilterHeading}'
    ${_showSearch}
    search_placeholder='${searchPlaceholder}'
  }}`;
};

export const addContentEventListener = ({
  type,
  wrapper
}: {
  type: "list" | "calendar";
  wrapper: HTMLElement;
}) => {
  const items =
    type == "list"
      ? Array.from(
          wrapper.querySelectorAll<HTMLElement>(".brz-eventLayout--list-item")
        )
      : Array.from(
          wrapper.querySelectorAll<HTMLElement>(
            ".brz-eventLayout--calendar-item"
          )
        );

  const activeClassName =
    type === "list"
      ? "brz-eventLayout--list-item-active"
      : "brz-eventLayout--calendar-item-active";

  items.forEach((item, index) => {
    const prevButton = item.querySelector(
      ".brz-eventLayout__pagination > .previous"
    );
    const nextButton = item.querySelector(
      ".brz-eventLayout__pagination > .next"
    );

    if (index === 0) {
      item?.classList.add(activeClassName);
      prevButton?.classList.add("off");
    }

    if (index === items.length - 1) {
      nextButton?.classList.add("off");
    }

    prevButton?.addEventListener("click", (e) => {
      e.preventDefault();
      changeContentVisibility({
        items,
        activeClassName,
        direction: "prev"
      });
    });

    nextButton?.addEventListener("click", (e) => {
      e.preventDefault();
      changeContentVisibility({
        items,
        activeClassName,
        direction: "next"
      });
    });
  });
};
