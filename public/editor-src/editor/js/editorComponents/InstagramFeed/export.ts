import { ExportFunction } from "visual/types";

const initInstagram = (id: string): void => {
  if (document.getElementById(id)) {
    return;
  }

  const js = document.createElement("script");
  js.setAttribute("id", id);
  js.setAttribute("async", "true");
  js.setAttribute("src", "https://www.instagram.com/embed.js");
  document.body.appendChild(js);
};

const fn: ExportFunction = ($node) => {
  const node = $node.get(0);
  if (!node) return;

  const instagramEmbeds = node.querySelector(".brz-instagram-feed");

  if (instagramEmbeds) {
    initInstagram("instagram-media");
  }
};

export default fn;
