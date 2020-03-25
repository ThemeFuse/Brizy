function createElementTwitter() {
  const node = document.createElement("script");

  node.setAttribute("src", "https://platform.twitter.com/widgets.js");
  document.body.appendChild(node);
}

export default function($node) {
  const twitterLaunch = $node.find(
    ".twitter-timeline, .twitter-follow-button, .twitter-mention-button"
  ).length;

  if (twitterLaunch) {
    createElementTwitter();
  }
}
