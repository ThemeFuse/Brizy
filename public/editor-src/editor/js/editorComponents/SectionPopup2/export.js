import $ from "jquery";

export default function() {
  const $document = $(document);

  $document.on("click", '[data-brz-link-type="popup"]', function(e) {
    e.preventDefault();

    const popupId = this.getAttribute("href").slice(1); // without the `#`

    if (popupId) {
      showPopup($('[data-brz-popup="' + popupId + '"]'));
    }
  });

  $document.on("click", ".brz-popup2", function(e) {
    const clickedOutSideToClose = $(this).attr("data-click_outside_to_close");
    const clickedOutSideContent =
      $(e.target).closest(".brz-container").length === 0;
    const clickedTheCross = $(e.target).closest(".brz-popup2__close").length;

    if (clickedTheCross || (clickedOutSideContent && clickedOutSideToClose)) {
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

  function showPopup($popup) {
    const scrollPage = $popup.attr("data-scroll_page");
    const showAfter = $popup.attr("data-show-close-button-after");

    if (showAfter) {
      setTimeout(() => {
        $popup.find(".brz-popup2__close").removeClass("brz-hidden");
      }, Number(showAfter) * 1000);
    }
    $popup.addClass("brz-popup2--opened");

    if (!scrollPage) {
      $("html").addClass("brz-ow-hidden");
    }
  }

  function closePopup(popup) {
    $(popup).removeClass("brz-popup2--opened");
    $("html").removeClass("brz-ow-hidden");

    // trigger an event so that other components could listen
    $(document).trigger("brz.popup.close", [popup]);
  }
}
