import { tags as t } from "@lezer/highlight";
import createTheme from "@uiw/codemirror-themes";

export const defaultTheme = createTheme({
  theme: "dark",
  settings: {
    background: "var(--inputs-bg, #292b2e);",
    foreground: "var(--toolbar__code_mirror-color, #808080)",
    caret: "var(--toolbar__code_mirror__cursor-color, #808080)",
    selection: "var(--toolbar__code_mirror__selected-bg, #0b69da)",
    selectionMatch: "var(--toolbar__code_mirror__selected-bg, #0b69da)",
    fontFamily: "monospace"
  },
  styles: [
    {
      tag: t.heading,
      color: "var(--toolbar__code_mirror__header-color, #0000ff)",
      fontWeight: "bold"
    },
    { tag: t.quote, color: "var(--toolbar__code_mirror__quote-color, #090)" },
    {
      tag: [t.keyword],
      color: "var(--toolbar__code_mirror__keyword-color, #be85c8)"
    },
    {
      tag: [t.className],
      color: "var(--toolbar__code_mirror__qualifier-color, #76a671)"
    },
    {
      tag: t.number,
      color: "var(--toolbar__code_mirror__number-color, #78b9a1)"
    },
    {
      tag: t.unit,
      color: "var(--toolbar__code_mirror__number-color, #78b9a1)"
    },
    {
      tag: [t.atom, t.literal],
      color: "var(--toolbar__code_mirror__atom-color, #9195da)"
    },
    {
      tag: [t.typeName, t.typeOperator],
      color: "var(--toolbar__code_mirror__variable__3-color, #16aa74)"
    },
    {
      tag: t.invalid,
      color: "var(--toolbar__code_mirror__error-color, #f88b8b)"
    },
    {
      tag: [t.attributeName, t.attributeValue],
      color: "var(--toolbar__code_mirror__attribute-color, #55b0ff)"
    },
    { tag: t.meta, color: "var(--toolbar__code_mirror__meta-color, #555)" },
    {
      tag: t.string,
      color: "var(--toolbar__code_mirror__string-color, #fd7e7e)"
    },
    {
      tag: t.tagName,
      color: "var(--toolbar__code_mirror__tag-color, #76a671)"
    },
    {
      tag: t.bracket,
      color: "var(--toolbar__code_mirror__bracket-color, #997)"
    },
    {
      tag: [t.definitionOperator, t.definitionKeyword],
      color: "var(--toolbar__code_mirror__def-color, #8abeff)"
    },
    {
      tag: t.link,
      color: "var(--toolbar__code_mirror__link-color, #55b0ff)",
      textDecoration: "underline"
    },
    {
      tag: [t.comment, t.lineComment, t.blockComment],
      color: "var(--toolbar__code_mirror__comment-color, #ea9e53)"
    },
    {
      tag: [t.operator, t.operatorKeyword, t.punctuation, t.variableName],
      color: "var(--toolbar__code_mirror__variable, #a59b08)"
    },
    // javascript default
    {
      tag: [t.modifier, t.controlKeyword, t.moduleKeyword],
      color: "#c678dd"
    }
  ]
});
