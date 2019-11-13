import $ from "jquery";

(function statistic() {
  var pagesViews = Number(localStorage.getItem("pagesViews")) || 0;
  var pagesViewsInSessionTimeLine =
    Number(localStorage.getItem("pagesViewsInSessionTimeLine")) || 0;
  var lastVisit = Number(localStorage.getItem("lastVisit")) || Date.now();
  var sessions = Number(localStorage.getItem("sessions")) || 0;

  var timeSixOursBefore = Date.now() - 3600 * 6 * 1000;
  // var timeSixOursBefore = Date.now() - 5 * 1000;
  if (!sessions || (lastVisit && lastVisit < timeSixOursBefore)) {
    localStorage.setItem("sessions", ++sessions);
    localStorage.setItem("pagesViewsInSessionTimeLine", 1);
  } else {
    localStorage.setItem(
      "pagesViewsInSessionTimeLine",
      ++pagesViewsInSessionTimeLine
    );
  }

  localStorage.setItem("pagesViews", ++pagesViews);
  localStorage.setItem("lastVisit", Date.now());
})();

export default function() {
  $(document).ready(function() {
    $(document).on("brz.popup.close", function(e, el) {
      if ($(el).hasClass("brz-conditions-popup")) {
        var showedPopups = JSON.parse(
          localStorage.getItem("showedPopups") || "[]"
        );

        var closedPopupId = $(el).attr("data-brz-popup");

        localStorage.setItem(
          "showedPopups",
          JSON.stringify([...new Set([...showedPopups, closedPopupId])])
        );
      }
    });

    $(".brz-conditions-popup").each(function() {
      var $this = $(this);
      var trigger_once = $this.attr("data-trigger_once");
      var popup = $this.popup();

      var popupId = $this.attr("data-brz-popup");
      var showedPopups = JSON.parse(
        localStorage.getItem("showedPopups") || "[]"
      );

      if (trigger_once === "true" && showedPopups.includes(popupId)) {
        return;
      }

      var pageLoad = $this.attr("data-page_load");
      var click = $this.attr("data-click");
      var inactivity = $this.attr("data-inactivity");
      var exitIntent = $this.attr("data-exit_intent");
      var scrolling = _parseData($this.attr("data-scrolling"));

      var showing = _parseData($this.attr("data-showing"));
      var loggedIn = _parseData($this.attr("data-logged_in"));
      var referrer = _parseData($this.attr("data-referrer"));
      var devices = _parseData($this.attr("data-devices"));

      var canShowPopup = true;
      var lastScrollTop = 0;
      var clickAmount = 0;
      var listeners = [];

      if (pageLoad) {
        pageLoad = Number(pageLoad);
        setTimeout(showPopup, pageLoad * 1000);
      }
      if (click) {
        attachEvent("click", onClick);
      }
      if (inactivity) {
        var activityChangeFn = _debounce(() => {
          showPopup();
        }, inactivity * 1000);

        attachEvent("load", activityChangeFn);
        attachEvent("mousemove", activityChangeFn);
        attachEvent("mousedown", activityChangeFn);
        attachEvent("touchstart", activityChangeFn);
        attachEvent("click", activityChangeFn);
        attachEvent("keypress", activityChangeFn);
        attachEvent("scroll", activityChangeFn);
      }
      if (exitIntent) {
        attachEvent("mouseleave", onExitIntent);
      }
      if (scrolling) {
        scrolling.forEach(function(item) {
          switch (item.value) {
            case "down":
              attachEvent("scroll", onDownScroll.bind(this, item.within));
              break;
            case "up":
              attachEvent("scroll", onUpScroll);
              break;
            case "toElement":
              attachEvent("scroll", onScrollTo.bind(this, item.toElement));
              break;
          }
        });
      }

      // Advanced Rules
      if (showing) {
        showing.forEach(function(item) {
          switch (item.value) {
            case "views":
              Number(localStorage.getItem("pagesViews")) ===
                Number(item.views) && showPopup();
              break;
            case "sessions":
              Number(localStorage.getItem("sessions")) ===
                Number(item.sessions) &&
                Number(localStorage.getItem("pagesViewsInSessionTimeLine")) ===
                  1 &&
                showPopup();
              break;
          }
        });
      }

      if (loggedIn) {
        loggedIn.forEach(function(item) {
          switch (item.value) {
            case "all":
              hidePopup();
              break;
            case "custom":
              var roles = __CONFIG__.currentUser.roles;
              if (roles.includes(item.user)) {
                hidePopup();
              }
              break;
          }
        });
      }

      if (referrer) {
        referrer.forEach(function(item) {
          switch (item.value) {
            case "show":
              _clearUrl(document.referrer) === _clearUrl(item.url) &&
                showPopup();
              break;
            case "hide":
              _clearUrl(document.referrer) === _clearUrl(item.url) &&
                hidePopup();
              break;
            case "regex":
              new RegExp(item.url).test(document.referrer) && showPopup();
              break;
            case "source":
              var SEARCH_ENGINES = [
                "google",
                "bing",
                "yahoo",
                "ask.com",
                "aol.com",
                "baidu",
                "wolframalpha",
                "duckduckgo",
                "archive",
                "yandex"
              ];

              var isFromSearchEngine = SEARCH_ENGINES.some(item =>
                _clearUrl(document.referrer).startsWith(item)
              );
              var isFromInternal = _clearUrl(document.referrer).startsWith(
                location.host
              );
              var isFromExternal =
                document.referrer && !isFromSearchEngine && !isFromInternal;

              if (
                (item.source === "search_engines" && isFromSearchEngine) ||
                (item.source === "internal" && isFromInternal) ||
                (item.source === "external" && isFromExternal)
              ) {
                showPopup();
              }
              break;
          }
        });
      }

      if (devices) {
        var currentDevice = _detectCurrentDevice();
        if (!devices.includes(currentDevice)) {
          hidePopup();
        }
      }

      function onDownScroll(value) {
        var scrollTop = $(document).scrollTop();
        var documentHeight = $(document).height();
        var windowHeight = $(window).height();
        var heightDiff = documentHeight - windowHeight;
        var scrollTopInPercent = (scrollTop * 100) / heightDiff;

        if (scrollTopInPercent > Number(value)) {
          showPopup();
        }
      }
      function onUpScroll() {
        var st = $(window).scrollTop();
        if (st < lastScrollTop) {
          showPopup();
        }

        lastScrollTop = st;
      }

      function onScrollTo(selector) {
        var $elem = $(selector);
        if (!$elem.length) {
          return;
        }

        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemHeight = $elem.height();
        var elemTop = $elem.offset().top;

        if (elemTop <= docViewBottom && elemTop + elemHeight >= docViewTop) {
          showPopup();
        }
      }

      function onClick() {
        clickAmount++;
        if (clickAmount >= Number(click)) {
          showPopup();
        }
      }
      function onExitIntent() {
        showPopup();
      }
      function showPopup() {
        setTimeout(() => {
          if (canShowPopup) {
            popup.show();

            canShowPopup = false;
          }
        }, 0);

        detachAll();
      }
      function hidePopup() {
        canShowPopup = false;
        detachAll();
      }
      function attachEvent(type, handler) {
        listeners.push({ type, handler });
        $(document).on(type, handler);
      }

      function detachEvent(detachType, detachHandler) {
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];

          if (
            listener.type == detachType &&
            listener.handler == detachHandler
          ) {
            listeners.splice(listeners.indexOf(listener), 1);
            $(document).off(detachType, detachHandler);
          }
        }
      }

      function detachAll() {
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];

          $(document).off(listener.type, listener.handler);
        }
      }
      function _parseData(value) {
        return value ? JSON.parse(decodeURIComponent(value)) : null;
      }
      function _debounce(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this,
            args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      }
      function _clearUrl(url) {
        var regex = /^(?:https?:\/\/)?(?:www\.)?/i;

        return url.replace(regex, "");
      }
      function _detectCurrentDevice() {
        var MAX_MOBILE_WIDTH = 767;
        var MAX_TABLET_WIDTH = 991;
        if (outerWidth < MAX_MOBILE_WIDTH) {
          return "mobile";
        } else if (outerWidth < MAX_TABLET_WIDTH) {
          return "tablet";
        } else {
          return "desktop";
        }
      }
    });
  });
}
