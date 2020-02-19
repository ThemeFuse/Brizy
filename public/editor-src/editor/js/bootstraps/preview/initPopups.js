import $ from "jquery";
import initExports from "./initExports";

export default function() {
  $(".brz-conditions-internal-popup, .brz-simple-popup").each(function() {
    _initPopup($(this));
    initExports($(this));
  });

  var MutationObserverCb = function(mutationsList) {
    for (let mutation of mutationsList) {
      var popupAdded =
        mutation.addedNodes[0] &&
        mutation.addedNodes[0].classList.contains("brz-external-popup-elem");

      if (mutation.type === "childList" && popupAdded) {
        var $popup = $(mutation.addedNodes[0]).find(".brz-conditions-popup");
        _initPopup($popup);
        initExports($popup);
      }
    }
  };

  const observer = new MutationObserver(MutationObserverCb);
  observer.observe(document.body, { childList: true });
}

function _initPopup($popup) {
  var data = _parsePopupData($popup);
  var popup = $popup.popup();

  window.brzPopup(
    Object.assign({}, data, {
      show: function() {
        this.show();
      }.bind(popup)
    })
  );
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

    triggerOnce: triggerOnce === "true",
    popupId: popupId
  };

  function _parseData(value) {
    return value ? JSON.parse(decodeURIComponent(value)) : null;
  }
}
