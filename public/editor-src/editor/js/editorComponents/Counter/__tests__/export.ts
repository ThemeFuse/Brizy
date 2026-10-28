import { z } from "zod";
import { makeAttr } from "visual/utils/i18n/attribute";

// The published Counter outside a Story: it counts once it scrolls into view.
// jsdom has no IntersectionObserver, so a stand-in records the observed nodes
// and `intersect` reports them all as visible in one callback. The counter
// modules keep page-wide state, so every test loads them afresh.

let observer: FakeIntersectionObserver | undefined;

class FakeIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly scrollMargin = "";
  readonly thresholds: number[] = [];
  private readonly targets: Element[] = [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    observer = this;
  }

  observe(target: Element): void {
    this.targets.push(target);
  }

  unobserve(): void {}

  disconnect(): void {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  intersect(): void {
    this.callback(
      this.targets.map((target) => {
        const rect = target.getBoundingClientRect();

        return {
          target,
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: rect,
          intersectionRect: rect,
          rootBounds: rect,
          time: 0
        };
      }),
      this
    );
  }
}

interface Fixture {
  start: string | undefined;
  end: string | undefined;
  duration: string | undefined;
  separator: string | undefined;
  chart: boolean;
}

const attribute = (name: string, value: string | undefined): string =>
  value === undefined ? "" : `${makeAttr(name)}="${value}"`;

const counter = ({ start, end, duration, separator, chart }: Fixture): string =>
  `<div class="brz-counter" ${attribute("start", start)} ${attribute("end", end)} ${attribute("duration", duration)} ${attribute("separator", separator)}>
    ${chart ? `<svg><circle class="brz-counter-pie-chart"></circle></svg>` : ""}
    <div class="brz-counter-figures"><span class="brz-counter-numbers">-</span></div>
  </div>`;

// What a counter shows: its figure, and for a pie the stroke that draws it.
const shown = (root: HTMLElement): string[] =>
  Array.from(root.querySelectorAll(".brz-counter")).map((element) => {
    const text = element.querySelector(".brz-counter-numbers")?.textContent;
    const chart = element.querySelector<SVGElement>(".brz-counter-pie-chart");

    return chart ? `${text} | ${chart.style.strokeDasharray}` : `${text}`;
  });

const simple = (patch: Partial<Fixture>): Fixture => ({
  start: "0",
  end: "100",
  duration: "2",
  separator: "",
  chart: false,
  ...patch
});

beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  observer = undefined;
  Object.defineProperty(globalThis, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: FakeIntersectionObserver
  });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  Reflect.deleteProperty(document, "hidden");
  Reflect.deleteProperty(window, "jQuery");
  document.body.innerHTML = "";
});

describe("a Counter scrolled into view", () => {
  it.each<{
    case: string;
    counters: Fixture[];
    hidden: boolean;
    fxOff: boolean;
    waits: number[];
    out: string[][];
  }>([
    {
      case: "counts from start to end over its duration",
      counters: [simple({})],
      hidden: false,
      fxOff: false,
      waits: [500, 500, 500, 500],
      out: [["0"], ["24"], ["49"], ["74"], ["100"]]
    },
    {
      case: "falls back to 0, 100 and two seconds without attributes",
      counters: [
        simple({
          start: undefined,
          end: undefined,
          duration: undefined,
          separator: undefined
        })
      ],
      hidden: false,
      fxOff: false,
      waits: [1000, 1000],
      out: [["0"], ["49"], ["100"]]
    },
    {
      case: "groups the thousands with the separator",
      counters: [simple({ end: "20000", duration: "1", separator: "," })],
      hidden: false,
      fxOff: false,
      waits: [250, 250, 250, 250, 16],
      out: [["0"], ["4,480"], ["9,600"], ["14,400"], ["19,520"], ["20,000"]]
    },
    {
      case: "counts down",
      counters: [simple({ start: "50", end: "10", duration: "1" })],
      hidden: false,
      fxOff: false,
      waits: [250, 250, 250, 250, 16],
      out: [["50"], ["41"], ["31"], ["21"], ["11"], ["10"]]
    },
    {
      case: "fills the pie chart with the figure",
      counters: [simple({ end: "80", duration: "1", chart: true })],
      hidden: false,
      fxOff: false,
      waits: [250, 250, 250, 250, 16],
      out: [
        ["0 | 0.5 100"],
        ["18 | 18.419999999999998 100"],
        ["38 | 38.9 100"],
        ["58 | 58.099999999999994 100"],
        ["78 | 78.58 100"],
        ["80 | 80.5 100"]
      ]
    },
    {
      case: "shows the end at once for a zero duration",
      counters: [simple({ start: "5", end: "42", duration: "0" })],
      hidden: false,
      fxOff: false,
      waits: [16],
      out: [["42"], ["42"]]
    },
    {
      case: "runs two counters that come into view together",
      counters: [
        simple({ duration: "1" }),
        simple({ end: "200", duration: "1" })
      ],
      hidden: false,
      fxOff: false,
      waits: [16, 16, 468, 500, 16],
      out: [
        ["0", "-"],
        ["0", "0"],
        ["2", "3"],
        ["48", "96"],
        ["98", "195"],
        ["100", "200"]
      ]
    },
    {
      case: "keeps counting on a timer while the tab is hidden",
      counters: [simple({ duration: "1" })],
      hidden: true,
      fxOff: false,
      waits: [13, 13, 474, 500, 13],
      out: [["0"], ["0"], ["1"], ["48"], ["98"], ["100"]]
    },
    {
      case: "jumps to the end when the page's jQuery has effects off",
      counters: [simple({})],
      hidden: false,
      fxOff: true,
      waits: [16],
      out: [["100"], ["100"]]
    }
  ])("$case", async ({ counters, hidden, fxOff, waits, out }) => {
    if (hidden) {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: true
      });
    }
    if (fxOff) {
      Object.defineProperty(window, "jQuery", {
        configurable: true,
        writable: true,
        value: { fx: { off: true } }
      });
    }

    const { default: exportCounter } = await import("../export");
    const root = document.createElement("div");

    root.innerHTML = counters.map(counter).join("");
    document.body.append(root);
    exportCounter(root);
    z.instanceof(FakeIntersectionObserver).parse(observer).intersect();

    const seen = [shown(root)];

    for (const wait of waits) {
      jest.advanceTimersByTime(wait);
      seen.push(shown(root));
    }

    expect(seen).toEqual(out);
  });
});
