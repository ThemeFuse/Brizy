import { getAttr } from "../utils/helpers";
import { Value } from "./types";

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
    showPreviousPage
  } = v;

  const _showImage = getAttr(showImage, "show_image");
  const _showTitle = getAttr(showTitle, "show_title");
  const _showDate = getAttr(showDate, "show_date");
  const _showCategory = getAttr(showCategory, "show_category");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showMetaHeadings = getAttr(showMetaHeadings, "show_meta_headings");
  const _showLocation = getAttr(showLocation, "show_location");
  const _showRoom = getAttr(showRoom, "show_room");
  const _showCoordinator = getAttr(showCoordinator, "show_coordinator");
  const _showCoordinatorEmail = getAttr(
    showCoordinatorEmail,
    "show_coordinator_email"
  );
  const _showCoordinatorPhone = getAttr(
    showCoordinatorPhone,
    "show_coordinator_phone"
  );
  const _showCost = getAttr(showCost, "show_cost");
  const _showWebsite = getAttr(showWebsite, "show_website");
  const _showRegistration = getAttr(showRegistration, "show_registration");
  const _showDescription = getAttr(showDescription, "show_description");
  const _showPreviousPage = getAttr(showPreviousPage, "previous_page");
  return `{{ekk_event_detail 
              ${_showImage}
              ${_showTitle}
              ${_showDate}
              ${_showCategory}
              ${_showGroup}
              ${_showMetaHeadings}
              ${_showLocation}
              ${_showRoom}
              ${_showCoordinator}
              ${_showCoordinatorEmail}
              ${_showCoordinatorPhone}
              ${_showCost}
              ${_showWebsite}
              ${_showRegistration}
              ${_showDescription}
              ${_showPreviousPage}
              events_recent='${recentEvents}'
           }}`;
};
