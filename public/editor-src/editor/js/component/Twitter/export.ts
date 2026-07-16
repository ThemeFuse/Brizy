import { ExportFunction } from "visual/types";

const initTwitter = (doc: Document, id: string): Window["twttr"] => {
  const t: Window["twttr"] = (window.twttr || {}) as Window["twttr"];

  if (doc.getElementById(id)) {
    return t;
  }

  const js = doc.createElement("script");
  js.setAttribute("id", id);
  js.setAttribute("src", "https://platform.twitter.com/widgets.js");
  doc.body.appendChild(js);

  return t;
};

const fn: ExportFunction = ($node) => {
  const node = $node.get(0);
  if (!node) return;

  const twitterLaunch = [
    ...node.querySelectorAll<HTMLDivElement>(".brz-twitter")
  ];

  if (twitterLaunch.length > 0) {
    window.twttr = initTwitter(document, "twitter-wjs");
  }
};

export default fn;
