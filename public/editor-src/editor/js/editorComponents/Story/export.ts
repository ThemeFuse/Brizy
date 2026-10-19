import { getFreeLibs } from "visual/libs";
import type { SliderHandle } from "visual/libs/slider";
import { measure, setStyle } from "visual/libs/slider/dimensions";
import { onBodyClick } from "visual/utils/export/delegate";
import { sliderDataSchema } from "visual/utils/export/schemas";
import {
  DEFAULT_NEXT_ARROW,
  DEFAULT_PREV_ARROW,
  readBreakpoints,
  readDataAttributes
} from "visual/utils/export/slider";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import * as Num from "visual/utils/reader/number";

export default function (root: HTMLElement): void {
  const { createSlider } = getFreeLibs();
  const node = root;

  const isRtl = root.closest("[dir='rtl']") !== null;
  const makeArrow = (slider: Element) => {
    const icons = Array.from(slider.children).filter((child) =>
      child.matches(".brz-icon-svg")
    );

    if (!icons.length) return () => "";

    const clones = icons.flatMap((icon) => {
      const clone = icon.cloneNode(true);

      return clone instanceof Element ? [clone] : [];
    });

    clones.forEach((clone) => {
      clone.classList.remove("brz-hidden");
    });
    icons.forEach((icon) => {
      icon.remove();
    });

    return (className: string) =>
      className === "brz-slick-slider__arrow-next" && clones.length > 1
        ? `<div class="brz-slick-slider__arrow ${className}">${clones[0]?.outerHTML}</div>
           <div class="brz-slick-slider__arrow brz-slick-slider__arrow-replay">${clones[1]?.outerHTML}</div>`
        : `<div class="brz-slick-slider__arrow ${className}">${clones[0]?.outerHTML}</div>`;
  };
  const handleResize = (slider: HTMLElement) => {
    const { innerWidth, innerHeight } = window;

    if (innerWidth < 768) {
      const slides = Array.from(
        slider.querySelectorAll<HTMLElement>(".slick-slide")
      );
      const docHeight = innerHeight;
      const [first] = slides;
      const slideHeight = first
        ? measure(first, "height", "content")
        : undefined;

      if (docHeight !== slideHeight) {
        slides.forEach((slide) => {
          setStyle(slide, "height", docHeight);
        });
      }
    }
  };
  const handlePrevent = (e: Event) => {
    e.preventDefault();
  };

  const stories: { slider: HTMLElement; slideshow: SliderHandle }[] = [];
  // a story that left the page no longer answers
  const liveSlideshows = (): SliderHandle[] =>
    stories.flatMap(({ slider, slideshow }) =>
      slider.isConnected ? [slideshow] : []
    );

  root
    .querySelectorAll<HTMLElement>(".brz-slick-slider__story")
    .forEach((slider) => {
      const data = sliderDataSchema.parse(readDataAttributes(slider));
      const responsive = readBreakpoints(data.responsive);
      const getArrow = makeArrow(slider);
      // Without `data-arrows` the slider builds its own arrows.
      const arrow = (className: string, fallback: string) =>
        data.arrows === undefined
          ? fallback
          : data.arrows && getArrow(className);

      const slideshow = createSlider(slider, {
        centerMode: data.centerMode ?? false,
        centerPadding: data.centerPadding ?? "50px",
        variableWidth: data.variableWidth ?? false,
        focusOnSelect: data.focusOnSelect ?? false,
        touchThreshold: data.touchThreshold ?? 5,
        slidesToShow: data.slidesToShow ?? 1,
        infinite: data.sliderLoop ?? true,
        slidesToScroll: data.slidesToScroll ?? 1,
        lazyLoad: data.lazyLoad ?? "ondemand",
        swipe: data.swipe ?? true,
        speed: data.speed ?? 500,
        dots: data.dots ?? false,
        dotsClass: data.dotsClass ?? "slick-dots",
        customPaging: undefined,
        arrows: data.arrows ?? true,
        fade: data.fade ?? false,
        vertical: data.vertical ?? false,
        responsive,
        useTransform: false,
        draggable: data.swipe ?? true,
        nextArrow: arrow("brz-slick-slider__arrow-next", DEFAULT_NEXT_ARROW),
        prevArrow: arrow("brz-slick-slider__arrow-prev", DEFAULT_PREV_ARROW),
        autoplay: data.autoPlay ?? false,
        autoplaySpeed: data.autoPlaySpeed ?? 3000,
        rtl: isRtl,
        rows: 0,
        accessibility: true,
        pauseOnHover: true,
        pauseOnFocus: true
      });

      slideshow.on("init", () => {
        handleResize(slider);
        window.Brz.emit("elements.story.init", slider);
      });

      slideshow.mount();

      slideshow.on("breakpoint", () => {
        handleResize(slider);
      });

      node
        .querySelectorAll(makeDataAttrString({ name: "link-story" }))
        .forEach((item) => {
          const linkIndex =
            Num.read(item.getAttribute(makeAttr("link-story"))) ?? 1;

          item.addEventListener("click", (e) => {
            e.preventDefault();
            slideshow.goTo(linkIndex - 1);
          });
        });

      stories.push({ slider, slideshow });

      slideshow.on("beforeChange", ({ slides, currentSlide, nextSlide }) => {
        if (currentSlide !== nextSlide) {
          const currentSlideNode = slides[currentSlide];
          if (currentSlideNode) {
            window.Brz.emit("elements.story.slide.changed", currentSlideNode);
          }
        }
      });

      if (!data.sliderLoop) {
        slideshow.on("afterChange", ({ currentSlide }) => {
          if (
            currentSlide ===
            document.querySelectorAll(".brz-slick-slider__dots > li").length - 1
          ) {
            slideshow.pause();
          }
        });
      }

      // Disable Vertical touch move
      window.addEventListener("touchmove", handlePrevent, { passive: false });
    });

  onBodyClick([
    {
      selector: ".brz-slick-slider__arrow-replay",
      handler: () => {
        liveSlideshows().forEach((slideshow) => {
          slideshow.goTo(0);
        });
      }
    },
    {
      selector: ".brz-slick-slider__inner-arrow-next",
      handler: (_next, e) => {
        const slideshows = liveSlideshows();

        if (slideshows.length === 0) {
          return;
        }

        e.stopPropagation();
        e.preventDefault();
        slideshows.forEach((slideshow) => {
          slideshow.next();
        });
      }
    },
    {
      selector: ".brz-slick-slider__inner-arrow-prev",
      handler: (_prev, e) => {
        const slideshows = liveSlideshows();

        if (slideshows.length === 0) {
          return;
        }

        e.stopPropagation();
        e.preventDefault();
        slideshows.forEach((slideshow) => {
          slideshow.prev();
        });
      }
    }
  ]);
}
