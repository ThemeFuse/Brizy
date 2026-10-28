// The Carousel slider on a published page (four items, 3 / 2 / 1 per view).

import { handleLightBoxZoom, openLightbox } from "visual/libs/lightbox";
import {
  click,
  dragX,
  endPage,
  intersect,
  isObserved,
  loadSliderRuntime,
  markupOf,
  mountPage,
  pressKey,
  recordEmits,
  required,
  resizeViewport,
  setLayout
} from "../../../../../jest-utils/sliderEnv";
import {
  type CarouselControls,
  carousel
} from "../../../../../jest-utils/sliderFixtures";

const DESKTOP = {
  viewportWidth: 1280,
  viewportHeight: 800,
  boxWidth: 1000,
  boxHeight: 400
};

const PLAIN = { pausePlay: false, customDot: false };
const SPEED = 350;
const AUTOPLAY_SPEED = 3000;

beforeAll(async () => {
  await loadSliderRuntime({ openLightbox, handleLightBoxZoom });
});

beforeEach(() => {
  setLayout(DESKTOP);
  jest.useFakeTimers();
});

afterEach(() => {
  endPage();
});

const sliderOf = (root: ParentNode): HTMLElement =>
  required<HTMLElement>(root, ".brz-carousel__slider");

const ownSlides = (slider: HTMLElement): HTMLElement[] => [
  ...slider.querySelectorAll<HTMLElement>(
    ":scope > .slick-list > .slick-track > .slick-slide"
  )
];

const current = (slider: HTMLElement): string | null =>
  ownSlides(slider)
    .find((slide) => slide.classList.contains("slick-current"))
    ?.getAttribute("data-slick-index") ?? null;

const trackOf = (slider: HTMLElement): HTMLElement =>
  required<HTMLElement>(slider, ":scope > .slick-list > .slick-track");

const activeSlides = (slider: HTMLElement): (string | null)[] =>
  ownSlides(slider)
    .filter((slide) => slide.classList.contains("slick-active"))
    .map((slide) => slide.getAttribute("data-slick-index"));

const dotStates = (slider: HTMLElement): (string | null)[] =>
  [
    ...slider.querySelectorAll(
      ":scope > .brz-slick-slider__dots > li:not(.brz-slick-slider__pause) > button"
    )
  ].map((button) => button.getAttribute("aria-current"));

const next = (slider: HTMLElement): void =>
  click(required(slider, ":scope > .brz-slick-slider__arrow-next"));

interface BuildCase {
  case: string;
  attributes: Record<string, string>;
  controls: CarouselControls;
}

describe("building the carousel", () => {
  it.each<BuildCase>([
    { case: "plain", attributes: {}, controls: PLAIN },
    { case: "fade", attributes: { "data-fade": "true" }, controls: PLAIN },
    {
      case: "no swipe",
      attributes: { "data-swipe": "false" },
      controls: PLAIN
    },
    {
      case: "custom dots and pause control",
      attributes: { "data-auto-play": "true" },
      controls: { pausePlay: true, customDot: true }
    }
  ])(
    "renders the $case carousel as before",
    async ({ attributes, controls }) => {
      const root = await mountPage(carousel(attributes, controls));

      expect(markupOf(sliderOf(root))).toMatchSnapshot();
    }
  );

  it("links the region, the slides and the dots through one instance number", async () => {
    const root = await mountPage(carousel({}, PLAIN));
    const slider = sliderOf(root);
    const instance = /^brz-carousel-(\d+)$/.exec(slider.id)?.[1];

    expect(instance).toBeDefined();

    const slideIds = ownSlides(slider)
      .filter((slide) => !slide.classList.contains("slick-cloned"))
      .map((slide) => slide.id);
    const controls = [
      ...slider.querySelectorAll(":scope > .brz-slick-slider__dots button")
    ].map((button) => button.getAttribute("aria-controls"));
    const arrows = [
      ...slider.querySelectorAll(":scope > .brz-slick-slider__arrow")
    ].map((arrow) => arrow.getAttribute("aria-controls"));

    expect(slideIds).toEqual(
      [0, 1, 2, 3].map((i) => `brz-carousel-slide-${instance}-${i}`)
    );
    expect(controls).toEqual(slideIds.slice(0, controls.length));
    expect(arrows).toEqual([
      `brz-carousel-${instance}`,
      `brz-carousel-${instance}`
    ]);
  });

  it("announces the carousel once it is built", async () => {
    const emits = recordEmits(/^elements\.(slick|carousel)/);
    const root = await mountPage(carousel({}, PLAIN));
    const slider = sliderOf(root);

    expect(emits.map(({ name }) => name)).toEqual([
      "elements.carousel.ready",
      "elements.slick.ready"
    ]);
    // The carousel is announced with the element itself.
    expect(emits[0]?.args).toEqual([slider]);
    expect(emits[1]?.args).toEqual([{ slick: slider }]);
  });
});

describe("moving between slides", () => {
  it.each([
    {
      case: "the next arrow",
      act: next,
      current: "1",
      active: ["1", "2", "3"]
    },
    {
      case: "the previous arrow",
      act: (slider: HTMLElement) =>
        click(required(slider, ":scope > .brz-slick-slider__arrow-prev")),
      current: "3",
      active: ["3", "4", "5"]
    },
    {
      case: "the second dot",
      act: (slider: HTMLElement) =>
        click(
          required(
            slider,
            ":scope > .brz-slick-slider__dots > li:nth-child(2) > button"
          )
        ),
      current: "1",
      active: ["1", "2", "3"]
    },
    {
      case: "ArrowRight on the next arrow",
      act: (slider: HTMLElement) =>
        pressKey(
          required(slider, ":scope > .brz-slick-slider__arrow-next"),
          "ArrowRight"
        ),
      current: "1",
      active: ["1", "2", "3"]
    },
    {
      case: "ArrowLeft on the previous arrow",
      act: (slider: HTMLElement) =>
        pressKey(
          required(slider, ":scope > .brz-slick-slider__arrow-prev"),
          "ArrowLeft"
        ),
      current: "3",
      active: ["3", "4", "5"]
    },
    {
      case: "a long drag to the left",
      act: (slider: HTMLElement) =>
        dragX(required(slider, ":scope > .slick-list"), -300),
      current: "1",
      active: ["1", "2", "3"]
    },
    {
      case: "a short drag",
      act: (slider: HTMLElement) =>
        dragX(required(slider, ":scope > .slick-list"), -100),
      current: "0",
      active: ["0", "1", "2"]
    }
  ])("follows $case", async ({ act, current: expected, active }) => {
    const root = await mountPage(carousel({}, PLAIN));
    const slider = sliderOf(root);

    act(slider);
    jest.advanceTimersByTime(SPEED + 100);

    expect(current(slider)).toBe(expected);
    expect(activeSlides(slider)).toEqual(active);
    expect({
      track: trackOf(slider).getAttribute("style"),
      dots: dotStates(slider)
    }).toMatchSnapshot();
  });

  it("ignores a drag when swiping is off", async () => {
    const root = await mountPage(carousel({ "data-swipe": "false" }, PLAIN));
    const slider = sliderOf(root);

    dragX(required(slider, ":scope > .slick-list"), -300);
    jest.advanceTimersByTime(SPEED + 100);

    expect(current(slider)).toBe("0");
  });

  it("renders the fade carousel after a move as before", async () => {
    const root = await mountPage(carousel({ "data-fade": "true" }, PLAIN));
    const slider = sliderOf(root);

    next(slider);
    jest.advanceTimersByTime(SPEED + 100);

    expect(markupOf(slider)).toMatchSnapshot();
  });
});

describe("responsive layout", () => {
  it.each([
    { case: "tablet", width: 900, box: 900 },
    { case: "mobile", width: 700, box: 700 }
  ])("switches to the $case layout on resize", async ({ width, box }) => {
    const root = await mountPage(carousel({}, PLAIN));
    const slider = sliderOf(root);

    setLayout({
      viewportWidth: width,
      viewportHeight: 800,
      boxWidth: box,
      boxHeight: 400
    });
    resizeViewport(width, 800);
    jest.advanceTimersByTime(1000);

    expect(markupOf(slider)).toMatchSnapshot();
  });

  it.each([
    { event: "elements.tabs.changed" },
    { event: "elements.accordion.changed" },
    { event: "elements.switcher.changed" },
    { event: "elements.mmenu.panel.opened" }
  ])(
    "lays itself out again on $event from a container holding it",
    async ({ event }) => {
      const root = await mountPage(carousel({}, PLAIN));
      const slider = sliderOf(root);
      const before = trackOf(slider).getAttribute("style");

      setLayout({ ...DESKTOP, boxWidth: 600 });
      window.Brz.emit(event, document.createElement("div"));
      const afterForeign = trackOf(slider).getAttribute("style");
      window.Brz.emit(event, root);

      expect(afterForeign).toBe(before);
      expect({
        before,
        after: trackOf(slider).getAttribute("style"),
        slide: ownSlides(slider)[0]?.getAttribute("style")
      }).toMatchSnapshot();
    }
  );
});

describe("autoplay", () => {
  const withAutoplay = () =>
    carousel(
      { "data-auto-play": "true" },
      { pausePlay: true, customDot: false }
    );
  const pause = (slider: HTMLElement) =>
    click(required(slider, ".brz-slick-slider__pause-button"));

  it.each([
    {
      case: "does not run before the carousel is in view",
      act: (_slider: HTMLElement) => undefined,
      current: "0",
      paused: "false"
    },
    {
      case: "runs once the carousel is in view",
      act: (slider: HTMLElement) => intersect(slider, true),
      current: "1",
      paused: "false"
    },
    {
      case: "stops once the carousel leaves the view",
      act: (slider: HTMLElement) => {
        intersect(slider, true);
        intersect(slider, false);
      },
      current: "0",
      paused: "false"
    },
    {
      case: "stays paused in view after the pause button",
      act: (slider: HTMLElement) => {
        pause(slider);
        intersect(slider, true);
      },
      current: "0",
      paused: "true"
    },
    {
      case: "runs in view after pause then play",
      act: (slider: HTMLElement) => {
        pause(slider);
        pause(slider);
        intersect(slider, true);
      },
      current: "1",
      paused: "false"
    }
  ])("$case", async ({ act, current: expected, paused }) => {
    const root = await mountPage(withAutoplay());
    const slider = sliderOf(root);

    expect(isObserved(slider)).toBe(true);

    act(slider);
    jest.advanceTimersByTime(AUTOPLAY_SPEED + SPEED + 100);

    expect(current(slider)).toBe(expected);
    expect(slider.getAttribute("data-slider-paused")).toBe(paused);
  });

  it("is not watched when autoplay is off", async () => {
    const root = await mountPage(carousel({}, PLAIN));

    expect(isObserved(sliderOf(root))).toBe(false);
  });
});
