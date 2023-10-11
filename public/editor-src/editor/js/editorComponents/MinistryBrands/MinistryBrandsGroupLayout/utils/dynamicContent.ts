import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import type { Value } from "../types";

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

  const attr = [
    getAttr(showImages, "show_images"),
    getAttr(showMeetingDay, "show_day"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showStatus, "show_status"),
    getAttr(showChildcare, "show_childcare"),
    getAttr(showResourceLink, "show_resourcelink"),
    getAttr(showPreview, "show_preview"),
    `detail_page='${getDetail(detailPage)}'`,
    `detail_page_button_text='${detailButtonText}'`,
    `howmany='${countPerPage}'`,
    getAttr(showCategoryFilter, "show_category_filter"),
    `parent_category='${parentCategory}'`,
    `category_filter_parent='${categoryFilterParent}'`,
    `category_filter_heading='${categoryFilterHeading}'`,
    getAttr(showGroupFilter, "show_group_filter"),
    `group_filter_heading='${groupFilterHeading}'`,
    getAttr(showSearch, "show_search"),
    `search_placeholder='${searchPlaceholder}'`,
    getAttr(showPagination, "show_pagination"),
    getAttr(addCategoryFilter, "show_category_filter_add1"),
    `category_filter_parent_add1='${addCategoryFilterParent}'`,
    `category_filter_heading_add1='${addCategoryFilterHeading}'`,
    getAttr(addCategoryFilter2, "show_category_filter_add2"),
    `category_filter_parent_add2='${addCategoryFilterParent2}'`,
    `category_filter_heading_add2='${addCategoryFilterHeading2}'`,
    getAttr(addCategoryFilter3, "show_category_filter_add3"),
    `category_filter_parent_add3='${addCategoryFilterParent3}'`,
    `category_filter_heading_add3='${addCategoryFilterHeading3}'`
  ];

  return makePlaceholder({
    content: "{{ekk_group_layout}}",
    attrStr: attr.join(" ")
  });
};
