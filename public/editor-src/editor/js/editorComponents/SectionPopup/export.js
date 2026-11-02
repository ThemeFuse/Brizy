import { onBodyClick } from "visual/utils/export/delegate";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";

// exact attribute match over the document; the value may not be a CSS identifier
const findByAttr = (name, value) => {
  const attrName = makeAttr(name);

  return Array.from(document.querySelectorAll(`[${attrName}]`)).filter(
    (node) => node.getAttribute(attrName) === value
  );
};

export default function (node) {
  const linkSelector = makeDataAttrString({
    name: "link-type",
    value: "popup"
  });
  const links = new Set(node.querySelectorAll(linkSelector));
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
          const popups = findByAttr("popup", popupId);

          if (popups.some((popup) => popup.classList.contains("brz-popup"))) {
            openPopup(popups[0]);
          }
        }
      }
    },
    {
      selector: ".brz-popup",
      handler: (nearest, e) => {
        // every popup around the click, innermost first
        for (
          let popup = nearest;
          popup;
          popup = popup.parentElement?.closest(".brz-popup")
        ) {
          popupClicks.get(popup)?.(e);
        }
      }
    }
  ]);

  node.querySelectorAll(".brz-popup:not(.brz-initialized)").forEach((popup) => {
    popupClicks.set(popup, (e) => {
      const clickedInsideContent = !e.target.closest(".brz-container");

      if (clickedInsideContent) {
        closePopup(popup);
      }
    });
  });

  document.querySelectorAll(".brz-popup").forEach((popup) => {
    popup.classList.add("brz-initialized");
  });

  // closes a popup when an anchor link is clicked inside it
  window.Brz.on("elements.anchor.startScrolled", (anchor) => {
    const closestPopup =
      anchor instanceof Element ? anchor.closest(".brz-popup") : null;

    if (closestPopup) {
      closePopup(closestPopup);
    }
  });

  function closePopup(popup) {
    popup.classList.remove("brz-popup--opened");
    document.documentElement.classList.remove("brz-ow-hidden");

    // trigger an event so that other components could listen
    window.Brz.emit("brz.popup.close", popup);
    window.Brz.emit("elements.popup.close", popup);
  }

  function openPopup(popup) {
    popup.classList.add("brz-popup--opened");
    document.documentElement.classList.add("brz-ow-hidden");
    window.Brz.emit("elements.popup.open", popup);
  }
}
