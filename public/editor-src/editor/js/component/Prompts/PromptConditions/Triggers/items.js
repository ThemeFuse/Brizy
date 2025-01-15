import { t } from "visual/utils/i18n";
import Cookie from "../common/Cookie";
import CurrentDate from "../common/CurrentDate";
import CurrentUrl from "../common/CurrentUrl";
import Devices from "../common/Devices";
import Input from "../common/Input";
import LastVisitDate from "../common/LastVisitDate";
import OS from "../common/OS";
import OtherPopups from "../common/OtherPopups";
import Referrer from "../common/Referrer";
import Scroll from "../common/Scroll";
import Showing from "../common/Showing";
import SpecificPopup from "../common/SpecificPopup";
import TimeFrom from "../common/TimeFrom";

export default function () {
  return [
    {
      id: "pageLoad",
      title: t("On Page Load"),
      type: "number",
      placeholder: t("After (sec)"),
      Component: Input
    },
    {
      id: "scrolling",
      title: t("On Scroll"),
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
      title: t("On Click"),
      type: "number",
      placeholder: t("clicks"),
      Component: Input
    },
    {
      id: "inactivity",
      title: t("After Inactivity"),
      type: "number",
      placeholder: t("After (sec)"),
      Component: Input
    },
    {
      id: "exitIntent",
      title: t("On Page Exit Intent"),
      defaultValue: true
    },
    {
      id: "showing",
      title: t("Number of"),
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
      title: t("Arriving"),
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
      id: "devices",
      title: t("Show on devices"),
      defaultValue: "desktop",
      duplicatesAmount: 3,
      Component: Devices
    },
    {
      id: "currentUrl",
      title: t("Current Page URL"),
      defaultValue: {
        type: "matches",
        value: ""
      },
      duplicatesAmount: Infinity,
      Component: CurrentUrl
    },
    {
      id: "currentDate",
      title: t("Current Date"),
      defaultValue: {
        type: "matches",
        value: ""
      },
      duplicatesAmount: Infinity,
      Component: CurrentDate
    },
    {
      id: "lastVisitDate",
      title: t("Last Visit Date"),
      defaultValue: {
        type: "matches",
        value: ""
      },
      duplicatesAmount: Infinity,
      Component: LastVisitDate
    },
    {
      id: "timeFrom",
      title: t("Time From"),
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
      title: t("Cookie"),
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
      title: t("Operating System"),
      defaultValue: {
        type: "is",
        value: "windows"
      },
      duplicatesAmount: Infinity,
      Component: OS
    },
    {
      id: "otherPopups",
      title: t("No other popup"),
      defaultValue: {
        type: "was",
        value: "page"
      },
      duplicatesAmount: 1,
      Component: OtherPopups
    },
    {
      id: "specificPopup",
      title: t("Other specific popup"),
      defaultValue: {
        type: "was",
        value: ""
      },
      duplicatesAmount: Infinity,
      Component: SpecificPopup
    }
  ];
}
