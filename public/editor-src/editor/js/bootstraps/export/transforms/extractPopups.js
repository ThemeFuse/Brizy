import { uuid } from "visual/utils/uuid";

export default function extractPopups($) {
  const globalPopupsProcessed = {};

  $("[data-brz-link-type='popup']").each(function() {
    const $this = $(this);
    const popupId = $this.attr("href").replace("#", "");
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
      $popup = $parent.children(`[data-brz-popup*='${popupId}']`);

      if ($popup.length > 0) {
        break;
      }

      $parent = $parent.parent();
    }

    if ($popup.length > 0) {
      const popupId = $popup.attr("data-brz-popup");
      const isGlobal = popupId.includes("global_");

      if (isGlobal && globalPopupsProcessed[popupId]) {
        // do not append more copies of global popups than 1
        $this.attr("href", `#${globalPopupsProcessed[popupId]}`);
        $popup.remove();
      } else {
        const newId = uuid();

        $this.attr("href", `#${newId}`);
        $popup.attr("data-brz-popup", newId);

        // append the popup to body to avoid problems with z-index
        $("body").append($popup);

        if (isGlobal) {
          globalPopupsProcessed[popupId] = newId;
        }
      }
    }
  });
}
