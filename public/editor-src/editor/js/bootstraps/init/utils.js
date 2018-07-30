export function insertLoadingCurtain(parentNode) {
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

export function removeLoadingCurtain(parentNode) {
  parentNode.removeChild(parentNode.querySelector(".brz-ed-page-curtain"));
}

export function preload(parentNode, type, src) {
  return new Promise(function(resolve, reject) {
    var node = parentNode.ownerDocument.createElement("link");

    node.rel = "preload";
    node.href = src;
    node.onload = resolve;
    node.onerror = reject;

    switch (type) {
      case "js":
        node.as = "script";
        break;
      case "css":
        node.as = "style";
        break;
      default:
        throw new Error("can't preload unknown type " + type);
    }

    parentNode.appendChild(node);
  });
}

export function load(parentNode, type, src) {
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
