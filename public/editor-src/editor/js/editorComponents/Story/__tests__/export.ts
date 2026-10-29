// The Story slider on a published page (centre mode, variable width, autoplay).

import { trackClickListeners } from "../../../../../jest-utils/exportRuntime";
import {
  click,
  endPage,
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
  type StoryOptions,
  story
} from "../../../../../jest-utils/sliderFixtures";

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

const SPEED = 300;
const AUTOPLAY_SPEED = 5000;

const STORY: StoryOptions = {
  loop: true,
  autoPlay: false,
  slides: 4,
  counterSlide: 0,
  linkSlide: 1
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

const sliderOf = (root: ParentNode): HTMLElement =>
  required<HTMLElement>(root, ".brz-slick-slider__story");

const ownSlides = (slider: HTMLElement): HTMLElement[] => [
  ...slider.querySelectorAll<HTMLElement>(
    ":scope > .slick-list > .slick-track > .slick-slide"
  )
];

const current = (slider: HTMLElement): string | null =>
  ownSlides(slider)
    .find((slide) => slide.classList.contains("slick-current"))
    ?.getAttribute("data-slick-index") ?? null;

const slideAt = (slider: HTMLElement, index: number): HTMLElement =>
  required<HTMLElement>(
    slider,
    `:scope > .slick-list > .slick-track > .slick-slide[data-slick-index="${index}"]`
  );

const trackOf = (slider: HTMLElement): HTMLElement =>
  required<HTMLElement>(slider, ":scope > .slick-list > .slick-track");

const indexOf = (node: unknown): string | null =>
  node instanceof HTMLElement ? node.getAttribute("data-slick-index") : null;

describe("building the story", () => {
  it.each([
    { case: "looping", options: STORY },
    { case: "non-looping", options: { ...STORY, loop: false } }
  ])("renders the $case story as before", async ({ options }) => {
    const root = await mountPage(story(options));

    expect(markupOf(sliderOf(root))).toMatchSnapshot();
  });

  it("gives the slides and dots ids built from one slider number", async () => {
    const root = await mountPage(story(STORY));
    const slider = sliderOf(root);
    const first = slideAt(slider, 0).id;
    const uid = /^slick-slide(\d+)0$/.exec(first)?.[1];

    expect(uid).toBeDefined();
    expect([0, 1, 2, 3].map((i) => slideAt(slider, i).id)).toEqual(
      [0, 1, 2, 3].map((i) => `slick-slide${uid}${i}`)
    );
    expect(
      [
        ...slider.querySelectorAll(":scope > .brz-slick-slider__dots button")
      ].map((button) => [button.id, button.getAttribute("aria-controls")])
    ).toEqual(
      [0, 1, 2, 3].map((i) => [
        `slick-slide-control${uid}${i}`,
        `slick-slide${uid}${i}`
      ])
    );
  });

  it("announces the story once it is built", async () => {
    const emits = recordEmits(/^elements\.story/);
    const root = await mountPage(story(STORY));

    expect(emits).toEqual([
      { name: "elements.story.init", args: [sliderOf(root)] }
    ]);
  });
});

describe("moving between slides", () => {
  it.each([
    {
      case: "the next arrow",
      act: (slider: HTMLElement) =>
        click(required(slider, ":scope > .brz-slick-slider__arrow-next")),
      current: "1"
    },
    {
      case: "the previous arrow",
      act: (slider: HTMLElement) =>
        click(required(slider, ":scope > .brz-slick-slider__arrow-prev")),
      current: "3"
    },
    {
      case: "the right half of the current slide",
      act: (slider: HTMLElement) =>
        click(
          required(slider, ".slick-current .brz-slick-slider__inner-arrow-next")
        ),
      current: "1"
    },
    {
      case: "the left half of the current slide",
      act: (slider: HTMLElement) =>
        click(
          required(slider, ".slick-current .brz-slick-slider__inner-arrow-prev")
        ),
      current: "3"
    },
    {
      case: "the third dot",
      act: (slider: HTMLElement) =>
        click(
          required(
            slider,
            ":scope > .brz-slick-slider__dots > li:nth-child(3) > button"
          )
        ),
      current: "2"
    },
    {
      case: "a button linking to slide 3",
      act: (slider: HTMLElement) =>
        click(required(slider, ".slick-current [data-brz-link-story]")),
      current: "2"
    },
    {
      case: "a click on the next slide (focus on select)",
      act: (slider: HTMLElement) => click(slideAt(slider, 1)),
      current: "1"
    },
    {
      case: "ArrowRight inside the slider",
      act: (slider: HTMLElement) =>
        pressKey(required(slider, ":scope > .slick-list"), "ArrowRight"),
      current: "1"
    },
    {
      case: "ArrowLeft inside the slider",
      act: (slider: HTMLElement) =>
        pressKey(required(slider, ":scope > .slick-list"), "ArrowLeft"),
      current: "3"
    }
  ])("follows $case", async ({ act, current: expected }) => {
    const root = await mountPage(story(STORY));
    const slider = sliderOf(root);
    const emits = recordEmits(/^elements\.story/);

    act(slider);
    jest.advanceTimersByTime(SPEED + 100);

    expect(current(slider)).toBe(expected);
    // The slide being left is announced before the move.
    expect(emits.map(({ name, args }) => [name, indexOf(args[0])])).toEqual([
      ["elements.story.slide.changed", "0"]
    ]);
    expect(trackOf(slider).getAttribute("style")).toMatchSnapshot();
  });
});

describe("autoplay", () => {
  it("runs through a looping story", async () => {
    const root = await mountPage(story({ ...STORY, autoPlay: true }));
    const slider = sliderOf(root);
    const seen: (string | null)[] = [];

    for (let step = 0; step < 5; step++) {
      jest.advanceTimersByTime(AUTOPLAY_SPEED + SPEED);
      seen.push(current(slider));
    }

    expect(seen).toMatchSnapshot();
  });

  it("stops on the last slide of a non-looping story and shows the replay arrow", async () => {
    const root = await mountPage(
      story({ ...STORY, loop: false, autoPlay: true })
    );
    const slider = sliderOf(root);
    const seen: (string | null)[] = [];

    for (let step = 0; step < 6; step++) {
      jest.advanceTimersByTime(AUTOPLAY_SPEED + SPEED);
      seen.push(current(slider));
    }

    expect(seen).toMatchSnapshot();
    expect(
      [...slider.querySelectorAll(":scope > .brz-slick-slider__arrow")].map(
        (arrow) => [arrow.className, arrow.getAttribute("aria-disabled")]
      )
    ).toMatchSnapshot();
  });

  it("goes back to the first slide from the replay arrow", async () => {
    const root = await mountPage(story({ ...STORY, loop: false }));
    const slider = sliderOf(root);

    click(
      required(
        slider,
        ":scope > .brz-slick-slider__dots > li:nth-child(4) > button"
      )
    );
    jest.advanceTimersByTime(SPEED + 100);
    click(required(slider, ":scope > .brz-slick-slider__arrow-replay"));
    jest.advanceTimersByTime(SPEED + 100);

    expect(current(slider)).toBe("0");
  });
});

describe("clicks and the page around the story", () => {
  it.each([
    {
      case: "the right half of the current slide",
      arrow: ".slick-current .brz-slick-slider__inner-arrow-next",
      current: "1"
    },
    {
      case: "the left half of the current slide",
      arrow: ".slick-current .brz-slick-slider__inner-arrow-prev",
      current: "3"
    }
  ])(
    "keeps a click on $case to the story",
    async ({ arrow, current: expected }) => {
      const root = await mountPage(story(STORY));
      const slider = sliderOf(root);
      const reached: string[] = [];
      const onDocument = (): number => reached.push("document");
      root.addEventListener("click", () => reached.push("root"));
      document.addEventListener("click", onDocument);
      const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true
      });

      required(slider, arrow).dispatchEvent(event);
      document.removeEventListener("click", onDocument);
      jest.advanceTimersByTime(SPEED + 100);

      expect({
        current: current(slider),
        prevented: event.defaultPrevented,
        reached
      }).toEqual({ current: expected, prevented: true, reached: [] });
    }
  );

  it("follows the replay arrow when the page around the story stops the click", async () => {
    const root = await mountPage(story({ ...STORY, loop: false }));
    const slider = sliderOf(root);

    click(
      required(
        slider,
        ":scope > .brz-slick-slider__dots > li:nth-child(4) > button"
      )
    );
    jest.advanceTimersByTime(SPEED + 100);
    root.addEventListener("click", (event) => event.stopPropagation());
    click(required(slider, ":scope > .brz-slick-slider__arrow-replay"));
    jest.advanceTimersByTime(SPEED + 100);

    expect(current(slider)).toBe("0");
  });
});

describe("the click listeners of the story", () => {
  it("are one on body for the halves of its slides", async () => {
    const listeners = trackClickListeners();
    const root = await mountPage(story(STORY));
    const targets = listeners.targets();
    listeners.restore();
    const nodes = Array.from(
      root.querySelectorAll(
        ".brz-slick-slider__inner-arrow-next, .brz-slick-slider__inner-arrow-prev"
      )
    );

    expect({
      nodes: nodes.length > 0,
      onNodes: targets.filter((target) => nodes.some((node) => node === target))
        .length,
      onBody: targets.filter((target) => target === document.body).length
    }).toEqual({ nodes: true, onNodes: 0, onBody: 1 });
  });
});

describe("small screens", () => {
  it("stretches the slides to the viewport height when built on a phone", async () => {
    setLayout(MOBILE);
    const root = await mountPage(story(STORY));

    expect(
      ownSlides(sliderOf(root)).map((slide) => slide.getAttribute("style"))
    ).toMatchSnapshot();
  });

  it("stretches the slides when the viewport crosses the mobile breakpoint", async () => {
    const root = await mountPage(story(STORY));
    const slider = sliderOf(root);

    setLayout(MOBILE);
    resizeViewport(MOBILE.viewportWidth, MOBILE.viewportHeight);
    jest.advanceTimersByTime(1000);

    expect(markupOf(slider)).toMatchSnapshot();
  });

  it("blocks the page's own touch scrolling", async () => {
    // Earlier stories' listeners are still on `window`; catch this one as it registers.
    const added = jest.spyOn(window, "addEventListener");

    await mountPage(story(STORY));

    const call = added.mock.calls.find(([type]) => type === "touchmove");

    added.mockRestore();

    expect(call?.[2]).toEqual({ passive: false });

    const touch = new Event("touchmove", { cancelable: true });
    const listener = call?.[1];

    if (typeof listener === "function") {
      listener(touch);
    }

    expect(touch.defaultPrevented).toBe(true);
  });
});
