import { getAttr, getDetail, getFeatures } from "../utils/helpers";
import { Value } from "./types";

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

  const _showImages = getAttr(showImage, "show_images");
  const _showTitle = getAttr(showTitle, "show_title");
  const _showDate = getAttr(showDate, "show_date");
  const _showCategory = getAttr(showCategory, "show_category");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showMeta = getAttr(showMeta, "show_meta_headings");
  const _showPreview = getAttr(showPreview, "show_preview");

  const _showPagination = getAttr(showPagination, "show_pagination");
  const _showLocation = getAttr(showLocation, "show_location");
  const _showRegistration = getAttr(showRegistration, "show_registration");

  const _features = getFeatures(features, "features");
  const _nonfeatures = getFeatures(nonfeatures, "nonfeatures");

  const _detailPage = getDetail(detailPage);

  return `{{ekk_event_list
      howmany='${itemsNumber}'
      ${_showImages}
      ${_showTitle}
      ${_showDate}
      ${_showCategory}
      ${_showGroup}
      ${_showMeta}
      ${_showPreview}
      ${_showPagination}
      ${_showLocation}
      ${_showRegistration}
      category='${category}'
      ${_features}
      ${_nonfeatures}
      group='${group}'
      detail_page='${_detailPage}'
      detail_page_button_text='${detailPageButtonText}'
   }}`;
};
