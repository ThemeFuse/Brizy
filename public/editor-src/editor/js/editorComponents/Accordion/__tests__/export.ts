import { z } from "zod";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  initFree,
  loadFreeRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";

// The published Accordion, initialised the way a page does it: the free
// bootstrap with the real manifest receives `init.dom` and loads this export.
// jsdom has no Web Animations API, so `animate` is replaced by a recorder
// whose animations the tests finish by hand.

type Collapsible = "on" | "off";

const TAGS = ["news", "events", "news"];

function accordionHtml(collapsible: Collapsible, withFilter: boolean): string {
  const filterItem = (value: string, active: boolean): string =>
    `<li class="brz-li brz-accordion__filter__item brz-accordion__filter__item--style-1${
      active ? " brz-accordion__filter__item--active" : ""
    }" ${makeAttr("filter")}="${value}">${value}</li>`;

  const filter = withFilter
    ? `<div class="brz-accordion__filter-wrapper">
        <ul class="brz-ul brz-accordion__filter brz-accordion__filter--style-1">
          ${filterItem("*", true)}${filterItem("news", false)}${filterItem("events", false)}
        </ul>
      </div>`
    : "";

  const items = TAGS.map(
    (tag, index) => `
      <div class="brz-accordion__item ${tag}${index === 0 ? " brz-accordion__item--active" : ""}">
        <div class="brz-accordion__nav" ${makeAttr("collapsible")}="${collapsible}">
          <div class="brz-accordion__nav-title">Title ${index}</div>
        </div>
        <div class="brz-accordion__content brz-d-xs-flex brz-flex-xs-column">
          <div class="brz-accordion__item-content">Body ${index}</div>
        </div>
      </div>`
  ).join("");

  return `<div class="brz-accordion" ${makeAttr("duration")}="0">${filter}${items}</div>`;
}

const elementSchema = z.instanceof(HTMLElement);
const elementsSchema = z.array(elementSchema);
const changedDetailsSchema = z.object({
  active: elementSchema,
  tabs: elementsSchema
});

function queryAll(root: HTMLElement, selector: string): HTMLElement[] {
  return elementsSchema.parse(Array.from(root.querySelectorAll(selector)));
}

function nth(nodes: HTMLElement[], index: number): HTMLElement {
  return elementSchema.parse(nodes[index]);
}

interface RecordedAnimation {
  onfinish: VoidFunction | undefined;
}

const animations: RecordedAnimation[] = [];

function finishAnimations(): void {
  for (const animation of animations.splice(0)) {
    animation.onfinish?.();
  }
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

interface ChangedEvent {
  accordion: unknown;
  active: HTMLElement;
}

const changedEvents: ChangedEvent[] = [];
let unbindChanged: VoidFunction = () => undefined;

beforeAll(async () => {
  silenceConsole();
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    writable: true,
    value: () => {
      const animation: RecordedAnimation = { onfinish: undefined };
      animations.push(animation);
      return animation;
    }
  });
  await loadFreeRuntime({ kind: "real" });
  unbindChanged = window.Brz.on(
    "elements.accordion.changed",
    (accordion: unknown, details: unknown) => {
      changedEvents.push({
        accordion,
        active: changedDetailsSchema.parse(details).active
      });
    }
  );
});

afterAll(() => {
  unbindChanged();
  Reflect.deleteProperty(Element.prototype, "animate");
  jest.restoreAllMocks();
});

afterEach(() => {
  animations.length = 0;
  changedEvents.length = 0;
  document.body.innerHTML = "";
});

describe("Accordion on a published page", () => {
  it.each([
    {
      case: "an inactive item when several may be open",
      collapsible: "off",
      click: 1,
      active: [true, true, false],
      changed: 1
    },
    {
      case: "the active item when several may be open",
      collapsible: "off",
      click: 0,
      active: [false, false, false],
      changed: 1
    },
    {
      case: "an inactive item when one must stay open",
      collapsible: "on",
      click: 1,
      active: [false, true, false],
      changed: 2
    },
    {
      case: "the active item when one must stay open",
      collapsible: "on",
      click: 0,
      active: [true, false, false],
      changed: 0
    }
  ] satisfies {
    case: string;
    collapsible: Collapsible;
    click: number;
    active: boolean[];
    changed: number;
  }[])(
    "toggles items after a click on $case",
    async ({ collapsible, click, active, changed }) => {
      const root = mountRoot(accordionHtml(collapsible, false));
      await initFree([root]);
      const items = queryAll(root, ".brz-accordion__item");
      const navs = queryAll(root, ".brz-accordion__nav");

      nth(navs, click).click();
      await nextFrame();
      finishAnimations();

      expect(
        items.map((item) =>
          item.classList.contains("brz-accordion__item--active")
        )
      ).toEqual(active);
      expect(navs.map((nav) => nav.getAttribute("aria-expanded"))).toEqual(
        active.map(String)
      );
      expect(changedEvents).toEqual(
        Array.from({ length: changed }, () => ({
          accordion: root.querySelector(".brz-accordion"),
          active: nth(items, click)
        }))
      );
    }
  );

  it.each([
    { case: "one tag", clicks: ["news"], hidden: [false, true, false] },
    { case: "another tag", clicks: ["events"], hidden: [true, false, true] },
    {
      case: "a tag and then all",
      clicks: ["news", "*"],
      hidden: [false, false, false]
    }
  ])("filters items after choosing $case", async ({ clicks, hidden }) => {
    const root = mountRoot(accordionHtml("off", true));
    await initFree([root]);
    const filterItems = queryAll(root, ".brz-accordion__filter__item");

    for (const value of clicks) {
      const filterItem = filterItems.find(
        (item) => item.getAttribute(makeAttr("filter")) === value
      );
      filterItem?.click();
    }

    expect(
      queryAll(root, ".brz-accordion__item").map((item) =>
        item.classList.contains("brz-accordion__hidden")
      )
    ).toEqual(hidden);
    expect(
      filterItems
        .filter((item) =>
          item.classList.contains("brz-accordion__filter__item--active")
        )
        .map((item) => item.getAttribute(makeAttr("filter")))
    ).toEqual([clicks[clicks.length - 1]]);
  });
});
