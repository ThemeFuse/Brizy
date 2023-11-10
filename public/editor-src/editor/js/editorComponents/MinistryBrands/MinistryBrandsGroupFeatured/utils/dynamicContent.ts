import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import { Value } from "../types";

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

  const attr = [
    getAttr(showImage, "show_image"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showDay, "show_day"),
    getAttr(showTimes, "show_times"),
    getAttr(showStatus, "show_status"),
    getAttr(showChildcare, "show_childcare"),
    getAttr(showResourceLink, "show_resourcelink"),
    getAttr(showPreview, "show_preview"),
    getAttr(groupLatest, "group_latest"),
    `group_recent_list='${groupRecentList}'`,
    `group_slug='${groupSlug}'`,
    `category='${category}'`,
    `group='${group}'`,
    `detail_page_button_text='${detailPageButtonText}'`,
    `detail_page='${getDetail(detailPage)}'`,
    `slug='${slug}'`
  ];

  return makePlaceholder({
    content: "{{ekk_group_featured}}",
    attrStr: attr.join(" ")
  });
};
