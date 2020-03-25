import $ from "jquery";

(function statistic() {
  var pagesViews = Number(localStorage.getItem("brz-pagesViews")) || 0;
  var pagesViewsInSessionTimeLine =
    Number(localStorage.getItem("brz-pagesViewsInSessionTimeLine")) || 0;
  var lastVisit = Number(localStorage.getItem("brz-lastVisit")) || Date.now();
  var sessions = Number(localStorage.getItem("brz-sessions")) || 0;

  var timeSixOursBefore = Date.now() - 3600 * 6 * 1000;
  // var timeSixOursBefore = Date.now() - 5 * 1000;
  if (!sessions || (lastVisit && lastVisit < timeSixOursBefore)) {
    localStorage.setItem("brz-sessions", ++sessions);
    localStorage.setItem("brz-pagesViewsInSessionTimeLine", 1);
  } else {
    localStorage.setItem(
      "brz-pagesViewsInSessionTimeLine",
      ++pagesViewsInSessionTimeLine
    );
  }

  localStorage.setItem("brz-pagesViews", ++pagesViews);
  localStorage.setItem("brz-lastVisit", Date.now());
})();

(function(window, document) {
  $(document).on("brz.popup.close", function(e, popup) {
    var $popup = $(popup);

    if ($popup.hasClass("brz-conditions-popup")) {
      var showedPopups = JSON.parse(
        localStorage.getItem("brz-showedPopups") || "[]"
      );

      var popupId = $popup.attr("data-brz-popup");

      localStorage.setItem(
        "brz-showedPopups",
        JSON.stringify([...new Set([...showedPopups, popupId])])
      );
    }
  });

  window.brzPopup = function(options) {
    var canShowPopup = true;
    var lastScrollTop = 0;
    var clickAmount = 0;
    var listeners = [];

    var showedPopups = JSON.parse(
      localStorage.getItem("brz-showedPopups") || "[]"
    );

    if (options.triggerOnce && showedPopups.includes(options.popupId)) {
      return;
    }

    _init();

    function _init() {
      if (options.pageLoad) {
        var pageLoad = Number(options.pageLoad);
        setTimeout(showPopup, pageLoad * 1000);
      }

      if (options.click) {
        _attachEvent("click", _onClick);
      }

      if (options.inactivity) {
        var activityChangeFn = _debounce(() => {
          showPopup();
        }, options.inactivity * 1000);

        _attachEvent("load", activityChangeFn);
        _attachEvent("mousemove", activityChangeFn);
        _attachEvent("mousedown", activityChangeFn);
        _attachEvent("touchstart", activityChangeFn);
        _attachEvent("click", activityChangeFn);
        _attachEvent("keypress", activityChangeFn);
        _attachEvent("scroll", activityChangeFn);
      }

      if (options.exitIntent) {
        _attachEvent("mouseleave", _onExitIntent);
      }

      if (options.scrolling) {
        options.scrolling.forEach(function(item) {
          switch (item.value) {
            case "down":
              _attachEvent("scroll", onDownScroll.bind(this, item.within));
              break;
            case "up":
              _attachEvent("scroll", onUpScroll);
              break;
            case "toElement":
              _attachEvent("scroll", onScrollTo.bind(this, item.toElement));
              break;
          }
        });
      }

      // Advanced Rules
      if (options.showing) {
        options.showing.forEach(function(item) {
          switch (item.value) {
            case "views":
              Number(localStorage.getItem("brz-pagesViews")) ===
                Number(item.views) && showPopup();
              break;
            case "sessions":
              Number(localStorage.getItem("brz-sessions")) ===
                Number(item.sessions) &&
                Number(
                  localStorage.getItem("brz-pagesViewsInSessionTimeLine")
                ) === 1 &&
                showPopup();
              break;
          }
        });
      }

      if (options.referrer) {
        options.referrer.forEach(function(item) {
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

      if (options.devices) {
        var currentDevice = _detectCurrentDevice();
        if (!options.devices.includes(currentDevice)) {
          hidePopup();
        }
      }
    }

    function onDownScroll(value) {
      var body = document.body;
      var html = document.documentElement;
      var scrollTop = html.scrollTop;
      var documentHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      var windowHeight = html.clientHeight;
      var heightDiff = documentHeight - windowHeight;
      var scrollTopInPercent = (scrollTop * 100) / heightDiff;

      if (scrollTopInPercent > Number(value)) {
        showPopup();
      }
    }

    function onUpScroll() {
      var html = document.documentElement;
      var st = html.scrollTop;
      if (st < lastScrollTop) {
        showPopup();
      }

      lastScrollTop = st;
    }

    function onScrollTo(selector) {
      var elem = document.querySelector(selector);
      if (!elem) {
        return;
      }

      var html = document.documentElement;
      var docViewTop = html.scrollTop;
      var docViewBottom = docViewTop + html.clientHeight;
      var elemHeight = elem.clientHeight;
      var elemTop = elem.offsetTop;

      if (elemTop <= docViewBottom && elemTop + elemHeight >= docViewTop) {
        showPopup();
      }
    }

    function _onClick() {
      clickAmount++;
      if (clickAmount >= Number(options.click)) {
        showPopup();
      }
    }

    function _onExitIntent() {
      showPopup();
    }

    function showPopup() {
      setTimeout(() => {
        if (canShowPopup) {
          options.show();
          // this.iframe.style.display = "block";

          canShowPopup = false;
        }
      }, 0);

      _detachAll();
    }

    function hidePopup() {
      options.hide();
      // this.iframe.style.display = "none";
      canShowPopup = false;
      _detachAll();
    }

    function _attachEvent(type, handler) {
      listeners.push({ type, handler });
      document.addEventListener(type, handler);
    }

    function _detachAll() {
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];

        document.removeEventListener(listener.type, listener.handler);
      }
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

    return this;
  };
})(window, document);
