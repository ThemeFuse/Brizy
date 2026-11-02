import type { ExportFunction } from "visual/types";
import { makeAttr } from "visual/utils/i18n/attribute";

const initInstagram = (id: string): void => {
  if (document.getElementById(id)) {
    return;
  }

  const js = document.createElement("script");
  js.setAttribute("id", id);
  js.setAttribute("async", "true");
  js.setAttribute("src", "https://www.instagram.com/embed.js");
  js.setAttribute(makeAttr("consent"), "marketing");
  js.onload = () => {
    window.Brz.emit("instagram.ready");
  };
  document.body.appendChild(js);
};

const fn: ExportFunction = (node) => {
  const instagramEmbeds = node.querySelector(".brz-instagram-feed");

  if (instagramEmbeds) {
    initInstagram("instagram-media");
  }
};

export default fn;
