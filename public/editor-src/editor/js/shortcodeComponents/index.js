import Text from "./Text";
import Video from "./Video";
import Button from "./Button"; // nc-button
import Icon from "./Icon"; // nc-star
// import Social from "./Social";       // nc-link
import Image from "./Image"; // nc-img
import Spacer from "./Spacer"; // nc-zoom-e
import Line from "./Line"; // nc-divider
import Map from "./Map"; // nc-pin
import Embed from "./Embed"; // nc-iframe
import Form from "./Form"; // nc-form
// import Share from "./Share";         // nc-share-2
import IconText from "./IconText"; // nc-paragraph
import Row from "./Row";
import Columns from "./Columns";
import Tabs from "./Tabs";
import ProgressBar from "./ProgressBar";
import Counter from "./Counter";
import SoundCloud from "./SoundCloud";
import Countdown from "./Countdown";
import Accordion from "./Accordion";

export default {
  base: [
    Text,
    Button,
    Icon,
    Image,
    Video,
    Spacer,
    Line,
    Map,
    Embed,
    Form,
    IconText,
    SoundCloud,
    Counter,
    Countdown,
    Tabs,
    ProgressBar,
    Accordion
  ],
  grid: [Row, Columns]
};
