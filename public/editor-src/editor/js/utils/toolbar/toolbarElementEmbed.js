import { t } from "visual/utils/i18n";

export function toolbarElementEmbedCode({ v }) {
  return {
    id: "code",
    type: "textarea",
    placeholder: t("Paste your code here..."),
    value: v.code
  };
}
