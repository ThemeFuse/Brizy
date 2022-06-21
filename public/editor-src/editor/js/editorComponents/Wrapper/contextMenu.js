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
  Timeline: t("Timeline"),
  Switcher: t("Switcher"),
  Table: t("Table"),
  ProgressBar: t("Progress"),
  Accordion: t("Accordion"),
  ImageGallery: t("Gallery"),
  Carousel: t("Carousel"),
  Row: t("Row"),
  Column: t("Column"),
  Posts: v =>
    v.type === "posts"
      ? t("Posts")
      : v.type === "upsell"
      ? t("Upsell")
      : v.type === "relatedProducts"
      ? t("Related Products")
      : v.type === "categories"
      ? t("Categories")
      : t("Products"),
  Archives: t("Archives"),
  Menu: t("Menu"),
  FacebookButton: t("Facebook Button"),
  FacebookComments: v => (v.review === "true" ? t("Review") : t("Comments")),
  FacebookEmbed: t("Facebook Embed"),
  FacebookPage: t("Facebook Page"),
  FacebookGroup: t("Facebook Group"),
  WPBreadcrumbs: v =>
    v.type === "woo" ? t("Product Breadcrumbs") : t("Breadcrumbs"),
  Audio: t("Audio"),
  Twitter: t("Twitter"),
  Facebook: t("Facebook"),
  Search: t("Search"),
  Login: t("Login"),
  Lottie: t("Lottie"),
  Filters: t("Filters"),
  StarRating: t("Rating"),
  ProtectedPage: t("Protected Form"),
  Translation: t("Translation"),

  // WP
  WPSidebar: t("Sidebar"),
  WPCustomShortcode: t("Shortcode"),
  WPPostNavigation: t("Post Navigation"),
  WPPostsTitle: v => (v?.type === "woo" ? t("Product Title") : t("Post Title")),
  WPPostContent: v =>
    v?.type === "woo" ? t("Product Content") : t("Post Content"),
  WPPostExcerpt: t("Post Excerpt"),
  WPNavigation: t("Menu"),
  WPPostInfo: t("Post Info"),
  WPComments: t("Comments"),
  WOOExcerpt: t("Product Excerpt"),
  WOOProductMeta: t("Product Meta"),
  WOORating: t("Product Rating"),
  WOOCart: t("Shop Cart"),
  WOOAddToCart: t("Add To Cart"),
  WOOPrice: t("Product Price"),
  WOOStock: t("Product Stock"),
  WOOSku: t("Product Sku"),
  WOOGallery: t("Product Gallery"),
  WOOAttributes: t("Product Attributes"),
  WOOCategories: t("Shop Categories"),
  WOOProducts: t("Shop Products"),
  WOOPages: t("Shop Pages"),
  EcwidMyAccount: t("Ecwid My Account"),
  EcwidCart: t("Ecwid Cart"),

  // Shopify
  Quantity: t("Quantity")
};

export default {
  getItems
};

function getItems(v) {
  const shortcodes = Editor.getShortcodes();
  const { items } = v;
  const { icon = "" } =
    Object.values(shortcodes)
      .flat()
      .find(
        item => item.component.resolve.value.items?.type === items[0]?.type
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
