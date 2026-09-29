import { z } from "zod";
import type { ExportFunction } from "visual/types";
import {
  loadFreeRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";
import {
  type BackgroundEnv,
  installBackgroundEnv,
  restoreBackgroundEnv,
  setRect,
  setScrollTop
} from "../__fixtures__/env";
import { parallaxHtml, parallaxSectionsHtml } from "../__fixtures__/markup";

// Characterization suite for the parallax half of `component/Background/export.ts`, written
// against the jQuery plugin it is about to replace. Every expectation is what the current code
// does today, latent bugs included; a red line after the rewrite means the rewrite changed
// behaviour, not that the expectation was wrong.

const INIT_CLASS = "brz-bg-image-parallax--init";

const element = z.instanceof(HTMLElement);

const query = (root: ParentNode, selector: string): HTMLElement =>
  element.parse(root.querySelector(selector));

const queryAll = (root: ParentNode, selector: string): HTMLElement[] =>
  z.array(element).parse([...root.querySelectorAll(selector)]);

let env: BackgroundEnv;
let initBackground: ExportFunction;

// An empty manifest keeps the runtime from running this export a second time: the real manifest
// matches `.brz-bg-image-parallax`, so the bootstrap's own `init.dom` would double every listener
// the export registers and every call they make.
async function loadExport(): Promise<ExportFunction> {
  await loadFreeRuntime({ kind: "mocked", componentManifest: {} });
  const module: { default: ExportFunction } = await import(
    "visual/component/Background/export"
  );

  return module.default;
}

interface Mounted {
  root: HTMLElement;
  bg: HTMLElement;
  image: HTMLElement;
  probe: HTMLElement;
}

function mountParallax(section: { height: number; top: number }): Mounted {
  const root = mountRoot(parallaxHtml({ height: section.height }));
  const bg = query(root, ".brz-bg");

  setRect(bg, { top: section.top, height: section.height });

  return {
    root,
    bg,
    image: query(root, ".brz-bg-image-parallax"),
    probe: query(root, ".brz-probe")
  };
}

function wheel(target: HTMLElement, init: WheelEventInit): WheelEvent {
  const event = new WheelEvent("wheel", {
    ...init,
    bubbles: true,
    cancelable: true
  });

  target.dispatchEvent(event);

  return event;
}

function runFrames(count: number): void {
  for (let frame = 0; frame < count; frame++) {
    jest.advanceTimersToNextFrame();
  }
}

beforeEach(async () => {
  silenceConsole();
  env = installBackgroundEnv();
  initBackground = await loadExport();
  jest.useFakeTimers();
});

afterEach(() => {
  // `jest.resetModules()` hands the next test fresh modules, but the wheel and scroll listeners an
  // instance registered on `window` outlive it and would answer the next test's events. Every
  // export run left a resize listener that switches parallax off below desktop, so one last resize
  // as "tablet" makes each run — this test's and any earlier one's — destroy its own instances,
  // which is what takes those listeners off `window`.
  env.setDevice("tablet");
  window.dispatchEvent(new Event("resize"));

  jest.clearAllTimers();
  jest.useRealTimers();
  document.body.innerHTML = "";
  restoreBackgroundEnv();
  jest.restoreAllMocks();
});

describe("profiling", () => {
  it.each([
    {
      case: "a container taller than the viewport",
      height: 900,
      out: {
        height: "128.57142857142858vh",
        transform: "translate3d(0,150px,0)"
      }
    },
    {
      case: "a container shorter than the viewport",
      height: 600,
      out: { height: "", transform: "translate3d(0,150px,0)" }
    }
  ])("profiles $case", ({ height, out }) => {
    // `getHeight` divides by `documentElement.clientHeight` while the initial transform uses the
    // plugin's own `windowHeight`, which is the max of that and `innerHeight`. Keeping the two
    // apart is what makes a wrong translation of `$(window).height()` visible.
    env.setViewport({ clientHeight: 700, innerHeight: 800 });

    const { root, image } = mountParallax({ height, top: 500 });

    initBackground(root);

    expect(image.style.height).toBe(out.height);
    expect(image.style.transform).toBe(out.transform);
    expect(image.classList.contains(INIT_CLASS)).toBe(true);
  });

  it("does not re-profile an element it already initialised", () => {
    env.setViewport({ clientHeight: 700, innerHeight: 700 });

    const { root, bg, image } = mountParallax({ height: 900, top: 500 });

    initBackground(root);
    setRect(bg, { top: 100, height: 900 });
    initBackground(root);

    expect(image.style.transform).toBe("translate3d(0,100px,0)");
  });
});

describe("scrolling", () => {
  it.each([
    {
      case: "a frame after a scroll",
      scroll: true,
      out: "translate3d(0,160px,0)"
    },
    {
      case: "a frame without a scroll",
      scroll: false,
      out: "translate3d(0,100px,0)"
    }
  ])("moves the image on $case", ({ scroll, out }) => {
    env.setViewport({ clientHeight: 700, innerHeight: 700 });

    const { root, image } = mountParallax({ height: 900, top: 500 });

    initBackground(root);
    expect(image.style.transform).toBe("translate3d(0,100px,0)");

    if (scroll) {
      setScrollTop(120);
    }

    runFrames(1);

    expect(image.style.transform).toBe(out);
  });

  it("leaves a section the scroll has passed alone", () => {
    env.setViewport({ clientHeight: 700, innerHeight: 700 });

    const { root, image } = mountParallax({ height: 900, top: 500 });

    initBackground(root);
    // elemBottom is 500 + 900; a scroll past it is out of the plugin's in-view window.
    setScrollTop(1500);
    runFrames(1);

    expect(image.style.transform).toBe("translate3d(0,100px,0)");
  });
});

describe("wheel inertia", () => {
  // Frozen from the current implementation: `D = -v * c(u, 0, 300, 30)` per frame, written out
  // only when |D| > 1, with `u` starting at 4 and the run ending once it passes 30. The first
  // values also match the formula by hand, which is what makes this table a real oracle.
  it.each([
    {
      case: "a 100px wheel notch",
      deltaY: 100,
      deltaMode: 0,
      calls: [25, 22, 19, 16, 13, 11, 9, 7, 6, 5, 4, 3, 2, 2, 1]
    },
    {
      case: "a 40px wheel notch",
      deltaY: 40,
      deltaMode: 0,
      calls: [30, 26, 22, 19, 16, 13, 11, 9, 7, 6, 5, 4, 3, 2, 2, 1]
    },
    {
      case: "a line-mode wheel notch",
      deltaY: 3,
      deltaMode: 1,
      calls: [30, 26, 22, 19, 16, 13, 11, 9, 7, 6, 5, 4, 3, 2, 2, 1]
    },
    {
      case: "a delta above the clamp",
      deltaY: 300,
      deltaMode: 0,
      calls: [61, 52, 45, 38, 32, 26, 22, 18, 14, 12, 9, 7, 5, 4, 3, 2, 2, 1]
    },
    {
      case: "an upward wheel notch",
      deltaY: -100,
      deltaMode: 0,
      calls: [-25, -22, -19, -16, -13, -11, -9, -7, -6, -5, -4, -3, -2, -2, -1]
    }
  ])("hijacks the scroll for $case", ({ deltaY, deltaMode, calls }) => {
    env.setViewport({ clientHeight: 700, innerHeight: 700 });

    const { root, probe } = mountParallax({ height: 900, top: 500 });

    initBackground(root);

    const event = wheel(probe, { deltaY, deltaMode });

    runFrames(40);

    expect(event.defaultPrevented).toBe(true);
    expect(env.scrollBy.mock.calls).toEqual(calls.map((y) => [0, y]));
  });

  it("drives only the most recently initialised section", () => {
    // `attachWheel` forwards the event to the last entry in its stack, so a page with two
    // parallax sections runs the inertia of the second one whichever section was scrolled over.
    env.setViewport({ clientHeight: 700, innerHeight: 700 });

    const root = mountRoot(
      parallaxSectionsHtml([{ height: 900 }, { height: 900 }])
    );

    for (const bg of queryAll(root, ".brz-bg")) {
      setRect(bg, { top: 500, height: 900 });
    }

    initBackground(root);

    wheel(queryAll(root, ".brz-probe")[0], { deltaY: 100, deltaMode: 0 });
    runFrames(40);

    expect(env.scrollBy.mock.calls).toEqual(
      [25, 22, 19, 16, 13, 11, 9, 7, 6, 5, 4, 3, 2, 2, 1].map((y) => [0, y])
    );
  });
});

describe("pausing while an overlay is open", () => {
  it.each([
    {
      case: "a popup that locks the page",
      open: "elements.popup.open",
      close: "elements.popup.close",
      dataset: {},
      paused: true
    },
    {
      case: "a popup that keeps the page scrollable",
      open: "elements.popup.open",
      close: "elements.popup.close",
      dataset: { brzScroll_page: "true" },
      paused: false
    },
    {
      case: "the mobile menu",
      open: "elements.mmenu.open",
      close: "elements.mmenu.close",
      dataset: {},
      paused: true
    }
  ])("pauses for $case: $paused", ({ open, close, dataset, paused }) => {
    env.setViewport({ clientHeight: 700, innerHeight: 700 });

    const { root, image, probe } = mountParallax({ height: 900, top: 500 });

    initBackground(root);

    const overlay = document.createElement("div");
    Object.assign(overlay.dataset, dataset);

    window.Brz.emit(open, overlay);

    setScrollTop(120);
    runFrames(1);
    const whileOpen = wheel(probe, { deltaY: 100, deltaMode: 0 });

    expect(image.style.transform).toBe(
      paused ? "translate3d(0,100px,0)" : "translate3d(0,160px,0)"
    );
    expect(whileOpen.defaultPrevented).toBe(!paused);

    window.Brz.emit(close, overlay);

    setScrollTop(200);
    runFrames(1);

    expect(image.style.transform).toBe("translate3d(0,200px,0)");
  });
});

describe("viewport changes", () => {
  it.each([
    {
      case: "the container still exceeds the viewport",
      clientHeight: 800,
      out: { height: "112.5vh", transform: "translate3d(0,150px,0)" }
    },
    {
      case: "the container no longer exceeds the viewport",
      clientHeight: 1000,
      out: {
        height: "128.57142857142858vh",
        transform: "translate3d(0,250px,0)"
      }
    }
  ])("re-profiles on resize when $case", ({ clientHeight, out }) => {
    env.setViewport({ clientHeight: 700, innerHeight: 700 });

    const { root, image } = mountParallax({ height: 900, top: 500 });

    initBackground(root);
    expect(image.style.height).toBe("128.57142857142858vh");

    env.setViewport({ clientHeight, innerHeight: clientHeight });
    window.dispatchEvent(new Event("resize"));

    // The inline height is only rewritten while the container is taller than the viewport; once
    // it is not, `getHeight` returns null and the previous value stays behind.
    expect(image.style.height).toBe(out.height);
    expect(image.style.transform).toBe(out.transform);
  });

  it("destroys on a switch away from desktop and rebuilds on the way back", () => {
    env.setViewport({ clientHeight: 700, innerHeight: 700 });

    const { root, image } = mountParallax({ height: 900, top: 500 });

    initBackground(root);

    env.setDevice("tablet");
    window.dispatchEvent(new Event("resize"));

    expect(image.style.height).toBe("");
    expect(image.style.transform).toBe("");
    expect(image.classList.contains(INIT_CLASS)).toBe(false);

    setScrollTop(120);
    runFrames(1);
    expect(image.style.transform).toBe("");

    env.setDevice("desktop");
    window.dispatchEvent(new Event("resize"));

    expect(image.style.height).toBe("128.57142857142858vh");
    expect(image.style.transform).toBe("translate3d(0,160px,0)");
    expect(image.classList.contains(INIT_CLASS)).toBe(true);
  });
});
