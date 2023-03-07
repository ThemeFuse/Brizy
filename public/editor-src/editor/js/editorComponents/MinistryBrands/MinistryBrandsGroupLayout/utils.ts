import { getAttr, getDetail } from "../utils/helpers";
import type { Value } from "./types";

export const getPlaceholder = (v: Value): string => {
  const {
    showImages,
    showMeetingDay,
    showCategory,
    showGroup,
    showStatus,
    showChildcare,
    showResourceLink,
    showPreview,
    detailPage,
    detailButtonText,
    countPerPage,
    showCategoryFilter,
    parentCategory,
    categoryFilterParent,
    categoryFilterHeading,
    showGroupFilter,
    groupFilterHeading,
    showSearch,
    searchPlaceholder,
    showPagination,
    addCategoryFilter,
    addCategoryFilterParent,
    addCategoryFilterHeading,
    addCategoryFilter2,
    addCategoryFilterParent2,
    addCategoryFilterHeading2,
    addCategoryFilter3,
    addCategoryFilterParent3,
    addCategoryFilterHeading3
  } = v;

  const _showImage = getAttr(showImages, "show_images");
  const _showMeetingDay = getAttr(showMeetingDay, "show_day");
  const _showCategory = getAttr(showCategory, "show_category");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showStatus = getAttr(showStatus, "show_status");
  const _showChildcare = getAttr(showChildcare, "show_childcare");
  const _showResourceLink = getAttr(showResourceLink, "show_resourcelink");
  const _showPreview = getAttr(showPreview, "show_preview");
  const _showCategoryFilter = getAttr(
    showCategoryFilter,
    "show_category_filter"
  );
  const _showGroupFilter = getAttr(showGroupFilter, "show_group_filter");
  const _showSearch = getAttr(showSearch, "show_search");
  const _showPagination = getAttr(showPagination, "show_pagination");

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

  const _detailPage = getDetail(detailPage);

  return `{{ ekk_group_layout
        ${_showImage}
        ${_showMeetingDay}
        ${_showCategory}
        ${_showGroup}
        ${_showStatus}
        ${_showChildcare}
        ${_showResourceLink}
        ${_showPreview}
        detail_page='${_detailPage}'
        detail_page_button_text='${detailButtonText}'
        howmany='${countPerPage}'
        ${_showCategoryFilter}
        parent_category='${parentCategory}'
        category_filter_parent='${categoryFilterParent}'
        category_filter_heading='${categoryFilterHeading}'
        ${_showGroupFilter}
        group_filter_heading='${groupFilterHeading}'
        ${_showSearch}
        search_placeholder='${searchPlaceholder}'
        ${_showPagination}
        ${_showCategoryFilterAdd1}
        category_filter_parent_add1='${addCategoryFilterParent}'
        category_filter_heading_add1='${addCategoryFilterHeading}'
        ${_showCategoryFilterAdd2}
        category_filter_parent_add2='${addCategoryFilterParent2}'
        category_filter_heading_add2='${addCategoryFilterHeading2}'
        ${_showCategoryFilterAdd3}
        category_filter_parent_add3='${addCategoryFilterParent3}'
        category_filter_heading_add3='${addCategoryFilterHeading3}'
      }}`;
};
