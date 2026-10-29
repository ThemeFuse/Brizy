import initCountdown from "visual/editorComponents/Countdown/export";
import * as group2 from "visual/libs/group-2";
import { makeAttr } from "visual/utils/i18n/attribute";
import { publishLibGroup } from "../../../../../jest-utils/libGroups";

// The published Countdown. A page that contains `.brz-countdown` also loads
// the `group-2` lib bundle (its selectors.json lists the class), so the bundle
// is published before the export runs, the way the page does it. The export is
// then called with the root node, as the dispatcher calls it.

const PARTS = ["days", "hours", "minutes", "seconds"] as const;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const T0 = Date.UTC(2026, 0, 14, 12, 0, 0);

interface Span {
  d: number;
  h: number;
  m: number;
  s: number;
}

const span = ({ d, h, m, s }: Span): number =>
  d * DAY + h * HOUR + m * MINUTE + s * SECOND;

interface Attributes {
  end: string | undefined;
  timezone: string | undefined;
  language: string | undefined;
}

function setAttribute(
  node: HTMLElement,
  name: string,
  value: string | undefined
): void {
  if (value !== undefined) {
    node.setAttribute(makeAttr(name), value);
  }
}

// Mirrors what `Countdown/index.jsx` renders: four items, each a number over a
// label, inside the element that carries the three data attributes.
function mountCountdown(
  root: HTMLElement,
  attributes: Attributes
): HTMLElement {
  const countdown = document.createElement("div");
  countdown.className = "brz-countdown";
  setAttribute(countdown, "end", attributes.end);
  setAttribute(countdown, "timezone", attributes.timezone);
  setAttribute(countdown, "language", attributes.language);
  countdown.innerHTML = PARTS.map(
    (part) =>
      `<div class="brz-countdown__item brz-countdown__${part}"><div class="brz-countdown__number">0</div><div class="brz-countdown__label">-</div></div>`
  ).join("");
  root.append(countdown);
  return countdown;
}

function mountRoot(): HTMLElement {
  const root = document.createElement("div");
  document.body.append(root);
  return root;
}

function texts(countdown: HTMLElement, child: "number" | "label"): string[] {
  return PARTS.map(
    (part) =>
      countdown.querySelector(
        `.brz-countdown__${part} > .brz-countdown__${child}`
      )?.textContent ?? ""
  );
}

function read(countdown: HTMLElement): {
  numbers: string[];
  labels: string[];
  timers: number;
} {
  return {
    numbers: texts(countdown, "number"),
    labels: texts(countdown, "label"),
    timers: jest.getTimerCount()
  };
}

const at = (offset: number): string => String(T0 + offset);

beforeAll(() => {
  publishLibGroup("BrizyLibs", group2);
});

beforeEach(() => {
  jest.useFakeTimers({ now: T0 });
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  document.body.innerHTML = "";
  publishLibGroup("BrizyLibs", group2);
});

describe("Countdown on a published page", () => {
  it.each([
    {
      case: "a day, two hours, three minutes and four seconds",
      attributes: {
        end: at(span({ d: 1, h: 2, m: 3, s: 4 })),
        timezone: "0",
        language: "en"
      },
      out: {
        numbers: ["1", "02", "03", "04"],
        labels: ["Day", "Hours", "Minutes", "Seconds"],
        timers: 1
      }
    },
    {
      case: "twelve days and nine seconds",
      attributes: {
        end: at(span({ d: 12, h: 0, m: 0, s: 9 })),
        timezone: "0",
        language: "en"
      },
      out: {
        numbers: ["12", "00", "00", "09"],
        labels: ["Days", "Hour", "Minute", "Seconds"],
        timers: 1
      }
    },
    {
      case: "more than a hundred days, unpadded and untruncated",
      attributes: {
        end: at(span({ d: 123, h: 0, m: 0, s: 0 })),
        timezone: "0",
        language: "en"
      },
      out: {
        numbers: ["123", "00", "00", "00"],
        labels: ["Days", "Hour", "Minute", "Second"],
        timers: 1
      }
    },
    {
      case: "Russian labels with their three plural forms",
      attributes: {
        end: at(span({ d: 2, h: 5, m: 21, s: 1 })),
        timezone: "0",
        language: "ru"
      },
      out: {
        numbers: ["2", "05", "21", "01"],
        labels: ["Дня", "Часов", "Минута", "Секунда"],
        timers: 1
      }
    },
    {
      case: "an unknown language, which falls back to English",
      attributes: {
        end: at(span({ d: 2, h: 0, m: 0, s: 0 })),
        timezone: "0",
        language: "xx"
      },
      out: {
        numbers: ["2", "00", "00", "00"],
        labels: ["Days", "Hour", "Minute", "Second"],
        timers: 1
      }
    },
    {
      case: "a missing language, which falls back to English",
      attributes: {
        end: at(span({ d: 2, h: 0, m: 0, s: 0 })),
        timezone: "0",
        language: undefined
      },
      out: {
        numbers: ["2", "00", "00", "00"],
        labels: ["Days", "Hour", "Minute", "Second"],
        timers: 1
      }
    },
    {
      case: "a positive timezone offset, which moves the end later",
      attributes: {
        end: at(span({ d: 0, h: 0, m: 0, s: 10 })),
        timezone: "1",
        language: "en"
      },
      out: {
        numbers: ["0", "00", "01", "10"],
        labels: ["Day", "Hour", "Minute", "Seconds"],
        timers: 1
      }
    },
    {
      case: "a negative timezone offset, which moves the end earlier",
      attributes: {
        end: at(span({ d: 0, h: 2, m: 0, s: 0 })),
        timezone: "-60",
        language: "en"
      },
      out: {
        numbers: ["0", "01", "00", "00"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 1
      }
    },
    {
      case: "an end in the past",
      attributes: { end: at(-5 * SECOND), timezone: "0", language: "en" },
      out: {
        numbers: ["0", "00", "00", "00"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 0
      }
    },
    {
      case: "a missing timezone, which makes the end not a number",
      attributes: {
        end: at(span({ d: 2, h: 0, m: 0, s: 0 })),
        timezone: undefined,
        language: "en"
      },
      out: {
        numbers: ["0", "00", "00", "00"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 0
      }
    },
    {
      // Reading the missing end as 0 instead of "not a number" would put the
      // end ~2027 with this offset and show a running countdown.
      case: "a missing end, even with an offset past today",
      attributes: { end: undefined, timezone: "30000000", language: "en" },
      out: {
        numbers: ["0", "00", "00", "00"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 0
      }
    }
  ])("renders $case", ({ attributes, out }) => {
    const root = mountRoot();
    const countdown = mountCountdown(root, attributes);

    initCountdown(root);

    expect(read(countdown)).toEqual(out);
  });

  it.each([
    {
      case: "a second passes",
      left: span({ d: 1, h: 2, m: 3, s: 4 }),
      advance: SECOND,
      out: {
        numbers: ["1", "02", "03", "03"],
        labels: ["Day", "Hours", "Minutes", "Seconds"],
        timers: 1
      }
    },
    {
      case: "a minute boundary is crossed",
      left: span({ d: 0, h: 0, m: 1, s: 0 }),
      advance: SECOND,
      out: {
        numbers: ["0", "00", "00", "59"],
        labels: ["Day", "Hour", "Minute", "Seconds"],
        timers: 1
      }
    },
    {
      case: "the seconds label turns singular",
      left: 2 * SECOND,
      advance: SECOND,
      out: {
        numbers: ["0", "00", "00", "01"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 1
      }
    },
    {
      case: "an hour passes",
      left: DAY,
      advance: HOUR,
      out: {
        numbers: ["0", "23", "00", "00"],
        labels: ["Day", "Hours", "Minute", "Second"],
        timers: 1
      }
    },
    {
      case: "the end is reached",
      left: 2 * SECOND,
      advance: 2 * SECOND,
      out: {
        numbers: ["0", "00", "00", "00"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 0
      }
    },
    {
      case: "time keeps passing after the end",
      left: 2 * SECOND,
      advance: 7 * SECOND,
      out: {
        numbers: ["0", "00", "00", "00"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 0
      }
    }
  ])("ticks when $case", ({ left, advance, out }) => {
    const root = mountRoot();
    const countdown = mountCountdown(root, {
      end: at(left),
      timezone: "0",
      language: "en"
    });

    initCountdown(root);
    jest.advanceTimersByTime(advance);

    expect(read(countdown)).toEqual(out);
  });

  it("runs one timer per countdown, each with its own end", () => {
    const root = mountRoot();
    const first = mountCountdown(root, {
      end: at(span({ d: 0, h: 1, m: 0, s: 0 })),
      timezone: "0",
      language: "en"
    });
    const second = mountCountdown(root, {
      end: at(span({ d: 3, h: 0, m: 0, s: 5 })),
      timezone: "0",
      language: "en"
    });

    initCountdown(root);

    expect({
      first: texts(first, "number"),
      second: texts(second, "number"),
      timers: jest.getTimerCount()
    }).toEqual({
      first: ["0", "01", "00", "00"],
      second: ["3", "00", "00", "05"],
      timers: 2
    });
  });

  it.each([
    {
      case: "at the same moment keeps a single timer",
      firstEnd: at(HOUR),
      wait: 0,
      secondEnd: at(HOUR),
      out: {
        numbers: ["0", "01", "00", "00"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 1
      }
    },
    {
      // Existing quirk: the update takes a fresh `now` but keeps the first
      // start time, so the time elapsed before the re-init counts twice.
      case: "five seconds later counts those seconds twice (existing drift)",
      firstEnd: at(HOUR),
      wait: 5 * SECOND,
      secondEnd: at(HOUR),
      out: {
        numbers: ["0", "00", "59", "50"],
        labels: ["Day", "Hour", "Minutes", "Seconds"],
        timers: 1
      }
    },
    {
      case: "of an expired countdown with the same end stays stopped",
      firstEnd: at(-SECOND),
      wait: 0,
      secondEnd: at(-SECOND),
      out: {
        numbers: ["0", "00", "00", "00"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 0
      }
    },
    {
      case: "of an expired countdown with a later end starts it again",
      firstEnd: at(-SECOND),
      wait: 0,
      secondEnd: at(MINUTE),
      out: {
        numbers: ["0", "00", "01", "00"],
        labels: ["Day", "Hour", "Minute", "Second"],
        timers: 1
      }
    }
  ])(
    "a second init over the same countdown $case",
    ({ firstEnd, wait, secondEnd, out }) => {
      const root = mountRoot();
      const countdown = mountCountdown(root, {
        end: firstEnd,
        timezone: "0",
        language: "en"
      });

      initCountdown(root);
      jest.advanceTimersByTime(wait);
      countdown.setAttribute(makeAttr("end"), secondEnd);
      initCountdown(root);

      expect(read(countdown)).toEqual(out);
    }
  );

  it("fails without the group-2 lib bundle", async () => {
    await jest.isolateModulesAsync(async () => {
      const { default: initIsolated } = await import(
        "visual/editorComponents/Countdown/export"
      );
      publishLibGroup("BrizyLibs", {});
      const root = mountRoot();
      mountCountdown(root, {
        end: at(HOUR),
        timezone: "0",
        language: "en"
      });

      // Only the throw is asserted: a freshly imported jQuery schedules its own
      // ready timer, so the timer count here says nothing about the countdown.
      expect(() => initIsolated(root)).toThrow(TypeError);
    });
  });
});
