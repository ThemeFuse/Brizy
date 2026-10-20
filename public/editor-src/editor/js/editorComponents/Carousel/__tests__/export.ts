import { handleLightBoxZoom, openLightbox } from "visual/libs/lightbox";
import { initFree, mountRoot } from "../../../../../jest-utils/exportRuntime";
import { loadSliderRuntime } from "../../../../../jest-utils/sliderEnv";

// The Carousel export on a published page: dots, play/pause and the lightbox.

// Four slides for three per view: the slider only builds dots when there is something to scroll.
const slideHtml = (index: number): string => `<div class="brz-carousel__item">
        <div class="brz-image__lightbox">
          <div class="brz-image">
            <a href="/slide-${index}.jpg" title="Slide ${index}"><img src="/slide-${index}.jpg" alt="Slide ${index}" /></a>
          </div>
        </div>
      </div>`;

function carouselHtml(): string {
  return `<div class="brz-carousel brz-carousel__items--horizontal">
    <div class="brz-carousel__slider"
      data-slides-to-show="3"
      data-slides-to-scroll="1"
      data-arrows="true"
      data-dots="true"
      data-dots-class="brz-slick-slider__dots brz-slick-slider__dots--dots"
      data-auto-play="false"
      data-auto-play-speed="3000"
      data-swipe="true"
      data-fade="false"
      data-transition-speed="0.5"
      data-responsive="%5B%5D">
      <svg class="brz-icon-svg brz-icon-svg--right button-play"></svg>
      <svg class="brz-icon-svg brz-icon-svg--right button-pause brz-hidden"></svg>
      ${[0, 1, 2, 3].map(slideHtml).join("")}
    </div>
  </div>`;
}

beforeAll(async () => {
  await loadSliderRuntime({ openLightbox, handleLightBoxZoom });
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("the Carousel on a published page", () => {
  it("builds the slider, then runs the block slick used to announce", async () => {
    const root = mountRoot(carouselHtml());

    await initFree([root]);

    expect(
      root.querySelectorAll(".brz-carousel__slider.slick-initialized")
    ).toHaveLength(1);

    // The play/pause item is added to the dots after the slider is built.
    const pauseItem = root.querySelector(
      ".brz-slick-slider__dots > .brz-slick-slider__pause"
    );

    expect(pauseItem).not.toBeNull();
    expect(window.Brz.emittedEvents["elements.carousel.ready"]).toBeDefined();
  });

  it("opens the lightbox on the image of a slide, with the zoom controls", async () => {
    const root = mountRoot(carouselHtml());

    await initFree([root]);

    root.querySelector<HTMLElement>(".brz-image__lightbox")?.click();

    // The image has two click handlers; the outcome must be one lightbox with zoom.
    expect(document.querySelectorAll(".brz-lb-wrap")).toHaveLength(1);
    expect(
      document.querySelector(".brz-lb-figure > .brz-lightbox-controls")
    ).not.toBeNull();
  });
});
