import Editor from "visual/global/Editor";
import { t } from "visual/utils/i18n";

const translationsMap = {
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
  Switcher: t("Switcher"),
  Table: t("Table"),
  ProgressBar: t("Progress"),
  Accordion: t("Accordion"),
  ImageGallery: t("Gallery"),
  Carousel: t("Carousel"),
  Row: t("Row"),
  Column: t("Column"),
  WPSidebar: t("Sidebar"),
  WPCustomShortcode: t("Shortcode"),
  WPPostsTitle: v =>
    v?.type === "woo" ? t("Woo Product Title") : t("Post Title"),
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
  WOORating: t("WOORating"),
  WOOCart: t("WOOCart"),
  Login: t("Login"),
  Lottie: t("Lottie")
};

export default {
  getItems
};

function getItems(v) {
  const { base } = Editor.getShortcodes();
  const items = v.items;
  const { icon = "" } =
    base.find(
      ({
        resolve: {
          value: {
            items: [{ type }]
          }
        }
      }) => type === items[0]?.type
    ) || {};
  let title = translationsMap[items[0]?.type]; // TODO: See if we'll need icons & prop

  if (typeof title === "function") {
    title = title(items[0]?.value);
  }

  return [
    {
      id: "main",
      type: "group",
      title,
      icon,
      items: []
    }
  ];
}
