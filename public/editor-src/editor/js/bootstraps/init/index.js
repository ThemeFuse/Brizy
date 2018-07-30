/*
 * WARNING:
 * using es5 because current version of gulp-uglify
 * does not understand es2015+
 */

import {
  insertLoadingCurtain,
  removeLoadingCurtain,
  preload,
  load
} from "./utils";

var Brizy = {
  init: function(config) {
    // inside iframe check
    var loadedInsideIframe;
    try {
      loadedInsideIframe = window.self !== window.top;
    } catch (e) {
      return true;
    }
    if (!loadedInsideIframe) {
      throw new Error("Brizy init script must be loaded inside an iframe");
    }

    // iframe id check
    var brizyIframe = window.parent.document.querySelector(
      "iframe#brz-ed-iframe"
    );
    var brizyIframeExists = brizyIframe !== null;
    if (!brizyIframeExists) {
      throw new Error(
        'Brizy init script must be loaded inside an iframe with id="brz-ed-iframe"'
      );
    }

    // app div check
    var brizyDiv = document.querySelector("#brz-ed-root");
    var brizyDivCreated = brizyDiv !== null;
    if (!brizyDivCreated) {
      throw new Error(
        "Brizy root div (#brz-ed-root) must be created before init script is loaded"
      );
    }

    // nodes
    var innerHead = brizyDiv.ownerDocument.head;
    var innerBody = brizyDiv.ownerDocument.body;
    var outerHead = brizyIframe.ownerDocument.head;
    var outerBody = brizyIframe.ownerDocument.body;

    // add classes
    outerBody.classList.add("brz", "brz-ed");
    brizyIframe.classList.add("brz-ed-iframe--desktop");
    innerBody.classList.add("brz", "brz-ed", "brz-ed--desktop");

    // add / remove loading curtain
    insertLoadingCurtain(outerBody);
    brizyDiv.addEventListener("brz.render", function() {
      removeLoadingCurtain(outerBody);
    });

    // urls
    var assetsUrl = config.urls.assets;
    var editorCSSUrl = assetsUrl + "/editor/css/editor.css";
    var polyfillsUrl =
      "https://cdn.polyfill.io/v2/polyfill.js?features=IntersectionObserver,IntersectionObserverEntry";
    var jQueryUrl =
      "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js";
    var editorVendorJSUrl = assetsUrl + "/editor/js/editor.vendor.js";
    var editorJSUrl = assetsUrl + "/editor/js/editor.js";

    var jQueryTest = window.jQuery === undefined;

    // load
    // inside iframe
    load(innerHead, "css", editorCSSUrl);
    Promise.all([
      load(innerBody, "js", polyfillsUrl),
      jQueryTest ? load(innerBody, "js", jQueryUrl) : Promise.resolve()
    ])
      .then(function() {
        return load(innerBody, "js", editorVendorJSUrl);
      })
      .then(function() {
        window.__VISUAL_CONFIG__ = config;
        return load(innerBody, "js", editorJSUrl);
      });

    // outside iframe
    load(outerHead, "css", editorCSSUrl);
    load(outerBody, "js", polyfillsUrl);
  }
};

export default Brizy;
