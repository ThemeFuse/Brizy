import { Value } from "./types";
import { changeContentVisibility, getAttr } from "../utils/helpers";

export const getPlaceholder = (v: Value): string => {
  const { category, group, numberOfMonths, features, nonfeatures, detailPage } =
    v;

  const _features = getAttr(features, "features");
  const _nonfeatures = getAttr(nonfeatures, "nonfeatures");

  return `{{ekk_event_calendar
            category='${category}'
            group='${group}'
            ${_features}
            ${_nonfeatures}
            howmanymonths='${numberOfMonths}'
            detail_page='${detailPage}'
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
