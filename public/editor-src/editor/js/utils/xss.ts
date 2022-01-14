import sanitizeHtml, { IOptions } from "sanitize-html";

type Escaping = IOptions["disallowedTagsMode"];

export const xss = (html: string, escaping: Escaping): string => {
  return sanitizeHtml(html, {
    disallowedTagsMode: escaping,
    allowedClasses: {
      "*": ["*"]
    },
    allowedAttributes: {
      a: ["href", "target", "rel", "style", "data-*"]
    }
  });
};
