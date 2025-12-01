import { makePlaceholder } from "visual/utils/dynamicContent";
import { getAttr, getDetail } from "../../utils/helpers";
import type { Value } from "../types";

export const getPlaceholder = (v: Value): string => {
  const {
    showImages,
    showTitle,
    showPosition,
    showGroups,
    showPhoneWork,
    showPhoneCell,
    showEmail,
    showFacebook,
    showTwitter,
    showWebsite,
    showInstagram,
    showGroupFilter,
    showSearch,
    showMetaHeadings,
    showFullEmail,
    detailPageButtonText,
    detailPage,
    showMetaIcons,
    searchPlaceholder,
    groupFilterHeading,
    showRss,
    showPagination,
    howmany,
    series
  } = v;

  const attr = [
    getAttr(showImages, "show_images"),
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
    getAttr(showGroupFilter, "show_group_filter"),
    getAttr(showSearch, "show_search"),
    getAttr(showMetaHeadings, "show_meta_headings"),
    getAttr(showMetaIcons, "show_meta_icons"),
    getAttr(showFullEmail, "show_full_email"),
    getAttr(showRss, "show_rss"),
    getAttr(showPagination, "show_pagination"),
    `detail_page='${getDetail(detailPage)}'`,
    `search_placeholder='${searchPlaceholder}'`,
    `group_filter_heading='${groupFilterHeading}'`,
    `detail_page_button_text='${detailPageButtonText}'`,
    `howmany='${howmany}'`,
    `series='${series}'`
  ];

  return makePlaceholder({
    content: "{{ekk_staff_layout}}",
    attrStr: attr.join(" ")
  });
};
