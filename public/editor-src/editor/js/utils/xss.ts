import sanitizeHtml, { IOptions } from "sanitize-html";

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
      li: ["style"]
    }
  });
};
