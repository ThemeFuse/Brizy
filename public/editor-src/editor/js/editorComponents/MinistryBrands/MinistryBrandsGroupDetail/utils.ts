import { getAttr } from "../utils/helpers";
import { Value } from "./types";

export const getPlaceholder = (v: Value): string => {
  const
    { showImage,
      showTitle,
      showCategory,
      showGroup,
      showMetaHeadings,
      showDay,
      showTimes,
      showStatus,
      showChildcare,
      showResourceLink,
      showContent,
      groupsRecent
    } = v;


  const _showImage = getAttr(showImage, "show_image")
  const _showTitle = getAttr(showTitle, "show_title")
  const _showCategory = getAttr(showCategory, "show_category")
  const _showGroup = getAttr(showGroup, "show_group")
  const _showMetaHeadings = getAttr(showMetaHeadings, "show_meta_headings")
  const _showDay = getAttr(showDay, "show_day")
  const _showTimes = getAttr(showTimes, "show_times")
  const _showStatus = getAttr(showStatus, "show_status")
  const _showChildcare = getAttr(showChildcare, "show_childcare")
  const _showResourcelink = getAttr(showResourceLink, "show_resourcelink")
  const _showContent = getAttr(showContent, "show_content")

  return `{{ ekk_group_detail
            ${_showImage}
            ${_showTitle}
            ${_showCategory}
            ${_showGroup}
            ${_showMetaHeadings}
            ${_showDay}
            ${_showTimes}
            ${_showStatus}
            ${_showChildcare}
            ${_showResourcelink}
            ${_showContent}
            groups_recent='${groupsRecent}'
          }}`;
};
