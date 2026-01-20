export const read = (v) => {
  switch (typeof v) {
    case "string":
      return v;
    case "number":
      return isNaN(v) ? undefined : v.toString();
    default:
      return undefined;
  }
};

const makeDataAttr = (name, value) => {
  const attribute = { [`data-brz-${name}`]: value };

  if (value === "") return attribute;

  return read(value) ? attribute : {};
};

(function (window, document) {
  var loadingPromises = {};

  window.brzExternalPopup = function (url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      var hostDocument = document;
      var guestDocument;

      var isEditor = hostDocument.querySelector(".brz-ed");

      if (this.readyState == 4 && this.status == 200) {
        var parser = new DOMParser();
        guestDocument = parser.parseFromString(xhttp.responseText, "text/html");

        appendFonts({})
          .then(appendStylesheets)
          .then(appendStyles)
          .then(appendHTML)
          .then(appendScripts)
          .then(function (data) {
            if (data.html) {
              window.Brz.emit("init.dom", window.jQuery(data.html));
            }
          })
          .catch(function (r) {
            // eslint-disable-next-line no-console
            console.log("Error", r);
          });
      }

      function appendFonts(data) {
        var googleFonts = new Promise(function (res) {
          var hostGoogleFonts = hostDocument.querySelector(
            "link.brz-link-google"
          );
          var guestGoogleFonts = guestDocument.querySelector(
            "link.brz-link-google"
          );

          if (!hostGoogleFonts && guestGoogleFonts) {
            guestGoogleFonts.onload = res;
            hostDocument.head.appendChild(guestGoogleFonts);
          }

          if (hostGoogleFonts && guestGoogleFonts) {
            var guestGoogleFontsArr = _parseGoogleFonts(guestGoogleFonts.href);
            var hostGoogleFontsArr = _parseGoogleFonts(hostGoogleFonts.href);
            var diff = guestGoogleFontsArr.filter(function (font) {
              return !_includes(hostGoogleFontsArr, font);
            });

            if (diff.length) {
              hostGoogleFonts.href = setGoogleFontUrl(
                hostGoogleFontsArr.concat(diff),
                hostGoogleFonts.href
              );
            }
          }

          res();
        });

        var uploadFonts = new Promise(function (res) {
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

        return Promise.all([googleFonts, uploadFonts]).then(function () {
          return data;
        });
      }

      function appendStylesheets(data) {
        var hostLibCSS = hostDocument.querySelector(".brz-link-preview-lib");
        var hostLibProCSS = hostDocument.querySelector(
          ".brz-link-preview-lib-pro"
        );
        var hostPreviewCSS = hostDocument.querySelector(
          "link.brz-link-preview, link#brizy-preview-css"
        );
        var hostPreviewProCSS = hostDocument.querySelector(
          "link.brz-link-preview-pro, link#brizy-pro-preview-css"
        );

        var guestLibCSS = guestDocument.querySelector(".brz-link-preview-lib");
        var guestLibProCSS = guestDocument.querySelector(
          ".brz-link-preview-lib-pro"
        );
        var guestPreviewCSS = guestDocument.querySelector(
          "link.brz-link-preview"
        );
        var guestPreviewProCSS = guestDocument.querySelector(
          "link.brz-link-preview-pro"
        );

        var promises = [];

        if (!isEditor) {
          if (guestLibCSS) {
            var guestLibGroup = guestLibCSS.dataset.group || "";
            var hostLibGroup = (hostLibCSS && hostLibCSS.dataset.group) || "";

            if (
              !hostLibCSS ||
              (hostLibGroup !== "group-all" && guestLibGroup !== hostLibGroup)
            ) {
              loadingPromises["hostLibCSS"] = new Promise(function (res) {
                guestLibCSS.onload = res;
                hostDocument.head.appendChild(guestLibCSS);
              });
            } else {
              if (!loadingPromises["hostLibCSS"]) {
                loadingPromises["hostLibCSS"] = Promise.resolve();
              }
            }

            promises.push(loadingPromises["hostLibCSS"]);
          }

          if (guestLibProCSS) {
            var guestLibProGroup = guestLibProCSS.dataset.group || "";
            var hostLibProGroup =
              (hostLibProCSS && hostLibProCSS.dataset.group) || "";

            if (
              !hostLibProCSS ||
              (hostLibProGroup !== "group-all" &&
                guestLibProGroup !== hostLibProGroup)
            ) {
              loadingPromises["hostLibProCSS"] = new Promise(function (res) {
                guestLibProCSS.onload = res;
                hostDocument.head.appendChild(guestLibProCSS);
              });
            } else {
              if (!loadingPromises["hostLibProCSS"]) {
                loadingPromises["hostLibProCSS"] = Promise.resolve();
              }
            }

            promises.push(loadingPromises["hostLibProCSS"]);
          }

          if (guestPreviewCSS) {
            if (!hostPreviewCSS && !hostPreviewProCSS) {
              loadingPromises["hostPreviewCSS"] = new Promise(function (res) {
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
              loadingPromises["hostPreviewProCSS"] = new Promise(function (
                res
              ) {
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

          return Promise.all(promises).then(function () {
            return data;
          });
        }

        return Promise.resolve(data);
      }

      function appendStyles(data) {
        return new Promise(function (res) {
          var styles = guestDocument.querySelectorAll("style.brz-style");

          styles.forEach(function (style) {
            document.head.appendChild(style);
          });

          res(data);
        });
      }

      function appendHTML(data) {
        return new Promise(function (res) {
          var popup = guestDocument.body.querySelector(".brz-conditions-popup");
          var div;

          if (popup) {
            div = hostDocument.createElement("div");
            div.classList.add("brz", "brz-external-popup-elem");
            div.appendChild(popup);

            var embeds = div.querySelectorAll(".brz-embed-code script");

            for (var i = 0; i < embeds.length; i++) {
              overrideScripts(hostDocument, embeds[i]);
            }
            hostDocument.body.appendChild(div);
          }

          res(Object.assign(data, { html: div }));
        });
      }

      function appendScripts(data) {
        var hostLibJS = hostDocument.querySelector(".brz-script-preview-lib");
        var hostLibProJS = hostDocument.querySelector(
          ".brz-script-preview-lib-pro"
        );
        var hostJS = hostDocument.querySelector(
          "script.brz-script-preview, script#brizy-preview-js"
        );
        var hostProJS = hostDocument.querySelector(
          "script.brz-script-preview-pro, script#brizy-pro-preview-js"
        );

        var guestLibJS = guestDocument.querySelector(".brz-script-preview-lib");
        var guestLibProJS = guestDocument.querySelector(
          ".brz-script-preview-lib-pro"
        );
        var guestJS = guestDocument.querySelector("script.brz-script-preview");
        var guestProJS = guestDocument.querySelector(
          "script.brz-script-preview-pro"
        );

        var promises = [];

        if (guestLibJS) {
          var guestLibGroup = guestLibJS.dataset.group || "";
          var hostLibGroup = (hostLibJS && hostLibJS.dataset.group) || "";

          if (
            !hostLibJS ||
            (hostLibGroup !== "group-all" && hostLibGroup !== guestLibGroup)
          ) {
            loadingPromises["hostLibJS"] = new Promise(function (res) {
              _appendScript(hostDocument, {
                className: guestLibJS.className,
                src: guestLibJS.src,
                ...makeDataAttr("group", guestLibGroup),
                onload: res,
                async: false
              });
            });
          } else {
            if (!loadingPromises["hostLibJS"]) {
              loadingPromises["hostLibJS"] = Promise.resolve();
            }
          }

          promises.push(loadingPromises["hostLibJS"]);
        }

        if (guestLibProJS) {
          var guestLibProGroup = guestLibProJS.dataset.group || "";
          var hostLibProGroup =
            (hostLibProJS && hostLibProJS.dataset.group) || "";

          if (
            !hostLibProJS ||
            (hostLibProGroup !== "group-all" &&
              guestLibProGroup !== hostLibProGroup)
          ) {
            loadingPromises["hostLibProJS"] = new Promise(function (res) {
              _appendScript(hostDocument, {
                className: guestLibProJS.className,
                src: guestLibProJS.src,
                onload: res,
                async: false
              });
            });
          } else {
            if (!loadingPromises["hostLibProJS"]) {
              loadingPromises["hostLibProJS"] = Promise.resolve();
            }
          }

          promises.push(loadingPromises["hostLibProJS"]);
        }

        if (guestJS) {
          if (!hostJS && !hostProJS) {
            loadingPromises["hostJS"] = new Promise(function (res) {
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
            loadingPromises["hostProJS"] = new Promise(function (res) {
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

        return Promise.all(promises).then(function () {
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

    Object.keys(attributes).forEach(function (attr) {
      script[attr] = attributes[attr];
    });

    doc.body.appendChild(script);
  }

  function overrideScripts(doc, script) {
    var docScript = doc.createElement("script");
    var attributes = script.attributes;

    docScript.innerHTML = script.innerHTML;

    for (var i = 0; i < attributes.length; i++) {
      var attrs = attributes[i];
      docScript.setAttribute(attrs.name, attrs.value);
    }

    script.replaceWith(docScript);
  }
})(window, document);
