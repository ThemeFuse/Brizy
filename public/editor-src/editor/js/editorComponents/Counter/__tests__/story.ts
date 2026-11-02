// The Counter inside a Story: it counts when its slide becomes current.

import {
  click,
  endPage,
  loadSliderRuntime,
  mountPage,
  required,
  setLayout
} from "../../../../../jest-utils/sliderEnv";
import { story } from "../../../../../jest-utils/sliderFixtures";

const DURATION = 2000;
const SPEED = 300;

const DESKTOP = {
  viewportWidth: 1280,
  viewportHeight: 800,
  boxWidth: 1000,
  boxHeight: 400
};
const MOBILE = {
  viewportWidth: 390,
  viewportHeight: 844,
  boxWidth: 390,
  boxHeight: 700
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

const counterText = (root: ParentNode): (string | null)[] =>
  [
    ...root.querySelectorAll(
      ".brz-slick-slider__story > .slick-list > .slick-track > .slick-slide:not(.slick-cloned) .brz-counter-numbers"
    )
  ].map((numbers) => numbers.textContent);

const goToSlide = (root: ParentNode, slide: number): void =>
  click(
    required(
      root,
      `.brz-slick-slider__story > .brz-slick-slider__dots > li:nth-child(${slide}) > button`
    )
  );

describe("a Counter in a Story", () => {
  it.each([
    {
      case: "counts on the first slide once the story is built",
      layout: DESKTOP,
      counterSlide: 1,
      moveTo: 0,
      text: ["100"]
    },
    {
      case: "waits on a later slide while the story starts",
      layout: DESKTOP,
      counterSlide: 3,
      moveTo: 0,
      text: ["0"]
    },
    {
      case: "counts once its slide becomes current",
      layout: DESKTOP,
      counterSlide: 3,
      moveTo: 3,
      text: ["100"]
    },
    {
      case: "does not count when another slide becomes current",
      layout: DESKTOP,
      counterSlide: 3,
      moveTo: 2,
      text: ["0"]
    },
    {
      // Under a breakpoint the slider is built twice over; `init` still comes once.
      case: "counts on the first slide of a story built on a phone",
      layout: MOBILE,
      counterSlide: 1,
      moveTo: 0,
      text: ["100"]
    },
    {
      case: "waits on a later slide of a story built on a phone",
      layout: MOBILE,
      counterSlide: 3,
      moveTo: 0,
      text: ["0"]
    }
  ])("$case", async ({ layout, counterSlide, moveTo, text }) => {
    setLayout(layout);

    const root = await mountPage(
      story({
        loop: true,
        autoPlay: false,
        slides: 4,
        counterSlide,
        linkSlide: 0
      })
    );

    if (moveTo > 0) {
      goToSlide(root, moveTo);
      jest.advanceTimersByTime(SPEED);
    }
    jest.advanceTimersByTime(DURATION + 100);

    expect(counterText(root)).toEqual(text);
  });

  it("counts from start to end over its duration", async () => {
    const root = await mountPage(
      story({
        loop: true,
        autoPlay: false,
        slides: 4,
        counterSlide: 1,
        linkSlide: 0
      })
    );
    const seen: (string | null)[] = [];

    for (let elapsed = 0; elapsed < DURATION; elapsed += 500) {
      jest.advanceTimersByTime(500);
      seen.push(counterText(root)[0] ?? null);
    }

    expect(seen).toMatchSnapshot();
  });
});
