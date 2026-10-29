// The slider contract, driven through `createSlider` / `onSlider` only.

import {
  createSlider,
  onSlider,
  type SliderAccessibilityOptions,
  type SliderEventDetail,
  type SliderEventName,
  type SliderHandle,
  type SliderOptions
} from "visual/libs/slider";
import {
  click,
  dragX,
  dragXReportingMoves,
  endPage,
  hover,
  installSliderEnvironment,
  markupOf,
  pressKey,
  required,
  resizeViewport,
  setLayout,
  swipeTouch
} from "../../../../../jest-utils/sliderEnv";

const DESKTOP = {
  viewportWidth: 1280,
  viewportHeight: 800,
  boxWidth: 1000,
  boxHeight: 400
};

/** The default settings, spelled out; each case overrides what it is about. */
const BASE: SliderOptions = {
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  fade: false,
  vertical: false,
  rtl: false,
  speed: 500,
  autoplay: false,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  pauseOnFocus: true,
  arrows: true,
  prevArrow:
    '<button type="button" class="arrow arrow-prev" aria-label="Previous slide">&lt;</button>',
  nextArrow:
    '<button type="button" class="arrow arrow-next" aria-label="Next slide">&gt;</button>',
  dots: true,
  dotsClass: "dots",
  customPaging: undefined,
  responsive: [],
  swipe: true,
  draggable: true,
  touchThreshold: 5,
  useTransform: true,
  accessibility: true,
  rows: 1,
  centerMode: false,
  centerPadding: "50px",
  variableWidth: false,
  focusOnSelect: false,
  lazyLoad: "ondemand"
};

const EVENTS: SliderEventName[] = [
  "init",
  "beforeChange",
  "afterChange",
  "breakpoint",
  "setPosition"
];

/** The events heard on a built slider: all but `init`, which fires during the build. */
const HANDLE_EVENTS: SliderEventName[] = [
  "beforeChange",
  "afterChange",
  "breakpoint",
  "setPosition"
];

beforeAll(async () => {
  await installSliderEnvironment();
});

beforeEach(() => {
  setLayout(DESKTOP);
  jest.useFakeTimers();
});

afterEach(() => {
  endPage();
});

const slideHtml = (index: number): string =>
  `<div class="item"><p>Slide ${index}</p><a href="#s${index}" class="link">Link ${index}</a></div>`;

interface Mounted {
  element: HTMLElement;
  slider: SliderHandle;
  events: string[];
}

/** Mounts `count` slides in a fresh element, records its events, builds the slider. */
function mount(options: SliderOptions, count: number, content = slideHtml): Mounted {
  const element = document.createElement("div");

  element.className = "slider";
  element.innerHTML = Array.from({ length: count }, (_, i) => content(i)).join("");
  document.body.append(element);

  const events: string[] = [];

  EVENTS.forEach((name) =>
    onSlider(element, name, (detail) => {
      events.push(summarize(name, detail));
    })
  );

  const slider = createSlider(element, options);

  slider.mount();

  return { element, slider, events };
}

function summarize(name: SliderEventName, detail: SliderEventDetail): string {
  const slides = detail.slides.length;

  return name === "beforeChange"
    ? `${name} ${detail.currentSlide}→${detail.nextSlide} (${slides})`
    : `${name} ${detail.currentSlide} (${slides})`;
}

const ownSlides = (element: HTMLElement): HTMLElement[] => [
  ...element.querySelectorAll<HTMLElement>(":scope > .slick-list > .slick-track > .slick-slide")
];

const current = (element: HTMLElement): string | null =>
  ownSlides(element)
    .find((slide) => slide.classList.contains("slick-current"))
    ?.getAttribute("data-slick-index") ?? null;

const trackStyle = (element: HTMLElement): string | null =>
  required<HTMLElement>(element, ":scope > .slick-list > .slick-track").getAttribute("style");

const listOf = (element: HTMLElement): HTMLElement =>
  required<HTMLElement>(element, ":scope > .slick-list");

// --- building ---------------------------------------------------------------------------------

interface BuildCase {
  case: string;
  options: SliderOptions;
  slides: number;
}

describe("building", () => {
  it.each<BuildCase>([
    { case: "the defaults", options: BASE, slides: 4 },
    { case: "unwrapped slides (rows 0)", options: { ...BASE, rows: 0 }, slides: 4 },
    { case: "a positioned track (no transform)", options: { ...BASE, useTransform: false }, slides: 4 },
    { case: "fade", options: { ...BASE, fade: true }, slides: 4 },
    { case: "vertical", options: { ...BASE, vertical: true }, slides: 4 },
    { case: "right to left", options: { ...BASE, rtl: true }, slides: 4 },
    { case: "no loop", options: { ...BASE, infinite: false }, slides: 4 },
    { case: "three per view", options: { ...BASE, slidesToShow: 3 }, slides: 5 },
    { case: "three per view given as text", options: { ...BASE, slidesToShow: "3" }, slides: 5 },
    {
      case: "centre mode with variable width",
      options: { ...BASE, centerMode: true, centerPadding: "60px", variableWidth: true, rows: 0 },
      slides: 4
    },
    { case: "no dots", options: { ...BASE, dots: false }, slides: 4 },
    { case: "no arrows", options: { ...BASE, arrows: false }, slides: 4 },
    {
      case: "arrows given as false and as empty markup",
      options: { ...BASE, prevArrow: false, nextArrow: "" },
      slides: 4
    },
    {
      case: "custom dots",
      options: { ...BASE, customPaging: (index) => `<button><i>${index}</i></button>` },
      slides: 4
    },
    { case: "no accessibility", options: { ...BASE, accessibility: false }, slides: 4 },
    { case: "fewer slides than shown", options: { ...BASE, slidesToShow: 3 }, slides: 2 },
    { case: "a single slide", options: BASE, slides: 1 }
  ])("builds $case", ({ options, slides }) => {
    const { element, events } = mount(options, slides);

    jest.advanceTimersByTime(1000);

    expect(markupOf(element)).toMatchSnapshot();
    expect(events).toMatchSnapshot();
  });

  it("uses arrows that are already in the page", () => {
    const prev = document.createElement("span");
    const next = document.createElement("span");

    prev.className = "own-prev";
    next.className = "own-next";
    document.body.append(prev, next);

    const { element } = mount({ ...BASE, prevArrow: prev, nextArrow: next }, 4);

    expect([prev.className, next.className, prev.parentElement === document.body]).toEqual([
      "own-prev slick-arrow",
      "own-next slick-arrow",
      true
    ]);

    click(next);
    jest.advanceTimersByTime(600);

    expect(current(element)).toBe("1");
  });

  it("builds a second slider with ids of its own", () => {
    const first = mount(BASE, 3).element;
    const second = mount(BASE, 3).element;
    const idsOf = (element: HTMLElement) =>
      ownSlides(element)
        .filter((slide) => !slide.classList.contains("slick-cloned"))
        .map((slide) => slide.id);
    const firstIds = idsOf(first);
    const secondIds = idsOf(second);
    const uidOf = (id: string | undefined) => /^slick-slide(\d+)0$/.exec(id ?? "")?.[1];

    expect(Number(uidOf(secondIds[0]))).toBe(Number(uidOf(firstIds[0])) + 1);
    expect(secondIds).toEqual([0, 1, 2].map((i) => `slick-slide${uidOf(secondIds[0])}${i}`));
  });

  it("loads lazy images on demand", () => {
    const { element } = mount(
      { ...BASE, lazyLoad: "ondemand" },
      4,
      (i) => `<div><img data-lazy="/img-${i}.jpg" alt="${i}" /></div>`
    );

    const sources = () =>
      ownSlides(element).map((slide) => slide.querySelector("img")?.getAttribute("src") ?? null);
    const initial = sources();

    element.querySelectorAll("img[src]").forEach((image) => image.dispatchEvent(new Event("load")));
    jest.advanceTimersByTime(1000);

    expect({ initial, loaded: sources(), markup: markupOf(element) }).toMatchSnapshot();
  });
});

// --- moving -----------------------------------------------------------------------------------

interface MoveCase {
  case: string;
  options: SliderOptions;
  act: (mounted: Mounted) => void;
}

describe("moving", () => {
  const next = ({ slider }: Mounted) => slider.next();
  const prev = ({ slider }: Mounted) => slider.prev();

  it.each<MoveCase>([
    { case: "next", options: BASE, act: next },
    { case: "prev from the first slide (through the clone)", options: BASE, act: prev },
    { case: "goTo 2", options: BASE, act: ({ slider }) => slider.goTo(2) },
    { case: "goTo the current slide", options: BASE, act: ({ slider }) => slider.goTo(0) },
    { case: "next twice while animating", options: BASE, act: (m) => { next(m); next(m); } },
    { case: "next on a positioned track", options: { ...BASE, useTransform: false }, act: next },
    { case: "prev on a positioned track", options: { ...BASE, useTransform: false }, act: prev },
    { case: "next in fade", options: { ...BASE, fade: true }, act: next },
    { case: "next in fade on a positioned track", options: { ...BASE, fade: true, useTransform: false }, act: next },
    { case: "next vertically", options: { ...BASE, vertical: true, useTransform: false }, act: next },
    { case: "next right to left", options: { ...BASE, rtl: true, useTransform: false }, act: next },
    { case: "prev without loop at the start", options: { ...BASE, infinite: false }, act: prev },
    { case: "next without loop", options: { ...BASE, infinite: false }, act: next },
    { case: "three per view, next", options: { ...BASE, slidesToShow: 3 }, act: next },
    { case: "three per view as text, next", options: { ...BASE, slidesToShow: "3" }, act: next },
    {
      case: "centre mode, next",
      options: { ...BASE, centerMode: true, centerPadding: "60px", variableWidth: true, rows: 0, useTransform: false },
      act: next
    },
    {
      case: "the next arrow",
      options: BASE,
      act: ({ element }) => click(required(element, ":scope > .arrow-next"))
    },
    {
      case: "the third dot",
      options: BASE,
      act: ({ element }) => click(required(element, ":scope > .dots > li:nth-child(3) > button"))
    }
  ])("moves on $case", ({ options, act }) => {
    const mounted = mount(options, 5);
    const { element, events } = mounted;

    events.length = 0;
    act(mounted);

    const during = trackStyle(element);

    jest.advanceTimersByTime(1100);

    expect({
      current: current(element),
      during,
      after: trackStyle(element),
      events
    }).toMatchSnapshot();
  });

  it("moves a positioned track frame by frame", () => {
    const { element, slider } = mount({ ...BASE, useTransform: false }, 4);
    const frames: (string | null)[] = [];

    slider.next();
    for (let elapsed = 0; elapsed < 500; elapsed += 100) {
      jest.advanceTimersByTime(100);
      frames.push(trackStyle(element));
    }

    expect(frames).toMatchSnapshot();
  });

  it("marks the arrows at the edges of a slider that does not loop", () => {
    const { element, slider } = mount({ ...BASE, infinite: false }, 3);
    const arrows = () =>
      [...element.querySelectorAll(":scope > .slick-arrow")].map((arrow) => [
        arrow.className,
        arrow.getAttribute("aria-disabled"),
        arrow.getAttribute("tabindex")
      ]);
    const atStart = arrows();

    slider.goTo(2);
    jest.advanceTimersByTime(600);

    expect({ atStart, atEnd: arrows() }).toMatchSnapshot();
  });
});

// --- events -----------------------------------------------------------------------------------

describe("events", () => {
  it("reports the slider state with every event", () => {
    const { slider, events } = mount(BASE, 3);

    slider.next();
    jest.advanceTimersByTime(600);
    slider.setPosition();

    expect(events).toMatchSnapshot();
  });

  it("lets a listener attach before the slider is built", () => {
    const element = document.createElement("div");
    const heard: number[] = [];

    element.innerHTML = [0, 1, 2].map(slideHtml).join("");
    document.body.append(element);
    onSlider(element, "init", (detail) => heard.push(detail.slides.length));

    createSlider(element, BASE).mount();

    expect(heard).toEqual([3]);
  });

  it("stops the build and hands the caller what an init listener throws", () => {
    const element = document.createElement("div");
    const failure = new Error("init listener");
    const heard: string[] = [];

    element.innerHTML = [0, 1, 2].map(slideHtml).join("");
    document.body.append(element);
    onSlider(element, "init", () => {
      throw failure;
    });
    onSlider(element, "init", () => heard.push("second listener"));

    const slider = createSlider(element, { ...BASE, autoplay: true });

    expect(() => slider.mount()).toThrow(failure);

    jest.advanceTimersByTime(3600 * 2);

    // The build stopped at `init`: no second listener, no ARIA on the slides, no autoplay.
    expect({
      heard,
      roles: [...element.querySelectorAll("[role='tabpanel']")].length,
      current: element.querySelector(".slick-current")?.getAttribute("data-slick-index")
    }).toEqual({ heard: [], roles: 0, current: "0" });
  });

  it("builds nothing until it is mounted", () => {
    const element = document.createElement("div");

    element.innerHTML = [0, 1, 2].map(slideHtml).join("");
    document.body.append(element);

    const before = element.outerHTML;
    const slider = createSlider(element, { ...BASE, autoplay: true });

    jest.advanceTimersByTime(3600 * 2);

    const unmounted = element.outerHTML;

    slider.mount();

    expect(unmounted).toBe(before);
    expect(element.classList.contains("slick-initialized")).toBe(true);
  });

  it("reports the build to a listener on the handle as it does on the element", () => {
    const element = document.createElement("div");
    const onElement: string[] = [];
    const onHandle: string[] = [];

    element.innerHTML = [0, 1, 2].map(slideHtml).join("");
    document.body.append(element);

    const slider = createSlider(element, BASE);

    EVENTS.forEach((name) => {
      onSlider(element, name, (detail) => onElement.push(summarize(name, detail)));
      slider.on(name, (detail) => onHandle.push(summarize(name, detail)));
    });
    slider.mount();

    expect(onHandle).toEqual(onElement);
    expect(onHandle.filter((entry) => entry.startsWith("init"))).toEqual(["init 0 (3)"]);
    expect(onHandle.some((entry) => entry.startsWith("setPosition"))).toBe(true);
  });

  it("carries the events of a nested slider up to its ancestors", () => {
    const outer = document.createElement("div");

    outer.innerHTML = [0, 1].map(() => `<div><div class="inner">${[0, 1, 2].map(slideHtml).join("")}</div></div>`).join("");
    document.body.append(outer);

    const heard: string[] = [];

    (["init", "afterChange"] as const).forEach((name) =>
      onSlider(outer, name, (detail) => heard.push(summarize(name, detail)))
    );

    const inner = required<HTMLElement>(outer, ".inner");
    const innerSlider = createSlider(inner, BASE);

    innerSlider.mount();
    innerSlider.next();
    jest.advanceTimersByTime(600);

    expect(heard).toEqual(["init 0 (3)", "afterChange 1 (3)"]);
  });

  it("reports a breakpoint and lays out again when the viewport crosses it", () => {
    const { element, events } = mount(
      {
        ...BASE,
        slidesToShow: 3,
        responsive: [
          { breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 1 } },
          { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1, speed: 300 } }
        ]
      },
      5
    );

    events.length = 0;
    setLayout({ viewportWidth: 900, viewportHeight: 800, boxWidth: 900, boxHeight: 400 });
    resizeViewport(900, 800);
    jest.advanceTimersByTime(1000);
    const tablet = { events: [...events], markup: markupOf(element) };

    events.length = 0;
    setLayout({ viewportWidth: 700, viewportHeight: 800, boxWidth: 700, boxHeight: 400 });
    resizeViewport(700, 800);
    jest.advanceTimersByTime(1000);

    expect({ tablet, mobile: { events, markup: markupOf(element) } }).toMatchSnapshot();
  });

  it("lays out again on a resize within one breakpoint", () => {
    const { element, events } = mount(BASE, 3);

    events.length = 0;
    setLayout({ ...DESKTOP, boxWidth: 800 });
    resizeViewport(1200, 800);
    jest.advanceTimersByTime(1000);

    expect({ events, track: trackStyle(element) }).toMatchSnapshot();
  });

  it("fires nothing but setPosition and init while it is built under a breakpoint", () => {
    setLayout({ viewportWidth: 700, viewportHeight: 800, boxWidth: 700, boxHeight: 400 });

    const { events } = mount(
      {
        ...BASE,
        slidesToShow: 3,
        responsive: [
          { breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 1 } },
          { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1, speed: 300 } }
        ]
      },
      5
    );

    expect([...new Set(events.map((entry) => entry.split(" ")[0]))]).toEqual([
      "setPosition",
      "init"
    ]);
  });

  it("reports to a listener on the handle what it reports on the element", () => {
    const { slider, events } = mount(
      {
        ...BASE,
        slidesToShow: 3,
        responsive: [{ breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 1 } }]
      },
      5
    );
    const heard: string[] = [];

    HANDLE_EVENTS.forEach((name) =>
      slider.on(name, (detail) => {
        heard.push(summarize(name, detail));
      })
    );

    events.length = 0;
    slider.next();
    jest.advanceTimersByTime(600);
    setLayout({ viewportWidth: 900, viewportHeight: 800, boxWidth: 900, boxHeight: 400 });
    resizeViewport(900, 800);
    jest.advanceTimersByTime(1000);

    const unheard = HANDLE_EVENTS.filter((name) => !heard.some((entry) => entry.startsWith(name)));

    expect(heard).toEqual(events);
    expect(unheard).toEqual([]);
  });

  it("carries the events of a nested slider up to a listener on the outer handle", () => {
    const outer = document.createElement("div");

    outer.innerHTML = [0, 1].map(() => `<div><div class="inner">${[0, 1, 2].map(slideHtml).join("")}</div></div>`).join("");
    document.body.append(outer);

    const heard: string[] = [];

    const outerSlider = createSlider(outer, BASE);

    outerSlider.mount();
    outerSlider.on("afterChange", (detail) => {
      heard.push(summarize("afterChange", detail));
    });

    const innerSlider = createSlider(required<HTMLElement>(outer, ".slick-current .inner"), BASE);

    innerSlider.mount();
    innerSlider.next();
    jest.advanceTimersByTime(600);

    expect(heard).toEqual(["afterChange 1 (3)"]);
  });
});

// --- autoplay ---------------------------------------------------------------------------------

describe("autoplay", () => {
  const AUTO = { ...BASE, autoplay: true };

  it.each<{ case: string; options: SliderOptions; act: (mounted: Mounted) => void; wait: number }>([
    { case: "advances on its own", options: AUTO, act: () => undefined, wait: 3600 },
    { case: "keeps going", options: AUTO, act: () => undefined, wait: 3600 * 3 },
    {
      case: "holds while hovered",
      options: AUTO,
      act: ({ element }) => hover(listOf(element), true),
      wait: 7000
    },
    {
      case: "resumes after the pointer leaves",
      options: AUTO,
      act: ({ element }) => {
        hover(listOf(element), true);
        hover(listOf(element), false);
      },
      wait: 3600
    },
    {
      case: "ignores hover when pauseOnHover is off",
      options: { ...AUTO, pauseOnHover: false },
      act: ({ element }) => hover(listOf(element), true),
      wait: 3600
    },
    {
      case: "holds while focus is inside",
      options: AUTO,
      act: ({ element }) => required<HTMLElement>(element, ".slick-current .link").focus(),
      wait: 7000
    },
    { case: "holds after pause()", options: AUTO, act: ({ slider }) => slider.pause(), wait: 7000 },
    {
      case: "resumes after play()",
      options: AUTO,
      act: ({ slider }) => {
        slider.pause();
        slider.play();
      },
      wait: 3600
    },
    { case: "starts on play() when it was off", options: BASE, act: ({ slider }) => slider.play(), wait: 3600 },
    {
      case: "turns back at the end without loop",
      options: { ...AUTO, infinite: false },
      act: () => undefined,
      wait: 3600 * 5
    }
  ])("$case", ({ options, act, wait }) => {
    const mounted = mount(options, 3);
    const seen: (string | null)[] = [];

    act(mounted);
    for (let elapsed = 0; elapsed < wait; elapsed += 1800) {
      jest.advanceTimersByTime(1800);
      seen.push(current(mounted.element));
    }

    expect(seen).toMatchSnapshot();
  });

  it("holds while the page is hidden", () => {
    const { element } = mount(AUTO, 3);
    const hidden = Object.getOwnPropertyDescriptor(Document.prototype, "hidden");

    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
    jest.advanceTimersByTime(7000);
    const whileHidden = current(element);

    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    document.dispatchEvent(new Event("visibilitychange"));
    jest.advanceTimersByTime(3600);
    const afterShown = current(element);

    if (hidden) {
      Object.defineProperty(document, "hidden", hidden);
    }

    expect({ whileHidden, afterShown }).toMatchSnapshot();
  });
});

// --- gestures and keys ------------------------------------------------------------------------

describe("gestures", () => {
  it.each<{ case: string; options: SliderOptions; act: (element: HTMLElement) => void }>([
    { case: "a long mouse drag left", options: BASE, act: (e) => dragX(listOf(e), -300) },
    { case: "a long mouse drag right", options: BASE, act: (e) => dragX(listOf(e), 300) },
    { case: "a short mouse drag", options: BASE, act: (e) => dragX(listOf(e), -150) },
    { case: "a short drag past a low threshold", options: { ...BASE, touchThreshold: 15 }, act: (e) => dragX(listOf(e), -100) },
    { case: "a mouse drag when dragging is off", options: { ...BASE, draggable: false }, act: (e) => dragX(listOf(e), -300) },
    { case: "a mouse drag when swiping is off", options: { ...BASE, swipe: false }, act: (e) => dragX(listOf(e), -300) },
    { case: "a long touch swipe", options: BASE, act: (e) => swipeTouch(listOf(e), -300, 0) },
    { case: "a mostly vertical touch swipe", options: BASE, act: (e) => swipeTouch(listOf(e), -30, 200) },
    { case: "a touch swipe when dragging is off", options: { ...BASE, draggable: false }, act: (e) => swipeTouch(listOf(e), -300, 0) },
    { case: "a drag on a positioned track", options: { ...BASE, useTransform: false }, act: (e) => dragX(listOf(e), -300) },
    { case: "a drag right to left", options: { ...BASE, rtl: true }, act: (e) => dragX(listOf(e), -300) },
    { case: "a drag in fade", options: { ...BASE, fade: true }, act: (e) => dragX(listOf(e), -300) },
    { case: "a drag without loop at the start", options: { ...BASE, infinite: false }, act: (e) => dragX(listOf(e), 300) }
  ])("follows $case", ({ options, act }) => {
    const { element, events } = mount(options, 4);

    events.length = 0;
    act(element);
    jest.advanceTimersByTime(1100);

    expect({ current: current(element), track: trackStyle(element), events }).toMatchSnapshot();
  });

  it("takes the gesture over once a drag passes 40px", () => {
    const { element } = mount(BASE, 4);

    expect(dragXReportingMoves(listOf(element), [-20, -39, -41, -80])).toMatchSnapshot();
  });

  it("swallows the click that ends a drag", () => {
    const { element } = mount(BASE, 4);
    const link = required<HTMLElement>(element, ".slick-current .link");

    dragX(link, -300);
    const afterDrag = new MouseEvent("click", { bubbles: true, cancelable: true });

    link.dispatchEvent(afterDrag);
    jest.advanceTimersByTime(1100);

    // A real click comes after its own press and release.
    const target = required<HTMLElement>(element, ".slick-current .link");
    const plain = new MouseEvent("click", { bubbles: true, cancelable: true });

    target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: 500 }));
    target.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, clientX: 500 }));
    target.dispatchEvent(plain);

    expect({ afterDrag: afterDrag.defaultPrevented, plain: plain.defaultPrevented }).toEqual({
      afterDrag: true,
      plain: false
    });
  });

  it.each<{ case: string; options: SliderOptions; key: "ArrowLeft" | "ArrowRight"; on: string }>([
    { case: "ArrowRight", options: BASE, key: "ArrowRight", on: ":scope > .slick-list" },
    { case: "ArrowLeft", options: BASE, key: "ArrowLeft", on: ":scope > .slick-list" },
    { case: "ArrowRight right to left", options: { ...BASE, rtl: true }, key: "ArrowRight", on: ":scope > .slick-list" },
    { case: "ArrowRight without accessibility", options: { ...BASE, accessibility: false }, key: "ArrowRight", on: ":scope > .slick-list" },
    { case: "ArrowRight on a dot", options: BASE, key: "ArrowRight", on: ":scope > .dots button" },
    { case: "ArrowRight on an arrow", options: BASE, key: "ArrowRight", on: ":scope > .arrow-next" }
  ])("answers $case", ({ options, key, on }) => {
    const { element } = mount(options, 4);

    pressKey(required(element, on), key);
    jest.advanceTimersByTime(1100);

    expect(current(element)).toMatchSnapshot();
  });

  it("ignores keys typed into a field inside a slide", () => {
    const { element } = mount(BASE, 4, (i) => `<div><input class="field" value="${i}" /></div>`);

    pressKey(required(element, ".slick-current .field"), "ArrowRight");
    jest.advanceTimersByTime(1100);

    expect(current(element)).toBe("0");
  });

  it.each([
    { case: "the next slide", index: 1 },
    { case: "a slide further on", index: 3 }
  ])("goes to $case clicked with focus on select", ({ index }) => {
    const { element } = mount({ ...BASE, focusOnSelect: true, slidesToShow: 3 }, 5);

    click(required(element, `.slick-slide[data-slick-index="${index}"]`));
    jest.advanceTimersByTime(1100);

    expect(current(element)).toMatchSnapshot();
  });
});

// --- accessibility layer ----------------------------------------------------------------------

describe("accessibility layer", () => {
  /** The controls carry the class names the layer looks them up by. */
  const WITH_CONTROLS: SliderOptions = {
    ...BASE,
    accessibility: false,
    dotsClass: "brz-slick-slider__dots",
    prevArrow: '<button class="brz-slick-slider__arrow-prev">&lt;</button>',
    nextArrow: '<button class="brz-slick-slider__arrow-next">&gt;</button>'
  };

  it.each<{ case: string; accessibility: SliderAccessibilityOptions }>([
    {
      case: "controls inside the slider and arrows kept in the tab order",
      accessibility: {
        regionId: "region-a",
        regionLabel: "Slider A",
        slideIdPrefix: "slide-a",
        controls: "slider",
        focusableArrows: true,
        tabindexKey: "sliderATabindex"
      }
    },
    {
      case: "controls looked up in the parent of the slider",
      accessibility: {
        regionId: "region-b",
        regionLabel: "Slider B",
        slideIdPrefix: "slide-b",
        controls: "parent",
        focusableArrows: false,
        tabindexKey: "sliderBTabindex"
      }
    }
  ])("sets up $case and follows a move", ({ accessibility }) => {
    const { element, slider } = mount(WITH_CONTROLS, 3);
    const parent = document.createElement("div");

    // An arrow of the parent, ahead of the slider: only a lookup in the parent reaches it.
    parent.innerHTML = '<button class="brz-slick-slider__arrow-prev outside">&lt;</button>';
    document.body.append(parent);
    parent.append(element);

    slider.setupAccessibility(accessibility);

    const built = markupOf(parent);

    slider.next();
    jest.advanceTimersByTime(600);

    expect({ built, moved: markupOf(parent) }).toMatchSnapshot();
  });
});
