import $ from "jquery";
import "./popupsPlugin";

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

      $this.addClass("brz-popup2--was-shown");
      $(document).trigger("brz.popup.show", [$this.get(0)]);
    },
    close() {
      $this.removeClass("brz-popup2--opened");
      $("html").removeClass("brz-ow-hidden");

      // trigger an event so that other components could listen
      $(document).trigger("brz.popup.close", [$this.get(0)]);
    }
  };
};

// closes a popup when an anchor link is clicked inside it
$(document).on("brz.anchor.click", function(e, anchor) {
  const $closestPopup = $(anchor).closest(".brz-popup2");

  if ($closestPopup.length > 0) {
    const popup = $closestPopup.popup();
    popup.close();
  }
});

export default function($node) {
  $node.find("[data-brz-link-type='popup']").on("click", function(e) {
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

  $node
    .find(".brz-simple-popup, .brz-conditions-internal-popup")
    .each(function() {
      const $this = $(this);

      $this.on("click", function(e) {
        const clickedOutSideToClose = $this.attr("data-click_outside_to_close");
        const clickedOutSideContent =
          $(e.target).closest(".brz-container").length === 0;
        const clickedTheCross = $(e.target).closest(".brz-popup2__close")
          .length;
        const clickedTheCrossAction = $(e.target).closest(
          ".brz-popup2__action-close"
        ).length;

        if (
          clickedTheCrossAction ||
          clickedTheCross ||
          (clickedOutSideContent && clickedOutSideToClose)
        ) {
          e.preventDefault();
          $this.popup().close();
        }
      });

      if ($this.hasClass("brz-conditions-internal-popup")) {
        const data = _parsePopupData($this);
        const popup = $this.popup();

        window.brzPopup(
          Object.assign({}, data, {
            show: function() {
              this.show();
            }.bind(popup),
            hide: function() {
              this.close();
            }.bind(popup)
          })
        );
      }
    });
}

function _parsePopupData($popup) {
  var triggerOnce = $popup.attr("data-trigger_once");

  var popupId = $popup.attr("data-brz-popup");

  var pageLoad = $popup.attr("data-page_load");
  var click = $popup.attr("data-click");
  var inactivity = $popup.attr("data-inactivity");
  var exitIntent = $popup.attr("data-exit_intent");
  var scrolling = _parseData($popup.attr("data-scrolling"));

  var showing = _parseData($popup.attr("data-showing"));
  var loggedIn = _parseData($popup.attr("data-logged_in"));
  var referrer = _parseData($popup.attr("data-referrer"));
  var devices = _parseData($popup.attr("data-devices"));

  var currentUrl = _parseData($popup.attr("data-current_url"));
  var currentDate = _parseData($popup.attr("data-current_date"));
  var lastVisitDate = _parseData($popup.attr("data-last_visit_date"));
  var timeFrom = _parseData($popup.attr("data-time_from"));
  var cookie = _parseData($popup.attr("data-cookie"));
  var os = _parseData($popup.attr("data-os"));
  var otherPopups = _parseData($popup.attr("data-other_popups"));
  var specificPopup = _parseData($popup.attr("data-specific_popup"));

  return {
    pageLoad: pageLoad,
    click: click,
    inactivity: inactivity,
    exitIntent: exitIntent,
    scrolling: scrolling,
    showing: showing,
    loggedIn: loggedIn,
    referrer: referrer,
    devices: devices,

    currentUrl: currentUrl,
    currentDate: currentDate,
    lastVisitDate: lastVisitDate,
    timeFrom: timeFrom,
    cookie: cookie,
    os: os,
    otherPopups: otherPopups,
    specificPopup: specificPopup,

    triggerOnce: triggerOnce === "true",
    popupId: popupId
  };

  function _parseData(value) {
    return value ? JSON.parse(decodeURIComponent(value)) : null;
  }
}
