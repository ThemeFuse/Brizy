function createElementFb(lang, appId) {
  var node = document.createElement("div");
  node.className = "fb-root";
  document.body.appendChild(node);

  var src =
    "https://connect.facebook.net/" +
    lang +
    "/sdk.js#xfbml=1&version=v3.1&appId=" +
    appId;

  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = src;
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
}

export default function($node) {
  var $facebook = $node.find(".brz-facebook");
  var $fbRoot = $node.find(".fb-root");

  if ($facebook.length && $fbRoot.length === 0) {
    var lang = $facebook.attr("lang");
    var appId = $facebook.attr("appid");

    createElementFb(lang, appId);
  }
}
