import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail, getFeatures } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    itemsNumber,
    showImage,
    showDate,
    showCategory,
    showGroup,
    showPreview,
    showTitle,
    showPagination,
    showMeta,
    group,
    category,
    detailPage,
    detailPageButtonText,
    features,
    nonfeatures,
    showLocation,
    showRegistration
  } = v;

  const attr = [
    `howmany='${itemsNumber}'`,
    getAttr(showImage, "show_images"),
    getAttr(showTitle, "show_title"),
    getAttr(showDate, "show_date"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showMeta, "show_meta_headings"),
    getAttr(showPreview, "show_preview"),
    getAttr(showPagination, "show_pagination"),
    getAttr(showLocation, "show_location"),
    getAttr(showRegistration, "show_registration"),
    `category='${category}'`,
    getFeatures(features, "features"),
    getFeatures(nonfeatures, "nonfeatures"),
    `group='${group}'`,
    `detail_page='${getDetail(detailPage)}'`,
    `detail_page_button_text='${detailPageButtonText}'`
  ];

  return makePlaceholder({
    content: "{{ekk_event_list}}",
    attrStr: attr.join(" ")
  });
};
