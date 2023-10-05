import Config, { isWp } from "visual/global/Config";
import Accordion from "./Accordion";
import Alert from "./Alert";
import Archive from "./Archive";
import AssetsPosts from "./AssetsPosts";
import Audio from "./Audio";
import Button from "./Button";
import Columns from "./Columns";
import Countdown2 from "./Countdown2";
import Counter from "./Counter";
import Cart from "./Ecwid/Cart";
import MyAccount from "./Ecwid/MyAccount";
import Product from "./Ecwid/Product";
import ShoppingBag from "./Ecwid/ShoppingBag";
import Embed from "./Embed";
import Form2 from "./Form2";
import Icon from "./Icon";
import IconText from "./IconText";
import Image from "./Image";
import Line from "./Line";
import Map from "./Map";
import MenuSimple from "./MenuSimple";
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
import MinistryBrandsSermonDetail from "./MinistryBrands/MinistryBrandsSermonDetail";
import MinistryBrandsSermonFeatured from "./MinistryBrands/MinistryBrandsSermonFeatured";
import MinistryBrandsSermonLayout from "./MinistryBrands/MinistryBrandsSermonLayout";
import MinistryBrandsSermonList from "./MinistryBrands/MinistryBrandsSermonList";
import PostExcerpt from "./PostExcerpt";
import PostTitle from "./PostTitle";
import Posts from "./Posts";
import ProgressBar from "./ProgressBar";
import ProtectedPage from "./ProtectedPage";
import Row from "./Row";
import ShopCategories from "./ShopCategories";
import ShopPosts from "./ShopPosts";
import Spacer from "./Spacer";
import Tabs from "./Tabs";
import Text from "./Text";
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
import WPFeaturedImage from "./WPFeaturedImage";
import WPSidebar from "./WPSidebar";
import Calendly from "./pro/Calendly";
import Carousel from "./pro/Carousel";
import Facebook from "./pro/Facebook";
import FacebookComments from "./pro/FacebookComments";
import ImageGallery from "./pro/ImageGallery";
import Login from "./pro/Login";
import Lottie from "./pro/Lottie";
import Menu from "./pro/Menu";
import Products from "./pro/Products";
import ResetPassword from "./pro/ResetPassword";
import Review from "./pro/Review.js";
import Search from "./pro/Search";
import StarRating from "./pro/StarRating";
import Switcher from "./pro/Switcher";
import Table from "./pro/Table";
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
import WPPostContent from "./pro/WPPostContent";
import WPPostInfo from "./pro/WPPostInfo";
import WPPostNavigation from "./pro/WPPostNavigation";
import StoryLottie from "./pro/story/StoryLottie";
import StoryStarRating from "./pro/story/StoryStarRating";
import StoryButton from "./story/StoryButton";
import StoryCountdown2 from "./story/StoryCountdown2";
import StoryCounter from "./story/StoryCounter";
import StoryEmbed from "./story/StoryEmbed";
import StoryForm2 from "./story/StoryForm2";
import StoryIcon from "./story/StoryIcon";
import StoryImage from "./story/StoryImage";
import StoryLine from "./story/StoryLine";
import StoryMap from "./story/StoryMap";
import StoryProgressBar from "./story/StoryProgressBar";
import StoryShape from "./story/StoryShape";
import StoryText from "./story/StoryText";
import StoryVideo from "./story/StoryVideo";

export const ProShortCodes = {
  Text: false,
  Image: false,
  Button: false,
  Icon: false,
  Spacer: false,
  Map: false,
  Form2: false,
  Line: false,
  Menu: true,
  MenuSimple: false,
  Login: true,
  Translation: false,

  ImageGallery: true,
  Video: false,
  Audio: false,
  VideoPlaylist: true,

  IconText: false,
  Lottie: true,
  Embed: false,
  StarRating: true,
  Alert: false,
  Counter: false,
  Countdown2: false,
  ProgressBar: false,
  Calendly: true,
  Carousel: true,
  Tabs: false,
  Accordion: false,
  Switcher: true,
  Table: true,
  Timeline: true,

  StoryButton: false,
  StoryIcon: false,
  StoryEmbed: false,
  StoryText: false,
  StoryMap: false,
  StoryProgressBar: false,
  StoryLine: false,
  StoryCountdown2: false,
  StoryCounter: false,
  StoryShape: false,
  StoryForm2: false,
  StoryStarRating: true,
  StoryLottie: true,

  StoryImage: false,
  StoryVideo: false,

  Facebook: true,
  Twitter: true,
  FacebookComments: true,

  Columns: false,
  Row: false,

  ProtectedPage: false,
  ResetPassword: false,

  Posts: isWp(Config.getAll()),
  PostTitle: isWp(Config.getAll()),
  AssetsPosts: false,

  UserFirstName: false,
  UserLastName: false,
  UserEmail: false,
  UserPhoneNumber: false,
  UserRoles: false,
  UserUsername: false,

  Cart: false,
  Product: false,
  ShoppingBag: false,
  MyAccount: false,

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

export const CloudShortCodes = {
  Text,
  Image,
  Button,
  Icon,
  Spacer,
  Map,
  Form2,
  Line,
  Menu,
  MenuSimple,
  Login,
  Translation,
  Posts,

  ImageGallery,
  Video,
  Audio,
  VideoPlaylist,

  IconText,
  Lottie,
  Embed,
  StarRating,
  Alert,
  Counter,
  Countdown2,
  ProgressBar,
  Calendly,
  Carousel,
  Tabs,
  Accordion,
  Switcher,
  Table,
  Timeline,

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
  StoryForm2,
  StoryStarRating,
  StoryLottie,

  StoryImage,
  StoryVideo,

  Facebook,
  Twitter,
  FacebookComments,

  Columns,
  Row,

  AssetsPosts,

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
  ShopPosts,
  ShopCategories,

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

  Product
};

export const WPShortCodes = {
  Archive,
  PostExcerpt,
  PostTitle,
  WOOCategories,
  WOOPages,
  WPCustomShortcode,
  WPFeaturedImage,
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
  WPPostContent,
  WPPostInfo,
  WPPostNavigation
};
