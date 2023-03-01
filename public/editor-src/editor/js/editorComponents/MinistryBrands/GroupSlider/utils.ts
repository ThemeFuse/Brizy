import { getAttr } from "../utils/helpers";
import { Value } from "./types";

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

  const _showArrows = getAttr(showArrows, "show_arrows", "1");
  const _showPagination = getAttr(showPagination, "show_pagination", "1");
  const _showImages = getAttr(showImages, "show_images", "1");
  const _showCategory = getAttr(showCategory, "show_category", "1");
  const _showGroup = getAttr(showGroup, "show_group", "1");
  const _showStatus = getAttr(showStatus, "show_status", "1");
  const _showChildcare = getAttr(showChildcare, "show_childcare", "1");
  const _showResourceLink = getAttr(showResourceLink, "show_resourcelink", "1");
  const _showPreview = getAttr(showPreview, "show_preview", "1");
  const _showMeetingDay = getAttr(showMeetingDay, "show_day", "1");
  const _showMeetingTimes = getAttr(showMeetingTimes, "show_times", "1");

  return `{{ 
            ekk_group_slider
            category='${category}' 
            group='${group}' 
            howmany='${howmany}'
            column_count='${slidesToShow}'
            ${_showArrows}
            ${_showPagination}
            ${_showImages}
            ${_showCategory}
            ${_showGroup}
            ${_showStatus}
            ${_showChildcare}
            ${_showResourceLink}
            ${_showPreview}
            ${_showMeetingDay}
            ${_showMeetingTimes}
            detail_page='${detailPage}'
            detail_page_button_text='${detailPageButton}'
          }}`;
};
