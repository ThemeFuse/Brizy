import { t } from "visual/utils/i18n";

export function toolbarCustomCSS({ v, position = 45 }) {
  return {
    id: "customCSS",
    type: "codeMirror",
    label: t("Custom CSS"),
    position,
    helper: true,
    display: "block",
    helperContent:
      '<p>You can use the following selectors to create targeted CSS.</p><p><span class="brz-ed-tooltip__overlay-code">element</span> {...} <br><span class="brz-ed-tooltip__overlay-code">element .child-element</span> {...}</p>',
    placeholder: "element { code goes here }",
    value: v.customCSS
  };
}
