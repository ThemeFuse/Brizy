import $ from "jquery";
import { getFreeLibs } from "visual/libs";

export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  const range = (node: Element): void => {
    const inputLeft: HTMLInputElement | null = node.querySelector(
      "#brz-filters__range--input-left"
    );
    const inputRight: HTMLInputElement | null = node.querySelector(
      "#brz-filters__range--input-right"
    );

    const showText: string | null | undefined = node
      .querySelector(".brz-filters__option.brz-filters__range")
      ?.getAttribute("data-show-text");

    const thumbLeft: HTMLInputElement | null = node.querySelector(
      ".brz-filters__range--slider > .brz-filters__range--thumb.brz-filters__range--thumb--left"
    );
    const thumbRight: HTMLInputElement | null = node.querySelector(
      ".brz-filters__range--slider > .brz-filters__range--thumb.brz-filters__range--thumb--right"
    );
    const range: HTMLElement | null = node.querySelector(
      ".brz-filters__range--slider > .brz-filters__range--range"
    );
    const minLabel: HTMLElement | null = node.querySelector(
      ".brz-filters__range__text > .brz-filters__range--min"
    );
    const maxLabel: HTMLElement | null = node.querySelector(
      ".brz-filters__range__text > .brz-filters__range--max"
    );

    function setLeftValue(): void {
      if (!inputLeft || !inputRight) return;

      const min: string | number = parseInt(inputLeft.min);
      const max: string | number = parseInt(inputLeft.max);
      const step: string | number = parseInt(inputLeft.step);

      inputLeft.value = Math.min(
        parseInt(inputLeft.value),
        parseInt(inputRight.value) - step
      ).toString();

      const percent: number =
        ((Number(inputLeft.value) - min) / (max - min)) * 100;

      if (showText === "on" && minLabel) {
        minLabel.innerText = inputLeft.value;
      }
      if (thumbLeft) {
        thumbLeft.style.left = percent + "%";
      }
      if (range) {
        range.style.left = percent + "%";
      }
    }

    function setRightValue(): void {
      if (!inputLeft || !inputRight) return;

      const min = parseInt(inputRight.min);
      const max = parseInt(inputRight.max);
      const step = parseInt(inputRight.step);

      inputRight.value = Math.max(
        parseInt(inputRight.value),
        parseInt(inputLeft.value) + step
      ).toString();

      const percent: number =
        ((Number(inputRight.value) - min) / (max - min)) * 100;

      if (showText === "on" && maxLabel) {
        maxLabel.innerText = inputRight.value;
      }
      if (thumbRight) {
        thumbRight.style.right = 100 - percent + "%";
      }
      if (range) {
        range.style.right = 100 - percent + "%";
      }
    }

    setLeftValue();
    setRightValue();

    inputRight && inputRight.addEventListener("input", () => setRightValue());
    inputLeft && inputLeft.addEventListener("input", () => setLeftValue());
  };

  const radio = (node: Element): void => {
    const activeClass = "brz-filters__radio-option--active";
    node.addEventListener("change", (): void => {
      node.querySelectorAll<HTMLInputElement>(".brz-input").forEach((item) => {
        const parent = item.closest(".brz-filters__radio-option");

        if (item.checked && !parent?.classList.contains(activeClass)) {
          parent?.classList.add(activeClass);
        } else if (parent?.classList.contains(activeClass)) {
          parent.classList.remove(activeClass);
        }
      });
    });
  };

  const checkbox = (node: Element): void => {
    const activeClass = "brz-filters__checkbox-option--active";
    node.addEventListener("change", (): void => {
      node.querySelectorAll(".brz-input").forEach((item: Element) => {
        const parent = item.closest(".brz-filters__checkbox-option");
        if (
          (item as HTMLInputElement).checked &&
          !parent?.classList.contains(activeClass)
        ) {
          parent?.classList.add(activeClass);
        } else if (
          !(item as HTMLInputElement).checked &&
          parent?.classList.contains(activeClass)
        ) {
          parent.classList.remove(activeClass);
        }
      });
    });
  };

  const active = (node: Element): void => {
    const container: HTMLElement | null =
      node.querySelector(".brz-filters__tags");

    if (container)
      container.addEventListener("click", (e) => {
        const node = e.target;

        if (node instanceof Element) {
          const close = node.closest(".brz-filters__option");
          close?.parentNode?.removeChild(close);
        }
      });
  };

  const rating = (node: Element): void => {
    const stars: NodeListOf<
      Element & {
        starValue: number;
      }
    > = node.querySelectorAll(".brz-starrating-icon-wrap");

    const starRate = (e: MouseEvent): void => {
      const type = e.type;
      const hoverClass = "brz-filters__rating-hover";
      const node = e.target;
      let starValue = 0;

      if (node instanceof Element) {
        const staring = node.closest(".brz-starrating-icon-wrap");
        starValue = parseInt(staring?.getAttribute("starValue") ?? "0");
      }

      stars.forEach((el: Element, i: number): void => {
        const colorStar: HTMLInputElement | null = el.querySelector(
          ".brz-filters__rating--color"
        );

        switch (type) {
          case "click": {
            if (colorStar && i < starValue) {
              colorStar.style.width = "100%";
            } else if (colorStar) {
              colorStar.style.width = "0%";
            }
            break;
          }
          case "mouseover": {
            if (colorStar && i < starValue) {
              el.classList.add(hoverClass);
              colorStar.style.width = "100%";
            } else if (colorStar) {
              el.classList.remove(hoverClass);
              colorStar.style.width = "0%";
            }
            break;
          }
          case "mouseout": {
            el.classList.remove(hoverClass);

            break;
          }
        }
      });
    };

    for (let i = 0; i < stars.length; i++) {
      stars[i].starValue = i + 1;

      ["mouseover", "mouseout", "click"].forEach((event): void => {
        stars[i].addEventListener(event, (e) => starRate(e as MouseEvent));
      });
    }
  };

  const date = (node: Element): void => {
    const dateFrom = node.querySelector(
      ".brz-filters__option.brz-filters__date-option--from"
    );
    const dateTo = node.querySelector(
      ".brz-filters__option.brz-filters__date-option--to"
    );

    const native =
      dateFrom?.getAttribute("data-native") === "on" &&
      dateTo?.getAttribute("data-native") === "on";

    const { Flatpickr } = getFreeLibs();
    if (!native && Flatpickr && dateFrom && dateTo) {
      Flatpickr(dateFrom, {});
      Flatpickr(dateTo, {});
    }
  };

  const select = (node: HTMLElement): void => {
    const $this = $(node);
    const $select = $this.find(".brz-filters__select-option");

    $select.select2({
      width: "100%",
      minimumResultsForSearch: Infinity,
      dropdownParent: $this
    });

    // Custom Scrollbars
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scrollbars: any;
    $select.on("select2:opening", function (): void {
      // waiting appear the dropdown in the dom
      setTimeout(function () {
        const $dropdown = $this.find(".select2-dropdown");
        const node = $dropdown.get(0);
        if (!node) return;

        const itemHeight = parseInt(
          $dropdown
            .find(".select2-results__options .select2-results__option")
            .css("height")
        );

        $dropdown.css("maxHeight", itemHeight * 5);

        const { Scrollbars } = getFreeLibs();
        if (Scrollbars) {
          scrollbars = new Scrollbars(node);
        }
      }, 0);
    });

    // destroy custom scrollbar when dropdown closed
    $select.on("select2:close", function () {
      if (scrollbars) {
        scrollbars.destroy();
        scrollbars = null;
      }
    });
  };

  node.querySelectorAll(".brz-filters__main").forEach((node): void => {
    const type = node.getAttribute("data-filter-type");

    switch (type) {
      case "range": {
        range(node);
        break;
      }
      case "radio": {
        radio(node);
        break;
      }
      case "checkbox": {
        checkbox(node);
        break;
      }
      case "checkrange": {
        checkbox(node);
        break;
      }
      case "active": {
        active(node);
        break;
      }
      case "rating": {
        rating(node);
        break;
      }
      case "select": {
        node
          .querySelectorAll<HTMLElement>(
            ".brz-filters__wrapper .brz-filters__select"
          )
          .forEach((item): void => {
            select(item);
          });

        break;
      }
      case "date": {
        date(node);
        break;
      }
    }
  });
}
