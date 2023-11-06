import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { getAttr, getDetail, getFeatures } from "../../utils/helpers";
import { Value } from "../types";

export const getPlaceholder = (v: Value, icon: string): string => {
  const {
    category,
    group,
    showEventTime,
    numberOfMonths,
    features,
    nonfeatures,
    detailPage,
    showSubscribeToCalendarButton,
    subscribeToCalendarText
  } = v;

  const attr = [
    `category='${category}'`,
    `group='${group}'`,
    getFeatures(features, "features"),
    getFeatures(nonfeatures, "nonfeatures"),
    `howmanymonths='${numberOfMonths}'`,
    `detail_page='${getDetail(detailPage)}'`,
    getAttr(showEventTime, "time"),
    getAttr(showSubscribeToCalendarButton, "showSubscribeToCalendarButton")
  ];
  const startPlaceholder = makeStartPlaceholder({
    content: "{{ekk_event_calendar}}",
    attrStr: attr.join(" ")
  });
  const endPlaceholder = makeEndPlaceholder({
    content: "{{end_ekk_event_calendar}}"
  });

  return `
    ${startPlaceholder}
    <a class="brz-eventCalendar__subscribe" href="?mc-subscribe">
        <span class='brz-eventCalendar__subscribe__icon'>${icon}</span>
        <span>${subscribeToCalendarText}</span>
    </a>
    ${endPlaceholder}
  `;
};
