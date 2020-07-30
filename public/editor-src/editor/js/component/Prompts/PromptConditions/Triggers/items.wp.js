import Config from "visual/global/Config";
import Input from "../common/Input";
import Scroll from "../common/Scroll";
import Showing from "../common/Showing";
import Referrer from "../common/Referrer";
import LoggedIn from "../common/LoggedIn";
import Devices from "../common/Devices";

import CurrentUrl from "../common/CurrentUrl";
import CurrentDate from "../common/CurrentDate";
import LastVisitDate from "../common/LastVisitDate";
import TimeFrom from "../common/TimeFrom";
import Cookie from "../common/Cookie";
import OS from "../common/OS";
import OtherPopups from "../common/OtherPopups";
import SpecificPopup from "../common/SpecificPopup";

const { availableRoles } = Config.get("wp");

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
      type: "equals",
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
      type: "is",
      value: "show",
      url: "",
      source: "search_engines"
    },
    duplicatesAmount: Infinity,
    Component: Referrer
  },
  {
    id: "loggedIn",
    title: "Hide for logged in users",
    defaultValue: {
      value: "all",
      user: availableRoles[0].role
    },
    duplicatesAmount: Infinity,
    Component: LoggedIn
  },
  {
    id: "devices",
    title: "Show on devices",
    defaultValue: "desktop",
    duplicatesAmount: 3,
    Component: Devices
  },
  {
    id: "currentUrl",
    title: "Current Page URL",
    defaultValue: {
      type: "matches",
      value: ""
    },
    duplicatesAmount: Infinity,
    Component: CurrentUrl
  },
  {
    id: "currentDate",
    title: "Current Date",
    defaultValue: {
      type: "matches",
      value: ""
    },
    duplicatesAmount: Infinity,
    Component: CurrentDate
  },
  {
    id: "lastVisitDate",
    title: "Last Visit Date",
    defaultValue: {
      type: "matches",
      value: ""
    },
    duplicatesAmount: Infinity,
    Component: LastVisitDate
  },
  {
    id: "timeFrom",
    title: "Time From",
    defaultValue: {
      type: "greater",
      visit: "first",
      time: "days",
      value: ""
    },
    duplicatesAmount: Infinity,
    Component: TimeFrom
  },
  {
    id: "cookie",
    title: "Cookie",
    defaultValue: {
      type: "matches",
      param: "",
      value: ""
    },
    duplicatesAmount: Infinity,
    Component: Cookie
  },
  {
    id: "os",
    title: "Operating System",
    defaultValue: {
      type: "is",
      value: "windows"
    },
    duplicatesAmount: Infinity,
    Component: OS
  },
  {
    id: "otherPopups",
    title: "No other popup",
    defaultValue: {
      type: "was",
      value: "page"
    },
    duplicatesAmount: 1,
    Component: OtherPopups
  },
  {
    id: "specificPopup",
    title: "Other specific popup",
    defaultValue: {
      type: "was",
      value: ""
    },
    duplicatesAmount: Infinity,
    Component: SpecificPopup
  }
];
