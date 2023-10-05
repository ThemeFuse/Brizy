import { tags as t } from "@lezer/highlight";
import createTheme from "@uiw/codemirror-themes";

export const ideaTheme = createTheme({
  theme: "light",
  settings: {
    background: "var(--modal_email__template__code_mirror-bg, #ffffff)",
    foreground: "var(--modal_email__template__code_mirror-color, #000000)",
    caret: "var(--modal_email__template__code_mirror__cursor, #000000)",
    selection: "var(--toolbar__code_mirror__selected-bg, #0b69da)",
    selectionMatch: "var(--toolbar__code_mirror__selected-bg, #0b69da)",
    fontFamily:
      "Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif"
  },
  styles: [
    {
      tag: t.className,
      color: "var(--modal_email__template__code_mirror__def, #000000)"
    },

    {
      tag: t.number,
      color: "var(--modal_email__template__code_mirror__number, #0000ff)"
    },
    {
      tag: t.unit,
      color: "var(--modal_email__template__code_mirror__number, #0000ff)"
    },
    {
      tag: [t.atom, t.literal],
      color: "var(--modal_email__template__code_mirror__atom, #000080)",
      fontWeight: "bold"
    },
    {
      tag: t.invalid,
      color: "var(--modal_email__template__code_mirror__error, #ff0000)"
    },
    {
      tag: [t.attributeName, t.attributeValue],
      color: "var(--modal_email__template__code_mirror__attribute, #0000ff)"
    },
    {
      tag: t.meta,
      color: "var(--modal_email__template__code_mirror__meta, #808000)"
    },
    {
      tag: t.string,
      color: "var(--modal_email__template__code_mirror__string, #008000)"
    },
    {
      tag: t.tagName,
      color: "var(--modal_email__template__code_mirror__tag, #000080)"
    },
    {
      tag: t.bracket,
      color: "var(--modal_email__template__code_mirror__bracket, #997)"
    },
    {
      tag: t.keyword,
      color: "var(--modal_email__template__code_mirror__keyword, #000080)",
      lineHeight: "1em",
      fontWeight: "bold"
    },
    {
      tag: [t.definitionOperator, t.definitionKeyword],
      color: "var(--modal_email__template__code_mirror__def, #000000)"
    },
    {
      tag: [t.variableName],
      color: "var(--modal_email__template__code_mirror__variable, #000000)"
    },
    {
      tag: [t.typeName, t.typeOperator],
      color: "var(--modal_email__template__code_mirror__variable, #000000)"
    },
    {
      tag: t.propertyName,
      color: "var(--modal_email__template__code_mirror__property, #000000)"
    },
    {
      tag: t.operator,
      color: "var(--modal_email__template__code_mirror__operator, #000000)"
    },
    {
      tag: t.link,
      color: "var(--modal_email__template__code_mirror__link, #0000ff)"
    },
    {
      tag: [t.comment, t.lineComment, t.blockComment],
      color: "var(--modal_email__template__code_mirror__comment, #808080)"
    },
    // javascript default
    {
      tag: [t.modifier, t.controlKeyword, t.operatorKeyword, t.moduleKeyword],
      color: "#708"
    }
  ]
});
