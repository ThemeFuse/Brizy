import { getAttr, getDetail } from "../utils/helpers";
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

  const _showArrows = getAttr(showArrows, "show_arrows");
  const _showPagination = getAttr(showPagination, "show_pagination");
  const _showImages = getAttr(showImages, "show_images");
  const _showCategory = getAttr(showCategory, "show_category");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showStatus = getAttr(showStatus, "show_status");
  const _showChildcare = getAttr(showChildcare, "show_childcare");
  const _showResourceLink = getAttr(showResourceLink, "show_resourcelink");
  const _showPreview = getAttr(showPreview, "show_preview");
  const _showMeetingDay = getAttr(showMeetingDay, "show_day");
  const _showMeetingTimes = getAttr(showMeetingTimes, "show_times");

  const _detailPage = getDetail(detailPage);

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
            detail_page='${_detailPage}'
            detail_page_button_text='${detailPageButton}'
          }}`;
};
