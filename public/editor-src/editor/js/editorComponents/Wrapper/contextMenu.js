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
  Posts: (v) =>
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
  FacebookComments: (v) => (v.review === "true" ? t("Review") : t("Comments")),
  FacebookEmbed: t("Facebook Embed"),
  FacebookPage: t("Facebook Page"),
  FacebookGroup: t("Facebook Group"),
  WPBreadcrumbs: (v) =>
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
  ResetPassword: t("Reset Password"),
  Translation: t("Translation"),
  Calendly: t("Calendly"),

  Alert: t("Alert"),
  TableOfContents: t("Table of Contents"),
  Flipbox: t("Flipbox"),
  PostInfo: t("Post Info"),
  PostNavigation: t("Post Navigation"),
  Breadcrumbs: t("Breadcrumbs"),
  ShareButton: t("Share Button"),
  Paypal: t("Paypal"),
  InstagramFeed: t("Instagram Feed"),

  // WP
  WPSidebar: t("Sidebar"),
  WPCustomShortcode: t("Shortcode"),
  WPPostNavigation: t("Post Navigation"),
  WPPostsTitle: (v) =>
    v?.type === "woo" ? t("Product Title") : t("Post Title"),
  WPPostContent: (v) =>
    v?.type === "woo" ? t("Product Content") : t("Post Content"),
  WPPostExcerpt: t("Post Excerpt"),
  WPNavigation: t("Menu"),
  WPPostInfo: t("Post Info"),
  WPComments: t("Comments"),
  WOOExcerpt: t("Product Excerpt"),
  WOOProductMeta: t("Product Meta"),
  WOORating: t("Product Rating"),
  WOOCart: t("Shop Cart"),
  WOOAddToCart: t("Add to cart"),
  WOOPrice: t("Product Price"),
  WOOStock: t("Product Stock"),
  WOOSku: t("Product SKU"),
  WOOGallery: t("Product Gallery"),
  WOOAttributes: t("Product Attributes"),
  WOOCategories: t("Shop Categories"),
  WOOProducts: t("Shop Products"),
  WOOPages: t("Shop Pages"),
  EcwidMyAccount: t("My Account"),
  EcwidCart: t("Cart & Checkout"),
  EcwidProduct: t("Product"),
  EcwidProducts: t("Products"),
  EcwidShoppingBag: t("Shopping Bag"),

  // Shopify
  AddToCart: t("Add To Cart"),
  Quantity: t("Quantity"),
  Price: t("Price"),
  KlavyioMarketing: t("Email Marketing by Klaviyo"),
  PreProduct: t("PreProduct"),
  TrustProductReview: t("Trust Product Review"),
  TrustProductRating: t("Trust Product Rating"),
  TrustSeals: t("Trust Product Seals"),
  ReviewVitals: t("Reviews by Vitals"),
  AliExpressReview: t("Widgets by AliExpress"),
  SealSubscription: t("Subscription by Seal"),
  OmegaTracking: t("Tracking by Omega"),
  AppstleSubscription: t("Subscription by Appstle"),
  BoldSubscription: t("Subscription by Bold"),
  ReviewOpinew: t("Review by Opinew"),
  UploadKit: t("Upload Fields by UploadKit"),
  BISStock: t("Back in Stock"),
  ZeptoPersonalizer: t("Personalizer by Zepto"),
  StampedReviews: t("Reviews by Stamped"),
  PaywhirlSubscription: t("Subscription by Paywhirl"),
  FastSimonUpsell: t("Upsell by FastSimon"),
  TipoBooking: t("Appointment Booking by Tipo"),
  ReviewJudgeMe: t("Review by Judge"),
  ReviewGrowave: t("Review by Growave"),
  YotPoReview: t("YotPo Product Review"),
  LimeSpot: t("Upsell by LimeSpot"),
  GrowaveWishlist: t("Wishlist by Growave"),
  BoldProduct: t("Product Options by Bold"),
  SnowBall: t("Marketing by Social SnowBall"),
  HeroWishList: t("Wishlist by Hero"),
  SpecialOffers: t("Special Offers"),
  TrustedBadge: t("Badges by Trusted"),
  OnVoard: t("Notifications by OnVoard"),
  WideBundle: t("WideBundle"),
  HextomBadges: t("Badges by Hextom"),
  ZoorixUpsell: t("Upsell by Zoorix"),
  VideoShopping: t("Video Shopping"),
  PushOwlNotifications: t("Notifications by PushOwl"),
  InfiniteOptions: t("Infinite Options by ShopPad"),
  HulkOptions: t("Product Options by Hulk"),
  KiwiChart: t("Kiwi Size Chart & Recommender"),
  OmnisendMarketing: t("Marketing by Omnisend"),
  MarselloMarketing: t("Marketing by Marsello"),
  PowrContactForm: t("Advanced Contact Form by POWR"),
  EmailMarketing: t("Email Marketing"),
  ParcelPanel: t("Parcel Panel Order Tracking"),
  ReferralCandy: t("Notifications by ReferralCandy"),
  LaiReviews: t("Reviews by Lai"),
  ProductOptions: t("Product Options"),
  RechargeSubscriptions: t("Subscriptions by Recharge"),
  FeraReviews: t("Reviews by Fera"),
  FrequentlyBought: t("Frequently Bought"),
  LooxReview: t("Review by Loox"),
  AreviewReviews: t("Reviews by Areview"),
  SwymWishList: t("WishList by Swym"),
  AutomizelyOrderTracking: t("Order Tracking by Automizely"),
  StampedBadge: t("Badges by Stamped"),
  OkendoReview: t("Review by Okendo"),
  AliReviews: t("Reviews by Ali"),
  SMSMarketing: t("SMS Marketing by Yotpo"),
  PickyStory: t("Widgets by PickyStory"),
  ReviewRivyo: t("Review by Rivyo"),
  UnlimitedBundles: t("Unlimited Bundles"),
  WiserUpsell: t("Upsell by Wiser"),
  BoldBundles: t("Bundles by Bold"),
  CrossSell: t("Cross Sell"),
  ProductMetafield: t("Metafield"),
  BlogPostMeta: t("Meta"),
  Vendor: t("Vendor"),
  Variant: t("Variant"),

  // Ministry Brands
  MinistryBrandsGroupLayout: t("Group Layout"),
  MinistryBrandsGroupSlider: t("Group Slider"),
  MinistryBrandsEventLayout: t("Event Layout"),
  MinistryBrandsEventCalendar: t("Event Calendar"),
  MinistryBrandsSermonLayout: t("Sermon Layout"),
  MinistryBrandsSermonList: t("Sermon List"),
  MinistryBrandsSermonFeatured: t("Sermon Featured"),
  MinistryBrandsSermonDetail: t("Sermon Detail"),
  MinistryBrandsGroupList: t("Group List"),
  MinistryBrandsGroupDetail: t("Group Detail"),
  MinistryBrandsEventFeatured: t("Event Featured"),
  MinistryBrandsGroupFeatured: t("Group Featured"),
  MinistryBrandsEventList: t("Event List"),
  MinistryBrandsEventDetail: t("Event Detail"),
  MinistryBrandsFormWidget: t("FMS Forms"),
  MinistryBrandsPrayerWidget: t("Prayer Widget"),
  MinistryBrandsArticleDetail: t("Article Detail"),
  MinistryBrandsArticleList: t("Article List"),
  MinistryBrandsStaffDetail: t("Staff Detail"),
  MinistryBrandsArticleFeatured: t("Article Featured"),

  // Leadific
  Leadific: t("Leadific")
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
        (item) => item.component.resolve.value.items?.type === items[0]?.type
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
