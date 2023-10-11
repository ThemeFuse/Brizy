import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    category,
    group,
    howmany,
    slidesToShow,
    showArrows,
    showPagination,
    showImages,
    showMeetingDay,
    showMeetingTimes,
    showCategory,
    showGroup,
    showStatus,
    showChildcare,
    showResourceLink,
    showPreview,
    detailPageButton,
    detailPage
  } = v;

  const attr = [
    `category='${category}'`,
    `group='${group}'`,
    `howmany='${howmany}'`,
    `column_count='${slidesToShow}'`,
    getAttr(showArrows, "show_arrows"),
    getAttr(showPagination, "show_pagination"),
    getAttr(showImages, "show_images"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showStatus, "show_status"),
    getAttr(showChildcare, "show_childcare"),
    getAttr(showResourceLink, "show_resourcelink"),
    getAttr(showPreview, "show_preview"),
    getAttr(showMeetingDay, "show_day"),
    getAttr(showMeetingTimes, "show_times"),
    `detail_page='${getDetail(detailPage)}'`,
    `detail_page_button_text='${detailPageButton}'`
  ];

  return makePlaceholder({
    content: "{{ekk_group_slider}}",
    attrStr: attr.join(" ")
  });
};
