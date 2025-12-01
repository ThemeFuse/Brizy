import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
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
    showFullEmail,
    showPreviousPage,
    group,
    staffSlug,
    detailPageButtonText,
    detailPage
  } = v;

  const attr = [
    `group='${group}'`,
    `staff_slug='${staffSlug}'`,
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
    getAttr(showFullEmail, "show_full_email"),
    getAttr(showPreviousPage, "show_previous_page"),
    `detail_page_button_text='${detailPageButtonText}'`,
    `detail_page='${getDetail(detailPage)}'`
  ];

  return makePlaceholder({
    content: "{{ekk_staff_featured}}",
    attrStr: attr.join(" ")
  });
};
