import { t } from "visual/utils/i18n";

export function toolbarImageTags({ devices = "all", gallery, enableTags }) {
  const { inGallery = false } = gallery || {};

  return {
    label: t("Tags"),
    id: "tags",
    type: "inputText",
    helper: {
      enabled: true,
      content: t(
        "Enter the tags, separated by a comma (art, sport, nature, etc)."
      ),
      position: "top-end"
    },
    placeholder: t("art, nature, etc."),
    devices,
    disabled: !inGallery || !enableTags
  };
}
