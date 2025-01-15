import { getFlatShortcodes } from "visual/shortcodeComponents/utils";
import { t } from "visual/utils/i18n";

const getTranslationsMap = () => ({
  RichText: t("Text"),
  Image: t("Image"),
  Video: t("Video"),
  VideoPlaylist: t("Playlist"),
  Spacer: t("Spacer"),
  Line: t("Line"),
  Map: t("Map"),
  EmbedCode: t("Embed"),
  Form: t("Form"),
  Form2: t("Form"),
  IconText: t("Icon Box"),
  SoundCloud: t("SoundCloud"),
  Counter: t("Counter"),
  Countdown: t("Countdown"),
  Countdown2: t("Countdown"),
  Tabs: t("Tabs"),
  TimeLine: t("Timeline"),
  BusinessHour: t("Business Hour"),
  Switcher: t("Switcher"),
  ProgressBar: t("Progress"),
  Accordion: t("Accordion"),
  ImageGallery: t("Gallery"),
  Carousel: t("Carousel"),
  Row: t("Row"),
  Column: t("Column"),
  WPSidebar: t("Sidebar"),
  WPCustomShortcode: t("Shortcode"),
  WPPostsTitle: t("Post Title"),
  WPNavigation: t("Menu"),
  WPPostExcerpt: t("Post Excerpt"),
  WPPostNavigation: t("Post Navigation"),
  Posts: t("Posts"),
  Archives: t("Archives"),
  Menu: t("Menu"),
  FacebookButton: t("Facebook Button"),
  FacebookComments: t("Comments"),
  FacebookEmbed: t("Facebook Embed"),
  FacebookPage: t("Facebook Page"),
  FacebookGroup: t("Facebook Group"),
  WPBreadcrumbs: t("Breadcrumbs"),
  WPPostInfo: t("Post Info"),
  WPPostContent: t("Post Content"),
  // WPPostInfo: t("Post info")
  Audio: t("Audio"),
  Twitter: t("Twitter"),
  Facebook: t("Facebook"),
  WPComments: t("Comments"),
  Search: t("Search"),
  WOOProductMeta: t("Product Meta"),
  WOORating: t("Product Rating"),
  WOOCart: t("WooCommerce Cart"),
  Login: t("Login"),
  Shape: t("Shape"),
  Icon: t("Icon"),
  Button: t("Button")
});

export default {
  getItems
};

function getItems(v, component) {
  const config = component.getGlobalConfig();
  const { essentials } = getFlatShortcodes(config);

  const { icon = "" } =
    essentials?.find(
      (item) => item.component.resolve.value.items?.type === v.items[0].type
    ) || {};
  const translations = getTranslationsMap();

  return [
    {
      id: "main",
      type: "group",
      title: translations[v.items[0].type], // TODO: See if we'll need icons & prop
      icon,
      items: []
    }
  ];
}
