import { isWp } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Shortcode } from "visual/types";
import { getDaysLeft } from "visual/utils/ecwid";
import getAccordion from "./Accordion";
import getAlert from "./Alert";
import getArchive from "./Archive";
import getAssetsPosts from "./AssetsPosts";
import getAudio from "./Audio";
import getButton from "./Button";
import getChart from "./Chart";
import getColumns from "./Columns";
import getCountdown2 from "./Countdown2";
import getCounter from "./Counter";
import getEcwidAddToCart from "./Ecwid/AddToCart";
import getCart from "./Ecwid/Cart";
import getFavorites from "./Ecwid/Favorites";
import getMyAccount from "./Ecwid/MyAccount";
import getEcwidPrice from "./Ecwid/Price";
import getProduct from "./Ecwid/Product";
import getEcwidSearch from "./Ecwid/Search";
import getShoppingBag from "./Ecwid/ShoppingBag";
import getForm2 from "./Form2";
import getIcon from "./Icon";
import getIconText from "./IconText";
import getImage from "./Image";
import getLeadific from "./Leadific/Leadific";
import getLine from "./Line";
import getMap from "./Map";
import getMenuSimple from "./MenuSimple";
import getMinistryBrandsArticleDetail from "./MinistryBrands/MinistryBrandsArticleDetail";
import getMinistryBrandsArticleFeatured from "./MinistryBrands/MinistryBrandsArticleFeatured";
import getMinistryBrandsArticleList from "./MinistryBrands/MinistryBrandsArticleList";
import getMinistryBrandsEventCalendar from "./MinistryBrands/MinistryBrandsEventCalendar";
import getMinistryBrandsEventDetail from "./MinistryBrands/MinistryBrandsEventDetail";
import getMinistryBrandsEventFeatured from "./MinistryBrands/MinistryBrandsEventFeatured";
import getMinistryBrandsEventLayout from "./MinistryBrands/MinistryBrandsEventLayout";
import getMinistryBrandsEventList from "./MinistryBrands/MinistryBrandsEventList";
import getMinistryBrandsFormWidget from "./MinistryBrands/MinistryBrandsFormWidget";
import getMinistryBrandsGroupDetail from "./MinistryBrands/MinistryBrandsGroupDetail";
import getMinistryBrandsGroupFeatured from "./MinistryBrands/MinistryBrandsGroupFeatured";
import getMinistryBrandsGroupLayout from "./MinistryBrands/MinistryBrandsGroupLayout";
import getMinistryBrandsGroupList from "./MinistryBrands/MinistryBrandsGroupList";
import getMinistryBrandsGroupSlider from "./MinistryBrands/MinistryBrandsGroupSlider";
import getMinistryBrandsPrayerWidget from "./MinistryBrands/MinistryBrandsPrayerWidget";
import getMinistryBrandsSermonDetail from "./MinistryBrands/MinistryBrandsSermonDetail";
import getMinistryBrandsSermonFeatured from "./MinistryBrands/MinistryBrandsSermonFeatured";
import getMinistryBrandsSermonLayout from "./MinistryBrands/MinistryBrandsSermonLayout";
import getMinistryBrandsSermonList from "./MinistryBrands/MinistryBrandsSermonList";
import getMinistryBrandsStaffDetail from "./MinistryBrands/MinistryBrandsStaffDetail";
import getPaypal from "./Paypal";
import getPostExcerpt from "./PostExcerpt";
import getPostTitle from "./PostTitle";
import getPosts from "./Posts";
import getProgressBar from "./ProgressBar";
import getProtectedPage from "./ProtectedPage";
import getRow from "./Row";
import getShareButton from "./ShareButton";
import getShopCategories from "./ShopCategories";
import getShopPosts from "./ShopPosts";
import {
  getAddToCart,
  getBlogPostExcerpt,
  getBlogPostList,
  getBlogPostMeta,
  getCollectionList,
  getPrice,
  getProductDescription,
  getProductImage,
  getProductList,
  getProductMetafield,
  getProductTitle,
  getQuantity,
  getVariant,
  getVendor
} from "./Shopify";
import getSpacer from "./Spacer";
import getTabs from "./Tabs";
import getText from "./Text";
import getTranslation from "./Translation";
import getUserEmail from "./UserEmail";
import getUserFirstName from "./UserFirstName";
import getUserLastName from "./UserLastName";
import getUserPhoneNumber from "./UserPhoneNumber";
import getUserRoles from "./UserRoles";
import getUserUsername from "./UserUsername";
import getVideo from "./Video";
import getWOOCategories from "./WOOCategories";
import getWOOPages from "./WOOPages";
import getWPCustomShortcode from "./WPCustomShortcode";
import getFeaturedImage from "./WPFeaturedImage";
import getWPSidebar from "./WPSidebar";
import AnimatedHeadline from "./pro/AnimatedHeadline";
import getBreadcrumbs from "./pro/Breadcrumbs";
import getCalendly from "./pro/Calendly";
import getCarousel from "./pro/Carousel";
import getEmbed from "./pro/Embed";
import getFacebook from "./pro/Facebook";
import getFacebookComments from "./pro/FacebookComments";
import getFlipbox from "./pro/Flipbox";
import getImageGallery from "./pro/ImageGallery";
import getInstagramFeed from "./pro/InstagramFeed";
import getLinkedinFeed from "./pro/LinkedinFeed";
import getLogin from "./pro/Login";
import getLottie from "./pro/Lottie";
import getMenu from "./pro/Menu";
import getPostInfo from "./pro/PostInfo";
import getPostNavigation from "./pro/PostNavigation";
import getProducts from "./pro/Products";
import getResetPassword from "./pro/ResetPassword";
import getReview from "./pro/Review";
import getSearch from "./pro/Search";
import getStarRating from "./pro/StarRating";
import getSwitcher from "./pro/Switcher";
import getTable from "./pro/Table";
import getTableOfContents from "./pro/TableOfContents";
import getTimeline from "./pro/Timeline";
import getTwitter from "./pro/Twitter";
import getVideoPlaylist from "./pro/VideoPlaylist";
import getWOOAddToCart from "./pro/WOOAddToCart";
import getWOOArchives from "./pro/WOOArchives";
import getWOOAttributes from "./pro/WOOAttributes";
import getWOOBreadcrumbs from "./pro/WOOBreadcrumbs";
import getWOOCart from "./pro/WOOCart";
import getWOOExcerpt from "./pro/WOOExcerpt";
import getWOOGallery from "./pro/WOOGallery";
import getWOOPrice from "./pro/WOOPrice";
import getWOOProductContent from "./pro/WOOProductContent";
import getWOOProductMeta from "./pro/WOOProductMeta";
import getWOOProductTitle from "./pro/WOOProductTitle";
import getWOORating from "./pro/WOORating";
import getWOOSku from "./pro/WOOSku";
import getWOOStock from "./pro/WOOStock";
import getWOOUpsell from "./pro/WOOUpsell";
import getWPBreadcrumbs from "./pro/WPBreadcrumbs";
import getPostContent from "./pro/WPPostContent";
import getWPPostInfo from "./pro/WPPostInfo";
import getWPPostNavigation from "./pro/WPPostNavigation";
import getStoryLottie from "./pro/story/StoryLottie";
import getStoryStarRating from "./pro/story/StoryStarRating";
import getStoryButton from "./story/StoryButton";
import getStoryCountdown2 from "./story/StoryCountdown2";
import getStoryCounter from "./story/StoryCounter";
import getStoryEmbed from "./story/StoryEmbed";
import getStoryForm2 from "./story/StoryForm2";
import getStoryIcon from "./story/StoryIcon";
import getStoryImage from "./story/StoryImage";
import getStoryLeadific from "./story/StoryLeadific";
import getStoryLine from "./story/StoryLine";
import getStoryMap from "./story/StoryMap";
import getStoryProgressBar from "./story/StoryProgressBar";
import getStoryShape from "./story/StoryShape";
import getStoryText from "./story/StoryText";
import getStoryVideo from "./story/StoryVideo";

export function getProShortCodes(
  config: ConfigCommon
): Record<string, Shortcode["pro"]> {
  return {
    Text: false,
    Image: false,
    Button: false,
    Icon: false,
    Spacer: false,
    Map: false,
    Form2: true,
    Line: false,
    Menu: true,
    MenuSimple: false,
    Login: true,
    Translation: false,
    ShareButton: false,

    ImageGallery: true,
    Video: false,
    Audio: false,
    VideoPlaylist: true,
    Flipbox: true,
    Chart: true,

    IconText: false,
    Lottie: true,
    Embed: true,
    StarRating: true,
    Alert: false,
    Counter: false,
    Countdown2: false,
    ProgressBar: false,
    Calendly: true,
    TableOfContents: true,
    Carousel: true,
    AnimatedHeadline: true,
    Tabs: false,
    Accordion: false,
    Switcher: true,
    Table: true,
    Timeline: true,

    StoryButton: false,
    StoryIcon: false,
    StoryEmbed: true,
    StoryText: false,
    StoryMap: false,
    StoryProgressBar: false,
    StoryLine: false,
    StoryCountdown2: false,
    StoryCounter: false,
    StoryShape: false,
    StoryForm2: true,
    StoryStarRating: true,
    StoryLottie: true,

    StoryImage: false,
    StoryVideo: false,

    StoryLeadific: false,

    Facebook: true,
    Twitter: true,
    FacebookComments: true,
    InstagramFeed: true,
    LinkedinFeed: true,

    Columns: false,
    Row: false,

    ProtectedPage: false,
    ResetPassword: false,

    Posts: isWp(config),
    PostTitle: isWp(config),
    PostInfo: true,
    PostNavigation: true,
    AssetsPosts: false,
    Breadcrumbs: true,

    UserFirstName: false,
    UserLastName: false,
    UserEmail: false,
    UserPhoneNumber: false,
    UserRoles: false,
    UserUsername: false,

    Cart: (c) => getDaysLeft(c) <= 0,
    Product: (c) => getDaysLeft(c) <= 0,
    ShoppingBag: (c) => getDaysLeft(c) <= 0,
    MyAccount: (c) => getDaysLeft(c) <= 0,
    Favorites: (c) => getDaysLeft(c) <= 0,

    MinistryBrandsGroupLayout: false,
    MinistryBrandsGroupSlider: false,
    MinistryBrandsEventLayout: false,
    MinistryBrandsEventCalendar: false,
    MinistryBrandsSermonLayout: false,
    MinistryBrandsSermonList: false,
    MinistryBrandsSermonFeatured: false,
    MinistryBrandsSermonDetail: false,
    MinistryBrandsGroupList: false,
    MinistryBrandsGroupDetail: false,
    MinistryBrandsEventFeatured: false,
    MinistryBrandsGroupFeatured: false,
    MinistryBrandsEventList: false,
    MinistryBrandsEventDetail: false,
    MinistryBrandsFormWidget: false,
    MinistryBrandsPrayerWidget: false,
    MinistryBrandsArticleDetail: false,
    MinistryBrandsArticleList: false,
    MinistryBrandsStaffDetail: false,
    MinistryBrandsArticleFeatured: false,

    Paypal: false,

    Leadific: false,

    ShopPosts: false,
    ShopCategories: false,

    Search: true,

    WPSidebar: false,
    WPCustomShortcode: false,

    WOOCategories: false,
    WOOPages: false,
    Products: true,
    WOOCart: true,

    WPFeaturedImage: true,

    PostExcerpt: true,
    WPPostContent: true,
    WPPostInfo: true,
    WPBreadcrumbs: true,
    WPPostNavigation: true,

    WOOProductTitle: true,
    WOOExcerpt: true,
    WOOProductContent: true,
    WOOPrice: true,
    WOOGallery: true,
    WOOAddToCart: true,
    WOOStock: true,
    WOOSku: true,
    WOOProductMeta: true,
    WOORating: true,
    WOOAttributes: true,
    WOOUpsell: true,
    WOOBreadcrumbs: true,
    Review: true,

    WOOArchives: true,
    Archive: true
  };
}

export const ShortCodesKeywords: Record<string, string> = {
  Text: "text content paragraph copy",
  Image: "image picture photo graphic",
  Button: "button CTA action link",
  Icon: "icon symbol graphic logo",
  Spacer: "space gap distance",
  Map: "Map location address geography",
  Form2: "form input submission",
  Line: "divider separator boundary",
  Menu: "navigation list links",
  MenuSimple: "simple menu basic navigation list",
  Login: "Login sign in authentication access",
  Translation: "language translate multilingual",

  ImageGallery: "gallery slideshow collection",
  Video: "video media clip",
  Audio: "audio sound music",
  VideoPlaylist: "video playlist media list collection",

  IconText: "icon with text combined symbol graphic and text",
  Lottie: "Lottie animation animated graphic",
  Embed: "embed external content insert",
  StarRating: "star rating feedback review",
  Alert: "notification warning message",
  Counter: "counter number numeric display",
  Countdown: "countdown timer time remaining",
  ProgressBar: "progress bar loading completion",
  Calendly: "Calendly calendar scheduling",
  TableOfContents: "table of contents",
  Carousel: "carousel slider rotating display",
  Tabs: "tabs tabbed content sections",
  Accordion: "accordion expanding sections collapsible",
  Switcher: "switcher toggle on-off",
  Table: "table data spreadsheet",
  Timeline: "timeline chronology events",
  Chart: "chart pie graph diagram data visualization analytics statistics",

  StoryButton: "story button narrative action interactive",
  StoryIcon: "story icon narrative symbol graphic",
  StoryEmbed: "story embed narrative integration insert",
  StoryText: "story text narrative content copy",
  StoryMap: "story map narrative location geography",
  StoryProgressBar: "story progress bar narrative loading completion",
  StoryLine: "story line narrative divider boundary",
  StoryCountdown2: "story countdown narrative timer time remaining",
  StoryCounter: "story counter narrative number numeric display",
  StoryShape: "story shape narrative graphic visual element",
  StoryForm2: "story form narrative input submission",
  StoryStarRating: "story star rating narrative feedback review",
  StoryLottie: "story Lottie narrative animation animated graphic",

  StoryImage: "story image narrative picture visual element",
  StoryVideo: "story video narrative media clip",

  StoryLeadific: "story Leadific narrative Leadific engagement",

  Facebook: "Facebook social media networking",
  Twitter: "Twitter social media microblogging",
  FacebookComments: "Facebook comments social interaction feedback",
  InstagramFeed: "Instagram feed social media integration display posts",

  Columns: "columns layout grid",
  Row: "row horizontal alignment series",
  ProtectedPage: "protected page restricted access security",
  ResetPassword: "reset password authentication security",
  Posts: "posts articles blog",
  PostTitle: "post title article heading headline",
  PostInfo: "post information, details, metadata",
  PostNavigation: "post navigation, previous, next",
  AssetsPosts: "assets posts media posts blog assets",
  UserFirstName: "user first name personalization customization",
  UserLastName: "user last name personalization customization",
  UserEmail: "user email contact communication",
  UserPhoneNumber: "user phone number contact communication",
  UserRoles: "user roles permissions access",
  UserUsername: "user username identification login",
  Cart: "cart shopping cart basket",
  Product: "product item merchandise",
  ShoppingBag: "shopping bag purchase buying",
  MyAccount: "my account user profile personal information",
  Favorites: "favorites products buy",

  MinistryBrandsGroupLayout:
    "Ministry Brands Group Layout organization layout group structure",
  MinistryBrandsGroupSlider:
    "Ministry Brands Group Slider organization slider group rotating display",
  MinistryBrandsEventLayout:
    "Ministry Brands Event Layout event layout event structure",
  MinistryBrandsEventCalendar:
    "Ministry Brands Event Calendar event calendar scheduling",
  MinistryBrandsSermonLayout:
    "Ministry Brands Sermon Layout sermon layout message structure",
  MinistryBrandsSermonList:
    "Ministry Brands Sermon List sermon list message collection",
  MinistryBrandsSermonFeatured:
    "Ministry Brands Sermon Featured featured sermon highlighted message",
  MinistryBrandsSermonDetail:
    "Ministry Brands Sermon Detail sermon details message information",
  MinistryBrandsGroupList:
    "Ministry Brands Group List group list organization collection",
  MinistryBrandsGroupDetail:
    "Ministry Brands Group Detail group details organization information",
  MinistryBrandsEventFeatured:
    "Ministry Brands Event Featured featured event highlighted activity",
  MinistryBrandsGroupFeatured:
    "Ministry Brands Group Featured featured group highlighted organization",
  MinistryBrandsEventList:
    "Ministry Brands Event List event list activity collection",
  MinistryBrandsEventDetail:
    "Ministry Brands Event Detail event details activity information",
  MinistryBrandsFormWidget:
    "Ministry Brands Form Widget organization form group submission",
  MinistryBrandsPrayerWidget: "Ministry Brands Prayer prayer request",
  MinistryBrandsArticleDetail:
    "Ministry Brands Article Detail article details information",
  MinistryBrandsArticleList:
    "Ministry Brands Article List article list collection",
  MinistryBrandsStaffDetail: "Ministry Brands Staff Detail staff details",

  Leadific: "Leadific engagement",

  ShopPosts: "shop posts store articles retail blog",
  ShopCategories: "shop categories store classifications retail groups",

  Search: "search find lookup locate",

  WPSidebar: "WP Sidebar WordPress sidebar website sidebar side menu",
  WPCustomShortcode:
    "WP Custom Shortcode WordPress shortcode custom code embedded code",

  WOOCategories:
    "WOO Categories WooCommerce categories product classifications merchandise groups",
  WOOPages: "WOO Pages WooCommerce pages product pages merchandise information",
  Products: "products items merchandise",
  WOOCart: "WOO Cart WooCommerce cart shopping cart basket",

  WPFeaturedImage: "WPFeaturedImage",

  PostExcerpt: "post excerpt, summary, highlight",
  WPPostContent: "post content, body, text",
  WPPostInfo: "post information, details, metadata",
  Breadcrumbs: "breadcrumbs, navigation, path",
  WPBreadcrumbs: "breadcrumbs, navigation, path",
  WPPostNavigation: "post navigation, previous, next",
  WOOProductTitle: "product title, name, identifier",
  WOOExcerpt: "product excerpt, summary, highlight",
  WOOProductContent: "product content, description, details",
  WOOPrice: "product price, cost, value",
  WOOGallery: "product gallery, images, visuals",
  WOOAddToCart: "add to cart, purchase, buy",
  WOOStock: "product stock, availability, inventory",
  WOOSku: "product SKU, stock keeping unit, identifier",
  WOOProductMeta: "product meta data, additional information, details",
  WOORating: "product rating, reviews, feedback",
  WOOAttributes: "product attributes, variations, options",
  WOOUpsell: "upsell, related products, recommendations",
  WOOBreadcrumbs: "product breadcrumbs, navigation, path",
  Review: "product review, feedback, opinion",

  WOOArchives: "product archives, list, collection",
  Archive: "archive, collection, list"
};

export function getSampleShortCodes(config: ConfigCommon) {
  return {
    Text: getText(config),
    Image: getImage(config),
    Button: getButton(config),
    Icon: getIcon(config),
    Spacer: getSpacer(),
    Map: getMap(),
    Form2: getForm2(),
    Line: getLine(),
    Menu: getMenu(),
    MenuSimple: getMenuSimple(),
    Login: getLogin(),
    Translation: getTranslation(),
    Posts: getPosts(config),
    ShareButton: getShareButton(),

    ImageGallery: getImageGallery(),
    Video: getVideo(),
    Audio: getAudio(),
    VideoPlaylist: getVideoPlaylist(),
    Paypal: getPaypal(),
    AnimatedHeadline,

    IconText: getIconText(),
    Lottie: getLottie(config),
    Embed: getEmbed(),
    StarRating: getStarRating(),
    Alert: getAlert(),
    Counter: getCounter(),
    Countdown2: getCountdown2(),
    ProgressBar: getProgressBar(),
    Calendly: getCalendly(),
    TableOfContents: getTableOfContents(),
    Carousel: getCarousel(),
    Tabs: getTabs(),
    Accordion: getAccordion(),
    Switcher: getSwitcher(),
    Table: getTable(),
    Timeline: getTimeline(),
    Flipbox: getFlipbox(),
    Chart: getChart(),

    StoryButton: getStoryButton(),
    StoryIcon: getStoryIcon(),
    StoryEmbed: getStoryEmbed(),
    StoryText: getStoryText(),
    StoryMap: getStoryMap(),
    StoryProgressBar: getStoryProgressBar(),
    StoryLine: getStoryLine(),
    StoryCountdown2: getStoryCountdown2(),
    StoryCounter: getStoryCounter(),
    StoryShape: getStoryShape(),
    StoryForm2: getStoryForm2(),
    StoryStarRating: getStoryStarRating(),
    StoryLottie: getStoryLottie(),

    StoryImage: getStoryImage(),
    StoryVideo: getStoryVideo(),

    StoryLeadific: getStoryLeadific(),

    Facebook: getFacebook(),
    Twitter: getTwitter(),
    FacebookComments: getFacebookComments(),
    InstagramFeed: getInstagramFeed(),
    LinkedinFeed: getLinkedinFeed(),

    Columns: getColumns(config),
    Row: getRow(config),

    AssetsPosts: getAssetsPosts(config),

    ProtectedPage: getProtectedPage(),
    ResetPassword: getResetPassword(),

    UserFirstName: getUserFirstName(),
    UserLastName: getUserLastName(),
    UserEmail: getUserEmail(),
    UserPhoneNumber: getUserPhoneNumber(),
    UserRoles: getUserRoles(),
    UserUsername: getUserUsername(),

    Cart: getCart(),
    ShoppingBag: getShoppingBag(),
    MyAccount: getMyAccount(),
    Favorites: getFavorites(),
    EcwidAddToCart: getEcwidAddToCart(),
    ShopPosts: getShopPosts(config),
    ShopCategories: getShopCategories(config),

    MinistryBrandsGroupLayout: getMinistryBrandsGroupLayout(),
    MinistryBrandsGroupSlider: getMinistryBrandsGroupSlider(),
    MinistryBrandsEventLayout: getMinistryBrandsEventLayout(),
    MinistryBrandsEventCalendar: getMinistryBrandsEventCalendar(),
    MinistryBrandsSermonLayout: getMinistryBrandsSermonLayout(),
    MinistryBrandsSermonList: getMinistryBrandsSermonList(),
    MinistryBrandsSermonFeatured: getMinistryBrandsSermonFeatured(),
    MinistryBrandsSermonDetail: getMinistryBrandsSermonDetail(),
    MinistryBrandsGroupList: getMinistryBrandsGroupList(),
    MinistryBrandsGroupDetail: getMinistryBrandsGroupDetail(),
    MinistryBrandsEventFeatured: getMinistryBrandsEventFeatured(),
    MinistryBrandsGroupFeatured: getMinistryBrandsGroupFeatured(),
    MinistryBrandsEventList: getMinistryBrandsEventList(),
    MinistryBrandsEventDetail: getMinistryBrandsEventDetail(),
    MinistryBrandsFormWidget: getMinistryBrandsFormWidget(),
    MinistryBrandsPrayerWidget: getMinistryBrandsPrayerWidget(),
    MinistryBrandsArticleDetail: getMinistryBrandsArticleDetail(),
    MinistryBrandsArticleList: getMinistryBrandsArticleList(),
    MinistryBrandsStaffDetail: getMinistryBrandsStaffDetail(),
    MinistryBrandsArticleFeatured: getMinistryBrandsArticleFeatured(),

    Leadific: getLeadific(),

    Product: getProduct(),
    EcwidSearch: getEcwidSearch(),
    EcwidPrice: getEcwidPrice(),
    PostInfo: getPostInfo(),
    PostNavigation: getPostNavigation(),
    Breadcrumbs: getBreadcrumbs(),

    Archive: getArchive(config),
    PostExcerpt: getPostExcerpt(config),
    PostTitle: getPostTitle(config),
    WOOCategories: getWOOCategories(),
    WOOPages: getWOOPages(),
    WPCustomShortcode: getWPCustomShortcode(),
    WPFeaturedImage: getFeaturedImage(config),
    WPSidebar: getWPSidebar(),
    Products: getProducts(),
    Review: getReview(),
    Search: getSearch(),
    WOOAddToCart: getWOOAddToCart(),
    WOOArchives: getWOOArchives(),
    WOOAttributes: getWOOAttributes(),
    WOOBreadcrumbs: getWOOBreadcrumbs(),
    WOOCart: getWOOCart(),
    WOOExcerpt: getWOOExcerpt(),
    WOOGallery: getWOOGallery(),
    WOOPrice: getWOOPrice(),
    WOOProductContent: getWOOProductContent(),
    WOOProductMeta: getWOOProductMeta(),
    WOOProductTitle: getWOOProductTitle(),
    WOORating: getWOORating(),
    WOOSku: getWOOSku(),
    WOOStock: getWOOStock(),
    WOOUpsell: getWOOUpsell(),
    WPBreadcrumbs: getWPBreadcrumbs(),
    WPPostContent: getPostContent(config),
    WPPostInfo: getWPPostInfo(),
    WPPostNavigation: getWPPostNavigation(),

    ProductTitle: getProductTitle(config),
    ProductDescription: getProductDescription(config),
    ProductImage: getProductImage(config),
    ProductMetafield: getProductMetafield(config),
    ProductList: getProductList(config),
    AddToCart: getAddToCart(config),
    Price: getPrice(config),
    Quantity: getQuantity(config),
    Variant: getVariant(config),
    Vendor: getVendor(config),
    CollectionList: getCollectionList(config),
    BlogPostList: getBlogPostList(config),
    BlogPostMeta: getBlogPostMeta(config),
    BlogPostExcerpt: getBlogPostExcerpt(config)
  };
}
