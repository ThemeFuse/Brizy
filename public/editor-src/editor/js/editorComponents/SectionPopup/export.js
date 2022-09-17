import $ from "jquery";
import { uuid } from "visual/utils/uuid";

export default function ($node) {
  const root = $node.get(0);

  // append the popup to body to avoid problems with z-index
  const rootBody = root.ownerDocument.body;
  const globalPopupsProcessed = {};

  root.querySelectorAll("[data-brz-link-type='popup']").forEach((node) => {
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
      popup.setAttribute("data-brz-popup", newId);

      if (isGlobal) {
        globalPopupsProcessed[popupId] = newId;
      }

      rootBody.append(popup);
    }
  });

  $node.find("[data-brz-link-type='popup']").on("click", function (e) {
    e.preventDefault();

    const popupId = this.getAttribute("href").slice(1); // without the `#`

    if (popupId) {
      const $popup = $(`[data-brz-popup="${popupId}"]`);

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
