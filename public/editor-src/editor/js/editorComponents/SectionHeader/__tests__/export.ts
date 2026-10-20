import { z } from "zod";
import * as group8 from "visual/libs/group-8";
import {
  initPro,
  loadProRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";
import { publishLibGroup } from "../../../../../jest-utils/libGroups";

// The published sticky header (a pro element), initialised the way a page does
// it: the free and pro bootstraps with their real manifests receive
// `init.pro.dom`, the pro one loads the header export, and the `group-8` lib
// bundle provides its sticky behaviour.
//
// The header is checked on the window's `load` and `scroll` events, once per
// animation frame. jsdom has no layout, so each step sets the header's
// rectangle and `window.scrollY` by hand, fires the event and waits a frame.
// The runtime never tears a header down, so headers of earlier tests keep
// listening; events are therefore filtered to the current fixture.

const eventSchema = z
  .object({
    node: z.instanceof(HTMLElement),
    type: z.enum(["animated", "fixed"])
  })
  .strict();

interface RecordedEvent {
  name: "show" | "hide";
  node: HTMLElement;
  type: "animated" | "fixed";
}

const recorded: RecordedEvent[] = [];
const unbinds: VoidFunction[] = [];

function record(name: "show" | "hide"): (payload: unknown) => void {
  return (payload) => {
    recorded.push({ name, ...eventSchema.parse(payload) });
  };
}

function eventsIn(
  root: HTMLElement
): { name: string; type: string; node: HTMLElement }[] {
  return recorded.filter((event) => root.contains(event.node));
}

function query(root: HTMLElement, selector: string): HTMLElement {
  return z.instanceof(HTMLElement).parse(root.querySelector(selector));
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function setScrollY(value: number): void {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    writable: true,
    value
  });
}

function place(header: HTMLElement, top: number, height: number): void {
  header.getBoundingClientRect = () => new DOMRect(0, top, 1024, height);
}

interface Step {
  top: number;
  height: number;
  scrollY: number;
  event: "scroll" | "load";
}

async function run(header: HTMLElement, step: Step): Promise<void> {
  place(header, step.top, step.height);
  setScrollY(step.scrollY);
  window.dispatchEvent(new Event(step.event));
  await nextFrame();
}

const animatedHtml = `
  <header class="brz-section brz-section__header brz-section__header-type--animated">
    <div class="brz-section__header--animated"><section class="brz-section__header-sticky-item">Sticky</section></div>
    <section class="brz-section__menu-item">Static</section>
  </header>
`;

function fixedHtml(barAttributes: string, child: string): string {
  return `
    <header class="brz-section brz-section__header brz-section__header-type--fixed">
      <div class="brz-section__header--fixed" ${barAttributes}>${child}</div>
    </header>
  `;
}

// 100px tall header, scrolled to various places.
const OPEN: Step = { top: -100, height: 100, scrollY: 0, event: "scroll" };
const CLOSED: Step = { top: 0, height: 100, scrollY: 0, event: "scroll" };

beforeAll(async () => {
  silenceConsole();
  await loadProRuntime({ kind: "real" }, { kind: "real" });
  publishLibGroup("BrizyLibs", group8);
  unbinds.push(
    window.Brz.on("elements.headerSticky.show", record("show")),
    window.Brz.on("elements.headerSticky.hide", record("hide"))
  );
});

afterAll(() => {
  unbinds.forEach((unbind) => unbind());
  jest.restoreAllMocks();
});

beforeEach(() => {
  setScrollY(0);
});

afterEach(() => {
  recorded.length = 0;
  document.body.innerHTML = "";
});

interface AnimatedSnapshot {
  opened: boolean;
  closed: boolean;
  ariaHidden: string | undefined;
  inert: string | undefined;
  events: string[];
}

function snapshotAnimated(root: HTMLElement): AnimatedSnapshot {
  const bar = query(root, ".brz-section__header--animated");

  return {
    opened: bar.classList.contains("brz-section__header--animated-opened"),
    closed: bar.classList.contains("brz-section__header--animated-closed"),
    ariaHidden: bar.getAttribute("aria-hidden") ?? undefined,
    inert: bar.getAttribute("inert") ?? undefined,
    events: eventsIn(root).map(({ name, type, node }) =>
      node === bar ? `${name}:${type}` : `${name}:${type}:other-node`
    )
  };
}

const untouched: AnimatedSnapshot = {
  opened: false,
  closed: false,
  ariaHidden: undefined,
  inert: undefined,
  events: []
};

const closed = (events: string[]): AnimatedSnapshot => ({
  opened: false,
  closed: true,
  ariaHidden: "true",
  inert: "",
  events
});

const opened = (events: string[]): AnimatedSnapshot => ({
  opened: true,
  closed: false,
  ariaHidden: undefined,
  inert: undefined,
  events
});

describe("the animated (sticky) header on a published page", () => {
  it.each<{ case: string; steps: Step[]; out: AnimatedSnapshot[] }>([
    {
      case: "nothing before the first scroll or load",
      steps: [],
      out: []
    },
    {
      case: "a forced first change to closed when not scrolled past",
      steps: [CLOSED],
      out: [closed(["hide:animated"])]
    },
    {
      case: "a first change to opened when scrolled past",
      steps: [OPEN],
      out: [opened(["show:animated"])]
    },
    {
      case: "the load event, handled like a scroll",
      steps: [{ ...CLOSED, event: "load" }],
      out: [closed(["hide:animated"])]
    },
    {
      case: "closed, opened and closed again",
      steps: [CLOSED, OPEN, CLOSED],
      out: [
        closed(["hide:animated"]),
        opened(["hide:animated", "show:animated"]),
        closed(["hide:animated", "show:animated", "hide:animated"])
      ]
    },
    {
      case: "no event while the state stays the same",
      steps: [CLOSED, { ...CLOSED, top: -50 }, OPEN, { ...OPEN, top: -400 }],
      out: [
        closed(["hide:animated"]),
        closed(["hide:animated"]),
        opened(["hide:animated", "show:animated"]),
        opened(["hide:animated", "show:animated"])
      ]
    },
    {
      case: "opened exactly when scrolled by the header's height",
      steps: [{ ...OPEN, top: -100 }],
      out: [opened(["show:animated"])]
    },
    {
      case: "closed half a pixel before the header's height",
      steps: [{ ...OPEN, top: -99.5 }],
      out: [closed(["hide:animated"])]
    },
    {
      case: "the iOS overscroll guard at the first check",
      steps: [
        { ...OPEN, scrollY: -30 },
        { ...CLOSED, top: 20 }
      ],
      out: [untouched, closed(["hide:animated"])]
    },
    {
      case: "the iOS overscroll guard after the header opened",
      steps: [OPEN, { ...CLOSED, scrollY: -30 }, CLOSED],
      out: [
        opened(["show:animated"]),
        opened(["show:animated"]),
        closed(["show:animated", "hide:animated"])
      ]
    }
  ])("shows $case", async ({ steps, out }) => {
    const root = mountRoot(animatedHtml);
    await initPro("init.pro.dom", [root]);
    const header = query(root, ".brz-section__header");

    const snapshots: AnimatedSnapshot[] = [];
    for (const step of steps) {
      await run(header, step);
      snapshots.push(snapshotAnimated(root));
    }
    await nextFrame();

    expect({ snapshots, final: snapshotAnimated(root) }).toEqual({
      snapshots: out,
      final: out.at(-1) ?? untouched
    });
  });

  it("registers a header once when an inner root is initialised again", async () => {
    const root = mountRoot(`<div>${animatedHtml}</div>`);
    await initPro("init.pro.dom", [root]);
    await initPro("init.pro.dom", [query(root, "div")]);
    const header = query(root, ".brz-section__header");

    await run(header, CLOSED);
    await run(header, OPEN);

    expect(snapshotAnimated(root)).toEqual(
      opened(["hide:animated", "show:animated"])
    );
  });

  it("checks animated headers before fixed ones in the same frame", async () => {
    const root = mountRoot(
      `${fixedHtml("", "")}${animatedHtml.replace("<header", '<header id="animated-header"')}`
    );
    await initPro("init.pro.dom", [root]);
    place(query(root, "#animated-header"), 0, 100);
    place(query(root, ".brz-section__header-type--fixed"), 0, 100);

    window.dispatchEvent(new Event("scroll"));
    await nextFrame();

    expect(eventsIn(root).map(({ name, type }) => `${name}:${type}`)).toEqual([
      "hide:animated",
      "show:fixed"
    ]);
  });
});

interface FixedSnapshot {
  opened: boolean;
  height: string;
  marginTop: string;
  ariaHidden: string | undefined;
  inert: string | undefined;
  events: string[];
}

function snapshotFixed(root: HTMLElement): FixedSnapshot {
  const bar = query(root, ".brz-section__header--fixed");
  const header = query(root, ".brz-section__header");

  return {
    opened: bar.classList.contains("brz-section__header--fixed-opened"),
    height: header.style.height,
    marginTop: header.style.marginTop,
    ariaHidden: bar.getAttribute("aria-hidden") ?? undefined,
    inert: bar.getAttribute("inert") ?? undefined,
    events: eventsIn(root).map(({ name, type, node }) =>
      node === bar ? `${name}:${type}` : `${name}:${type}:other-node`
    )
  };
}

const STUCK: Step = { top: 0, height: 100, scrollY: 0, event: "scroll" };
const UNSTUCK: Step = { top: 1, height: 100, scrollY: 0, event: "scroll" };
const TALL_BAR = 'style="height: 80px"';
const PULLED_UP_CHILD =
  '<section class="brz-section__menu-item" style="margin-top: -20px">Static</section>';

describe("the fixed header on a published page", () => {
  it.each([
    {
      case: "sticks at the top of the page",
      bar: TALL_BAR,
      child: PULLED_UP_CHILD,
      steps: [STUCK],
      out: [
        {
          opened: true,
          height: "80px",
          marginTop: "-20px",
          ariaHidden: undefined,
          inert: undefined,
          events: ["show:fixed"]
        }
      ]
    },
    {
      case: "is released below the top of the page",
      bar: TALL_BAR,
      child: PULLED_UP_CHILD,
      steps: [STUCK, UNSTUCK],
      out: [
        {
          opened: true,
          height: "80px",
          marginTop: "-20px",
          ariaHidden: undefined,
          inert: undefined,
          events: ["show:fixed"]
        },
        {
          opened: false,
          height: "auto",
          marginTop: "",
          ariaHidden: undefined,
          inert: undefined,
          events: ["show:fixed", "hide:fixed"]
        }
      ]
    },
    {
      case: "is released on a forced first check",
      bar: TALL_BAR,
      child: PULLED_UP_CHILD,
      steps: [UNSTUCK],
      out: [
        {
          opened: false,
          height: "auto",
          marginTop: "",
          ariaHidden: undefined,
          inert: undefined,
          events: ["hide:fixed"]
        }
      ]
    },
    {
      case: "ignores an overscroll above the page",
      bar: TALL_BAR,
      child: PULLED_UP_CHILD,
      steps: [{ ...STUCK, scrollY: -30 }],
      out: [
        {
          opened: false,
          height: "",
          marginTop: "",
          ariaHidden: undefined,
          inert: undefined,
          events: []
        }
      ]
    }
  ])("$case", async ({ bar, child, steps, out }) => {
    const root = mountRoot(fixedHtml(bar, child));
    await initPro("init.pro.dom", [root]);
    const header = query(root, ".brz-section__header");

    const snapshots: FixedSnapshot[] = [];
    for (const step of steps) {
      await run(header, step);
      snapshots.push(snapshotFixed(root));
    }

    expect(snapshots).toEqual(out);
  });

  it.each([
    {
      case: "the height of a content-box bar",
      html: fixedHtml(TALL_BAR, ""),
      offsetHeight: undefined,
      out: { height: "80px", marginTop: "", barStyle: "height: 80px" }
    },
    {
      case: "the height plus padding and border of a content-box bar",
      html: fixedHtml(
        'style="height: 80px; padding: 5px 0px; border: 2px solid"',
        ""
      ),
      offsetHeight: undefined,
      out: {
        height: "94px",
        marginTop: "",
        barStyle: "height: 80px; padding: 5px 0px; border: 2px solid"
      }
    },
    {
      case: "the height alone of a border-box bar",
      html: fixedHtml(
        'style="box-sizing: border-box; height: 80px; padding: 5px 0px"',
        ""
      ),
      offsetHeight: undefined,
      out: {
        height: "80px",
        marginTop: "",
        barStyle: "box-sizing: border-box; height: 80px; padding: 5px 0px"
      }
    },
    {
      case: "a scrollbar gutter measured through offsetHeight",
      html: fixedHtml(
        'style="height: 80px; padding: 5px 0px; border: 2px solid"',
        ""
      ),
      offsetHeight: 97,
      out: {
        height: "97px",
        marginTop: "",
        barStyle: "height: 80px; padding: 5px 0px; border: 2px solid"
      }
    },
    {
      // A hidden bar is measured with jQuery's swap: absolutely positioned and
      // displayed for the measurement, restored afterwards to an empty style.
      case: "a hidden bar measured while shown",
      html: `<style>#hidden-bar{display:none}#hidden-bar[style*="absolute"]{height:70px}</style>${fixedHtml('id="hidden-bar"', "")}`,
      offsetHeight: undefined,
      out: { height: "70px", marginTop: "", barStyle: "" }
    },
    {
      case: "a negative top margin of the first child",
      html: fixedHtml(TALL_BAR, PULLED_UP_CHILD),
      offsetHeight: undefined,
      out: { height: "80px", marginTop: "-20px", barStyle: "height: 80px" }
    },
    {
      case: "no margin for a positive top margin of the first child",
      html: fixedHtml(
        TALL_BAR,
        '<section class="brz-section__menu-item" style="margin-top: 10px">Static</section>'
      ),
      offsetHeight: undefined,
      out: { height: "80px", marginTop: "", barStyle: "height: 80px" }
    },
    {
      case: "no margin for a bar without children",
      html: fixedHtml(TALL_BAR, "text only"),
      offsetHeight: undefined,
      out: { height: "80px", marginTop: "", barStyle: "height: 80px" }
    }
  ])(
    "keeps the page in place with $case",
    async ({ html, offsetHeight, out }) => {
      const root = mountRoot(html);
      await initPro("init.pro.dom", [root]);
      const bar = query(root, ".brz-section__header--fixed");
      if (offsetHeight !== undefined) {
        Object.defineProperty(bar, "offsetHeight", {
          configurable: true,
          value: offsetHeight
        });
      }

      await run(query(root, ".brz-section__header"), STUCK);
      const { height, marginTop } = snapshotFixed(root);

      expect({
        height,
        marginTop,
        barStyle: bar.getAttribute("style")
      }).toEqual(out);
    }
  );
});
