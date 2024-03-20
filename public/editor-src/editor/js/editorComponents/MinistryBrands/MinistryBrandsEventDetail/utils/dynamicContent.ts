import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr } from "../../utils/helpers";
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
    recentEvents,
    showPreviousPage,
    dateFormat,
    showMetaIcons,
    showSubscribeToEvent,
    subscribeToEventButtonText
  } = v;

  const attr = [
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
    getAttr(showPreviousPage, "previous_page"),
    getAttr(showMetaIcons, "show_meta_icons"),
    getAttr(showSubscribeToEvent, "show_subscribe_to_event"),
    `events_recent='${recentEvents}'`,
    `date_format='${dateFormat}'`,
    `subscribe_to_event_button_text='${subscribeToEventButtonText}'`
  ];

  return makePlaceholder({
    content: "{{ekk_event_detail}}",
    attrStr: attr.join(" ")
  });
};
