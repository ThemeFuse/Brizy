import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    showImage,
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
    groupsRecent,
    showPreviousPage
  } = v;

  const attr = [
    getAttr(showImage, "show_image"),
    getAttr(showTitle, "show_title"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showMetaHeadings, "show_meta_headings"),
    getAttr(showDay, "show_day"),
    getAttr(showTimes, "show_times"),
    getAttr(showStatus, "show_status"),
    getAttr(showChildcare, "show_childcare"),
    getAttr(showResourceLink, "show_resourcelink"),
    getAttr(showContent, "show_content"),
    getAttr(showPreviousPage, "previous_page"),
    `groups_recent='${groupsRecent}'`
  ];

  return makePlaceholder({
    content: "{{ekk_group_detail}}",
    attrStr: attr.join(" ")
  });
};
