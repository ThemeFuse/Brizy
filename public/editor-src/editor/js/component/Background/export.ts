import $ from "jquery";
import { getFreeLibs } from "visual/libs";
import { ExportFunction } from "visual/types";
import { getCurrentDevice } from "visual/utils/export";
import { makeAttr } from "visual/utils/i18n/attribute";
import { read as readNumber } from "visual/utils/reader/number";
import "./lib/jquery.background-video";
import "./lib/jquery.parallax";
import { Effect, Transition } from "./type";
import { getSlideType, handleSwiperResize, readTransition } from "./utils";

const fn: ExportFunction = ($node) => {
  const $parallax = $node.find(".brz-bg-image-parallax");

  if ($parallax.length > 0) {
    const $parallaxContainers = $parallax.closest(".brz-bg");
    const initialDeviceMode = getCurrentDevice();

    if (initialDeviceMode === "desktop") {
      $parallaxContainers.parallax({
        bgClass: "brz-bg-image-parallax"
      });
    }

    $(window).on("resize", function () {
      const device = getCurrentDevice();

      if (device === "desktop") {
        $parallaxContainers.parallax({
          bgClass: "brz-bg-image-parallax"
        });
      } else {
        $parallaxContainers.parallax("destroy");
      }
    });

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

          $parallaxContainers.parallax("paused", true);
        } else {
          $parallaxContainers.parallax("paused", true);
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

          $parallaxContainers.parallax("paused", false);
        } else {
          $parallaxContainers.parallax("paused", false);
        }
      });
    });
  }

  $node.find(".brz-bg-video").each(function () {
    const $this = $(this);
    const { type, loop, start } = $this.data();

    $this.backgroundVideo({ type, loop, start });

    window.Brz.on("elements.lottie.loaded", (node: HTMLElement) => {
      const parent = $this.get(0)?.parentElement?.parentElement?.parentElement;

      if (parent && parent.contains(node)) {
        $this.backgroundVideo("resize");
      }
    });

    window.Brz.on("elements.story.init", (element: HTMLElement) => {
      const node = $this.get(0);
      if (node && element.contains(node)) {
        $this.backgroundVideo("typeChange", { type, loop, start });
      }
    });

    window.Brz.on("elements.slick.ready", (slick: HTMLElement) => {
      const video = $this.get(0);

      if (video) {
        $this.backgroundVideo("resize");

        if (slick.contains(video)) {
          $this.backgroundVideo("reinit", {
            type,
            loop,
            start
          });
        }
      }
    });
  });

  // slideshow
  const { Swiper, EffectFade, Autoplay } = getFreeLibs();

  const node = $node.get(0);

  if (Swiper && EffectFade && Autoplay && node) {
    node
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
