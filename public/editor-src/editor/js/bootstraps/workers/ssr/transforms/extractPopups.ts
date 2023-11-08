import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { read } from "visual/utils/reader/string";
import { uuid } from "visual/utils/uuid";

export const extractPopups = ($: cheerio.Root): void => {
  const globalPopupsProcessed: Record<string, string> = {};
  const popupSelector = makeDataAttrString({
    name: "link-type",
    value: "popup"
  });

  $(popupSelector).each(function (this: cheerio.CheerioAPI) {
    const $this = $(this);
    const popupId = read($this.attr("href")?.replace("#", ""));

    if (!popupId) {
      return;
    }

    const selector = makeDataAttrString({ name: "popup*", value: popupId });
    let $parent = $this.parent();
    let $popup;

    while ($parent.length > 0) {
      /*
       * data-brz-popup can be in one of two forms
       *   1. data-brz-popup={some_hash} - for normal (non global) popups
       *   2. data-brz-popup=`global_{some_hash}` - for global popups
       *
       * popupId contains only {some_hash} and that's why we
       * search with *= instead of = (to match both normal and global popups)
       */
      $popup = $parent.children(selector);

      if ($popup.length > 0) {
        break;
      }

      $parent = $parent.parent();
    }

    if ($popup && $popup.length > 0) {
      const popupId = $popup.attr(makeAttr("popup")) ?? "";
      const isGlobal = popupId.includes("global_");

      if (isGlobal && globalPopupsProcessed[popupId]) {
        // do not append more copies of global popups than 1
        $this.attr("href", `#${globalPopupsProcessed[popupId]}`);
        $popup.remove();
      } else {
        const newId = uuid();

        $this.attr("href", `#${newId}`);
        $popup.attr(makeAttr("popup"), newId);

        if (isGlobal) {
          globalPopupsProcessed[popupId] = newId;
        }
      }
    }
  });
};
