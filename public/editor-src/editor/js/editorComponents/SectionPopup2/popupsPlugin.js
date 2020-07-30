import $ from "jquery";

var lastVisit = Number(localStorage.getItem("brz-lastVisit")) || Date.now();

(function statistic() {
  var pagesViews = Number(localStorage.getItem("brz-pagesViews")) || 0;
  var pagesViewsInSessionTimeLine =
    Number(localStorage.getItem("brz-pagesViewsInSessionTimeLine")) || 0;

  var lastVisit = Number(localStorage.getItem("brz-lastVisit")) || Date.now();
  var sessions = Number(localStorage.getItem("brz-sessions")) || 0;

  var timeSixOursBefore = Date.now() - 3600 * 6 * 1000;
  // var timeSixOursBefore = Date.now() - 10 * 1000;
  if (!sessions || (lastVisit && lastVisit < timeSixOursBefore)) {
    localStorage.setItem("brz-sessions", ++sessions);
    localStorage.setItem("brz-pagesViewsInSessionTimeLine", 1);
    localStorage.setItem("brz-showedPopupsInSessionTimeLine", "[]");
  } else {
    localStorage.setItem(
      "brz-pagesViewsInSessionTimeLine",
      ++pagesViewsInSessionTimeLine
    );
  }

  localStorage.setItem("brz-pagesViews", ++pagesViews);

  setTimeout(function() {
    localStorage.setItem("brz-lastVisit", Date.now());
  }, 0);

  if (!localStorage.getItem("brz-firstVisit")) {
    localStorage.setItem("brz-firstVisit", Date.now());
  }
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
        // a hack for firefox. mouseLeave event doesn't fire
        // on document object
        _attachEvent("mouseleave", _onExitIntent, document.body);
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
          // || "equals" - is for old projects which don't have type
          const type = item.type || "equals";

          var isFewer = type === "is fewer";
          var isEqual = type === "equals";
          var isMore = type === "is more";

          switch (item.value) {
            case "views":
              var pageViews = Number(localStorage.getItem("brz-pagesViews"));
              var itemViews = Number(item.views);

              isFewer && pageViews < itemViews && showPopup();
              isEqual && pageViews === itemViews && showPopup();
              isMore && pageViews > itemViews && showPopup();

              break;
            case "sessions":
              var pagesViewsInSession = localStorage.getItem(
                "brz-pagesViewsInSessionTimeLine"
              );
              var sessions = Number(localStorage.getItem("brz-sessions"));
              var itemsSessions = Number(item.sessions);
              if (pagesViewsInSession !== 1) {
                break;
              }

              isFewer && sessions < itemsSessions && showPopup();
              isEqual && sessions === itemsSessions && showPopup();
              isMore && sessions > itemsSessions && showPopup();

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
              var type = item.type || "is";
              var source = item.source;

              var SEARCH_ENGINES = [
                "search_engines",
                "bing",
                "yandex",
                "yahoo",
                "baidu",
                "so.com",
                "360.cn",
                "aol",
                "duckduckgo",
                "ask.com",
                "mail.ru",
                "sogou"
              ];

              var SOCIAL_NETWORKS = [
                "social_networks",
                "facebook",
                "pinterest",
                "twitter",
                "linkedin"
              ];

              var _referrerIs = function(str) {
                return (
                  source === str && _clearUrl(document.referrer).startsWith(str)
                );
              };

              var referrerIncludes = function(items) {
                return items.some(function(item) {
                  return _referrerIs(item);
                });
              };

              var isFromSearchEngine =
                source === "search_engines" && referrerIncludes(SEARCH_ENGINES);

              var isFromSocialNetworks =
                source === "social_networks" &&
                referrerIncludes(SOCIAL_NETWORKS);

              var isFromInternal =
                source === "internal" &&
                _clearUrl(document.referrer).startsWith(location.host);

              var isFromExternal =
                source === "external" &&
                document.referrer &&
                !isFromSearchEngine &&
                !isFromInternal;

              var popupPassedChecks =
                _referrerIs(source) ||
                isFromSearchEngine ||
                isFromSocialNetworks ||
                isFromInternal ||
                isFromExternal;

              switch (type) {
                case "is": {
                  popupPassedChecks && showPopup();
                  break;
                }
                // ! is not working correctly
                case "is not": {
                  !popupPassedChecks && showPopup();
                  break;
                }
              }
          }
        });
      }

      if (options.devices) {
        var currentDevice = _detectCurrentDevice();
        if (!options.devices.includes(currentDevice)) {
          hidePopup();
        }
      }

      if (options.currentUrl) {
        options.currentUrl.forEach(function(item) {
          var parsedHref = _clearUrl(document.location.href);
          var parsedValue = _clearUrl(item.value);

          switch (item.type) {
            case "matches":
              parsedHref === parsedValue && showPopup();
              break;
            case "does not match":
              parsedHref !== parsedValue && showPopup();
              break;
            case "contains":
              parsedHref.includes(parsedValue) && showPopup();
              break;
            case "does not contain":
              !parsedHref.includes(parsedValue) && showPopup();
              break;
          }
        });
      }

      if (options.currentDate) {
        options.currentDate.forEach(function(item) {
          var timeStamp = new Date(
            item.value
              .split("/")
              .reverse()
              .join(" ")
          ).getTime();
          var d = new Date();
          var currentTimeStamp = new Date(
            `${d.getFullYear()} ${d.getMonth() + 1} ${d.getDate()}`
          ).getTime();
          switch (item.type) {
            case "matches":
              currentTimeStamp === timeStamp && showPopup();
              break;
            case "before":
              currentTimeStamp < timeStamp && showPopup();
              break;
            case "after":
              currentTimeStamp > timeStamp && showPopup();
              break;
          }
        });
      }

      if (options.os) {
        options.os.forEach(function(item) {
          var os = _detectOS();
          var devices = os.getAll();
          var popupPassedChecks = devices[item.value];

          switch (item.type) {
            case "is":
              popupPassedChecks && showPopup();
              break;
            case "is not":
              !popupPassedChecks && showPopup();
              break;
          }
        });
      }

      if (options.cookie) {
        options.cookie.forEach(function(item) {
          var param = item.param;
          var value = item.value;

          var currentCookie = _getCookie(param);
          if (!currentCookie) return;

          switch (item.type) {
            case "matches":
              currentCookie === value && showPopup();
              break;
            case "does not match":
              currentCookie !== value && showPopup();
              break;
            case "contains":
              currentCookie.includes(value) && showPopup();
              break;
            case "does not contain":
              !currentCookie.includes(value) && showPopup();
              break;
          }
        });
      }

      if (options.timeFrom) {
        options.timeFrom.forEach(function(item) {
          var visit = item.visit;
          var time = item.time === "days" ? 3600 * 24 * 1000 : 3600 * 1000;
          var value = Number(item.value);
          var firstVisit =
            Number(localStorage.getItem("brz-firstVisit")) || Date.now();
          const isFirst = visit == "first";
          const isLast = visit == "last";

          var firstTimeIsGreater = firstVisit + value * time < Date.now();
          var secondTimeIsGreater = lastVisit + value * time < Date.now();

          switch (item.type) {
            case "greater":
              isFirst && firstTimeIsGreater && showPopup();
              isLast && secondTimeIsGreater && showPopup();
              break;
            case "less":
              isFirst && !firstTimeIsGreater && showPopup();
              isLast && !secondTimeIsGreater && showPopup();
              break;
          }
        });
      }

      if (options.lastVisitDate) {
        options.lastVisitDate.forEach(function(item) {
          var timeStamp = new Date(
            item.value
              .split("/")
              .reverse()
              .join(" ")
          ).getTime();
          var d = new Date(lastVisit);
          var lastVisitTimeStamp = new Date(
            `${d.getFullYear()} ${d.getMonth() + 1} ${d.getDate()}`
          ).getTime();
          switch (item.type) {
            case "matches":
              lastVisitTimeStamp === timeStamp && showPopup();
              break;
            case "before":
              lastVisitTimeStamp < timeStamp && showPopup();
              break;
            case "after":
              lastVisitTimeStamp > timeStamp && showPopup();
              break;
          }
        });
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
      var showPopupNow = true;
      if (options.specificPopup) {
        options.specificPopup.forEach(function(item) {
          var value = item.value.replace("#", "");
          var specificElem = document.getElementById(value);

          var anotherPopupWasShown =
            specificElem &&
            specificElem.classList.contains("brz-popup2--was-shown");

          showPopupNow = item.type === "was" && anotherPopupWasShown;
        });
      }

      var showedPopupsInSessionTimeLine = JSON.parse(
        localStorage.getItem("brz-showedPopupsInSessionTimeLine") || "[]"
      );

      if (options.otherPopups) {
        options.otherPopups.forEach(function(item) {
          var value = item.value;
          var alreadyShowedPopups = document.querySelector(
            ".brz-popup2--was-shown"
          );

          switch (item.type) {
            case "was":
              if (value === "page") {
                canShowPopup = Boolean(alreadyShowedPopups);
              }
              if (value === "session") {
                canShowPopup = !showedPopupsInSessionTimeLine.length;
              }
              break;
            case "was not":
              if (value === "page") {
                canShowPopup = Boolean(!alreadyShowedPopups);
              }
              if (value === "session") {
                canShowPopup = showedPopupsInSessionTimeLine.length;
              }
              break;
          }
        });
      }

      if (showPopupNow) {
        setTimeout(() => {
          if (canShowPopup) {
            options.show();

            localStorage.setItem(
              "brz-showedPopupsInSessionTimeLine",
              JSON.stringify([
                ...new Set([...showedPopupsInSessionTimeLine, options.popupId])
              ])
            );

            canShowPopup = false;
          }
        }, 0);

        _detachAll();
      }
    }

    function hidePopup() {
      options.hide();
      // this.iframe.style.display = "none";
      canShowPopup = false;
      _detachAll();
    }

    function _attachEvent(type, handler, elem) {
      if (!elem) {
        elem = document;
      }
      listeners.push({ type, handler, elem });
      elem.addEventListener(type, handler);
    }

    function _detachAll() {
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];

        listener.elem.removeEventListener(listener.type, listener.handler);
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

    function _detectOS() {
      var os = {
        getUserAgent: function() {
          return navigator.userAgent;
        },
        getPlatform: function() {
          return navigator.platform;
        },
        isIos: function() {
          return /iPhone|iPad|iPod/.test(os.getPlatform());
        },
        isAndroid: function() {
          return /Android/.test(os.getUserAgent());
        },
        isBlackBerry: function() {
          return /BlackBerry/.test(os.getPlatform());
        },
        isBada: function() {
          return /Bada/.test(os.getPlatform());
        },
        isMac: function() {
          return /Mac/.test(os.getPlatform());
        },
        isWindows: function() {
          return /Win/.test(os.getPlatform());
        },
        isLinux: function() {
          return /Linux/.test(os.getPlatform()) && !os.isAndroid();
        },
        isChromeOS: function() {
          return /\bCrOS\b/.test(os.getPlatform());
        },
        isFirefoxOS: function() {
          return /\bFxiOS\b/.test(os.getPlatform());
        },
        getAll: function() {
          return {
            blackberry: os.isBlackBerry(),
            firefoxOs: os.isFirefoxOS(),
            windows: os.isWindows(),
            android: os.isAndroid(),
            chromeOs: os.isChromeOS(),
            linux: os.isLinux(),
            bada: os.isBada(),
            ios: os.isIos(),
            mac: os.isMac()
          };
        }
      };

      return os;
    }

    function _getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2)
        return parts
          .pop()
          .split(";")
          .shift();
    }

    return this;
  };
})(window, document);
