import { debounce } from "es-toolkit";
import { getFreeLibs } from "visual/libs";
import type { ExportFunction } from "visual/types";
import { getCurrentDevice } from "visual/utils/export";
import { makeAttr } from "visual/utils/i18n/attribute";
import { read as readNumber } from "visual/utils/reader/number";
import {
  initBackgroundVideo,
  pauseBackgroundVideo,
  playBackgroundVideo,
  reinitBackgroundVideo,
  resizeBackgroundVideo,
  typeChangeBackgroundVideo
} from "./lib/backgroundVideo";
import { readVideoSettings } from "./lib/dataset";
import { destroyParallax, initParallax, pauseParallax } from "./lib/parallax";
import { Effect, Transition } from "./type";
import {
  getSlideType,
  handleSwiperResize,
  readTransition
} from "./utils/common";

const parallaxOptions = {
  bgClass: "brz-bg-image-parallax",
  wheelIgnoreClass: []
};

const fn: ExportFunction = (root) => {
  const parallax = root.querySelectorAll<HTMLElement>(".brz-bg-image-parallax");

  if (parallax.length > 0) {
    // One container can hold several parallax images; jQuery deduplicated the `closest` set and
    // the paused/destroy calls below still have to run once per container.
    const parallaxContainers = new Set<HTMLElement>();

    for (const image of parallax) {
      const container = image.closest<HTMLElement>(".brz-bg");

      if (container) {
        parallaxContainers.add(container);
      }
    }

    const initialDeviceMode = getCurrentDevice();

    if (initialDeviceMode === "desktop") {
      for (const container of parallaxContainers) {
        initParallax(container, parallaxOptions);
      }
    }

    window.addEventListener("resize", () => {
      const device = getCurrentDevice();

      for (const container of parallaxContainers) {
        if (device === "desktop") {
          initParallax(container, parallaxOptions);
        } else {
          destroyParallax(container);
        }
      }
    });

    const pauseAll = (paused: boolean): void => {
      for (const container of parallaxContainers) {
        pauseParallax(container, paused);
      }
    };

    // when some of element popup, mmenu opened
    // wee need stop parallax
    const openedElements = ["elements.mmenu.open", "elements.popup.open"];
    openedElements.forEach((id) => {
      window.Brz.on(id, (element: HTMLElement) => {
        if (id === "elements.popup.open") {
          // need to check scroll behance
          const { brzScroll_page = "false" } = element.dataset;
          const isScrolled = brzScroll_page === "true";

          if (isScrolled) {
            return;
          }

          pauseAll(true);
        } else {
          pauseAll(true);
        }
      });
    });

    // start parallaxes
    const closedElements = ["elements.mmenu.close", "elements.popup.close"];
    closedElements.forEach((id) => {
      window.Brz.on(id, (element: HTMLElement) => {
        if (id === "elements.popup.close") {
          // need to check scroll behance
          const { brzScroll_page = "false" } = element.dataset;
          const isScrolled = brzScroll_page === "true";

          if (isScrolled) {
            return;
          }

          pauseAll(false);
        } else {
          pauseAll(false);
        }
      });
    });
  }

  for (const video of root.querySelectorAll<HTMLElement>(".brz-bg-video")) {
    const settings = readVideoSettings(video);

    initBackgroundVideo(video, settings);

    window.addEventListener(
      "resize",
      debounce(() => {
        resizeBackgroundVideo(video);
      }, 100)
    );

    window.Brz.on("elements.lottie.loaded", (node: HTMLElement) => {
      const parent = video.parentElement?.parentElement?.parentElement;

      if (parent?.contains(node)) {
        resizeBackgroundVideo(video);
      }
    });

    window.Brz.on("elements.story.init", (element: HTMLElement) => {
      if (element.contains(video)) {
        typeChangeBackgroundVideo(video, settings);
      }
    });

    window.Brz.on(
      "elements.slick.ready",
      ({ slick, wrapper }: { slick: HTMLElement; wrapper?: HTMLElement }) => {
        resizeBackgroundVideo(video);

        const isSectionSlick = !!slick.querySelector(".brz-section__content");

        if (slick.contains(video) && !isSectionSlick) {
          reinitBackgroundVideo(video, settings);
        }

        // Pause background videos inside the current slick slider, excluding the active slide
        if (
          isSectionSlick &&
          !slick.contains(video) &&
          wrapper?.contains(video)
        ) {
          pauseBackgroundVideo(video);
        }
      }
    );

    window.Brz.on(
      "elements.section.slide.change",
      ({ node, slick }: { node: HTMLElement; slick: HTMLElement }) => {
        if (!node.contains(video)) {
          return;
        }

        if (slick.contains(video)) {
          playBackgroundVideo(video);
        } else {
          pauseBackgroundVideo(video);
        }
      }
    );
  }

  // slideshow
  const { Swiper, EffectFade, Autoplay } = getFreeLibs();

  if (Swiper && EffectFade && Autoplay) {
    root
      .querySelectorAll<HTMLDivElement>(".brz-bg-slideshow")
      .forEach((item) => {
        const totalItems =
          readNumber(item.getAttribute(makeAttr("total-items"))) ?? 1;

        if (totalItems > 1) {
          Swiper.use([EffectFade, Autoplay]);

          const loop = item.getAttribute(makeAttr("loop")) ?? "on";
          const duration =
            readNumber(item.getAttribute(makeAttr("duration"))) ?? 1;
          const transition =
            readNumber(item.getAttribute(makeAttr("transition"))) ?? 1;
          const transitionType =
            readTransition(item.getAttribute(makeAttr("transition-type"))) ??
            Transition.Fade;

          const isFade = transitionType === Transition.Fade;
          const isLoopEnabled = loop === "on";

          const fadeOptions = isFade
            ? {
                fadeEffect: {
                  crossFade: true
                }
              }
            : {};

          const swiper = new Swiper(item, {
            slidesPerView: 1,
            loop: isLoopEnabled,
            autoplay: {
              delay: duration * 1000,
              stopOnLastSlide: !isLoopEnabled
            },
            speed: transition * 1000,
            direction: getSlideType(transitionType),
            effect: isFade ? Effect.Fade : Effect.Slide,
            allowTouchMove: false,
            ...fadeOptions
          });

          swiper.on("resize", handleSwiperResize);
        }
      });
  }
};

export default fn;
