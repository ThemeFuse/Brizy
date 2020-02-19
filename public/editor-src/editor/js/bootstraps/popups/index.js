(function(window, document) {
  window.brzExternalPopup = function(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xhttp.responseText, "text/html");
        var styles = doc.head.querySelectorAll("style.brz-style");
        var links = doc.head.querySelectorAll("link.brz-link");
        var scripts = doc.body.querySelectorAll("script.brz-script");
        var popup = doc.body.querySelector("div.brz-conditions-popup");

        // html is inserting before link were uploaded
        var previewLinkLoad = function() {
          appendStyles(styles);
          appendScripts(scripts);
          appendPopup(popup);
        };

        appendLinks(links, previewLinkLoad);
      }

      function appendStyles(styles) {
        for (var i = 0; i < styles.length; i++) {
          document.head.appendChild(styles[i]);
        }
      }

      function appendLinks(links) {
        var currentGoogleLink = document.querySelector("link.brz-link-google");
        var currentPreviewLink = document.querySelector(
          "link.brz-link-preview"
        );

        for (var i = 0; i < links.length; i++) {
          var link = links[i];
          var isPreviewLink = link.classList.contains("brz-link-preview");

          if (currentGoogleLink && link.classList.contains("brz-link-google")) {
            var newGoogleFonts = _parseGoogleFonts(link.href);
            var currentGoogleFonts = _parseGoogleFonts(currentGoogleLink.href);

            var diff = newGoogleFonts.filter(function(x) {
              return !_includes(currentGoogleFonts, x);
            });

            if (diff.length) {
              link.href = setGoogleFontUrl(diff, currentGoogleLink.href);
            }
          }

          if (isPreviewLink) {
            link.onload = function() {
              previewLinkLoad();
            };
          }

          if (currentPreviewLink && isPreviewLink) {
            previewLinkLoad();
            continue;
          }

          document.head.appendChild(link);
        }
      }

      function appendScripts(scripts) {
        var currentPreviewScript = document.querySelector(
          "script.brz-script-preview"
        );

        var currentPolyfillScript = document.querySelector(
          "script.brz-script-polyfill"
        );

        var script;
        for (var i = 0; i < scripts.length; i++) {
          var shouldAppendPreviewScript =
            currentPreviewScript &&
            scripts[i].classList.contains("brz-script-preview");
          var shouldAppendPolyfillScript =
            currentPolyfillScript &&
            scripts[i].classList.contains("brz-script-polyfill");

          if (shouldAppendPreviewScript || shouldAppendPolyfillScript) {
            break;
          }

          script = document.createElement("script");
          script.src = scripts[i].src;
          script.className = scripts[i].className;
          document.body.appendChild(script);
        }
      }

      function appendPopup(popup) {
        var div = document.createElement("div");
        div.classList.add("brz", "brz-external-popup-elem");
        div.appendChild(popup);
        document.body.appendChild(div);
      }
    };
    xhttp.open(
      "GET",
      url +
        "?source_url=" +
        encodeURIComponent(location.host + location.pathname),
      true
    );
    xhttp.send();
  };

  function _parseGoogleFonts(url) {
    var parsedUrl = new URL(url);
    var params = parsedUrl.search.replace("?family=", "");

    return params.split("|");
  }

  function setGoogleFontUrl(fonts, url) {
    var parsedUrl = new URL(url);
    parsedUrl.search = "family=" + fonts.join("|");

    return parsedUrl.href;
  }

  function _includes(arr, searchElement, fromIndex) {
    if (arr == null) {
      throw new TypeError("arr is null or not defined");
    }

    // 1. Let O be ? ToObject(arr value).
    var o = Object(arr);

    // 2. Let len be ? ToLength(? Get(O, "length")).
    var len = o.length >>> 0;

    // 3. If len is 0, return false.
    if (len === 0) {
      return false;
    }

    // 4. Let n be ? ToInteger(fromIndex).
    //    (If fromIndex is undefined, arr step produces the value 0.)
    var n = fromIndex | 0;

    // 5. If n ≥ 0, then
    //  a. Let k be n.
    // 6. Else n < 0,
    //  a. Let k be len + n.
    //  b. If k < 0, let k be 0.
    var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    function sameValueZero(x, y) {
      return (
        x === y ||
        (typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y))
      );
    }

    // 7. Repeat, while k < len
    while (k < len) {
      // a. Let elementK be the result of ? Get(O, ! ToString(k)).
      // b. If SameValueZero(searchElement, elementK) is true, return true.
      if (sameValueZero(o[k], searchElement)) {
        return true;
      }
      // c. Increase k by 1.
      k++;
    }

    // 8. Return false
    return false;
  }
})(window, document);
