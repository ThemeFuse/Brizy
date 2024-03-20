import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import { Value } from "../types";

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
    showResourceLink,
    dateFormat,
    showMetaIcons
  } = v;

  const attr = [
    `howmany='${itemsNumber}'`,
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showCoordinator, "show_coordinator"),
    `category='${category}'`,
    `group='${group}'`,
    getAttr(showPreview, "show_preview"),
    getAttr(showPagination, "show_pagination"),
    getAttr(showImages, "show_images"),
    getAttr(showDay, "show_day"),
    getAttr(showTimes, "show_times"),
    getAttr(showStatus, "show_status"),
    getAttr(showChildcare, "show_childcare"),
    getAttr(showResourceLink, "show_resourcelink"),
    getAttr(showMetaIcons, "show_meta_icons"),
    `detail_page='${getDetail(detailPage)}'`,
    `detail_page_button_text='${detailPageButtonText}'`,
    `date_format='${dateFormat}'`
  ];

  return makePlaceholder({
    content: "{{ekk_group_list}}",
    attrStr: attr.join(" ")
  });
};
