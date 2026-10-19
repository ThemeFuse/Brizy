// The Section slider on a published page.

import {
  click,
  dragX,
  endPage,
  hover,
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
  sectionNested,
  sectionPlain
} from "../../../../../jest-utils/sliderFixtures";

const DESKTOP = {
  viewportWidth: 1280,
  viewportHeight: 800,
  boxWidth: 1000,
  boxHeight: 400
};

const NO_AUTOPLAY = { "data-auto-play": "false" };
const SPEED = 500;
const AUTOPLAY_SPEED = 3000;

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
  required<HTMLElement>(root, ".brz-slick-slider__section");

const ownSlides = (slider: HTMLElement): HTMLElement[] => [
  ...slider.querySelectorAll<HTMLElement>(
    ":scope > .slick-list > .slick-track > .slick-slide"
  )
];

/** `data-slick-index` of the current slide (negative / beyond the count for clones). */
const current = (slider: HTMLElement): string | null =>
  ownSlides(slider)
    .find((slide) => slide.classList.contains("slick-current"))
    ?.getAttribute("data-slick-index") ?? null;

const trackOf = (slider: HTMLElement): HTMLElement =>
  required<HTMLElement>(slider, ":scope > .slick-list > .slick-track");

const dotStates = (slider: HTMLElement): (string | null)[] =>
  [
    ...slider.querySelectorAll(
      ":scope > .brz-slick-slider__dots > li:not(.brz-slick-slider__pause) > button"
    )
  ].map((button) => button.getAttribute("aria-current"));

const hiddenStates = (slider: HTMLElement): (string | null)[] =>
  ownSlides(slider)
    .filter((slide) => !slide.classList.contains("slick-cloned"))
    .map((slide) => slide.getAttribute("aria-hidden"));

/** A readable name for a node an event carries. */
const describeNode = (node: unknown): string => {
  if (!(node instanceof HTMLElement)) {
    return String(node);
  }
  if (node.classList.contains("brz-section")) {
    return "section";
  }
  if (node.classList.contains("slick-slide")) {
    const owner = node.closest(
      ".brz-slick-slider__section, .brz-carousel__slider"
    );
    const kind = owner?.classList.contains("brz-carousel__slider")
      ? "carousel-slide"
      : "section-slide";

    return `${kind}:${node.getAttribute("data-slick-index")}`;
  }
  if (node.classList.contains("brz-carousel__slider")) {
    return "carousel-slider";
  }
  return node.className;
};

const describeArgs = (args: unknown[]): unknown[] =>
  args.map((arg) =>
    arg instanceof HTMLElement
      ? describeNode(arg)
      : arg && typeof arg === "object"
        ? Object.fromEntries(
            Object.entries(arg).map(([key, value]) => [
              key,
              describeNode(value)
            ])
          )
        : arg
  );

describe("building the slider", () => {
  it.each([
    { case: "slide animation", attributes: NO_AUTOPLAY },
    {
      case: "fade animation",
      attributes: { ...NO_AUTOPLAY, "data-fade": "true" }
    },
    {
      case: "vertical animation",
      attributes: { ...NO_AUTOPLAY, "data-vertical": "true" }
    },
    {
      case: "no arrows and no dots",
      attributes: {
        ...NO_AUTOPLAY,
        "data-arrows": "false",
        "data-dots": "false"
      }
    }
  ])("renders the $case slider as before", async ({ attributes }) => {
    const root = await mountPage(sectionPlain(attributes));

    expect(markupOf(sliderOf(root))).toMatchSnapshot();
  });

  it("renders a slider inside a right-to-left page as before", async () => {
    const root = await mountPage(
      `<div dir="rtl">${sectionPlain(NO_AUTOPLAY)}</div>`
    );

    expect(markupOf(sliderOf(root))).toMatchSnapshot();
  });

  it("renders the nested carousels and their focusable elements as before", async () => {
    const root = await mountPage(sectionNested(NO_AUTOPLAY));

    expect(markupOf(sliderOf(root))).toMatchSnapshot();
  });

  it("initialises only the nested carousels of the original slides", async () => {
    const root = await mountPage(sectionNested(NO_AUTOPLAY));

    const states = [...root.querySelectorAll(".brz-carousel__slider")].map(
      (carousel) => ({
        inClone: !!carousel.closest(".slick-cloned"),
        initialized: carousel.classList.contains("slick-initialized")
      })
    );

    expect(states).toEqual([
      { inClone: true, initialized: false },
      { inClone: false, initialized: true },
      { inClone: false, initialized: true },
      { inClone: true, initialized: false },
      { inClone: true, initialized: false }
    ]);
  });
});

describe("the events it announces", () => {
  it.each([
    {
      case: "a plain slider",
      html: () => sectionPlain(NO_AUTOPLAY),
      events: [
        {
          name: "elements.slick.ready",
          args: [{ slick: "section-slide:0", wrapper: "section" }]
        }
      ]
    },
    {
      // A nested carousel's `init` bubbles up and announces the section again.
      case: "a slider with nested carousels",
      html: () => sectionNested(NO_AUTOPLAY),
      events: [
        {
          name: "elements.slick.ready",
          args: [{ slick: "section-slide:0", wrapper: "section" }]
        },
        {
          name: "elements.slick.ready",
          args: [{ slick: "carousel-slide:0", wrapper: "section" }]
        },
        {
          name: "elements.slick.ready",
          args: [{ slick: "carousel-slide:0", wrapper: "section" }]
        },
        { name: "elements.carousel.ready", args: ["carousel"] },
        { name: "elements.slick.ready", args: [{ slick: "carousel-slider" }] },
        { name: "elements.carousel.ready", args: ["carousel"] },
        { name: "elements.slick.ready", args: [{ slick: "carousel-slider" }] }
      ]
    }
  ])("announces $case once it is built", async ({ html, events }) => {
    const emits = recordEmits(/^elements\.(slick|carousel|section)/);

    await mountPage(html());

    // `elements.carousel.ready` carries the carousel itself.
    expect(
      emits.map(({ name, args }) =>
        name === "elements.carousel.ready"
          ? { name, args: ["carousel"] }
          : { name, args: describeArgs(args) }
      )
    ).toEqual(events);
  });

  it("announces the current slide of the section when a nested carousel moves", async () => {
    const root = await mountPage(sectionNested(NO_AUTOPLAY));
    const slider = sliderOf(root);
    const emits = recordEmits(/^elements\.section\.slide\.change$/);
    const nested = required<HTMLElement>(
      slider,
      ".slick-slide.slick-current .brz-carousel__slider"
    );

    click(required(nested, ".brz-slick-slider__arrow-next"));
    jest.advanceTimersByTime(4000);

    expect(current(slider)).toBe("0");
    expect(emits.map(({ args }) => describeArgs(args))).toEqual([
      [{ slick: "carousel-slide:1", node: "section" }]
    ]);
  });
});

describe("moving between slides", () => {
  const next = (slider: HTMLElement) =>
    click(required(slider, ":scope > .brz-slick-slider__arrow-next"));
  const prev = (slider: HTMLElement) =>
    click(required(slider, ":scope > .brz-slick-slider__arrow-prev"));

  it.each([
    {
      case: "the next arrow",
      act: next,
      current: "1",
      left: "-2000px",
      announced: "1"
    },
    {
      case: "the previous arrow",
      act: prev,
      current: "2",
      left: "-3000px",
      announced: "2"
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
      current: "2",
      left: "-3000px",
      announced: "2"
    },
    {
      case: "ArrowRight on the next arrow",
      act: (slider: HTMLElement) =>
        pressKey(
          required(slider, ":scope > .brz-slick-slider__arrow-next"),
          "ArrowRight"
        ),
      current: "1",
      left: "-2000px",
      announced: "1"
    },
    {
      case: "ArrowLeft on the previous arrow",
      act: (slider: HTMLElement) =>
        pressKey(
          required(slider, ":scope > .brz-slick-slider__arrow-prev"),
          "ArrowLeft"
        ),
      current: "2",
      left: "-3000px",
      announced: "2"
    },
    {
      case: "a long drag to the left",
      act: (slider: HTMLElement) =>
        dragX(required(slider, ":scope > .slick-list"), -300),
      current: "1",
      left: "-2000px",
      announced: "1"
    },
    {
      case: "a long drag to the right",
      act: (slider: HTMLElement) =>
        dragX(required(slider, ":scope > .slick-list"), 300),
      current: "2",
      left: "-3000px",
      announced: "2"
    },
    {
      case: "a short drag",
      act: (slider: HTMLElement) =>
        dragX(required(slider, ":scope > .slick-list"), -100),
      current: "0",
      left: "-1000px",
      // Settling back on the same slide is still reported as a change.
      announced: "0"
    }
  ])("follows $case", async ({ act, current: expected, left, announced }) => {
    const root = await mountPage(sectionPlain(NO_AUTOPLAY));
    const slider = sliderOf(root);
    const emits = recordEmits(/^elements\.section\.slide\.change$/);

    act(slider);
    jest.advanceTimersByTime(SPEED + 100);

    expect(current(slider)).toBe(expected);
    expect(trackOf(slider).style.left).toBe(left);
    expect(emits.map(({ args }) => describeArgs(args))).toEqual([
      [{ slick: `section-slide:${announced}`, node: "section" }]
    ]);

    const index = Number(expected);

    expect(dotStates(slider)).toEqual(
      [0, 1, 2].map((i) => (i === index ? "true" : null))
    );
    expect(hiddenStates(slider)).toEqual(
      [0, 1, 2].map((i) => (i === index ? "false" : "true"))
    );
  });

  it("moves the track frame by frame with slick's linear easing", async () => {
    const root = await mountPage(sectionPlain(NO_AUTOPLAY));
    const slider = sliderOf(root);
    const track = trackOf(slider);
    const positions: string[] = [];

    next(slider);
    for (let elapsed = 0; elapsed < SPEED; elapsed += 125) {
      jest.advanceTimersByTime(125);
      positions.push(track.style.left);
    }

    expect(positions).toMatchSnapshot();
  });

  it.each([
    { case: "fade", attributes: { ...NO_AUTOPLAY, "data-fade": "true" } },
    {
      case: "vertical",
      attributes: { ...NO_AUTOPLAY, "data-vertical": "true" }
    }
  ])(
    "renders the $case slider after a move as before",
    async ({ attributes }) => {
      const root = await mountPage(sectionPlain(attributes));
      const slider = sliderOf(root);

      next(slider);
      jest.advanceTimersByTime(SPEED + 100);

      expect(markupOf(slider)).toMatchSnapshot();
    }
  );

  it("moves a right-to-left slider as before", async () => {
    const root = await mountPage(
      `<div dir="rtl">${sectionPlain(NO_AUTOPLAY)}</div>`
    );
    const slider = sliderOf(root);

    next(slider);
    jest.advanceTimersByTime(SPEED + 100);

    expect({
      current: current(slider),
      left: trackOf(slider).style.left
    }).toMatchSnapshot();
  });
});

describe("autoplay", () => {
  it.each([
    {
      case: "runs on its own",
      act: (_slider: HTMLElement) => undefined,
      current: "1",
      paused: "false"
    },
    {
      case: "holds while the pointer is over the slider",
      act: (slider: HTMLElement) =>
        hover(required(slider, ":scope > .slick-list"), true),
      current: "0",
      paused: "false"
    },
    {
      case: "holds once the pause button is pressed",
      act: (slider: HTMLElement) =>
        click(required(slider, ".brz-slick-slider__pause-button")),
      current: "0",
      paused: "true"
    },
    {
      case: "resumes once play is pressed after pause",
      act: (slider: HTMLElement) => {
        click(required(slider, ".brz-slick-slider__pause-button"));
        click(required(slider, ".brz-slick-slider__pause-button"));
      },
      current: "1",
      paused: "false"
    }
  ])("$case", async ({ act, current: expected, paused }) => {
    const root = await mountPage(sectionPlain({}));
    const slider = sliderOf(root);

    act(slider);
    jest.advanceTimersByTime(AUTOPLAY_SPEED + SPEED + 100);

    expect(current(slider)).toBe(expected);
    expect(slider.getAttribute("data-slider-paused")).toBe(paused);
  });

  it("puts the pause control after the dots", async () => {
    const root = await mountPage(sectionPlain({}));

    expect(
      markupOf(required(sliderOf(root), ":scope > .brz-slick-slider__dots"))
    ).toMatchSnapshot();
  });
});

describe("resizing", () => {
  it("keeps the slider laid out across the mobile breakpoint", async () => {
    const root = await mountPage(sectionPlain(NO_AUTOPLAY));
    const slider = sliderOf(root);
    const emits = recordEmits(/^elements\./);

    setLayout({
      viewportWidth: 700,
      viewportHeight: 800,
      boxWidth: 700,
      boxHeight: 400
    });
    resizeViewport(700, 800);
    jest.advanceTimersByTime(1000);

    expect({
      track: trackOf(slider).getAttribute("style"),
      events: emits.map(({ name, args }) => ({
        name,
        args: describeArgs(args)
      }))
    }).toMatchSnapshot();
    expect(markupOf(slider)).toMatchSnapshot();
  });
});
