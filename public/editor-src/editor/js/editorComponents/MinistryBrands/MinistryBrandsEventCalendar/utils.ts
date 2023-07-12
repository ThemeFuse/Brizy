import {
  changeContentVisibility,
  getAttr,
  getDetail,
  getFeatures
} from "../utils/helpers";
import { Value } from "./types";

export const getPlaceholder = (v: Value): string => {
  const {
    category,
    group,
    showEventTime,
    numberOfMonths,
    features,
    nonfeatures,
    detailPage
  } = v;

  const _features = getFeatures(features, "features");
  const _nonfeatures = getFeatures(nonfeatures, "nonfeatures");
  const _detailPage = getDetail(detailPage);
  const _showEventTime = getAttr(showEventTime, "time");
  return `{{ekk_event_calendar
            category='${category}'
            group='${group}'
            ${_features}
            ${_nonfeatures}
            howmanymonths='${numberOfMonths}'
            detail_page='${_detailPage}'
            ${_showEventTime}
 }}`;
};

export const addContentEventListener = ({
  wrapper
}: {
  wrapper: HTMLElement;
}) => {
  const items = Array.from(
    wrapper.querySelectorAll<HTMLElement>(".brz-eventCalendar-month")
  );

  const activeClassName = "active";

  items.forEach((item, index) => {
    const prevButton = item.querySelector(
      ".brz-eventCalendar-pagination > .brz-eventCalendar-pagination-previous"
    );
    const nextButton = item.querySelector(
      ".brz-eventCalendar-pagination > .brz-eventCalendar-pagination-next"
    );

    if (index === 0) {
      item?.classList.add(activeClassName);
      prevButton?.classList.add("off");
    }

    if (index === items.length - 1) {
      nextButton?.classList.add("off");
    }

    prevButton?.addEventListener("click", (e) => {
      e.preventDefault();
      changeContentVisibility({
        items,
        activeClassName,
        direction: "prev"
      });
    });

    nextButton?.addEventListener("click", (e) => {
      e.preventDefault();
      changeContentVisibility({
        items,
        activeClassName,
        direction: "next"
      });
    });
  });
};
