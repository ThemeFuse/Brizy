import { z } from "zod";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  initFree,
  loadFreeRuntime,
  mountRoot,
  silenceConsole,
  stopClicksAt,
  trackClickListeners
} from "../../../../../jest-utils/exportRuntime";

// The published SectionPopup2, initialised the way a page does it: the free
// bootstrap receives `init.dom` for `document.body` and loads this export.
// Every test starts from a fresh runtime, as a fresh page would.

type Attrs = Record<string, string>;

const elementSchema = z.instanceof(HTMLElement);
const optionsSchema = z.object({
  show: z.custom<() => void>((v) => typeof v === "function"),
  hide: z.custom<() => void>((v) => typeof v === "function")
});

function attrsHtml(attrs: Attrs): string {
  return Object.entries(attrs)
    .map(([name, value]) => `${name}="${value}"`)
    .join(" ");
}

function popupHtml(id: string, attrs: Attrs, closeHidden: boolean): string {
  return `<div class="brz brz-popup2 brz-popup2__preview" id="${id}" ${makeAttr("popup")}="${id}" ${makeAttr("once-id")}="once-${id}" ${attrsHtml(attrs)}>
    <div class="brz-popup2__inner">
      <div class="brz-container__wrap">
        <div class="brz-popup2__close${closeHidden ? " brz-hidden" : ""}"><span class="close-icon">x</span></div>
        <div class="brz-map__cover"></div>
        <span class="select2-selection__choice"></span>
        <div class="brz-container">
          <p class="content">Content</p>
          <span class="brz-popup2__action-close">Close</span>
        </div>
      </div>
    </div>
  </div>`;
}

function linkHtml(href: string, className: string): string {
  return `<a class="${className} link--popup" ${makeAttr("link-type")}="popup" href="#${href}">Open</a>`;
}

function pageHtml(attrs: Attrs): string {
  return `<section class="section">${linkHtml("p1", "brz-a")}</section>${popupHtml("p1", attrs, false)}`;
}

function query(root: ParentNode, selector: string): HTMLElement {
  return elementSchema.parse(root.querySelector(selector));
}

const html = document.documentElement;

const opened: unknown[] = [];
const closed: unknown[] = [];

async function initPage(content: string): Promise<HTMLElement> {
  const root = mountRoot(content);
  await initFree([document.body]);
  return root;
}

// Opens the popup the way a visitor does: a click on its link.
async function openByLink(attrs: Attrs): Promise<HTMLElement> {
  const root = await initPage(pageHtml(attrs));
  query(root, "a").click();
  return query(document.body, ".brz-popup2");
}

beforeAll(() => {
  silenceConsole();
});

beforeEach(async () => {
  await loadFreeRuntime({ kind: "real" });
  window.Brz.on("elements.popup.open", (node: unknown) => opened.push(node));
  window.Brz.on("elements.popup.close", (node: unknown) => closed.push(node));
});

afterEach(() => {
  jest.useRealTimers();
  // A fresh page has no handlers left over from the previous test: Escape lets
  // the open popups detach their document keydown listeners.
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  // A new body drops the listeners earlier exports attached to the old one.
  document.body.replaceWith(document.createElement("body"));
  html.className = "";
  localStorage.clear();
  opened.length = 0;
  closed.length = 0;
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("SectionPopup2 links on a published page", () => {
  it("moves the linked popup to body under a fresh id", async () => {
    const root = await initPage(pageHtml({}));
    const link = query(root, "a");
    const popup = query(document.body, ".brz-popup2");
    const newId = popup.getAttribute(makeAttr("popup"));

    expect(popup.parentElement).toBe(document.body);
    expect(newId).not.toBe("p1");
    expect(link.getAttribute("href")).toBe(`#${newId}`);
    expect(link.classList.contains("link--popup")).toBe(true);
  });

  it.each([
    { case: "a plain link", className: "brz-a", cursorAuto: true },
    { case: "a button", className: "brz-btn", cursorAuto: false }
  ])(
    "unmarks $case whose popup is missing",
    async ({ className, cursorAuto }) => {
      const root = await initPage(
        `${linkHtml("missing", className)}${popupHtml("p1", {}, false)}`
      );
      const link = query(root, "a");

      expect(link.classList.contains("link--popup")).toBe(false);
      expect(link.classList.contains("brz-cursor-auto")).toBe(cursorAuto);
      expect(link.getAttribute("href")).toBe("#missing");

      link.click();

      expect(opened).toEqual([]);
    }
  );
});

describe("SectionPopup2 show on a published page", () => {
  it.each([
    {
      case: "default settings",
      attrs: {},
      overflowHidden: true,
      pointerEvents: true
    },
    {
      case: "scroll page behind",
      attrs: { [makeAttr("scroll_page")]: "true" },
      overflowHidden: false,
      pointerEvents: true
    },
    {
      case: "click outside to close",
      attrs: { [makeAttr("click_outside_to_close")]: "true" },
      overflowHidden: true,
      pointerEvents: false
    },
    {
      case: "the legacy click outside attribute",
      attrs: { "data-click_outside_to_close": "true" },
      overflowHidden: true,
      pointerEvents: false
    }
  ])(
    "opens from its link with $case",
    async ({ attrs, overflowHidden, pointerEvents }) => {
      html.classList.add("brz-ow-hidden");
      const popup = await openByLink(attrs);
      const wrap = query(popup, ".brz-popup2__inner > .brz-container__wrap");

      expect(popup.classList.contains("brz-popup2--opened")).toBe(true);
      expect(popup.classList.contains("brz-popup2--was-shown")).toBe(true);
      expect(html.classList.contains("brz-ow-hidden")).toBe(overflowHidden);
      expect(popup.classList.contains("brz-pointer-events-none")).toBe(
        pointerEvents
      );
      expect(wrap.classList.contains("brz-pointer-events-auto")).toBe(
        pointerEvents
      );
      expect(popup.getAttribute("role")).toBe("dialog");
      expect(popup.getAttribute("aria-hidden")).toBe("false");
      expect(opened).toEqual([popup]);
      expect(closed).toEqual([]);
    }
  );

  it("reveals the close button after its delay", async () => {
    const root = await initPage(
      `${linkHtml("p1", "brz-a")}${popupHtml("p1", { [makeAttr("show-close-button-after")]: "2" }, true)}`
    );
    const close = query(document.body, ".brz-popup2__close");
    jest.useFakeTimers();

    query(root, "a").click();
    jest.advanceTimersByTime(1999);
    const hiddenBefore = close.classList.contains("brz-hidden");
    jest.advanceTimersByTime(1);

    expect(hiddenBefore).toBe(true);
    expect(close.classList.contains("brz-hidden")).toBe(false);
  });
});

describe("SectionPopup2 close on a published page", () => {
  const clickOutside = { [makeAttr("click_outside_to_close")]: "true" };

  it.each([
    { case: "the close icon", attrs: {}, target: ".close-icon", closes: true },
    {
      case: "a close action",
      attrs: {},
      target: ".brz-popup2__action-close",
      closes: true
    },
    {
      case: "the backdrop with click outside",
      attrs: clickOutside,
      target: ".brz-popup2",
      closes: true
    },
    {
      case: "the backdrop without click outside",
      attrs: {},
      target: ".brz-popup2",
      closes: false
    },
    {
      case: "the content",
      attrs: clickOutside,
      target: ".content",
      closes: false
    },
    {
      case: "a map cover",
      attrs: clickOutside,
      target: ".brz-map__cover",
      closes: false
    },
    {
      case: "a select2 choice",
      attrs: clickOutside,
      target: ".select2-selection__choice",
      closes: false
    }
  ])("after a click on $case", async ({ attrs, target, closes }) => {
    const popup = await openByLink(attrs);
    const node = target === ".brz-popup2" ? popup : query(popup, target);

    node.click();

    expect(popup.classList.contains("brz-popup2--opened")).toBe(!closes);
    expect(html.classList.contains("brz-ow-hidden")).toBe(!closes);
    expect(closed).toEqual(closes ? [popup] : []);
  });

  it("closes when an anchor inside it starts scrolling", async () => {
    const popup = await openByLink({});

    window.Brz.emit("elements.anchor.startScrolled", query(popup, ".content"));

    expect(popup.classList.contains("brz-popup2--opened")).toBe(false);
    expect(html.classList.contains("brz-ow-hidden")).toBe(false);
    expect(closed).toEqual([popup]);
  });

  it.each([
    { case: "with click outside", attrs: clickOutside, closes: true },
    { case: "without click outside", attrs: {}, closes: false }
  ])("handles Escape $case", async ({ attrs, closes }) => {
    const popup = await openByLink(attrs);

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );

    expect(popup.classList.contains("brz-popup2--opened")).toBe(!closes);
    expect(closed).toEqual(closes ? [popup] : []);
  });

  it.each([
    { case: "a popup with an id", once: true, stored: ["once-p1"] },
    { case: "a popup without an id", once: false, stored: [null] }
  ])("records $case as shown after it closes", async ({ once, stored }) => {
    const popup = await openByLink({});
    if (!once) {
      popup.removeAttribute(makeAttr("once-id"));
    }

    query(popup, ".close-icon").click();

    expect(JSON.parse(localStorage.getItem("brz-showedPopups") ?? "")).toEqual(
      stored
    );
  });
});

describe("SectionPopup2 clicks and the page around them", () => {
  const clickOutside = { [makeAttr("click_outside_to_close")]: "true" };

  it("is open when the click on its link reaches the page around it", async () => {
    const root = await initPage(pageHtml({}));
    const popup = query(document.body, ".brz-popup2");
    const seen = stopClicksAt(query(root, ".section"), () =>
      popup.classList.contains("brz-popup2--opened")
    );

    query(root, "a").click();

    expect(seen).toEqual([true]);
    expect(opened).toEqual([popup]);
  });

  it("closes on a click that its backdrop keeps to itself", async () => {
    const popup = await openByLink(clickOutside);
    const backdrop = query(popup, ".brz-popup2__inner");
    backdrop.addEventListener("click", (event) => event.stopPropagation());

    backdrop.click();

    expect(popup.classList.contains("brz-popup2--opened")).toBe(false);
    expect(closed).toEqual([popup]);
  });

  it("opens once in a root initialised after the page", async () => {
    await initPage(pageHtml({}));
    const late = mountRoot(
      `<section class="section">${linkHtml("p2", "brz-a")}</section>${popupHtml("p2", {}, false)}`
    );
    await initFree([late]);
    const popup = query(document.body, "#p2");

    query(late, "a").click();

    expect(opened).toEqual([popup]);
  });
});

describe("SectionPopup2 click listeners on a published page", () => {
  it("are one on body for every popup and its link", async () => {
    const root = mountRoot(
      `${pageHtml({})}${linkHtml("p2", "brz-btn")}${popupHtml("p2", {}, false)}`
    );
    const listeners = trackClickListeners();
    await initFree([document.body]);
    const targets = listeners.targets();
    listeners.restore();
    const nodes = [
      ...root.querySelectorAll("a"),
      ...document.querySelectorAll(".brz-popup2")
    ];

    expect({
      onBody: targets.filter((target) => target === document.body).length,
      onNodes: targets.filter((target) => nodes.some((node) => node === target))
        .length
    }).toEqual({ onBody: 1, onNodes: 0 });
  });
});

describe("SectionPopup2 conditional popups on a published page", () => {
  const encode = (value: unknown): string =>
    encodeURIComponent(JSON.stringify(value));

  it("hands its parsed conditions to the popup plugin", async () => {
    // The plugin defines `window.brzPopup` when the export is first loaded.
    await initPage(popupHtml("warmup", {}, false));
    const brzPopup = jest.fn();
    Object.defineProperty(window, "brzPopup", {
      configurable: true,
      writable: true,
      value: brzPopup
    });

    const scrolling = { value: "50" };
    const devices = ["desktop"];
    const conditions = {
      [makeAttr("trigger_once")]: "true",
      [makeAttr("page_load")]: "3",
      [makeAttr("click")]: "2",
      [makeAttr("exit_intent")]: "true",
      [makeAttr("scrolling")]: encode(scrolling),
      [makeAttr("devices")]: encode(devices)
    };
    const root = mountRoot(
      `<div class="brz-conditions-popup" ${attrsHtml(conditions)}>${popupHtml("c1", {}, false)}</div>
       <div class="brz-conditions-popup brz-conditions-popup--static">${popupHtml("c2", {}, false)}</div>
       <div class="brz-conditions-popup">   </div>`
    );
    await initFree([root]);

    expect(brzPopup).toHaveBeenCalledTimes(1);
    const options = brzPopup.mock.calls[0][0];
    expect(options).toEqual({
      pageLoad: "3",
      click: "2",
      inactivity: undefined,
      exitIntent: "true",
      scrolling,
      showing: null,
      loggedIn: null,
      referrer: null,
      devices,
      currentUrl: null,
      currentDate: null,
      lastVisitDate: null,
      timeFrom: null,
      cookie: null,
      os: null,
      otherPopups: null,
      specificPopup: null,
      triggerOnce: true,
      popupId: "once-c1",
      show: expect.any(Function),
      hide: expect.any(Function)
    });

    const popup = query(root, "#c1");
    const { show, hide } = optionsSchema.parse(options);

    show();
    const openedAfterShow = popup.classList.contains("brz-popup2--opened");
    hide();

    expect(openedAfterShow).toBe(true);
    expect(popup.classList.contains("brz-popup2--opened")).toBe(false);
    expect(opened).toEqual([popup]);
    expect(closed).toEqual([popup]);
  });
});
