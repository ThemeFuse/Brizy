// #region Story
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { IS_PRO } from "visual/utils/env";
import Accordion from "./Accordion";
import Alert from "./Alert";
import Audio from "./Audio";
import Button from "./Button";
import Columns from "./Columns";
import Countdown2 from "./Countdown2";
import Counter from "./Counter";
import Embed from "./Embed";
import Form2 from "./Form2";
import Icon from "./Icon";
import IconText from "./IconText";
import Image from "./Image";
import Line from "./Line";
import Map from "./Map";
import MenuSimple from "./MenuSimple";
import ProgressBar from "./ProgressBar";
import Row from "./Row";
import Spacer from "./Spacer";
import Tabs from "./Tabs";
import Text from "./Text";
import Video from "./Video";
import Calendly from "./pro/Calendly";
import Carousel from "./pro/Carousel";
import Facebook from "./pro/Facebook";
import FacebookComments from "./pro/FacebookComments";
import ImageGallery from "./pro/ImageGallery";
import Login from "./pro/Login";
import Lottie from "./pro/Lottie";
import Menu from "./pro/Menu";
import StarRating from "./pro/StarRating";
import Switcher from "./pro/Switcher";
import Table from "./pro/Table";
import Timeline from "./pro/Timeline";
import Twitter from "./pro/Twitter";
import VideoPlaylist from "./pro/VideoPlaylist";
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

//#endregion
const config = Config.getAll();

export const essentialsCommon = [
  { component: Text, pro: false },
  { component: Image, pro: false },
  { component: Button, pro: false },
  { component: Icon, pro: false },
  { component: Spacer, pro: false },
  { component: Map, pro: false },
  { component: Form2, pro: false },
  { component: Line, pro: false },
  ...(IS_PRO
    ? [{ component: Menu, pro: true }]
    : [
        { component: MenuSimple, pro: false },
        { component: Menu, pro: true }
      ])
];

export const media = [
  { component: ImageGallery, pro: true },
  { component: Video, pro: false },
  { component: Audio, pro: false },
  { component: VideoPlaylist, pro: true }
];

export const content = [
  { component: IconText, pro: false },
  { component: Lottie, pro: true },
  { component: Embed, pro: false },
  { component: StarRating, pro: true },
  { component: Alert, pro: false },
  { component: Counter, pro: false },
  { component: Countdown2, pro: false },
  { component: ProgressBar, pro: false },
  { component: Calendly, pro: true },
  { component: Carousel, pro: true },
  { component: Tabs, pro: false },
  { component: Accordion, pro: false },
  { component: Switcher, pro: true },
  { component: Table, pro: true },
  { component: Timeline, pro: true },
  ...(isCloud(config) && isShopify(config)
    ? []
    : [{ component: Login, pro: true }])
];

export const essentialsStory = [
  { component: StoryButton, pro: false },
  { component: StoryIcon, pro: false },
  { component: StoryEmbed, pro: false },
  { component: StoryText, pro: false },
  { component: StoryMap, pro: false },
  { component: StoryProgressBar, pro: false },
  { component: StoryLine, pro: false },
  { component: StoryCountdown2, pro: false },
  { component: StoryCounter, pro: false },
  { component: StoryShape, pro: false },
  { component: StoryForm2, pro: false },
  { component: StoryStarRating, pro: true },
  { component: StoryLottie, pro: true }
];

export const mediaStory = [
  { component: StoryImage, pro: false },
  { component: StoryVideo, pro: false }
];

export const social = [
  { component: Facebook, pro: true },
  { component: Twitter, pro: true },
  { component: FacebookComments, pro: true }
];

export const grid = [
  { component: Columns, pro: false },
  { component: Row, pro: false }
];
