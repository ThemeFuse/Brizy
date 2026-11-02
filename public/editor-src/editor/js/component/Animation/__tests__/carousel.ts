// Entrance animations inside a Carousel: clones are animated too.

import {
  endPage,
  intersect,
  loadSliderRuntime,
  mountPage,
  observerCount,
  required,
  setLayout
} from "../../../../../jest-utils/sliderEnv";
import { carousel } from "../../../../../jest-utils/sliderFixtures";

beforeAll(async () => {
  // The page's Animation lib next to the slider group.
  const animation: object = jest.requireActual("visual/libs/animation");

  await loadSliderRuntime(animation);
});

beforeEach(() => {
  setLayout({
    viewportWidth: 1280,
    viewportHeight: 800,
    boxWidth: 1000,
    boxHeight: 400
  });
  jest.useFakeTimers();
});

afterEach(() => {
  endPage();
});

/** The compiled carousel with an entrance animation on the content of every item. */
function animatedCarousel(): string {
  const template = document.createElement("template");

  template.innerHTML = carousel({}, { pausePlay: false, customDot: false });
  template.content
    .querySelectorAll(".brz-carousel__item")
    .forEach((item, index) => {
      item.insertAdjacentHTML(
        "afterbegin",
        `<div class="brz-animated brz-animate-fadeIn" data-animationid="item-${index}"><p>Item ${index}</p></div>`
      );
    });

  return template.innerHTML;
}

const animatedIn = (root: ParentNode, selector: string): HTMLElement[] => [
  ...root.querySelectorAll<HTMLElement>(`${selector} .brz-animated`)
];

describe("entrance animations in a carousel", () => {
  it("watches the animations of the original and the cloned slides", async () => {
    const root = await mountPage(animatedCarousel());
    const slider = required<HTMLElement>(root, ".brz-carousel__slider");

    expect(slider.classList.contains("slick-initialized")).toBe(true);
    expect({
      original: animatedIn(root, ".slick-slide:not(.slick-cloned)").map(
        observerCount
      ),
      cloned: animatedIn(root, ".slick-slide.slick-cloned").map(observerCount)
    }).toMatchSnapshot();
  });

  it("plays the animation of a cloned slide once it comes into view", async () => {
    const root = await mountPage(animatedCarousel());
    const [clone] = animatedIn(root, ".slick-slide.slick-cloned");

    if (!clone) {
      throw new Error("the carousel has no cloned animated slide");
    }

    intersect(clone, true);

    expect(clone.classList.contains("brz-animate")).toBe(true);
  });
});
