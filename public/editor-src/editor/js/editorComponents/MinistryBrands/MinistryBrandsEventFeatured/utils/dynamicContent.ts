import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail, getFeatures } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    showImage,
    showTitle,
    showDate,
    showCategory,
    showGroup,
    showMetaHeadings,
    showLocation,
    showRoom,
    showCoordinator,
    showCoordinatorEmail,
    showCoordinatorPhone,
    showCost,
    showWebsite,
    showRegistration,
    showDescription,
    showLatestEvents,
    recentEvents,
    eventSlug,
    category,
    group,
    features,
    nonfeatures,
    showPreview,
    detailPageButtonText,
    detailPage,
    dateFormat,
    showMetaIcons
  } = v;

  const attr = [
    `category='${category}'`,
    `group='${group}'`,
    `recentEvents='${recentEvents}'`,
    getAttr(showLatestEvents, "show_latest_events"),
    `event_slug='${eventSlug}'`,
    getFeatures(features, "features"),
    getFeatures(nonfeatures, "nonfeatures"),
    getAttr(showImage, "show_image"),
    getAttr(showTitle, "show_title"),
    getAttr(showDate, "show_date"),
    getAttr(showCategory, "show_category"),
    getAttr(showGroup, "show_group"),
    getAttr(showMetaHeadings, "show_meta_headings"),
    getAttr(showLocation, "show_location"),
    getAttr(showRoom, "show_room"),
    getAttr(showCoordinator, "show_coordinator"),
    getAttr(showCoordinatorEmail, "show_coordinator_email"),
    getAttr(showCoordinatorPhone, "show_coordinator_phone"),
    getAttr(showCost, "show_cost"),
    getAttr(showWebsite, "show_website"),
    getAttr(showRegistration, "show_registration"),
    getAttr(showDescription, "show_description"),
    getAttr(showPreview, "show_preview"),
    getAttr(showMetaIcons, "show_meta_icons"),
    `detail_page_button_text='${detailPageButtonText}'`,
    `detail_page='${getDetail(detailPage)}'`,
    `date_format='${dateFormat}'`
  ];

  return makePlaceholder({
    content: "{{ekk_event_featured}}",
    attrStr: attr.join(" ")
  });
};
