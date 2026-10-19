import { makeAttr } from "visual/utils/i18n/attribute";

const getFromStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
};

const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    // biome-ignore lint/suspicious/noConsole: migrated from eslint
    console.warn("Could not access to localStorage");
  }
};

var lastVisit = Number(getFromStorage("brz-lastVisit")) || Date.now();

(function statistic() {
  var pagesViews = Number(getFromStorage("brz-pagesViews")) || 0;
  var pagesViewsInSessionTimeLine =
    Number(getFromStorage("brz-pagesViewsInSessionTimeLine")) || 0;

  var lastVisit = Number(getFromStorage("brz-lastVisit")) || Date.now();
  var sessions = Number(getFromStorage("brz-sessions")) || 0;

  var timeSixOursBefore = Date.now() - 3600 * 6 * 1000;
  // var timeSixOursBefore = Date.now() - 10 * 1000;
  if (!sessions || (lastVisit && lastVisit < timeSixOursBefore)) {
    setToStorage("brz-sessions", ++sessions);
    setToStorage("brz-pagesViewsInSessionTimeLine", 1);
    setToStorage("brz-showedPopupsInSessionTimeLine", "[]");
  } else {
    setToStorage(
      "brz-pagesViewsInSessionTimeLine",
      ++pagesViewsInSessionTimeLine
    );
  }

  setToStorage("brz-pagesViews", ++pagesViews);

  setTimeout(() => {
    setToStorage("brz-lastVisit", Date.now());
  }, 0);

  if (!getFromStorage("brz-firstVisit")) {
    setToStorage("brz-firstVisit", Date.now());
  }
})();

((window, document) => {
  // the jQuery set was always truthy, so every closed popup is recorded
  window.Brz.on("brz.popup.close", (popup) => {
    const showedPopups = JSON.parse(getFromStorage("brz-showedPopups") || "[]");

    const popupId =
      popup?.getAttribute(makeAttr("once-id")) ??
      popup?.getAttribute(makeAttr("custom-id")) ??
      undefined;

    setToStorage(
      "brz-showedPopups",
      JSON.stringify([...new Set([...showedPopups, popupId])])
    );
  });

  window.brzPopup = function (options) {
    var canShowPopup = true;
    var lastScrollTop = 0;
    var clickAmount = 0;
    var listeners = [];

    var showedPopups = JSON.parse(getFromStorage("brz-showedPopups") || "[]");

    if (options.triggerOnce && showedPopups.includes(options.popupId)) {
      return;
    }

    _init();

    function _init() {
      if (options.pageLoad) {
        const pageLoad = Number(options.pageLoad);
        setTimeout(showPopup, pageLoad * 1000);
      }

      if (options.click) {
        _attachEvent("click", _onClick);
      }

      if (options.inactivity) {
        const activityChangeFn = _debounce(() => {
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
        options.scrolling.forEach(function (item) {
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
        options.showing.forEach((item) => {
          // || "equals" - is for old projects which don't have type
          const type = item.type || "equals";

          var isFewer = type === "is fewer";
          var isEqual = type === "equals";
          var isMore = type === "is more";

          switch (item.value) {
            case "views": {
              const pageViews = Number(getFromStorage("brz-pagesViews"));
              const itemViews = Number(item.views);

              if (isFewer && pageViews < itemViews) showPopup();
              if (isEqual && pageViews === itemViews) showPopup();
              if (isMore && pageViews > itemViews) showPopup();

              break;
            }
            case "sessions": {
              const pagesViewsInSession = getFromStorage(
                "brz-pagesViewsInSessionTimeLine"
              );
              const sessions = Number(getFromStorage("brz-sessions"));
              const itemsSessions = Number(item.sessions);
              if (pagesViewsInSession !== 1) {
                break;
              }

              if (isFewer && sessions < itemsSessions) showPopup();
              if (isEqual && sessions === itemsSessions) showPopup();
              if (isMore && sessions > itemsSessions) showPopup();

              break;
            }
          }
        });
      }

      if (options.loggedIn) {
        const roles = __CONFIG__.currentUser.roles;

        const hideForUser = options.loggedIn.find(
          (user) => user.value === "all" || roles.includes(user.user)
        );

        if (hideForUser) {
          hidePopup();
        }
      }

      if (options.referrer) {
        options.referrer.forEach((item) => {
          switch (item.value) {
            case "show":
              if (_clearUrl(document.referrer) === _clearUrl(item.url)) {
                showPopup();
              }
              break;
            case "hide":
              if (_clearUrl(document.referrer) === _clearUrl(item.url)) {
                hidePopup();
              }
              break;
            case "regex":
              if (new RegExp(item.url).test(document.referrer)) showPopup();
              break;
            case "source": {
              const type = item.type || "is";
              const source = item.source;

              const SEARCH_ENGINES = [
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

              const SOCIAL_NETWORKS = [
                "social_networks",
                "facebook",
                "pinterest",
                "twitter",
                "linkedin"
              ];

              const _referrerIs = (str) =>
                source === str && _clearUrl(document.referrer).startsWith(str);

              const referrerIncludes = (items) =>
                items.some((item) => _referrerIs(item));

              const isFromSearchEngine =
                source === "search_engines" && referrerIncludes(SEARCH_ENGINES);

              const isFromSocialNetworks =
                source === "social_networks" &&
                referrerIncludes(SOCIAL_NETWORKS);

              const isFromInternal =
                source === "internal" &&
                _clearUrl(document.referrer).startsWith(location.host);

              const isFromExternal =
                source === "external" &&
                document.referrer &&
                !isFromSearchEngine &&
                !isFromInternal;

              const popupPassedChecks =
                _referrerIs(source) ||
                isFromSearchEngine ||
                isFromSocialNetworks ||
                isFromInternal ||
                isFromExternal;

              switch (type) {
                case "is": {
                  if (popupPassedChecks) showPopup();
                  break;
                }
                // ! is not working correctly
                case "is not": {
                  if (!popupPassedChecks) showPopup();
                  break;
                }
              }
            }
          }
        });
      }

      if (options.devices) {
        const currentDevice = _detectCurrentDevice();
        if (!options.devices.includes(currentDevice)) {
          hidePopup();
        }
      }

      if (options.currentUrl) {
        options.currentUrl.forEach((item) => {
          var parsedHref = _clearUrl(document.location.href);
          var parsedValue = _clearUrl(item.value);

          switch (item.type) {
            case "matches":
              if (parsedHref === parsedValue) showPopup();
              break;
            case "does not match":
              if (parsedHref !== parsedValue) showPopup();
              break;
            case "contains":
              if (parsedHref.includes(parsedValue)) showPopup();
              break;
            case "does not contain":
              if (!parsedHref.includes(parsedValue)) showPopup();
              break;
          }
        });
      }

      if (options.currentDate) {
        options.currentDate.forEach((item) => {
          var timeStamp = new Date(
            item.value.split(/[/.-]/).reverse().join(" ")
          ).getTime();
          var d = new Date();
          var currentTimeStamp = new Date(
            `${d.getFullYear()} ${d.getMonth() + 1} ${d.getDate()}`
          ).getTime();
          switch (item.type) {
            case "matches":
              if (currentTimeStamp === timeStamp) showPopup();
              break;
            case "before":
              if (currentTimeStamp < timeStamp) showPopup();
              break;
            case "after":
              if (currentTimeStamp > timeStamp) showPopup();
              break;
          }
        });
      }

      if (options.os) {
        options.os.forEach((item) => {
          var os = _detectOS();
          var devices = os.getAll();
          var popupPassedChecks = devices[item.value];

          switch (item.type) {
            case "is":
              if (popupPassedChecks) showPopup();
              break;
            case "is not":
              if (!popupPassedChecks) showPopup();
              break;
          }
        });
      }

      if (options.cookie) {
        options.cookie.forEach((item) => {
          var param = item.param;
          var value = item.value;

          var currentCookie = _getCookie(param);
          if (!currentCookie) return;

          switch (item.type) {
            case "matches":
              if (currentCookie === value) showPopup();
              break;
            case "does not match":
              if (currentCookie !== value) showPopup();
              break;
            case "contains":
              if (currentCookie.includes(value)) showPopup();
              break;
            case "does not contain":
              if (!currentCookie.includes(value)) showPopup();
              break;
          }
        });
      }

      if (options.timeFrom) {
        options.timeFrom.forEach((item) => {
          var visit = item.visit;
          var time = item.time === "days" ? 3600 * 24 * 1000 : 3600 * 1000;
          var value = Number(item.value);
          var firstVisit =
            Number(getFromStorage("brz-firstVisit")) || Date.now();
          const isFirst = visit === "first";
          const isLast = visit === "last";

          var firstTimeIsGreater = firstVisit + value * time < Date.now();
          var secondTimeIsGreater = lastVisit + value * time < Date.now();

          switch (item.type) {
            case "greater":
              if (isFirst && firstTimeIsGreater) showPopup();
              if (isLast && secondTimeIsGreater) showPopup();
              break;
            case "less":
              if (isFirst && !firstTimeIsGreater) showPopup();
              if (isLast && !secondTimeIsGreater) showPopup();
              break;
          }
        });
      }

      if (options.lastVisitDate) {
        options.lastVisitDate.forEach((item) => {
          var timeStamp = new Date(
            item.value.split(/[/.-]/).reverse().join(" ")
          ).getTime();
          var d = new Date(lastVisit);
          var lastVisitTimeStamp = new Date(
            `${d.getFullYear()} ${d.getMonth() + 1} ${d.getDate()}`
          ).getTime();
          switch (item.type) {
            case "matches":
              if (lastVisitTimeStamp === timeStamp) showPopup();
              break;
            case "before":
              if (lastVisitTimeStamp < timeStamp) showPopup();
              break;
            case "after":
              if (lastVisitTimeStamp > timeStamp) showPopup();
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
        options.specificPopup.forEach((item) => {
          var value = item.value.replace("#", "");
          var specificElem = document.getElementById(value);

          var anotherPopupWasShown = specificElem?.classList.contains(
            "brz-popup2--was-shown"
          );

          showPopupNow = item.type === "was" && anotherPopupWasShown;
        });
      }

      var showedPopupsInSessionTimeLine = JSON.parse(
        getFromStorage("brz-showedPopupsInSessionTimeLine") || "[]"
      );

      if (options.otherPopups) {
        options.otherPopups.forEach((item) => {
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

            setToStorage(
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
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];

        listener.elem.removeEventListener(listener.type, listener.handler);
      }
    }

    function _debounce(func, wait, immediate) {
      var timeout;
      return function (...args) {
        var later = () => {
          timeout = null;
          if (!immediate) func.apply(this, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
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
        getUserAgent: () => navigator.userAgent,
        getPlatform: () => navigator.platform,
        isIos: () => /iPhone|iPad|iPod/.test(os.getPlatform()),
        isAndroid: () => /Android/.test(os.getUserAgent()),
        isBlackBerry: () => /BlackBerry/.test(os.getPlatform()),
        isBada: () => /Bada/.test(os.getPlatform()),
        isMac: () => /Mac/.test(os.getPlatform()),
        isWindows: () => /Win/.test(os.getPlatform()),
        isLinux: () => /Linux/.test(os.getPlatform()) && !os.isAndroid(),
        isChromeOS: () => /\bCrOS\b/.test(os.getPlatform()),
        isFirefoxOS: () => /\bFxiOS\b/.test(os.getPlatform()),
        getAll: () => ({
          blackberry: os.isBlackBerry(),
          firefoxOs: os.isFirefoxOS(),
          windows: os.isWindows(),
          android: os.isAndroid(),
          chromeOs: os.isChromeOS(),
          linux: os.isLinux(),
          bada: os.isBada(),
          ios: os.isIos(),
          mac: os.isMac()
        })
      };

      return os;
    }

    function _getCookie(name) {
      var value = `; ${document.cookie}`;
      var parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    }

    return this;
  };
})(window, document);
