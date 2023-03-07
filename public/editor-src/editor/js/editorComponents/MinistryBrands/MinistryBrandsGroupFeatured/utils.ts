import { getAttr, getDetail } from "../utils/helpers";
import { Value } from "./types";

export const getPlaceholder = (v: Value): string => {
  const {
    showImage,
    showCategory,
    showGroup,
    showDay,
    showTimes,
    showStatus,
    showChildcare,
    showResourceLink,
    showPreview,
    groupLatest,
    groupRecentList,
    groupSlug,
    category,
    group,
    detailPageButtonText,
    detailPage,
    slug
  } = v;

  const _showImage = getAttr(showImage, "show_image");
  const _showCategory = getAttr(showCategory, "show_category");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showDay = getAttr(showDay, "show_day");
  const _showTimes = getAttr(showTimes, "show_times");
  const _showStatus = getAttr(showStatus, "show_status");
  const _showChildcare = getAttr(showChildcare, "show_childcare");
  const _showResourceLink = getAttr(showResourceLink, "show_resourcelink");
  const _showPreview = getAttr(showPreview, "show_preview");
  const _groupLatest = getAttr(groupLatest, "group_latest");

  const _detailPage = getDetail(detailPage);

  return `{{ ekk_group_featured
              ${_showImage}
              ${_showCategory}
              ${_showGroup}
              ${_showDay}
              ${_showTimes}
              ${_showStatus}
              ${_showChildcare}
              ${_showResourceLink}
              ${_showPreview}
              ${_groupLatest}
              group_recent_list='${groupRecentList}'
              group_slug='${groupSlug}'
              category='${category}'
              group='${group}'
              detail_page_button_text='${detailPageButtonText}'
              detail_page='${_detailPage}'
              slug='${slug}'
          }}`;
};
