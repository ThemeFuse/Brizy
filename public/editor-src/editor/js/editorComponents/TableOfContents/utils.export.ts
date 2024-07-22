import { checkValue } from "visual/utils/checkValue";
import { getCurrentDevice } from "visual/utils/export";
import type { MValue } from "visual/utils/value";
import { easeInOutQuad } from "../../component/Link/export/utils";
import { collapse, expand } from "../Accordion/utils";
import type { MarkerType } from "./types";

const setMessage = (node: HTMLElement, message: string): void => {
  const span = document.createElement("span");
  span.innerText = message;
  span.classList.add("brz-toc-message");
  node.appendChild(span);
};

const scrollTo = (config: { endLocation: number; duration: number }): void => {
  const { endLocation, duration } = config;
  const element = document.scrollingElement;

  if (element) {
    const startLocation = element.scrollTop;
    const distance = endLocation - startLocation;
    const increment = 20;

    let currentTime = 0;

    const animateScroll = (): void => {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, startLocation, distance, duration);

      element.scrollTop = val;

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }
};

export const isMinimized = (
  mDesktop: string,
  mTablet: string,
  mMobile: string
): boolean => {
  const currentDevice = getCurrentDevice();

  switch (currentDevice) {
    case "desktop":
      return mDesktop === "on";
    case "tablet":
      return mTablet === "on";
    case "mobile":
      return mMobile === "on";
    default:
      return false;
  }
};

export const renderList = (
  selectedElements: HTMLElement[],
  tocBody: HTMLElement,
  bodyList: HTMLElement,
  isMarkerNumbers: boolean
): void => {
  if (selectedElements.length !== 0) {
    selectedElements.forEach((item: HTMLElement, i: number) => {
      const li = document.createElement("li");
      li.classList.add("brz-li");

      const listContent = document.createElement("span");

      if (isMarkerNumbers) {
        bodyList.classList.add("brz-toc-body__list-numbers");
        const listMarker = document.createElement("span");
        listMarker.innerText = String(i + 1) + ".";
        listMarker.classList.add("brz-toc-body__list-marker");
        li.appendChild(listMarker);
      }

      listContent.classList.add("brz-toc-body__list-content");
      listContent.innerText = item.innerText;

      li.appendChild(listContent);

      li.addEventListener("click", () => {
        scrollTo({
          endLocation:
            item.getBoundingClientRect().top +
            (document?.scrollingElement?.scrollTop ?? 0) -
            30, // 30 is needed to have a small gap between top of viewport and heading
          duration: 600
        });
      });
      bodyList.appendChild(li);
    });
    // we create list dynamically and is needed to append only if selectedElements > 0
    tocBody.appendChild(bodyList);
  } else {
    setMessage(tocBody, "No headings were found.");
  }
};

export const changeIcon = (
  parentNode: HTMLElement | null,
  openedStatus: boolean
): void => {
  const firstChildren = parentNode && (parentNode.children[0] as HTMLElement); // arrow up
  const secondChildren = parentNode && (parentNode.children[1] as HTMLElement); // arrow down

  if (openedStatus) {
    firstChildren?.style.setProperty("display", "none");
    secondChildren?.style.setProperty("display", "block", "important");
  } else {
    firstChildren?.style.setProperty("display", "block");
    secondChildren?.style.setProperty("display", "none", "important");
  }
};

export const openHideTOC = (
  isOpened: boolean,
  tocBody: HTMLElement,
  height: number,
  duration: number,
  tocHeader: HTMLDivElement
): void => {
  tocHeader.classList.add("brz-blocked");

  if (isOpened) {
    expand(tocBody, {
      height,
      duration,
      onFinish() {
        tocBody.parentElement?.classList.remove("brz-toc--opened");
        tocHeader.classList.remove("brz-blocked");
      }
    });
  } else {
    collapse(tocBody, {
      height,
      duration,
      onStart() {
        tocBody.parentElement?.classList.add("brz-toc--opened");
      },
      onFinish() {
        tocHeader.classList.remove("brz-blocked");
      }
    });
  }
};

export const readMarkerType = (v: unknown): MValue<MarkerType> =>
  checkValue<MarkerType>(["numbers", "circle"])(v);
