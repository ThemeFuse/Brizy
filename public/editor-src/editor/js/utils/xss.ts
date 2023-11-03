import sanitizeHtml, { IOptions } from "sanitize-html";
import Config from "visual/global/Config";

type Escaping = IOptions["disallowedTagsMode"];

const allowedTags = ["img"];

export const xss = (html: string, escaping: Escaping): string => {
  return sanitizeHtml(html, {
    disallowedTagsMode: escaping,
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(allowedTags),
    allowedClasses: {
      "*": ["*"]
    },

    allowedAttributes: {
      a: ["href", "target", "rel", "style", "data-*"],
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
      span: ["style"],
      strong: ["style"],
      em: ["style"],
      u: ["style"],
      s: ["style"],
      li: ["style"],
      th: ["rowspan", "colspan"]
    }
  });
};

export const discardXSS = (element: HTMLElement | string) => {
  const config = Config.getAll();
  const allowScripts = !config.user.allowScripts;

  if (typeof element === "string") {
    return allowScripts ? xss(element, "discard") : element;
  } else {
    return allowScripts
      ? xss(element.innerHTML, "discard")
      : element.textContent || "";
  }
};
