import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    recentStaff,
    showImage,
    showTitle,
    showPosition,
    showGroups,
    showPhoneWork,
    showPhoneCell,
    showEmail,
    showFacebook,
    showTwitter,
    showInstagram,
    showWebsite,
    showRss,
    showMetaHeadings,
    showAboutText,
    showMetaIcons,
    showPreviousPage,
    showFullEmail
  } = v;

  const attr = [
    `staff_recent='${recentStaff}'`,
    getAttr(showImage, "show_image"),
    getAttr(showTitle, "show_title"),
    getAttr(showPosition, "show_position"),
    getAttr(showGroups, "show_groups"),
    getAttr(showPhoneWork, "show_phone_work"),
    getAttr(showPhoneCell, "show_phone_cell"),
    getAttr(showEmail, "show_email"),
    getAttr(showFacebook, "show_facebook"),
    getAttr(showTwitter, "show_twitter"),
    getAttr(showInstagram, "show_instagram"),
    getAttr(showWebsite, "show_website"),
    getAttr(showRss, "show_rss"),
    getAttr(showMetaHeadings, "show_meta_headings"),
    getAttr(showAboutText, "show_about"),
    getAttr(showMetaIcons, "show_meta_icons"),
    getAttr(showPreviousPage, "show_previous_page"),
    getAttr(showFullEmail, "show_full_email")
  ];

  return makePlaceholder({
    content: "{{ekk_staff_detail}}",
    attrStr: attr.join(" ")
  });
};
