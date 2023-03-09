import { getAttr, getDetail, getFeatures } from "../utils/helpers";
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
    showLatestEvents,
    recentEvents,
    eventSlug,
    category,
    group,
    features,
    nonfeatures,
    showPreview,
    detailPageButtonText,
    detailPage
  } = v;

  const _detailPage = getDetail(detailPage);

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
  const _showPreview = getAttr(showPreview, "show_preview");
  const _showLatestEvents = getAttr(showLatestEvents, "show_latest_events");

  const _features = getFeatures(features, "features");
  const _nonfeatures = getFeatures(nonfeatures, "nonfeatures");

  return `{{ekk_event_featured 
              category='${category}'
              group='${group}'
              recentEvents='${recentEvents}'
              ${_showLatestEvents}
              event_slug='${eventSlug}'
              ${_features}
              ${_nonfeatures}
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
              ${_showPreview}
              detail_page_button_text='${detailPageButtonText}'
              detail_page='${_detailPage}'
           }}`;
};
