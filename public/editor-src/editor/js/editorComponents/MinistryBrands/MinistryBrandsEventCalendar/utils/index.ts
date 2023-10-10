import { changeContentVisibility } from "../../utils/helpers";

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
