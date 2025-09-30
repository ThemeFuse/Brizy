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
        setTimeout(
          () => {
            $this.find(".brz-popup2__close").removeClass("brz-hidden");
          },
          Number(showAfter) * 1000
        );
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

  root
    .querySelectorAll(makeDataAttrString({ name: "link-type", value: "popup" }))
    .forEach((node) => {
      const popupId = node.getAttribute("href").slice(1); // without the `#`

      if (!popupId) {
        return;
      }

      let parent = node.parentElement;
      let popup;

      while (parent) {
        popup = [...parent.children].find(
          (node) => node.dataset.brzPopup === popupId
        );

        if (popup) {
          break;
        }

        parent = parent.parentElement;
      }

      if (popup) {
        // Need to generate a new UID to resolve problems with global popup.
        // The global popup doesn't need to be removed because the popup can be inside a post loop.
        const newId = uuid();
        node.setAttribute("href", `#${newId}`);
        popup.setAttribute(makeAttr("popup"), newId);
        rootBody.append(popup);
      } else {
        node.classList.remove("link--popup");

        if (!node.classList.contains("brz-btn")) {
          node.classList.add("brz-cursor-auto");
        }
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

  // Excluded embedded popups(.brz-conditions-popup--static)
  const $conditionalPopups = $node
    .find(".brz-conditions-popup:not(.brz-conditions-popup--static)")
    .filter((_, node) => node.innerHTML && node.innerHTML.trim() !== "");

  // Popups with Triggers
  $conditionalPopups.each(function () {
    const $this = $(this);
    const data = _parsePopupData($this);
    const $popup = $this.children(".brz-popup2");
    const popup = $popup.popup();

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
  });

  $node.find(".brz-popup2, .brz-popup").each(function () {
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
          (!clickedFormEvent && clickedOutSideContent && clickedOutSideToClose)
        ) {
          e.preventDefault();
          $this.popup().close();
        }
      }
    });
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
  const triggerOnce = $popup.attr(makeAttr("trigger_once"));
  const popup = $popup.find(".brz-popup2");

  // custom-id is for the old popups that haven't been updated
  const popupId =
    popup?.attr(makeAttr("once-id")) ?? popup?.attr(makeAttr("custom-id"));

  const pageLoad =
    $popup.attr(makeAttr("page_load")) ?? $popup.attr("data-page_load");
  const click = $popup.attr(makeAttr("click"));
  const inactivity = $popup.attr(makeAttr("inactivity"));
  const exitIntent = $popup.attr(makeAttr("exit_intent"));
  const scrolling = _parseData($popup.attr(makeAttr("scrolling")));

  const showing = _parseData($popup.attr(makeAttr("showing")));
  const loggedIn = _parseData($popup.attr(makeAttr("logged_in")));
  const referrer = _parseData($popup.attr(makeAttr("referrer")));
  const devices = _parseData($popup.attr(makeAttr("devices")));

  const currentUrl = _parseData($popup.attr(makeAttr("current_url")));
  const currentDate = _parseData($popup.attr(makeAttr("current_date")));
  const lastVisitDate = _parseData($popup.attr(makeAttr("last_visit_date")));
  const timeFrom = _parseData($popup.attr(makeAttr("time_from")));
  const cookie = _parseData($popup.attr(makeAttr("cookie")));
  const os = _parseData($popup.attr(makeAttr("os")));
  const otherPopups = _parseData($popup.attr(makeAttr("other_popups")));
  const specificPopup = _parseData($popup.attr(makeAttr("specific_popup")));

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

    triggerOnce: triggerOnce === "true" || triggerOnce === "1",
    popupId: popupId
  };

  function _parseData(value) {
    return value ? JSON.parse(decodeURIComponent(value)) : null;
  }
}
