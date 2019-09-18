import Editor from "visual/global/Editor";
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
  SoundCloud: t("SoundCloud"),
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
  Archives: t("Archives"),
  Menu: t("Menu"),
  FacebookButton: t("Facebook Button"),
  FacebookComments: t("Facebook Comments"),
  FacebookEmbed: t("Facebook Embed"),
  FacebookPage: t("Facebook Page"),
  FacebookGroup: t("Facebook Group")
};

export default {
  getItems
};

function getItems(v, component) {
  const { base } = Editor.getShortcodes();
  const { icon = "" } =
    base.find(
      ({
        resolve: {
          value: {
            items: [{ type }]
          }
        }
      }) => type === v.items[0].type
    ) || {};

  return [
    {
      id: "main",
      type: "group",
      title: translationsMap[v.items[0].type], // TODO: See if we'll need icons & prop
      icon,
      items: []
    }
  ];
}
