import $ from "jquery";

export default function($node) {
  const $document = $(document);

  $node.find("[data-brz-link-type='popup']").on("click", function(e) {
    e.preventDefault();

    const popupId = this.getAttribute("href").slice(1); // without the `#`

    if (popupId) {
      const $elem = $(`[data-brz-popup="${popupId}"]`);

      if ($elem.hasClass("brz-popup")) {
        $(`[data-brz-popup="${popupId}"]`).addClass("brz-popup--opened");
        $("html").addClass("brz-ow-hidden");
      }
    }
  });

  $node.find(".brz-popup:not(.brz-initialized)").click(function(e) {
    const clickedInsideContent =
      $(e.target).closest(".brz-container").length === 0;

    if (clickedInsideContent) {
      closePopup(this);
    }
  });

  $(".brz-popup").addClass("brz-initialized");

  // closes a popup when an anchor link is clicked inside it
  $document.on("brz.anchor.click", function(e, anchor) {
    const $closestPopup = $(anchor).closest(".brz-popup");

    if ($closestPopup.length > 0) {
      closePopup($closestPopup);
    }
  });

  function closePopup(popup) {
    $(popup).removeClass("brz-popup--opened");
    $("html").removeClass("brz-ow-hidden");

    // trigger an event so that other components could listen
    $(document).trigger("brz.popup.close", [popup]);
  }
}
