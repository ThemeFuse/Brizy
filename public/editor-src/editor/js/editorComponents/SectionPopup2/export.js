import { onBodyClick } from "visual/utils/export/delegate";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { uuid } from "visual/utils/uuid";
import { SectionPopup2Accessibility } from "../accessibility";
import { popup } from "./popup";
import "./popupsPlugin";

// do not close popup is element with some of this className was clicked
const clickInsideExceptions = ["brz-map__cover"];
const clickOutsideAttr = makeAttr("click_outside_to_close");
const oldClickOutsideAttr = "data-click_outside_to_close";

// exact attribute match over the document; the value may not be a CSS identifier
const findByAttr = (name, value) => {
  const attrName = makeAttr(name);

  return Array.from(document.querySelectorAll(`[${attrName}]`)).filter(
    (node) => node.getAttribute(attrName) === value
  );
};

export default function (node) {
  const root = node;

  // append the popup to body to avoid problems with z-index
  const rootBody = root.ownerDocument.body;

  // Accessibility: dialog semantics + ESC to close (when allowed)
  root.querySelectorAll(".brz-popup2").forEach((popup) => {
    if (popup instanceof HTMLElement) {
      new SectionPopup2Accessibility(popup).init();
    }
  });

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

  const linkSelector = makeDataAttrString({
    name: "link-type",
    value: "'popup'"
  });
  const links = new Set(root.querySelectorAll(linkSelector));
  const popupSelector = ".brz-popup2, .brz-popup";
  const popupClicks = new Map();

  onBodyClick([
    {
      selector: linkSelector,
      handler: (link, e) => {
        if (!links.has(link)) {
          return;
        }

        e.preventDefault();

        const popupId = link.getAttribute("href").slice(1); // without the `#`

        if (popupId) {
          const elems = findByAttr("popup", popupId);
          if (elems.some((elem) => elem.classList.contains("brz-popup2"))) {
            popup(elems).show();
          }
        }
      }
    },
    {
      selector: popupSelector,
      handler: (nearest, e) => {
        // every popup around the click, innermost first
        for (
          let element = nearest;
          element;
          element = element.parentElement?.closest(popupSelector)
        ) {
          popupClicks.get(element)?.(e);
        }
      }
    }
  ]);

  // Excluded embedded popups(.brz-conditions-popup--static)
  const conditionalPopups = Array.from(
    root.querySelectorAll(
      ".brz-conditions-popup:not(.brz-conditions-popup--static)"
    )
  ).filter((node) => node.innerHTML && node.innerHTML.trim() !== "");

  // Popups with Triggers
  conditionalPopups.forEach((node) => {
    const data = _parsePopupData(node);
    const instance = popup(
      Array.from(node.children).filter((child) =>
        child.classList.contains("brz-popup2")
      )
    );

    window.brzPopup(
      Object.assign({}, data, {
        show: function () {
          this.show();
        }.bind(instance),
        hide: function () {
          this.close();
        }.bind(instance)
      })
    );
  });

  root.querySelectorAll(popupSelector).forEach((node) => {
    popupClicks.set(node, (e) => {
      const canClosePopup = !clickInsideExceptions.some((className) =>
        e.target.classList.contains(className)
      );

      if (canClosePopup) {
        const clickedOutSideToClose =
          node.getAttribute(clickOutsideAttr) ??
          node.getAttribute(oldClickOutsideAttr);

        const clickedOutSideContent = !e.target.closest(".brz-container");
        const clickedTheCross = e.target.closest(".brz-popup2__close");
        const clickedTheCrossAction = e.target.closest(
          ".brz-popup2__action-close"
        );

        const clickedFormEvent = !!e.target.closest(
          ".select2-selection__choice"
        );

        if (
          clickedTheCrossAction ||
          clickedTheCross ||
          (!clickedFormEvent && clickedOutSideContent && clickedOutSideToClose)
        ) {
          e.preventDefault();
          popup([node]).close();
        }
      }
    });
  });

  // closes a popup when an anchor link is clicked inside it
  window.Brz.on("elements.anchor.startScrolled", (anchor) => {
    const closestPopup =
      anchor instanceof Element ? anchor.closest(".brz-popup2") : null;

    if (closestPopup) {
      popup([closestPopup]).close();
    }
  });
}

function _parsePopupData(node) {
  const attr = (name) => node.getAttribute(name) ?? undefined;
  const triggerOnce = attr(makeAttr("trigger_once"));
  const popup = node.querySelector(".brz-popup2");

  // custom-id is for the old popups that haven't been updated
  const popupId =
    popup?.getAttribute(makeAttr("once-id")) ??
    popup?.getAttribute(makeAttr("custom-id")) ??
    undefined;

  const pageLoad = attr(makeAttr("page_load")) ?? attr("data-page_load");
  const click = attr(makeAttr("click"));
  const inactivity = attr(makeAttr("inactivity"));
  const exitIntent = attr(makeAttr("exit_intent"));
  const scrolling = _parseData(attr(makeAttr("scrolling")));

  const showing = _parseData(attr(makeAttr("showing")));
  const loggedIn = _parseData(attr(makeAttr("logged_in")));
  const referrer = _parseData(attr(makeAttr("referrer")));
  const devices = _parseData(attr(makeAttr("devices")));

  const currentUrl = _parseData(attr(makeAttr("current_url")));
  const currentDate = _parseData(attr(makeAttr("current_date")));
  const lastVisitDate = _parseData(attr(makeAttr("last_visit_date")));
  const timeFrom = _parseData(attr(makeAttr("time_from")));
  const cookie = _parseData(attr(makeAttr("cookie")));
  const os = _parseData(attr(makeAttr("os")));
  const otherPopups = _parseData(attr(makeAttr("other_popups")));
  const specificPopup = _parseData(attr(makeAttr("specific_popup")));

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
