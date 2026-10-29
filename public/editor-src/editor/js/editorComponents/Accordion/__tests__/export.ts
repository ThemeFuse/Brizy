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

// Published Accordion; `animate` is a recorder, jsdom has no Web Animations API.

type Collapsible = "on" | "off";

const TAGS = ["news", "2024", "news"];

function accordionHtml(collapsible: Collapsible, withFilter: boolean): string {
  const filterItem = (value: string, active: boolean): string =>
    `<li class="brz-li brz-accordion__filter__item brz-accordion__filter__item--style-1${
      active ? " brz-accordion__filter__item--active" : ""
    }" ${makeAttr("filter")}="${value}">${value}</li>`;

  const filter = withFilter
    ? `<div class="brz-accordion__filter-wrapper">
        <ul class="brz-ul brz-accordion__filter brz-accordion__filter--style-1">
          ${filterItem("*", true)}${filterItem("news", false)}${filterItem("2024", false)}
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

function attrs(nodes: HTMLElement[], name: string): (string | undefined)[] {
  return nodes.map((node) => node.getAttribute(name) ?? undefined);
}

function press(node: HTMLElement, key: string): void {
  node.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
  );
}

function focusedIndex(nodes: HTMLElement[]): number {
  return nodes.findIndex((node) => node === document.activeElement);
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
  tabs: HTMLElement[];
}

const changedEvents: ChangedEvent[] = [];
const replacedProperties: { restore: VoidFunction }[] = [];
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
        ...changedDetailsSchema.parse(details)
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
  jest.useRealTimers();
  for (const replaced of replacedProperties.splice(0)) {
    replaced.restore();
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
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
          active: nth(items, click),
          tabs: items.filter((_, index) => index !== click)
        }))
      );
    }
  );

  it.each([
    { case: "one tag", clicks: ["news"], hidden: [false, true, false] },
    {
      case: "a tag made of digits",
      clicks: ["2024"],
      hidden: [true, false, true]
    },
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

  it.each([
    {
      case: "when several may be open",
      collapsible: "off",
      disabled: ["false", "false", "false"]
    },
    {
      case: "when one must stay open",
      collapsible: "on",
      disabled: ["true", "false", "false"]
    }
  ] satisfies {
    case: string;
    collapsible: Collapsible;
    disabled: string[];
  }[])(
    "labels the items for assistive technology $case",
    async ({ collapsible, disabled }) => {
      const root = mountRoot(accordionHtml(collapsible, true));
      await initFree([root]);
      const navs = queryAll(root, ".brz-accordion__nav");
      const contents = queryAll(root, ".brz-accordion__content");
      const filterItems = queryAll(root, ".brz-accordion__filter__item");

      expect({
        roles: attrs(navs, "role"),
        tabIndexes: attrs(navs, "tabindex"),
        controls: attrs(navs, "aria-controls"),
        expanded: attrs(navs, "aria-expanded"),
        disabled: attrs(navs, "aria-disabled"),
        panelRoles: attrs(contents, "role"),
        panelLabels: attrs(contents, "aria-labelledby"),
        panelsHidden: attrs(contents, "aria-hidden"),
        filterRoles: attrs(filterItems, "role"),
        filterIndexes: attrs(filterItems, "tabindex"),
        filtersPressed: attrs(filterItems, "aria-pressed")
      }).toEqual({
        roles: ["button", "button", "button"],
        tabIndexes: ["0", "0", "0"],
        controls: contents.map((content) => content.id),
        expanded: ["true", "false", "false"],
        disabled,
        panelRoles: ["region", "region", "region"],
        panelLabels: navs.map((nav) => nav.id),
        panelsHidden: ["false", "true", "true"],
        filterRoles: ["button", "button", "button"],
        filterIndexes: ["0", "0", "0"],
        filtersPressed: ["true", "false", "false"]
      });
      expect(new Set([...navs, ...contents].map((node) => node.id)).size).toBe(
        TAGS.length * 2
      );
    }
  );

  it.each([
    {
      case: "Enter",
      from: 1,
      key: "Enter",
      active: [true, true, false],
      focused: 1
    },
    {
      case: "Space",
      from: 0,
      key: " ",
      active: [false, false, false],
      focused: 0
    },
    {
      case: "ArrowDown",
      from: 0,
      key: "ArrowDown",
      active: [true, false, false],
      focused: 1
    },
    {
      case: "ArrowDown on the last item",
      from: 2,
      key: "ArrowDown",
      active: [true, false, false],
      focused: 0
    },
    {
      case: "ArrowUp on the first item",
      from: 0,
      key: "ArrowUp",
      active: [true, false, false],
      focused: 2
    },
    {
      case: "Home",
      from: 2,
      key: "Home",
      active: [true, false, false],
      focused: 0
    },
    {
      case: "End",
      from: 0,
      key: "End",
      active: [true, false, false],
      focused: 2
    }
  ])(
    "follows the keyboard on the item headers: $case",
    async ({ from, key, active, focused }) => {
      const root = mountRoot(accordionHtml("off", false));
      await initFree([root]);
      const items = queryAll(root, ".brz-accordion__item");
      const navs = queryAll(root, ".brz-accordion__nav");
      const nav = nth(navs, from);

      nav.focus();
      press(nav, key);
      await nextFrame();
      finishAnimations();

      expect(
        items.map((item) =>
          item.classList.contains("brz-accordion__item--active")
        )
      ).toEqual(active);
      expect(attrs(navs, "aria-expanded")).toEqual(active.map(String));
      expect(focusedIndex(navs)).toBe(focused);
    }
  );

  it.each([
    {
      case: "Enter",
      from: 1,
      key: "Enter",
      hidden: [false, true, false],
      pressed: 1,
      focused: 1
    },
    {
      case: "Space",
      from: 2,
      key: " ",
      hidden: [true, false, true],
      pressed: 2,
      focused: 2
    },
    {
      case: "ArrowRight",
      from: 0,
      key: "ArrowRight",
      hidden: [false, false, false],
      pressed: 0,
      focused: 1
    },
    {
      case: "ArrowDown on the last tag",
      from: 2,
      key: "ArrowDown",
      hidden: [false, false, false],
      pressed: 0,
      focused: 0
    },
    {
      case: "ArrowLeft on the first tag",
      from: 0,
      key: "ArrowLeft",
      hidden: [false, false, false],
      pressed: 0,
      focused: 2
    },
    {
      case: "ArrowUp",
      from: 2,
      key: "ArrowUp",
      hidden: [false, false, false],
      pressed: 0,
      focused: 1
    },
    {
      case: "Home",
      from: 2,
      key: "Home",
      hidden: [false, false, false],
      pressed: 0,
      focused: 0
    },
    {
      case: "End",
      from: 0,
      key: "End",
      hidden: [false, false, false],
      pressed: 0,
      focused: 2
    }
  ])(
    "follows the keyboard on the tags: $case",
    async ({ from, key, hidden, pressed, focused }) => {
      const root = mountRoot(accordionHtml("off", true));
      await initFree([root]);
      const filterItems = queryAll(root, ".brz-accordion__filter__item");
      const filterItem = nth(filterItems, from);

      filterItem.focus();
      press(filterItem, key);

      expect(
        queryAll(root, ".brz-accordion__item").map((item) =>
          item.classList.contains("brz-accordion__hidden")
        )
      ).toEqual(hidden);
      expect(attrs(filterItems, "aria-pressed")).toEqual(
        filterItems.map((_, index) => String(index === pressed))
      );
      expect(focusedIndex(filterItems)).toBe(focused);
    }
  );

  it.each([
    {
      case: "above the viewport, under a sticky header",
      collapsible: "off",
      top: -300,
      scrollY: 500,
      stickyHeader: 60,
      scrollTop: 140
    },
    {
      case: "above the viewport, without a sticky header",
      collapsible: "off",
      top: -300,
      scrollY: 500,
      stickyHeader: undefined,
      scrollTop: 200
    },
    {
      case: "above the viewport, when one must stay open",
      collapsible: "on",
      top: -300,
      scrollY: 500,
      stickyHeader: 60,
      scrollTop: 140
    },
    {
      case: "inside the viewport",
      collapsible: "off",
      top: 100,
      scrollY: 50,
      stickyHeader: 60,
      scrollTop: 0
    }
  ] satisfies {
    case: string;
    collapsible: Collapsible;
    top: number;
    scrollY: number;
    stickyHeader: number | undefined;
    scrollTop: number;
  }[])(
    "scrolls to an opened item that ends up $case",
    async ({ collapsible, top, scrollY, stickyHeader, scrollTop }) => {
      const sticky =
        stickyHeader === undefined
          ? ""
          : `<div class="brz-section__header-sticky-item" style="height: ${stickyHeader}px"></div>`;
      const root = mountRoot(`${sticky}${accordionHtml(collapsible, false)}`);
      await initFree([root]);
      const item = nth(queryAll(root, ".brz-accordion__item"), 1);
      const rect = new DOMRect(0, top, 300, 40);

      jest.spyOn(item, "getBoundingClientRect").mockReturnValue(rect);
      jest
        .spyOn(item, "getClientRects")
        .mockReturnValue(Object.assign([rect], { item: () => rect }));
      replacedProperties.push(
        jest.replaceProperty(window, "scrollY", scrollY),
        jest.replaceProperty(window, "pageYOffset", scrollY)
      );
      jest.useFakeTimers();

      nth(queryAll(root, ".brz-accordion__nav"), 1).click();
      jest.advanceTimersByTime(50);
      finishAnimations();
      jest.advanceTimersByTime(1000);

      expect({
        html: document.documentElement.scrollTop,
        body: document.body.scrollTop
      }).toEqual({ html: scrollTop, body: scrollTop });
    }
  );

  it("keeps two accordions on one page apart", async () => {
    const root = mountRoot(
      `${accordionHtml("off", true)}${accordionHtml("off", true)}`
    );
    await initFree([root]);
    const [first, second] = queryAll(root, ".brz-accordion");
    const firstAccordion = elementSchema.parse(first);
    const secondAccordion = elementSchema.parse(second);

    nth(queryAll(secondAccordion, ".brz-accordion__nav"), 2).click();
    nth(queryAll(secondAccordion, ".brz-accordion__filter__item"), 2).click();
    await nextFrame();
    finishAnimations();

    const stateOf = (accordion: HTMLElement): unknown =>
      queryAll(accordion, ".brz-accordion__item").map((item) => ({
        active: item.classList.contains("brz-accordion__item--active"),
        hidden: item.classList.contains("brz-accordion__hidden")
      }));

    expect(stateOf(firstAccordion)).toEqual([
      { active: true, hidden: false },
      { active: false, hidden: false },
      { active: false, hidden: false }
    ]);
    expect(stateOf(secondAccordion)).toEqual([
      { active: true, hidden: true },
      { active: false, hidden: false },
      { active: true, hidden: true }
    ]);
    expect(changedEvents.map((event) => event.accordion)).toEqual([
      secondAccordion
    ]);
  });

  it.each([
    {
      case: "the title of an item",
      withFilter: false,
      target: ".brz-accordion__nav-title",
      index: 1,
      state: {
        active: [true, true, false],
        hidden: [false, false, false]
      }
    },
    {
      case: "a tag",
      withFilter: true,
      target: ".brz-accordion__filter__item",
      index: 1,
      state: {
        active: [true, false, false],
        hidden: [false, true, false]
      }
    }
  ])(
    "has done its work when a click on $case reaches the page around it",
    async ({ withFilter, target, index, state }) => {
      const root = mountRoot(accordionHtml("off", withFilter));
      await initFree([root]);
      const read = () => {
        const items = queryAll(root, ".brz-accordion__item");

        return {
          active: items.map((item) =>
            item.classList.contains("brz-accordion__item--active")
          ),
          hidden: items.map((item) =>
            item.classList.contains("brz-accordion__hidden")
          )
        };
      };
      const seen = stopClicksAt(root, read);

      nth(queryAll(root, target), index).click();
      await nextFrame();
      finishAnimations();

      expect(seen).toEqual([state]);
      expect(read()).toEqual(state);
    }
  );

  it("toggles an accordion of a root initialised inside another once", async () => {
    const outer = mountRoot(accordionHtml("off", false));
    await initFree([outer]);
    const inner = document.createElement("div");
    inner.innerHTML = accordionHtml("off", false);
    outer.append(inner);
    await initFree([inner]);
    const accordion = elementSchema.parse(
      inner.querySelector(".brz-accordion")
    );
    const items = queryAll(accordion, ".brz-accordion__item");

    nth(queryAll(accordion, ".brz-accordion__nav"), 1).click();
    await nextFrame();
    finishAnimations();

    expect(
      items.map((item) =>
        item.classList.contains("brz-accordion__item--active")
      )
    ).toEqual([true, true, false]);
    expect(changedEvents.map((event) => event.accordion)).toEqual([accordion]);
  });

  it("listens for the clicks of every accordion with one listener on body", async () => {
    const root = mountRoot(
      `${accordionHtml("off", true)}${accordionHtml("on", true)}`
    );
    const listeners = trackClickListeners();
    await initFree([root]);
    const targets = listeners.targets();
    listeners.restore();

    expect(targets).toEqual([document.body]);
  });
});
