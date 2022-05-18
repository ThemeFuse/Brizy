import Text from "./Text";
import Button from "./Button";
import Icon from "./Icon";
import Image from "./Image";
import Audio from "./Audio";
import Video from "./Video";
import Spacer from "./Spacer";
import Line from "./Line";
import Map from "./Map";
import Embed from "./Embed";
import Form2 from "./Form2";
import IconText from "./IconText";
import Counter from "./Counter";
import Countdown2 from "./Countdown2";
import Tabs from "./Tabs";
import ProgressBar from "./ProgressBar";
import Accordion from "./Accordion";
import MenuSimple from "./MenuSimple";

import Login from "./pro/Login";

import ImageGallery from "./pro/ImageGallery";
import Carousel from "./pro/Carousel";
import StarRating from "./pro/StarRating";
import Menu from "./pro/Menu";
import VideoPlaylist from "./pro/VideoPlaylist";
import Timeline from "./pro/Timeline";
import Switcher from "./pro/Switcher";
import Lottie from "./pro/Lottie";
import Table from "./pro/Table";

import FacebookComments from "./pro/FacebookComments";
import Facebook from "./pro/Facebook";
import Twitter from "./pro/Twitter";

import Row from "./Row";
import Columns from "./Columns";

// #region Story
import StoryText from "./story/StoryText";
import StoryMap from "./story/StoryMap";
import StoryVideo from "./story/StoryVideo";
import StoryProgressBar from "./story/StoryProgressBar";
import StoryLine from "./story/StoryLine";
import StoryCountdown2 from "./story/StoryCountdown2";
import StoryCounter from "./story/StoryCounter";
import StoryEmbed from "./story/StoryEmbed";
import StoryIcon from "./story/StoryIcon";
import StoryShape from "./story/StoryShape";
import StoryImage from "./story/StoryImage";
import StoryButton from "./story/StoryButton";
import StoryForm2 from "./story/StoryForm2";

import StoryStarRating from "./pro/story/StoryStarRating";
import StoryLottie from "./pro/story/StoryLottie";
//#endregion

export const baseCommon = [
  { component: Text, pro: false },
  { component: Button, pro: false },
  { component: Icon, pro: false },
  { component: Image, pro: false },
  { component: Audio, pro: false },
  { component: Video, pro: false },
  { component: Spacer, pro: false },
  { component: Line, pro: false },
  { component: Map, pro: false },
  { component: Embed, pro: false },
  { component: Form2, pro: false },
  { component: IconText, pro: false },
  { component: Counter, pro: false },
  { component: Countdown2, pro: false },
  { component: Tabs, pro: false },
  { component: ProgressBar, pro: false },
  { component: Accordion, pro: false },
  { component: MenuSimple, pro: false },

  { component: ImageGallery, pro: true },
  { component: Carousel, pro: true },
  { component: StarRating, pro: true },
  { component: Menu, pro: true },
  { component: VideoPlaylist, pro: true },
  { component: Table, pro: true },
  { component: Timeline, pro: true },
  { component: Switcher, pro: true },
  { component: Lottie, pro: true },
  { component: Login, pro: true }
];

export const baseStory = [
  { component: StoryButton, pro: false },
  { component: StoryImage, pro: false },
  { component: StoryIcon, pro: false },
  { component: StoryEmbed, pro: false },
  { component: StoryText, pro: false },
  { component: StoryMap, pro: false },
  { component: StoryVideo, pro: false },
  { component: StoryProgressBar, pro: false },
  { component: StoryLine, pro: false },
  { component: StoryCountdown2, pro: false },
  { component: StoryCounter, pro: false },
  { component: StoryShape, pro: false },
  { component: StoryForm2, pro: false },
  { component: StoryStarRating, pro: true },
  { component: StoryLottie, pro: true }
];

export const social = [
  { component: Facebook, pro: true },
  { component: Twitter, pro: true },
  { component: FacebookComments, pro: true }
];

export const grid = [
  { component: Row, pro: false },
  { component: Columns, pro: false }
];
