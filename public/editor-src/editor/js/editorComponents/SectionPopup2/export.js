import $ from "jquery";

export default function() {
  const $document = $(document);

  $document.on("click", '[data-brz-link-type="popup"]', function(e) {
    e.preventDefault();

    const popupId = this.getAttribute("href").slice(1); // without the `#`

    if (popupId) {
      $('[data-brz-popup="' + popupId + '"]').addClass("brz-popup2--opened");
      $("html").addClass("brz-ow-hidden");
    }
  });

  $document.on("click", ".brz-popup2", function(e) {
    const clickedInsideContent =
      $(e.target).closest(".brz-container").length === 0;

    if (clickedInsideContent) {
      closePopup(this);
    }
  });

  // closes a popup when an anchor link is clicked inside it
  $document.on("brz.anchor.click", function(e, anchor) {
    const $closestPopup = $(anchor).closest(".brz-popup2");

    if ($closestPopup.length > 0) {
      closePopup($closestPopup);
    }
  });

  function closePopup(popup) {
    $(popup).removeClass("brz-popup2--opened");
    $("html").removeClass("brz-ow-hidden");

    // trigger an event so that other components could listen
    $(document).trigger("brz.popup.close", [popup]);
  }
}
