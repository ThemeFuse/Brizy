import { IS_PAGE, IS_SINGLE, IS_CMS, IS_ARCHIVE } from "visual/utils/env";
import { IS_STORY } from "visual/utils/models";

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

import Row from "./Row";
import Columns from "./Columns";

import PostTitle from "./PostTitle";
import PostExcerpt from "./PostExcerpt";
import Posts from "./Posts";
import Archive from "./Archive";

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

const base = [
  Text,
  Button,
  Icon,
  Image,
  Audio,
  Video,
  Spacer,
  Line,
  Map,
  Embed,
  Form2,
  IconText,
  Counter,
  Countdown2,
  Tabs,
  ProgressBar,
  Accordion,
  MenuSimple
];
const basePage = [...base, Posts];
const baseStory = [
  StoryButton,
  StoryImage,
  StoryIcon,
  StoryEmbed,
  StoryText,
  StoryMap,
  StoryVideo,
  StoryProgressBar,
  StoryLine,
  StoryCountdown2,
  StoryCounter,
  StoryShape,
  StoryForm2
];

const grid = [Row, Columns];

const dynamicSingle = [PostTitle, PostExcerpt, Posts];
const dynamicArchive = [Archive, PostTitle, PostExcerpt];

const config = (() => {
  const isFallback = !IS_PAGE && !IS_SINGLE && !IS_ARCHIVE && !IS_STORY;

  if (IS_PAGE || isFallback) {
    return {
      dynamic: [],
      base: IS_CMS ? basePage : base,
      grid,
      social: []
    };
  }

  if (IS_SINGLE) {
    return {
      dynamic: dynamicSingle,
      base,
      grid,
      social: []
    };
  }

  if (IS_ARCHIVE) {
    return {
      dynamic: dynamicArchive,
      base,
      grid,
      social: []
    };
  }

  if (IS_STORY) {
    return {
      dynamic: [],
      base: baseStory,
      grid: [],
      social: []
    };
  }
})();

export default config;
