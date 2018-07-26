var Brizy = (function () {
'use strict';

function insertLoadingCurtain(parentNode) {
  var parentNodeDocument = parentNode.ownerDocument;

  // append css
  var parentNodeHead = parentNodeDocument.head;
  var style = parentNodeDocument.createElement("style");
  style.id = "brz-ed-loading-curtain";
  style.innerText =
    "@keyframes spin{100%{transform:rotate(360deg)}}.brz-ed-page-curtain{position:fixed;left:0;right:0;top:0;bottom:0;background-color:#141923;z-index:1000}.brz-ed-page-spinner,.brz-ed-page-spinner:after,.brz-ed-page-spinner:before{content:'';position:absolute;top:50%;left:50%;border:3px solid transparent;border-radius:50%;animation:spin 1s linear infinite}.brz-ed-page-spinner{width:100px;height:100px;margin:-50px 0 0 -50px;border-top-color:#22b0da;animation-duration:2.5s}.brz-ed-page-spinner:after{width:80px;height:80px;margin:-40px 0 0 -40px;border-right-color:#ed2164;animation-duration:2s}.brz-ed-page-spinner:before{width:60px;height:60px;margin:-30px 0 0 -30px;border-bottom-color:#fff}";
  parentNodeHead.appendChild(style);

  // append divs
  var curtain = parentNodeDocument.createElement("div");
  var spinner = parentNodeDocument.createElement("div");
  curtain.className = "brz-ed-page-curtain";
  spinner.className = "brz-ed-page-spinner";
  curtain.appendChild(spinner);
  parentNode.appendChild(curtain);
}

function removeLoadingCurtain(parentNode) {
  parentNode.removeChild(parentNode.querySelector(".brz-ed-page-curtain"));
}



function load(parentNode, type, src) {
  return new Promise(function(resolve, reject) {
    var node;

    switch (type) {
      case "js":
        node = parentNode.ownerDocument.createElement("script");
        node.type = "text/javascript";
        node.src = src;
        break;
      case "css":
        node = parentNode.ownerDocument.createElement("link");
        node.rel = "stylesheet";
        node.type = "text/css";
        node.href = src;
        break;
      default:
        throw new Error("can't load unknown type " + type);
    }

    node.onload = resolve;
    node.onerror = reject;

    parentNode.appendChild(node);
  });
}

/*
 * WARNING:
 * using es5 because current version of gulp-uglify
 * does not understand es2015+
 */

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

return Brizy;

}());
