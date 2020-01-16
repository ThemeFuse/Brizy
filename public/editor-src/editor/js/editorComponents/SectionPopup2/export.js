import $ from "jquery";

export default function() {
  const $document = $(document);

  $.fn.popup = function() {
    const $this = $(this);

    return {
      show() {
        const scrollPage = $this.attr("data-scroll_page");
        const showAfter = $this.attr("data-show-close-button-after");
        const clickedOutSideToClose = $this.attr("data-click_outside_to_close");

        if (!clickedOutSideToClose) {
          $this.addClass("brz-pointer-events-none");
          $this
            .find(".brz-bg > .brz-bg-content .brz-container__wrap")
            .addClass("brz-pointer-events-auto");
        }

        if (showAfter) {
          setTimeout(() => {
            $this.find(".brz-popup2__close").removeClass("brz-hidden");
          }, Number(showAfter) * 1000);
        }

        $this.addClass("brz-popup2--opened");

        if (!scrollPage) {
          $("html").addClass("brz-ow-hidden");
        } else {
          $("html").removeClass("brz-ow-hidden");
        }
      },
      close() {
        $this.removeClass("brz-popup2--opened");
        $("html").removeClass("brz-ow-hidden");

        // trigger an event so that other components could listen
        $(document).trigger("brz.popup.close", [$this.get(0)]);
      }
    };
  };

  $document.on("click", "[data-brz-link-type='popup']", function(e) {
    e.preventDefault();

    const popupId = this.getAttribute("href").slice(1); // without the `#`

    if (popupId) {
      const $elem = $(`[data-brz-popup="${popupId}"]`);
      if ($elem.hasClass("brz-popup2")) {
        const popup = $elem.popup();
        popup.show();
      }
    }
  });

  $document.on("click", ".brz-popup2", function(e) {
    const clickedOutSideToClose = $(this).attr("data-click_outside_to_close");
    const clickedOutSideContent =
      $(e.target).closest(".brz-container").length === 0;
    const clickedTheCross = $(e.target).closest(".brz-popup2__close").length;
    const clickedTheCrossAction = $(e.target).closest(
      ".brz-popup2__action-close"
    ).length;

    if (
      clickedTheCrossAction ||
      clickedTheCross ||
      (clickedOutSideContent && clickedOutSideToClose)
    ) {
      const popup = $(this).popup();
      e.preventDefault();
      popup.close();
    }
  });

  // closes a popup when an anchor link is clicked inside it
  $document.on("brz.anchor.click", function(e, anchor) {
    const $closestPopup = $(anchor).closest(".brz-popup2");

    if ($closestPopup.length > 0) {
      const popup = $closestPopup.popup();
      popup.close();
    }
  });
}
