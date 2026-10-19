// The Ministry Brands group slider export on the markup the service renders.

import {
  click,
  endPage,
  loadSliderRuntime,
  markupOf,
  pressKey,
  required,
  resizeViewport,
  setLayout
} from "../../../../../../jest-utils/sliderEnv";
import {
  type GroupSliderOptions,
  groupSlider
} from "../../../../../../jest-utils/sliderFixtures";

const DESKTOP = {
  viewportWidth: 1280,
  viewportHeight: 800,
  boxWidth: 1200,
  boxHeight: 400
};

const SPEED = 500;

const FULL: GroupSliderOptions = {
  show: "3",
  pagination: true,
  showArrows: true,
  slides: 5
};

beforeAll(async () => {
  await loadSliderRuntime({});
});

beforeEach(() => {
  setLayout(DESKTOP);
  jest.useFakeTimers();
});

afterEach(() => {
  endPage();
});

async function mount(options: GroupSliderOptions): Promise<HTMLElement> {
  const root = document.createElement("div");

  root.innerHTML = groupSlider(options);
  document.body.append(root);

  const { default: run } = await import("../export");

  run(root);

  return root;
}

const sliderOf = (root: ParentNode): HTMLElement =>
  required<HTMLElement>(root, ".brz-groupSlider-swiper-wrapper");

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

describe("building the group slider", () => {
  it.each([
    { case: "with arrows and dots", options: FULL },
    {
      case: "without arrows and dots",
      options: { ...FULL, pagination: false, showArrows: false }
    }
  ])("renders the slider $case as before", async ({ options }) => {
    const root = await mount(options);

    expect(markupOf(root)).toMatchSnapshot();
  });

  it("uses the arrows already in the markup", async () => {
    const root = await mount(FULL);

    expect(
      [
        required(root, ".brz-swiper-arrow_prev"),
        required(root, ".brz-swiper-arrow_next")
      ].map((arrow) => arrow.className)
    ).toEqual([
      "brz-swiper-arrow brz-swiper-arrow_prev slick-arrow",
      "brz-swiper-arrow brz-swiper-arrow_next slick-arrow"
    ]);
  });
});

describe("moving between slides", () => {
  it.each([
    {
      case: "the next arrow",
      act: (root: HTMLElement) =>
        click(required(root, ".brz-swiper-arrow_next")),
      current: "1"
    },
    {
      case: "the previous arrow",
      act: (root: HTMLElement) =>
        click(required(root, ".brz-swiper-arrow_prev")),
      current: "4"
    },
    {
      case: "the third dot",
      act: (root: HTMLElement) =>
        click(
          required(root, ".brz-slick-slider__dots > li:nth-child(3) > button")
        ),
      current: "2"
    },
    {
      case: "ArrowRight inside the slider",
      act: (root: HTMLElement) =>
        pressKey(
          required(sliderOf(root), ":scope > .slick-list"),
          "ArrowRight"
        ),
      current: "1"
    },
    {
      case: "ArrowLeft inside the slider",
      act: (root: HTMLElement) =>
        pressKey(required(sliderOf(root), ":scope > .slick-list"), "ArrowLeft"),
      current: "4"
    }
  ])("follows $case", async ({ act, current: expected }) => {
    const root = await mount(FULL);
    const slider = sliderOf(root);
    const during: (string | null)[] = [];

    act(root);
    during.push(trackOf(slider).getAttribute("style"));
    jest.advanceTimersByTime(SPEED + 100);

    expect(current(slider)).toBe(expected);
    expect({
      during,
      after: trackOf(slider).getAttribute("style")
    }).toMatchSnapshot();
  });
});

describe("responsive layout", () => {
  it.each([
    { case: "tablet", width: 900 },
    { case: "mobile", width: 700 }
  ])("shows one group per view on $case", async ({ width }) => {
    const root = await mount(FULL);
    const slider = sliderOf(root);

    setLayout({
      viewportWidth: width,
      viewportHeight: 800,
      boxWidth: width,
      boxHeight: 400
    });
    resizeViewport(width, 800);
    jest.advanceTimersByTime(1000);

    expect(markupOf(slider)).toMatchSnapshot();
  });
});
