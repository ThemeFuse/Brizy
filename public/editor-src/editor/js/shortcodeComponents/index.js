import Text from "./Text";
import Video from "./Video";
import Button from "./Button";
import Icon from "./Icon";
import Image from "./Image";
import Spacer from "./Spacer";
import Line from "./Line";
import Map from "./Map";
import Embed from "./Embed";
import Form from "./Form";
import IconText from "./IconText";
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
  grid: [Row, Columns],
  social: []
};
