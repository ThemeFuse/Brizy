import $ from "jquery";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { uuid } from "visual/utils/uuid";
import "./popupsPlugin";

// do not close popup is element with some of this className was clicked
const clickInsideExceptions = ["brz-map__cover"];
const clickOutsideAttr = makeAttr("click_outside_to_close");
const oldClickOutsideAttr = "data-click_outside_to_close";

$.fn.popup = function () {
  const $this = $(this);

  return {
    show() {
      const scrollPage = $this.attr(makeAttr("scroll_page"));
      const showAfter = $this.attr(makeAttr("show-close-button-after"));
      const clickedOutSideToClose =
        $this.attr(clickOutsideAttr) ?? $this.attr(oldClickOutsideAttr);

      if (!clickedOutSideToClose) {
        $this.addClass("brz-pointer-events-none");
        $this
          .find(".brz-popup2__inner > .brz-container__wrap")
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
      window.Brz.emit("elements.popup.open", $this.get(0));
    },
    close() {
      $this.removeClass("brz-popup2--opened");
      $("html").removeClass("brz-ow-hidden");

      // trigger an event so that other components could listen
      $(document).trigger("brz.popup.close", [$this.get(0)]);
      window.Brz.emit("elements.popup.close", $this.get(0));
    }
  };
};

export default function ($node) {
  const root = $node.get(0);

  // append the popup to body to avoid problems with z-index
  const rootBody = root.ownerDocument.body;
  const globalPopupsProcessed = {};

  root
    .querySelectorAll(
      makeDataAttrString({ name: "link-type", value: "'popup'" })
    )
    .forEach((node) => {
      const popupId = node.getAttribute("href").slice(1); // without the `#`
      let parent = node.parentElement;
      let popup;

      // Link with reference to a global popup
      // Global Block Popup exist only 1 in all page
      if (globalPopupsProcessed[popupId]) {
        node.setAttribute("href", `#${globalPopupsProcessed[popupId]}`);
        return;
      }

      while (parent) {
        popup = [...parent.children].find(
          (node) => node.dataset.brzPopup === popupId
        );

        if (popup) {
          break;
        }

        parent = parent.parentElement;
      }

      // append the popup to body to avoid problems with z-index
      // need to regenerate ids for popups for Dynamic Content
      if (popup && popup.parentElement !== rootBody) {
        const newId = uuid();
        const isGlobal = popup.getAttribute("id").includes("global_");

        node.setAttribute("href", `#${newId}`);
        popup.setAttribute(makeAttr("popup"), newId);

        if (isGlobal) {
          globalPopupsProcessed[popupId] = newId;
        }

        rootBody.append(popup);
      }
    });

  $node
    .find(makeDataAttrString({ name: "link-type", value: "'popup'" }))
    .on("click", function (e) {
      e.preventDefault();

      const popupId = this.getAttribute("href").slice(1); // without the `#`

      if (popupId) {
        const $elem = $(makeDataAttrString({ name: "popup", value: popupId }));
        if ($elem.hasClass("brz-popup2")) {
          const popup = $elem.popup();
          popup.show();
        }
      }
    });

  $node
    .find(
      ".brz-simple-popup, .brz-conditions-internal-popup, .brz-conditions-external-popup"
    )
    .filter(function () {
      return !($(this).attr("data-brz-embedded") === "true");
    })
    .each(function () {
      const $this = $(this);

      $this.on("click", function (e) {
        const canClosePopup = !clickInsideExceptions.some((className) =>
          e.target.classList.contains(className)
        );

        if (canClosePopup) {
          const clickedOutSideToClose =
            $this.attr(clickOutsideAttr) ?? $this.attr(oldClickOutsideAttr);

          const clickedOutSideContent =
            $(e.target).closest(".brz-container").length === 0;
          const clickedTheCross = $(e.target).closest(
            ".brz-popup2__close"
          ).length;
          const clickedTheCrossAction = $(e.target).closest(
            ".brz-popup2__action-close"
          ).length;

          const clickedFormEvent =
            $(e.target).closest(".select2-selection__choice").length > 0;

          if (
            clickedTheCrossAction ||
            clickedTheCross ||
            (!clickedFormEvent &&
              clickedOutSideContent &&
              clickedOutSideToClose)
          ) {
            e.preventDefault();
            $this.popup().close();
          }
        }
      });

      if (
        $this.hasClass("brz-conditions-internal-popup") ||
        $this.hasClass("brz-conditions-external-popup")
      ) {
        const data = _parsePopupData($this);
        const popup = $this.popup();

        window.brzPopup(
          Object.assign({}, data, {
            show: function () {
              this.show();
            }.bind(popup),
            hide: function () {
              this.close();
            }.bind(popup)
          })
        );
      }
    });

  // closes a popup when an anchor link is clicked inside it
  window.Brz.on("elements.anchor.startScrolled", (anchor) => {
    const $closestPopup = $(anchor).closest(".brz-popup2");

    if ($closestPopup.length > 0) {
      const popup = $closestPopup.popup();
      popup.close();
    }
  });
}

function _parsePopupData($popup) {
  var triggerOnce = $popup.attr(makeAttr("trigger_once"));

  var popupId = $popup.attr(makeAttr("popup"));

  var pageLoad =
    $popup.attr(makeAttr("page_load")) ?? $popup.attr("data-page_load");
  var click = $popup.attr(makeAttr("click"));
  var inactivity = $popup.attr(makeAttr("inactivity"));
  var exitIntent = $popup.attr(makeAttr("exit_intent"));
  var scrolling = _parseData($popup.attr(makeAttr("scrolling")));

  var showing = _parseData($popup.attr(makeAttr("showing")));
  var loggedIn = _parseData($popup.attr(makeAttr("logged_in")));
  var referrer = _parseData($popup.attr(makeAttr("referrer")));
  var devices = _parseData($popup.attr(makeAttr("devices")));

  var currentUrl = _parseData($popup.attr(makeAttr("current_url")));
  var currentDate = _parseData($popup.attr(makeAttr("current_date")));
  var lastVisitDate = _parseData($popup.attr(makeAttr("last_visit_date")));
  var timeFrom = _parseData($popup.attr(makeAttr("time_from")));
  var cookie = _parseData($popup.attr(makeAttr("cookie")));
  var os = _parseData($popup.attr(makeAttr("os")));
  var otherPopups = _parseData($popup.attr(makeAttr("other_popups")));
  var specificPopup = _parseData($popup.attr(makeAttr("specific_popup")));

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
