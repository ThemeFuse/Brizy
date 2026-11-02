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

// The published first-generation popup, initialised the way a page does it.
// Every test starts from a fresh runtime, as a fresh page would.

const elementSchema = z.instanceof(HTMLElement);

function popupHtml(id: string): string {
  return `<div class="brz-popup" id="${id}" ${makeAttr("popup")}="${id}">
    <div class="brz-popup__inner">
      <div class="brz-container"><p class="content">Content</p></div>
    </div>
  </div>`;
}

function pageHtml(id: string): string {
  return `<section class="section"><a class="brz-a" ${makeAttr("link-type")}="popup" href="#${id}">Open</a></section>${popupHtml(id)}`;
}

function query(root: ParentNode, selector: string): HTMLElement {
  return elementSchema.parse(root.querySelector(selector));
}

const html = document.documentElement;

const opened: unknown[] = [];
const closed: unknown[] = [];

beforeAll(() => {
  silenceConsole();
});

beforeEach(async () => {
  await loadFreeRuntime({ kind: "real" });
  window.Brz.on("elements.popup.open", (node: unknown) => opened.push(node));
  window.Brz.on("elements.popup.close", (node: unknown) => closed.push(node));
});

afterEach(() => {
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

describe("SectionPopup on a published page", () => {
  it("opens from its link", async () => {
    const root = mountRoot(pageHtml("v1"));
    await initFree([document.body]);
    const popup = query(root, ".brz-popup");

    query(root, "a").click();

    expect(popup.classList.contains("brz-popup--opened")).toBe(true);
    expect(html.classList.contains("brz-ow-hidden")).toBe(true);
    expect(opened).toEqual([popup]);
  });

  it.each([
    { case: "the backdrop", target: ".brz-popup__inner", closes: true },
    { case: "the content", target: ".content", closes: false }
  ])("after a click on $case", async ({ target, closes }) => {
    const root = mountRoot(pageHtml("v1"));
    await initFree([document.body]);
    const popup = query(root, ".brz-popup");
    query(root, "a").click();

    query(popup, target).click();

    expect(popup.classList.contains("brz-popup--opened")).toBe(!closes);
    expect(html.classList.contains("brz-ow-hidden")).toBe(!closes);
    expect(closed).toEqual(closes ? [popup] : []);
  });

  it("closes when an anchor inside it starts scrolling", async () => {
    const root = mountRoot(pageHtml("v1"));
    await initFree([document.body]);
    const popup = query(root, ".brz-popup");
    query(root, "a").click();

    window.Brz.emit("elements.anchor.startScrolled", query(popup, ".content"));

    expect(popup.classList.contains("brz-popup--opened")).toBe(false);
    expect(closed).toEqual([popup]);
  });

  it("marks every popup of the document but binds only those in its root", async () => {
    const outside = mountRoot(popupHtml("outer"));
    const root = mountRoot(pageHtml("v1"));
    await initFree([root]);
    const outer = query(outside, ".brz-popup");
    outer.classList.add("brz-popup--opened");

    query(outer, ".brz-popup__inner").click();

    expect(
      [query(root, ".brz-popup"), outer].map((popup) =>
        popup.classList.contains("brz-initialized")
      )
    ).toEqual([true, true]);
    expect(outer.classList.contains("brz-popup--opened")).toBe(true);
    expect(closed).toEqual([]);
  });

  it("keeps its current behaviour after a second init.dom", async () => {
    const root = mountRoot(pageHtml("v1"));
    await initFree([document.body]);
    await initFree([document.body]);
    const popup = query(root, ".brz-popup");

    query(root, "a").click();
    query(popup, ".brz-popup__inner").click();

    expect(opened).toEqual([popup, popup]);
    expect(closed).toEqual([popup]);
  });

  it("is recorded as shown by the SectionPopup2 plugin on a mixed page", async () => {
    const root = mountRoot(
      `${pageHtml("v1")}<div class="brz-popup2" ${makeAttr("popup")}="v2"></div>`
    );
    await initFree([document.body]);
    query(root, "a").click();
    const popup = query(document.body, ".brz-popup");

    query(popup, ".brz-popup__inner").click();

    expect(closed).toEqual([popup]);
    expect(JSON.parse(localStorage.getItem("brz-showedPopups") ?? "")).toEqual([
      null
    ]);
  });

  it("is open when the click on its link reaches the page around it", async () => {
    const root = mountRoot(pageHtml("v1"));
    await initFree([document.body]);
    const popup = query(root, ".brz-popup");
    const seen = stopClicksAt(query(root, ".section"), () =>
      popup.classList.contains("brz-popup--opened")
    );

    query(root, "a").click();

    expect(seen).toEqual([true]);
    expect(opened).toEqual([popup]);
  });

  it("closes on a click that its backdrop keeps to itself", async () => {
    const root = mountRoot(pageHtml("v1"));
    await initFree([document.body]);
    const popup = query(root, ".brz-popup");
    query(root, "a").click();
    const backdrop = query(popup, ".brz-popup__inner");
    backdrop.addEventListener("click", (event) => event.stopPropagation());

    backdrop.click();

    expect(popup.classList.contains("brz-popup--opened")).toBe(false);
    expect(closed).toEqual([popup]);
  });

  it("opens and closes once in a root initialised after the page", async () => {
    mountRoot(pageHtml("v1"));
    await initFree([document.body]);
    const late = mountRoot(pageHtml("late"));
    await initFree([late]);
    const popup = query(late, ".brz-popup");

    query(late, "a").click();
    query(popup, ".brz-popup__inner").click();

    expect(opened).toEqual([popup]);
    expect(closed).toEqual([popup]);
  });

  it("listens for every popup and its link with one listener on body", async () => {
    const root = mountRoot(`${pageHtml("v1")}${pageHtml("v2")}`);
    const listeners = trackClickListeners();
    await initFree([document.body]);
    const targets = listeners.targets();
    listeners.restore();
    const nodes = Array.from(root.querySelectorAll("a, .brz-popup"));

    expect({
      onBody: targets.filter((target) => target === document.body).length,
      onNodes: targets.filter((target) => nodes.some((node) => node === target))
        .length
    }).toEqual({ onBody: 1, onNodes: 0 });
  });
});
