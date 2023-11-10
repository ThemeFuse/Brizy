export function toolbarImageTags({ devices = "all", gallery, enableTags }) {
  const { inGallery = false } = gallery || {};

  return {
    label: "Tags",
    id: "tags",
    type: "inputText-dev",
    helper: {
      enabled: true,
      content:
        "Enter the tags, separated by a comma (art, sport, nature, etc).",
      position: "top-end"
    },
    placeholder: "art, nature, etc.",
    devices,
    disabled: !inGallery || !enableTags
  };
}
