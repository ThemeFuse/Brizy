import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    itemsNumber,
    showTitle,
    showImages,
    showMeta,
    category,
    detailPageButton,
    detailPage,
    showPosition,
    showPhoneWork,
    showPhoneCell,
    showEmail,
    showFacebook,
    showTwitter,
    showWebsite,
    showInstagram,
    showGroups,
    showMetaIcons,
    showFullEmail,
    showPagination,
    showRss
  } = v;

  const attr = [
    `howmany='${itemsNumber}'`,
    `group='${category}'`,
    getAttr(showTitle, "show_title"),

    getAttr(showPosition, "show_position"),
    getAttr(showGroups, "show_groups"),
    getAttr(showPhoneWork, "show_phone_work"),
    getAttr(showPhoneCell, "show_phone_cell"),
    getAttr(showEmail, "show_email"),
    getAttr(showFacebook, "show_facebook"),
    getAttr(showTwitter, "show_twitter"),
    getAttr(showWebsite, "show_website"),
    getAttr(showInstagram, "show_instagram"),
    getAttr(showImages, "show_images"),
    getAttr(showMeta, "show_meta_headings"),
    getAttr(showMetaIcons, "show_meta_icons"),
    getAttr(showFullEmail, "show_full_email"),
    getAttr(showPagination, "show_pagination"),
    getAttr(showRss, "show_rss"),

    `detail_page='${getDetail(detailPage)}'`,
    `detail_page_button_text='${detailPageButton}'`
  ];

  return makePlaceholder({
    content: "{{ekk_staff_list}}",
    attrStr: attr.join(" ")
  });
};
