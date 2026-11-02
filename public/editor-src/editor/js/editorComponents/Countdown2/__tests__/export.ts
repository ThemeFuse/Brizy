import initCountdown2 from "visual/editorComponents/Countdown2/export";
import * as group2 from "visual/libs/group-2";
import { makeAttr } from "visual/utils/i18n/attribute";
import { publishLibGroup } from "../../../../../jest-utils/libGroups";

// The published Countdown2. A page that contains `.brz-countdown2` also loads
// the `group-2` lib bundle (its selectors.json lists the class), so the bundle
// is published before the export runs, the way the page does it. The export is
// then called with the root node, as the dispatcher calls it.
//
// The end is stored as a d/m/Y date plus hour and minute, and the export turns
// it into an instant with the visitor's timezone offset. Every instant here is
// in mid-January (or early March), where no timezone changes its offset, so
// the stored wall-clock time 15/01/2026 10:30 always lands on END.

const PARTS = ["days", "hours", "minutes", "seconds"] as const;
type Part = (typeof PARTS)[number];

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const END = Date.UTC(2026, 0, 15, 10, 30);
const END_DATE = "15/01/2026";
const END_HOURS = "10 am";
const END_MINUTES = "30";
const PAST_DATE = "13/01/2026";

interface Fixture {
  date: string | undefined;
  hours: string | undefined;
  timezone: string;
  linkType: string;
  redirect: string;
  action: string;
  parts: readonly Part[];
  // `data-brz-message` / `data-brz-hide` are never rendered by the element;
  // they are added only to observe what the "none" action removes.
  unrenderedAttributes: boolean;
}

const fixture = (patch: Partial<Fixture>): Fixture => ({
  date: END_DATE,
  hours: END_HOURS,
  timezone: "0",
  linkType: "linkAction",
  redirect: "",
  action: "none",
  parts: PARTS,
  unrenderedAttributes: false,
  ...patch
});

function setAttribute(
  node: HTMLElement,
  name: string,
  value: string | undefined
): void {
  if (value !== undefined) {
    node.setAttribute(name, value);
  }
}

// Mirrors `Countdown2/index.jsx#renderForView`: the message box exists only
// when the action is "showMessage", and the published CSS hides it.
function mountCountdown(root: HTMLElement, f: Fixture): HTMLElement {
  const countdown = document.createElement("div");
  countdown.className = "brz-countdown2 brz-countdown2-style1";
  setAttribute(countdown, makeAttr("end"), f.date);
  setAttribute(countdown, makeAttr("hours"), f.hours);
  setAttribute(countdown, makeAttr("minutes"), END_MINUTES);
  setAttribute(countdown, makeAttr("timezone"), f.timezone);
  setAttribute(countdown, makeAttr("link-type"), f.linkType);
  setAttribute(countdown, makeAttr("redirect"), f.redirect);
  setAttribute(countdown, makeAttr("message", true), "Congratulation!");
  setAttribute(countdown, makeAttr("action"), f.action);
  if (f.unrenderedAttributes) {
    setAttribute(countdown, makeAttr("message"), "Congratulation!");
    setAttribute(countdown, makeAttr("hide"), "on");
  }

  const parts = f.parts
    .map(
      (part) =>
        `<div class="brz-countdown2__item brz-countdown2__${part}"><div class="brz-countdown2__number">00</div><div class="brz-countdown2__label">${part}</div></div>`
    )
    .join("");
  const message =
    f.action === "showMessage"
      ? `<div class="brz-countdown2-message">Congratulation!</div>`
      : "";
  countdown.innerHTML = `<div class="brz-countdown2-parts">${parts}</div>${message}`;
  root.append(countdown);
  return countdown;
}

function mountRoot(): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = "<style>.brz-countdown2-message{display:none}</style>";
  document.body.append(root);
  return root;
}

function numbers(countdown: HTMLElement): string[] {
  return PARTS.map(
    (part) =>
      countdown.querySelector(
        `.brz-countdown2__${part} > .brz-countdown2__number`
      )?.textContent ?? "absent"
  );
}

const ATTRIBUTES = [
  makeAttr("redirect"),
  makeAttr("message", true),
  makeAttr("message"),
  makeAttr("hide")
];

function outcome(countdown: HTMLElement): {
  hash: string;
  message: string;
  root: string;
  attributes: string[];
} {
  const message = countdown.querySelector(".brz-countdown2-message");

  return {
    hash: window.location.hash,
    message: message ? getComputedStyle(message).display : "absent",
    root: getComputedStyle(countdown).display,
    attributes: ATTRIBUTES.filter((name) => countdown.hasAttribute(name))
  };
}

beforeAll(() => {
  publishLibGroup("BrizyLibs", group2);
});

beforeEach(() => {
  jest.useFakeTimers({ now: END - HOUR });
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  document.body.innerHTML = "";
  window.history.replaceState(null, "", "/");
});

describe("Countdown2 on a published page", () => {
  it.each([
    {
      case: "a day, an hour and four seconds, all padded",
      left: DAY + HOUR + 4 * SECOND,
      f: fixture({}),
      out: { numbers: ["01", "01", "00", "04"], timers: 1 }
    },
    {
      case: "twelve days, unpadded past nine",
      left: 12 * DAY,
      f: fixture({}),
      out: { numbers: ["12", "00", "00", "00"], timers: 1 }
    },
    {
      case: "a timezone offset in minutes, which moves the end later",
      left: HOUR,
      f: fixture({ timezone: "60" }),
      out: { numbers: ["00", "02", "00", "00"], timers: 1 }
    },
    {
      case: "only the units the element renders",
      left: DAY + HOUR + 4 * SECOND,
      f: fixture({ parts: ["hours", "minutes", "seconds"] }),
      out: { numbers: ["absent", "01", "00", "04"], timers: 1 }
    },
    {
      case: "an end in the past",
      left: -MINUTE,
      f: fixture({}),
      out: { numbers: ["00", "00", "00", "00"], timers: 0 }
    },
    {
      case: "an unparsable date, which counts as long expired",
      left: HOUR,
      f: fixture({ date: "not/a/date" }),
      out: { numbers: ["00", "00", "00", "00"], timers: 0 }
    },
    {
      // Existing quirk: 31/02 is not rejected, the Date constructor rolls it
      // over to 3 March.
      case: "an impossible day, which rolls over into March",
      left: HOUR,
      f: fixture({ date: "31/02/2026" }),
      out: { numbers: ["47", "01", "00", "00"], timers: 1 }
    }
  ])("renders $case", ({ left, f, out }) => {
    jest.setSystemTime(END - left);
    const root = mountRoot();
    const countdown = mountCountdown(root, f);

    initCountdown2(root);

    expect({
      numbers: numbers(countdown),
      timers: jest.getTimerCount()
    }).toEqual(out);
  });

  it("ticks every second and stops at the end", () => {
    jest.setSystemTime(END - 2 * SECOND);
    const root = mountRoot();
    const countdown = mountCountdown(root, fixture({}));

    initCountdown2(root);
    const start = numbers(countdown);
    jest.advanceTimersByTime(SECOND);
    const second = numbers(countdown);
    jest.advanceTimersByTime(5 * SECOND);

    expect({
      start,
      second,
      end: numbers(countdown),
      timers: jest.getTimerCount()
    }).toEqual({
      start: ["00", "00", "00", "02"],
      second: ["00", "00", "00", "01"],
      end: ["00", "00", "00", "00"],
      timers: 0
    });
  });

  it.each([
    {
      case: "redirect goes to the stored url",
      f: fixture({ linkType: "redirect", redirect: "#done" }),
      out: {
        hash: "#done",
        message: "absent",
        root: "block",
        attributes: [makeAttr("redirect"), makeAttr("message", true)]
      }
    },
    {
      case: "redirect wins over showMessage",
      f: fixture({
        linkType: "redirect",
        redirect: "#done",
        action: "showMessage"
      }),
      out: {
        hash: "#done",
        message: "none",
        root: "block",
        attributes: [makeAttr("redirect"), makeAttr("message", true)]
      }
    },
    {
      case: "showMessage reveals the message",
      f: fixture({ action: "showMessage" }),
      out: {
        hash: "",
        message: "block",
        root: "block",
        attributes: [makeAttr("redirect"), makeAttr("message", true)]
      }
    },
    {
      case: "showMessage reveals the message whatever the link type",
      f: fixture({ linkType: "", action: "showMessage" }),
      out: {
        hash: "",
        message: "block",
        root: "block",
        attributes: [makeAttr("redirect"), makeAttr("message", true)]
      }
    },
    {
      // Existing quirk: the rendered message attribute is the translatable
      // one, so only the redirect attribute is really removed.
      case: "none removes only the rendered redirect attribute",
      f: fixture({ action: "none" }),
      out: {
        hash: "",
        message: "absent",
        root: "block",
        attributes: [makeAttr("message", true)]
      }
    },
    {
      case: "none also removes the message and hide attributes when present",
      f: fixture({ action: "none", unrenderedAttributes: true }),
      out: {
        hash: "",
        message: "absent",
        root: "block",
        attributes: [makeAttr("message", true)]
      }
    },
    {
      case: "hide hides the countdown",
      f: fixture({ action: "hide" }),
      out: {
        hash: "",
        message: "absent",
        root: "none",
        attributes: [makeAttr("redirect"), makeAttr("message", true)]
      }
    },
    {
      case: "hide does nothing without the linkAction link type",
      f: fixture({ linkType: "", action: "hide" }),
      out: {
        hash: "",
        message: "absent",
        root: "block",
        attributes: [makeAttr("redirect"), makeAttr("message", true)]
      }
    },
    {
      case: "none does nothing without the linkAction link type",
      f: fixture({ linkType: "", action: "none" }),
      out: {
        hash: "",
        message: "absent",
        root: "block",
        attributes: [makeAttr("redirect"), makeAttr("message", true)]
      }
    }
  ])("at the end, $case", ({ f, out }) => {
    const root = mountRoot();
    const countdown = mountCountdown(root, { ...f, date: PAST_DATE });

    initCountdown2(root);

    expect(outcome(countdown)).toEqual(out);
  });

  it.each([
    {
      case: "nothing happens while time remains",
      left: DAY,
      advance: SECOND,
      root: "block"
    },
    {
      case: "nothing happens one second before the end",
      left: 2 * SECOND,
      advance: SECOND,
      root: "block"
    },
    {
      case: "the action runs when the end is reached",
      left: 2 * SECOND,
      advance: 2 * SECOND,
      root: "none"
    },
    {
      // Existing quirk: the action runs as soon as every displayed unit is 0,
      // up to a second before the end.
      case: "the action runs once the display reads zero",
      left: 1500,
      advance: SECOND,
      root: "none"
    }
  ])("$case", ({ left, advance, root: display }) => {
    jest.setSystemTime(END - left);
    const root = mountRoot();
    const countdown = mountCountdown(root, fixture({ action: "hide" }));

    initCountdown2(root);
    jest.advanceTimersByTime(advance);

    expect(getComputedStyle(countdown).display).toBe(display);
  });

  // The "none" action is used because a hash navigation queues a jsdom task,
  // which the fake timer count would include.
  it("runs the action again on a second init of an expired countdown", () => {
    const root = mountRoot();
    const countdown = mountCountdown(
      root,
      fixture({ date: PAST_DATE, action: "none", redirect: "#done" })
    );

    initCountdown2(root);
    const afterFirst = countdown.hasAttribute(makeAttr("redirect"));
    countdown.setAttribute(makeAttr("redirect"), "#done");
    initCountdown2(root);

    expect({
      afterFirst,
      afterSecond: countdown.hasAttribute(makeAttr("redirect")),
      numbers: numbers(countdown),
      timers: jest.getTimerCount()
    }).toEqual({
      afterFirst: false,
      afterSecond: false,
      numbers: ["00", "00", "00", "00"],
      timers: 0
    });
  });

  it.each([
    { case: "the end date", missing: { date: undefined } },
    { case: "the end hour", missing: { hours: undefined } }
  ])(
    "without $case, throws and leaves the next countdown stopped",
    ({ missing }) => {
      const root = mountRoot();
      mountCountdown(root, fixture(missing));
      const next = mountCountdown(root, fixture({}));

      expect(() => initCountdown2(root)).toThrow(TypeError);
      expect({
        numbers: numbers(next),
        timers: jest.getTimerCount()
      }).toEqual({ numbers: ["00", "00", "00", "00"], timers: 0 });
    }
  );

  it("with an unparsable redirect, throws on init and on every tick", () => {
    const root = mountRoot();
    mountCountdown(
      root,
      fixture({ date: PAST_DATE, linkType: "redirect", redirect: "http://[" })
    );

    expect(() => initCountdown2(root)).toThrow();
    expect(jest.getTimerCount()).toBe(1);
    expect(() => jest.advanceTimersByTime(SECOND)).toThrow();
    expect(jest.getTimerCount()).toBe(1);
  });

  it("fails without the group-2 lib bundle", async () => {
    await jest.isolateModulesAsync(async () => {
      const { default: initIsolated } = await import(
        "visual/editorComponents/Countdown2/export"
      );
      publishLibGroup("BrizyLibs", {});
      const root = mountRoot();
      mountCountdown(root, fixture({}));

      // Only the throw is asserted: a freshly imported jQuery schedules its own
      // ready timer, so the timer count here says nothing about the countdown.
      expect(() => initIsolated(root)).toThrow(TypeError);
    });
    publishLibGroup("BrizyLibs", group2);
  });
});
