import Input from "../common/Input";
import Scroll from "../common/Scroll";
import Showing from "../common/Showing";
import Referrer from "../common/Referrer";
import Devices from "../common/Devices";

export default [
  {
    id: "pageLoad",
    title: "On Page Load",
    type: "number",
    placeholder: "After (sec)",
    Component: Input
  },
  {
    id: "scrolling",
    title: "On Scroll",
    defaultValue: {
      value: "down",
      within: "",
      toElement: ""
    },
    duplicatesAmount: Infinity,
    Component: Scroll
  },
  {
    id: "click",
    title: "On Click",
    type: "number",
    placeholder: "clicks",
    Component: Input
  },
  {
    id: "inactivity",
    title: "After Inactivity",
    type: "number",
    placeholder: "After (sec)",
    Component: Input
  },
  {
    id: "exitIntent",
    title: "On Page Exit Intent",
    defaultValue: true
  },
  {
    id: "showing",
    title: "Show After X",
    defaultValue: {
      value: "views",
      views: 5,
      sessions: 3
    },
    duplicatesAmount: 2,
    Component: Showing
  },
  {
    id: "referrer",
    title: "Arriving From",
    defaultValue: {
      value: "show",
      url: "",
      source: "search_engines"
    },
    duplicatesAmount: Infinity,
    Component: Referrer
  },
  {
    id: "devices",
    title: "Show on devices",
    defaultValue: "desktop",
    duplicatesAmount: 3,
    Component: Devices
  }
];
