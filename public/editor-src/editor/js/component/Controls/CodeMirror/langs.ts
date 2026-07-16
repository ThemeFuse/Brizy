import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import type { LanguageSupport } from "@codemirror/language";

export type Language = "html" | "css" | "markdown" | "xml";

export const getLangExtension = (language: Language): LanguageSupport => {
  switch (language) {
    case "html":
      return html();
    case "css":
      return css();
    case "markdown":
      return markdown();
    case "xml":
      return xml();
  }
};
