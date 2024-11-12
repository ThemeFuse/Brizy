import Config, { isWp } from "visual/global/Config";
import { Config as ConfigType } from "visual/global/Config/types";
import Accordion from "./Accordion";
import Alert from "./Alert";
import getArchive from "./Archive";
import getAssetsPosts from "./AssetsPosts";
import Audio from "./Audio";
import getButton from "./Button";
import getColumns from "./Columns";
import Countdown2 from "./Countdown2";
import Counter from "./Counter";
import Cart from "./Ecwid/Cart";
import MyAccount from "./Ecwid/MyAccount";
import Product from "./Ecwid/Product";
import ShoppingBag from "./Ecwid/ShoppingBag";
import getForm2 from "./Form2";
import getIcon from "./Icon";
import IconText from "./IconText";
import getImage from "./Image";
import Leadific from "./Leadific/Leadific";
import Line from "./Line";
import Map from "./Map";
import MenuSimple from "./MenuSimple";
import MinistryBrandsArticleDetail from "./MinistryBrands/MinistryBrandsArticleDetail";
import MinistryBrandsArticleFeatured from "./MinistryBrands/MinistryBrandsArticleFeatured";
import MinistryBrandsArticleList from "./MinistryBrands/MinistryBrandsArticleList";
import MinistryBrandsEventCalendar from "./MinistryBrands/MinistryBrandsEventCalendar";
import MinistryBrandsEventDetail from "./MinistryBrands/MinistryBrandsEventDetail";
import MinistryBrandsEventFeatured from "./MinistryBrands/MinistryBrandsEventFeatured";
import MinistryBrandsEventLayout from "./MinistryBrands/MinistryBrandsEventLayout";
import MinistryBrandsEventList from "./MinistryBrands/MinistryBrandsEventList";
import MinistryBrandsFormWidget from "./MinistryBrands/MinistryBrandsFormWidget";
import MinistryBrandsGroupDetail from "./MinistryBrands/MinistryBrandsGroupDetail";
import MinistryBrandsGroupFeatured from "./MinistryBrands/MinistryBrandsGroupFeatured";
import MinistryBrandsGroupLayout from "./MinistryBrands/MinistryBrandsGroupLayout";
import MinistryBrandsGroupList from "./MinistryBrands/MinistryBrandsGroupList";
import MinistryBrandsGroupSlider from "./MinistryBrands/MinistryBrandsGroupSlider";
import MinistryBrandsPrayerWidget from "./MinistryBrands/MinistryBrandsPrayerWidget";
import MinistryBrandsSermonDetail from "./MinistryBrands/MinistryBrandsSermonDetail";
import MinistryBrandsSermonFeatured from "./MinistryBrands/MinistryBrandsSermonFeatured";
import MinistryBrandsSermonLayout from "./MinistryBrands/MinistryBrandsSermonLayout";
import MinistryBrandsSermonList from "./MinistryBrands/MinistryBrandsSermonList";
import MinistryBrandsStaffDetail from "./MinistryBrands/MinistryBrandsStaffDetail";
import getPaypal from "./Paypal";
import getPostExcerpt from "./PostExcerpt";
import getPostTitle from "./PostTitle";
import getPosts from "./Posts";
import ProgressBar from "./ProgressBar";
import ProtectedPage from "./ProtectedPage";
import getRow from "./Row";
import ShareButton from "./ShareButton";
import getShopCategories from "./ShopCategories";
import getShopPosts from "./ShopPosts";
import Spacer from "./Spacer";
import Tabs from "./Tabs";
import getText from "./Text";
import Translation from "./Translation";
import UserEmail from "./UserEmail";
import UserFirstName from "./UserFirstName";
import UserLastName from "./UserLastName";
import UserPhoneNumber from "./UserPhoneNumber";
import UserRoles from "./UserRoles";
import UserUsername from "./UserUsername";
import Video from "./Video";
import WOOCategories from "./WOOCategories";
import WOOPages from "./WOOPages";
import WPCustomShortcode from "./WPCustomShortcode";
import getFeaturedImage from "./WPFeaturedImage";
import WPSidebar from "./WPSidebar";
import Breadcrumbs from "./pro/Breadcrumbs";
import Embed from "./pro/Embed";
import Calendly from "./pro/Calendly";
import Carousel from "./pro/Carousel";
import Facebook from "./pro/Facebook";
import FacebookComments from "./pro/FacebookComments";
import getFlipbox from "./pro/Flipbox";
import ImageGallery from "./pro/ImageGallery";
import Login from "./pro/Login";
import getLottie from "./pro/Lottie";
import Menu from "./pro/Menu";
import PostInfo from "./pro/PostInfo";
import PostNavigation from "./pro/PostNavigation";
import Products from "./pro/Products";
import ResetPassword from "./pro/ResetPassword";
import Review from "./pro/Review.js";
import Search from "./pro/Search";
import StarRating from "./pro/StarRating";
import Switcher from "./pro/Switcher";
import Table from "./pro/Table";
import getTableOfContents from "./pro/TableOfContents";
import Timeline from "./pro/Timeline";
import Twitter from "./pro/Twitter";
import VideoPlaylist from "./pro/VideoPlaylist";
import WOOAddToCart from "./pro/WOOAddToCart";
import WOOArchives from "./pro/WOOArchives";
import WOOAttributes from "./pro/WOOAttributes";
import WOOBreadcrumbs from "./pro/WOOBreadcrumbs.js";
import WOOCart from "./pro/WOOCart";
import WOOExcerpt from "./pro/WOOExcerpt";
import WOOGallery from "./pro/WOOGallery";
import WOOPrice from "./pro/WOOPrice";
import WOOProductContent from "./pro/WOOProductContent.js";
import WOOProductMeta from "./pro/WOOProductMeta";
import WOOProductTitle from "./pro/WOOProductTitle";
import WOORating from "./pro/WOORating";
import WOOSku from "./pro/WOOSku";
import WOOStock from "./pro/WOOStock";
import WOOUpsell from "./pro/WOOUpsell.js";
import WPBreadcrumbs from "./pro/WPBreadcrumbs";
import getPostContent from "./pro/WPPostContent";
import WPPostInfo from "./pro/WPPostInfo";
import WPPostNavigation from "./pro/WPPostNavigation";
import StoryLottie from "./pro/story/StoryLottie";
import StoryStarRating from "./pro/story/StoryStarRating";
import StoryButton from "./story/StoryButton";
import StoryCountdown2 from "./story/StoryCountdown2";
import StoryCounter from "./story/StoryCounter";
import StoryEmbed from "./story/StoryEmbed";
import getStoryForm2 from "./story/StoryForm2";
import StoryIcon from "./story/StoryIcon";
import StoryImage from "./story/StoryImage";
import StoryLeadific from "./story/StoryLeadific";
import StoryLine from "./story/StoryLine";
import StoryMap from "./story/StoryMap";
import StoryProgressBar from "./story/StoryProgressBar";
import StoryShape from "./story/StoryShape";
import StoryText from "./story/StoryText";
import StoryVideo from "./story/StoryVideo";
import InstagramFeed from "./pro/InstagramFeed";
import { getDaysLeft } from "visual/utils/ecwid";
const config = Config.getAll();

export const ProShortCodes = {
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

  Columns: false,
  Row: false,

  ProtectedPage: false,
  ResetPassword: false,

  Posts: isWp(Config.getAll()),
  PostTitle: isWp(Config.getAll()),
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

  Cart: (c: ConfigType) => getDaysLeft(c) <= 0,
  Product: (c: ConfigType) => getDaysLeft(c) <= 0,
  ShoppingBag: (c: ConfigType) => getDaysLeft(c) <= 0,
  MyAccount: (c: ConfigType) => getDaysLeft(c) <= 0,

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

export const ShortCodesKeywords = {
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

export const CloudShortCodes = {
  Text: getText(config),
  Image: getImage(config),
  Button: getButton(config),
  Icon: getIcon(config),
  Spacer,
  Map,
  Form2: getForm2(),
  Line,
  Menu,
  MenuSimple,
  Login,
  Translation,
  Posts: getPosts(config),
  ShareButton,

  ImageGallery,
  Video,
  Audio,
  VideoPlaylist,
  Paypal: getPaypal(),

  IconText,
  Lottie: getLottie(config),
  Embed,
  StarRating,
  Alert,
  Counter,
  Countdown2,
  ProgressBar,
  Calendly,
  TableOfContents: getTableOfContents(),
  Carousel,
  Tabs,
  Accordion,
  Switcher,
  Table,
  Timeline,
  Flipbox: getFlipbox(),

  StoryButton,
  StoryIcon,
  StoryEmbed,
  StoryText,
  StoryMap,
  StoryProgressBar,
  StoryLine,
  StoryCountdown2,
  StoryCounter,
  StoryShape,
  StoryForm2: getStoryForm2(),
  StoryStarRating,
  StoryLottie,

  StoryImage,
  StoryVideo,

  StoryLeadific,

  Facebook,
  Twitter,
  FacebookComments,
  InstagramFeed,

  Columns: getColumns(config),
  Row: getRow(config),

  AssetsPosts: getAssetsPosts(config),

  ProtectedPage,
  ResetPassword,

  UserFirstName,
  UserLastName,
  UserEmail,
  UserPhoneNumber,
  UserRoles,
  UserUsername,

  Cart,
  ShoppingBag,
  MyAccount,
  ShopPosts: getShopPosts(config),
  ShopCategories: getShopCategories(config),

  MinistryBrandsGroupLayout,
  MinistryBrandsGroupSlider,
  MinistryBrandsEventLayout,
  MinistryBrandsEventCalendar,
  MinistryBrandsSermonLayout,
  MinistryBrandsSermonList,
  MinistryBrandsSermonFeatured,
  MinistryBrandsSermonDetail,
  MinistryBrandsGroupList,
  MinistryBrandsGroupDetail,
  MinistryBrandsEventFeatured,
  MinistryBrandsGroupFeatured,
  MinistryBrandsEventList,
  MinistryBrandsEventDetail,
  MinistryBrandsFormWidget,
  MinistryBrandsPrayerWidget,
  MinistryBrandsArticleDetail,
  MinistryBrandsArticleList,
  MinistryBrandsStaffDetail,
  MinistryBrandsArticleFeatured,

  Leadific,

  Product,
  PostInfo,
  PostNavigation,
  Breadcrumbs
};

export const WPShortCodes = {
  Archive: getArchive(config),
  PostExcerpt: getPostExcerpt(config),
  PostTitle: getPostTitle(config),
  WOOCategories,
  WOOPages,
  WPCustomShortcode,
  WPFeaturedImage: getFeaturedImage(config),
  WPSidebar,
  Products,
  Review,
  Search,
  WOOAddToCart,
  WOOArchives,
  WOOAttributes,
  WOOBreadcrumbs,
  WOOCart,
  WOOExcerpt,
  WOOGallery,
  WOOPrice,
  WOOProductContent,
  WOOProductMeta,
  WOOProductTitle,
  WOORating,
  WOOSku,
  WOOStock,
  WOOUpsell,
  WPBreadcrumbs,
  WPPostContent: getPostContent(config),
  WPPostInfo,
  WPPostNavigation
};
