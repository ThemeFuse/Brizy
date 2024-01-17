import $ from "jquery";
import { makeDataAttrString } from "visual/utils/i18n/attribute";

export default function ($node) {
  $node
    .find(makeDataAttrString({ name: "link-type", value: "popup" }))
    .on("click", function (e) {
      e.preventDefault();

      const popupId = this.getAttribute("href").slice(1); // without the `#`

      if (popupId) {
        const $popup = $(makeDataAttrString({ name: "popup", value: popupId }));

        if ($popup.hasClass("brz-popup")) {
          openPopup($popup.get(0));
        }
      }
    });

  $node.find(".brz-popup:not(.brz-initialized)").click(function (e) {
    const clickedInsideContent =
      $(e.target).closest(".brz-container").length === 0;

    if (clickedInsideContent) {
      closePopup(this);
    }
  });

  $(".brz-popup").addClass("brz-initialized");

  // closes a popup when an anchor link is clicked inside it
  window.Brz.on("elements.anchor.startScrolled", (anchor) => {
    const $closestPopup = $(anchor).closest(".brz-popup");

    if ($closestPopup.length > 0) {
      closePopup($closestPopup.get(0));
    }
  });

  function closePopup(popup) {
    $(popup).removeClass("brz-popup--opened");
    $("html").removeClass("brz-ow-hidden");

    // trigger an event so that other components could listen
    $(document).trigger("brz.popup.close", [popup]);
    window.Brz.emit("elements.popup.close", popup);
  }

  function openPopup(popup) {
    $(popup).addClass("brz-popup--opened");
    $("html").addClass("brz-ow-hidden");
    window.Brz.emit("elements.popup.open", popup);
  }
}
