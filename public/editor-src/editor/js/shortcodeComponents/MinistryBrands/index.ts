import { Shortcode } from "visual/types";
import EventCalendar from "./EventCalendar";
import EventLayout from "./EventLayout";
import GroupLayout from "./GroupLayout";
import GroupSlider from "./GroupSlider";
import SermonLayout from "./SermonLayout";

const config: Shortcode[] = [
  { component: GroupLayout, pro: false },
  { component: GroupSlider, pro: false },
  { component: EventLayout, pro: false },
  { component: EventCalendar, pro: false },
  { component: SermonLayout, pro: false }
];

export default config;
