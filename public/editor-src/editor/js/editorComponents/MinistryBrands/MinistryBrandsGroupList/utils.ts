import { getAttr, getDetail } from "../utils/helpers";
import { Value } from "./types";

export const getPlaceholder = (v: Value): string => {
  const {
    showCategory,
    showGroup,
    showCoordinator,
    category,
    group,
    showPreview,
    detailPageButtonText,
    detailPage,
    itemsNumber,
    showPagination,
    showImages,
    showDay,
    showTimes,
    showStatus,
    showChildcare,
    showResourceLink
  } = v;

  const _showCategory = getAttr(showCategory, "show_category");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showCoordinator = getAttr(showCoordinator, "show_coordinator");
  const _showPreview = getAttr(showPreview, "show_preview");

  const _showPagination = getAttr(showPagination, "show_pagination");
  const _showImages = getAttr(showImages, "show_images");
  const _showDay = getAttr(showDay, "show_day");
  const _showTimes = getAttr(showTimes, "show_times");
  const _showStatus = getAttr(showStatus, "show_status");
  const _showChildcare = getAttr(showChildcare, "show_childcare");
  const _showResourceLink = getAttr(showResourceLink, "show_resourcelink");

  const _detailPage = getDetail(detailPage);

  return `{{ ekk_group_list
            howmany='${itemsNumber}'
            ${_showCategory}
            ${_showGroup}
            ${_showCoordinator}
            category='${category}'
            group='${group}'
            ${_showPreview}
            ${_showPagination}
            ${_showImages}
            ${_showDay}
            ${_showTimes}
            ${_showStatus}
            ${_showChildcare}
            ${_showResourceLink}
            detail_page='${_detailPage}'
            detail_page_button_text='${detailPageButtonText}'
         }}`;
};
