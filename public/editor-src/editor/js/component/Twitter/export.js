import $ from "jquery";

function createElementTwitter() {
  var node = document.createElement("script");

  node.setAttribute("src", "https://platform.twitter.com/widgets.js");
  document.body.appendChild(node);
}

export default function() {
  var twitterLaunch =
    $(".twitter-timeline").length ||
    $(".twitter-follow-button").length ||
    $(".twitter-mention-button").length;

  if (twitterLaunch) {
    createElementTwitter();
  }
}
