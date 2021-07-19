(function(window, document) {
  var loadingPromises = {};

  window.brzExternalPopup = function(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      var hostDocument = document;
      var guestDocument;

      if (this.readyState == 4 && this.status == 200) {
        var parser = new DOMParser();
        guestDocument = parser.parseFromString(xhttp.responseText, "text/html");

        appendFonts({})
          .then(appendStylesheets)
          .then(appendStyles)
          .then(appendHTML)
          .then(appendScripts)
          .then(function(data) {
            if (data.html) {
              window.Brizy.emit("init.dom", window.jQuery(data.html));
            }
          })
          .catch(function(r) {
            console.log("Error", r);
          });
      }

      function appendFonts(data) {
        var googleFontsOptimizations = new Promise(function(res) {
          var hostGoogleOptimization = hostDocument.querySelectorAll(
            "link.brz-link-google-preconnect, link.brz-link-google-prefetch"
          );
          var guestGoogleOptimization = hostDocument.querySelectorAll(
            "link.brz-link-google-preconnect, link.brz-link-google-prefetch"
          );

          if (
            hostGoogleOptimization.length === 0 &&
            guestGoogleOptimization.length
          ) {
            guestGoogleOptimization.onload = res;
            hostDocument.head.appendChild(guestGoogleOptimization);
          } else {
            res();
          }
        });

        var brizyCDN = new Promise(function(res) {
          var hostCDN = hostDocument.querySelector(
            "link.brz-link-cdn-preconnect"
          );
          var guestCDN = guestDocument.querySelector(
            "link.brz-link-cdn-preconnect"
          );

          if (!hostCDN && guestCDN) {
            guestCDN.onload = res;
            hostDocument.head.appendChild(guestCDN);
          } else {
            res();
          }
        });

        var googleFonts = new Promise(function(res) {
          var hostGoogleFonts = hostDocument.querySelector(
            "link.brz-link-google"
          );
          var guestGoogleFonts = guestDocument.querySelector(
            "link.brz-link-google"
          );

          if (!hostGoogleFonts && guestGoogleFonts) {
            guestGoogleFonts.onload = res;
            hostDocument.head.appendChild(guestGoogleFonts);
            return;
          }

          var guestGoogleFontsArr = _parseGoogleFonts(guestGoogleFonts.href);
          var hostGoogleFontsArr = _parseGoogleFonts(hostGoogleFonts.href);
          var diff = guestGoogleFontsArr.filter(function(font) {
            return !_includes(hostGoogleFontsArr, font);
          });

          if (diff.length) {
            hostGoogleFonts.href = setGoogleFontUrl(
              hostGoogleFontsArr.concat(diff),
              hostGoogleFonts.href
            );
          }

          res();
        });

        var uploadFonts = new Promise(function(res) {
          var guestUploadFonts = guestDocument.querySelector(
            "link.brz-link-upload"
          );

          if (guestUploadFonts) {
            guestUploadFonts.onload = res;
            hostDocument.head.appendChild(guestUploadFonts);
          } else {
            res();
          }
        });

        return Promise.all([
          googleFontsOptimizations,
          brizyCDN,
          googleFonts,
          uploadFonts
        ]).then(function() {
          return data;
        });
      }

      function appendStylesheets(data) {
        var hostPreviewCSS = hostDocument.querySelector(
          "link.brz-link-preview, link#brizy-preview-css"
        );
        var hostPreviewProCSS = hostDocument.querySelector(
          "link.brz-link-preview-pro, link#brizy-pro-preview-css"
        );

        var guestPreviewCSS = guestDocument.querySelector(
          "link.brz-link-preview"
        );
        var guestPreviewProCSS = guestDocument.querySelector(
          "link.brz-link-preview-pro"
        );

        var promises = [];

        if (guestPreviewCSS) {
          if (!hostPreviewCSS) {
            loadingPromises["hostPreviewCSS"] = new Promise(function(res) {
              guestPreviewCSS.onload = res;
              hostDocument.head.appendChild(guestPreviewCSS);
            });
          } else {
            if (!loadingPromises["hostPreviewCSS"]) {
              loadingPromises["hostPreviewCSS"] = Promise.resolve();
            }
          }

          promises.push(loadingPromises["hostPreviewCSS"]);
        }

        if (guestPreviewProCSS) {
          if (!hostPreviewProCSS) {
            loadingPromises["hostPreviewProCSS"] = new Promise(function(res) {
              guestPreviewProCSS.onload = res;
              hostDocument.head.appendChild(guestPreviewProCSS);
            });
          } else {
            if (!loadingPromises["hostPreviewProCSS"]) {
              loadingPromises["hostPreviewProCSS"] = Promise.resolve();
            }
          }

          promises.push(loadingPromises["hostPreviewProCSS"]);
        }

        return Promise.all(promises).then(function() {
          return data;
        });
      }

      function appendStyles(data) {
        return new Promise(function(res) {
          var styles = guestDocument.querySelectorAll("style.brz-style");

          styles.forEach(function(style) {
            document.head.appendChild(style);
          });

          res(data);
        });
      }

      function appendHTML(data) {
        return new Promise(function(res) {
          var popup = guestDocument.body.querySelector(".brz-conditions-popup");
          var div;

          if (popup) {
            div = hostDocument.createElement("div");
            div.classList.add("brz", "brz-external-popup-elem");
            div.appendChild(popup);
            hostDocument.body.appendChild(div);
          }

          res(Object.assign(data, { html: div }));
        });
      }

      function appendScripts(data) {
        var hostPolyfillJS = hostDocument.querySelector(
          "script.brz-script-polyfill, script#brizy-preview-polyfill-js"
        );
        var guestPolyfillJS = guestDocument.querySelector(
          "script.brz-script-polyfill"
        );
        var hostJS = hostDocument.querySelector(
          "script.brz-script-preview, script#brizy-preview-js"
        );
        var guestJS = guestDocument.querySelector("script.brz-script-preview");
        var hostProJS = hostDocument.querySelector(
          "script.brz-script-preview-pro, script#brizy-pro-preview-js"
        );
        var guestProJS = guestDocument.querySelector(
          "script.brz-script-preview-pro"
        );

        var promises = [];

        if (guestPolyfillJS) {
          if (!hostPolyfillJS) {
            loadingPromises["hostPolyfillJS"] = new Promise(function(res) {
              _appendScript(hostDocument, {
                className: guestPolyfillJS.className,
                src: guestPolyfillJS.src,
                onload: res,
                async: false
              });
            });
          } else {
            if (!loadingPromises["hostPolyfillJS"]) {
              loadingPromises["hostPolyfillJS"] = Promise.resolve();
            }
          }

          promises.push(loadingPromises["hostPolyfillJS"]);
        }

        if (guestJS) {
          if (!hostJS) {
            loadingPromises["hostJS"] = new Promise(function(res) {
              _appendScript(hostDocument, {
                className: guestJS.className,
                src: guestJS.src,
                onload: res,
                async: false
              });
            });
          } else {
            if (!loadingPromises["hostJS"]) {
              loadingPromises["hostJS"] = Promise.resolve();
            }
          }

          promises.push(loadingPromises["hostJS"]);
        }

        if (guestProJS) {
          if (!hostProJS) {
            loadingPromises["hostProJS"] = new Promise(function(res) {
              _appendScript(hostDocument, {
                className: guestProJS.className,
                src: guestProJS.src,
                onload: res,
                async: false
              });
            });
          } else {
            if (!loadingPromises["hostProJS"]) {
              loadingPromises["hostProJS"] = Promise.resolve();
            }
          }

          promises.push(loadingPromises["hostProJS"]);
        }

        return Promise.all(promises).then(function() {
          return data;
        });
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
    var params = parsedUrl.search.replace("?family=", "").replace(/&.+$/g, "");

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

  function _appendScript(doc, attributes) {
    var script = doc.createElement("script");

    Object.keys(attributes).forEach(function(attr) {
      script[attr] = attributes[attr];
    });

    doc.body.appendChild(script);
  }
})(window, document);
