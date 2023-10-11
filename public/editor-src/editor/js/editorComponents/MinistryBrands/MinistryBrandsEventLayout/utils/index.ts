import { changeContentVisibility } from "../../utils/helpers";

export const addContentEventListener = ({
  type,
  wrapper
}: {
  type: "list" | "calendar";
  wrapper: HTMLElement;
}) => {
  const items =
    type == "list"
      ? Array.from(
          wrapper.querySelectorAll<HTMLElement>(".brz-eventLayout--list-item")
        )
      : Array.from(
          wrapper.querySelectorAll<HTMLElement>(
            ".brz-eventLayout--calendar-item"
          )
        );

  const activeClassName =
    type === "list"
      ? "brz-eventLayout--list-item-active"
      : "brz-eventLayout--calendar-item-active";

  items.forEach((item, index) => {
    const prevButton = item.querySelector(
      ".brz-eventLayout__pagination > .previous"
    );
    const nextButton = item.querySelector(
      ".brz-eventLayout__pagination > .next"
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
