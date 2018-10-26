import { t } from "visual/utils/i18n";

const translationsMap = {
  RichText: t("Text"),
  Image: t("Image"),
  Video: t("Video"),
  Spacer: t("Spacer"),
  Line: t("Line"),
  Map: t("Map"),
  EmbedCode: t("Embed"),
  Form: t("Form"),
  IconText: t("Icon Box"),
  SoundCloud: t("SndCloud"),
  Counter: t("Counter"),
  Countdown: t("Countdown"),
  Tabs: t("Tabs"),
  ProgressBar: t("Progress"),
  Accordion: t("Accordion"),
  ImageGallery: t("Gallery"),
  Carousel: t("Carousel"),
  Row: t("Row"),
  Column: t("Column"),
  WPSidebar: t("Sidebar"),
  WPCustomShortcode: t("Shortcode"),
  WPNavigation: t("Menu"),
  Posts: t("Posts"),
  Archives: t("Archives")
};

export default {
  getItems
};

function getItems(v, component) {
  return [
    {
      id: "main",
      type: "group",
      title: translationsMap[v.items[0].type], // TODO: See if we'll need icons & prop
      icon: "",
      items: []
    }
  ];
}
