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
      $parallaxContainers.brzParallax({
        bgClass: "brz-bg-image-parallax"
      });
    }

    $(window).on("resize", function () {
      const device = getCurrentDevice();

      if (device === "desktop") {
        $parallaxContainers.brzParallax({
          bgClass: "brz-bg-image-parallax"
        });
      } else {
        $parallaxContainers.brzParallax("destroy");
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

          $parallaxContainers.brzParallax("paused", true);
        } else {
          $parallaxContainers.brzParallax("paused", true);
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

          $parallaxContainers.brzParallax("paused", false);
        } else {
          $parallaxContainers.brzParallax("paused", false);
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

    window.Brz.on(
      "elements.slick.ready",
      ({ slick, wrapper }: { slick: HTMLElement; wrapper?: HTMLElement }) => {
        const video = $this.get(0);

        if (video) {
          $this.backgroundVideo("resize");
          const isSectionSlick = !!slick.querySelector(".brz-section__content");

          if (slick.contains(video) && !isSectionSlick) {
            $this.backgroundVideo("reinit", {
              type,
              loop,
              start
            });
          }

          // Pause background videos inside the current slick slider, excluding the active slide
          if (
            isSectionSlick &&
            !slick.contains(video) &&
            wrapper?.contains(video)
          ) {
            $this.backgroundVideo("pause");
          }
        }
      }
    );

    window.Brz.on(
      "elements.section.slide.change",
      ({ node, slick }: { node: HTMLElement; slick: HTMLElement }) => {
        const video = $this.get(0);

        if (!video || !node.contains(video)) {
          return;
        }

        const method = video && slick.contains(video) ? "play" : "pause";
        $this.backgroundVideo(method);
      }
    );
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
