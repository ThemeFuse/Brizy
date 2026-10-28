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

// The published Tabs, loaded by the free bootstrap through its real manifest.

type Action = "click" | "hover";
type Orientation = "horizontal" | "vertical";

interface TabsConfig {
  id: string;
  action: Action;
  orientation: Orientation;
}

const COUNT = 3;
const defaultConfig: TabsConfig = {
  id: "tabs-a",
  action: "click",
  orientation: "horizontal"
};

function tabsHtml({ id, action, orientation }: TabsConfig): string {
  const indexes = Array.from({ length: COUNT }, (_, index) => index);
  const button = (index: number): string =>
    `<div class="brz-tabs__nav--button"><span class="label">Tab ${index}</span></div>`;

  const nav = indexes
    .map(
      (index) =>
        `<li class="brz-tabs__nav--item brz-tabs__nav--desktop${
          index === 0 ? " brz-tabs__nav--active" : ""
        }">${button(index)}</li>`
    )
    .join("");

  const items = indexes
    .map(
      (index) => `
      <div class="brz-tabs__items${index === 0 ? " brz-tabs__items--active" : ""}">
        <div class="brz-tabs__nav--mobile${
          index === 0 ? " brz-tabs__nav--mobile--active" : ""
        }">${button(index)}</div>
        <div class="brz-tabs__item--content brz-d-xs-flex brz-flex-xs-column">Body ${index}</div>
      </div>`
    )
    .join("");

  return `<div class="brz-tabs brz-tabs--${orientation}" ${makeAttr("action")}="${action}" ${makeAttr("tabs-id")}="${id}">
    <ul class="brz-tabs__nav brz-tabs__nav--${orientation}">${nav}</ul>
    <div class="brz-tabs__content brz-tabs__content--${orientation}">${items}</div>
  </div>`;
}

const elementSchema = z.instanceof(HTMLElement);
const elementsSchema = z.array(elementSchema);
const changedDetailsSchema = z.object({
  active: elementSchema,
  tabs: elementsSchema
});

function queryAll(root: ParentNode, selector: string): HTMLElement[] {
  return elementsSchema.parse(Array.from(root.querySelectorAll(selector)));
}

function nth(nodes: HTMLElement[], index: number): HTMLElement {
  return elementSchema.parse(nodes[index]);
}

interface Parts {
  tabs: HTMLElement;
  nav: HTMLElement;
  navItems: HTMLElement[];
  navButtons: HTMLElement[];
  items: HTMLElement[];
  mobileHeaders: HTMLElement[];
  mobileButtons: HTMLElement[];
  contents: HTMLElement[];
}

function partsOf(root: ParentNode, id: string): Parts {
  const tabs = elementSchema.parse(
    root.querySelector(`[${makeAttr("tabs-id")}="${id}"]`)
  );

  return {
    tabs,
    nav: elementSchema.parse(tabs.querySelector(".brz-tabs__nav")),
    navItems: queryAll(tabs, ".brz-tabs__nav > li"),
    navButtons: queryAll(tabs, ".brz-tabs__nav .brz-tabs__nav--button"),
    items: queryAll(tabs, ".brz-tabs__items"),
    mobileHeaders: queryAll(tabs, ".brz-tabs__nav--mobile"),
    mobileButtons: queryAll(
      tabs,
      ".brz-tabs__nav--mobile .brz-tabs__nav--button"
    ),
    contents: queryAll(tabs, ".brz-tabs__item--content")
  };
}

function activeIndexes(nodes: HTMLElement[], className: string): number[] {
  return nodes.flatMap((node, index) =>
    node.classList.contains(className) ? [index] : []
  );
}

function childrenOf(node: Element, selector: string): HTMLElement[] {
  return elementsSchema.parse(
    Array.from(node.children).filter((child) => child.matches(selector))
  );
}

// The tabs and panels that belong to this tabs element, not to one inside it.
function ownParts(tabs: HTMLElement): {
  navItems: HTMLElement[];
  items: HTMLElement[];
} {
  return {
    navItems: childrenOf(tabs, ".brz-tabs__nav").flatMap((nav) =>
      childrenOf(nav, "li")
    ),
    items: childrenOf(tabs, ".brz-tabs__content").flatMap((content) =>
      childrenOf(content, ".brz-tabs__items")
    )
  };
}

function ownActive(tabs: HTMLElement): { nav: number[]; items: number[] } {
  const { navItems, items } = ownParts(tabs);

  return {
    nav: activeIndexes(navItems, "brz-tabs__nav--active"),
    items: activeIndexes(items, "brz-tabs__items--active")
  };
}

function attrs(nodes: HTMLElement[], name: string): (string | undefined)[] {
  return nodes.map((node) => node.getAttribute(name) ?? undefined);
}

interface State {
  nav: number[];
  items: number[];
  mobile: number[];
  selected: (string | undefined)[];
  expanded: (string | undefined)[];
}

function stateOf(parts: Parts): State {
  return {
    nav: activeIndexes(parts.navItems, "brz-tabs__nav--active"),
    items: activeIndexes(parts.items, "brz-tabs__items--active"),
    mobile: activeIndexes(parts.mobileHeaders, "brz-tabs__nav--mobile--active"),
    selected: attrs(parts.navButtons, "aria-selected"),
    expanded: attrs(parts.mobileButtons, "aria-expanded")
  };
}

function stateWith(desktop: number, mobile: number): State {
  const flags = (active: number): string[] =>
    Array.from({ length: COUNT }, (_, index) => String(index === active));

  return {
    nav: [desktop],
    items: [mobile],
    mobile: [mobile],
    selected: flags(desktop),
    expanded: flags(mobile)
  };
}

function hover(node: HTMLElement): void {
  node.dispatchEvent(
    new MouseEvent("mouseenter", { relatedTarget: document.body })
  );
}

function press(node: HTMLElement, key: string): void {
  node.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
  );
}

function focusedIndex(nodes: HTMLElement[]): number {
  return nodes.findIndex((node) => node === document.activeElement);
}

function storedIndex(id: string): string | undefined {
  return localStorage.getItem(`brz-tabs-active:${id}`) ?? undefined;
}

interface ChangedEvent {
  node: unknown;
  active: HTMLElement;
  tabs: HTMLElement[];
}

const changedEvents: ChangedEvent[] = [];
const replacedProperties: { restore: VoidFunction }[] = [];
let unbindChanged: VoidFunction = () => undefined;

beforeAll(async () => {
  silenceConsole();
  await loadFreeRuntime({ kind: "real" });
  unbindChanged = window.Brz.on(
    "elements.tabs.changed",
    (node: unknown, details: unknown) => {
      changedEvents.push({ node, ...changedDetailsSchema.parse(details) });
    }
  );
});

afterAll(() => {
  unbindChanged();
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
  for (const replaced of replacedProperties.splice(0)) {
    replaced.restore();
  }
  changedEvents.length = 0;
  localStorage.clear();
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.body.innerHTML = "";
});

describe("Tabs on a published page", () => {
  it.each([
    { orientation: "horizontal" },
    { orientation: "vertical" }
  ] satisfies {
    orientation: Orientation;
  }[])(
    "labels $orientation tabs for assistive technology",
    async ({ orientation }) => {
      const root = mountRoot(tabsHtml({ ...defaultConfig, orientation }));
      await initFree([root]);
      const parts = partsOf(root, defaultConfig.id);

      expect({
        navRole: parts.nav.getAttribute("role"),
        navOrientation: parts.nav.getAttribute("aria-orientation"),
        tabRoles: attrs(parts.navButtons, "role"),
        tabIndexes: attrs(parts.navButtons, "tabindex"),
        tabControls: attrs(parts.navButtons, "aria-controls"),
        panelRoles: attrs(parts.items, "role"),
        panelLabels: attrs(parts.items, "aria-labelledby"),
        panelsHidden: attrs(parts.items, "aria-hidden"),
        mobileRoles: attrs(parts.mobileButtons, "role"),
        mobileIndexes: attrs(parts.mobileButtons, "tabindex"),
        mobileControls: attrs(parts.mobileButtons, "aria-controls"),
        regionRoles: attrs(parts.contents, "role"),
        regionLabels: attrs(parts.contents, "aria-labelledby"),
        regionsHidden: attrs(parts.contents, "aria-hidden")
      }).toEqual({
        navRole: "tablist",
        navOrientation: orientation,
        tabRoles: ["tab", "tab", "tab"],
        tabIndexes: ["0", "-1", "-1"],
        tabControls: parts.items.map((item) => item.id),
        panelRoles: ["tabpanel", "tabpanel", "tabpanel"],
        panelLabels: parts.navButtons.map((button) => button.id),
        panelsHidden: ["false", "true", "true"],
        mobileRoles: ["button", "button", "button"],
        mobileIndexes: ["0", "0", "0"],
        mobileControls: parts.contents.map((content) => content.id),
        regionRoles: ["region", "region", "region"],
        regionLabels: parts.mobileButtons.map((button) => button.id),
        regionsHidden: ["false", "true", "true"]
      });
      expect(
        new Set(
          [
            ...parts.navButtons,
            ...parts.items,
            ...parts.mobileButtons,
            ...parts.contents
          ].map((node) => node.id)
        ).size
      ).toBe(COUNT * 4);
      expect(stateOf(parts)).toEqual(stateWith(0, 0));
      expect(changedEvents).toEqual([]);
    }
  );

  it.each([
    {
      case: "a click on another tab",
      action: "click",
      gesture: "click",
      target: 1,
      active: 1,
      changed: 1
    },
    {
      case: "a click on the last tab",
      action: "click",
      gesture: "click",
      target: 2,
      active: 2,
      changed: 1
    },
    {
      case: "a click on the active tab",
      action: "click",
      gesture: "click",
      target: 0,
      active: 0,
      changed: 1
    },
    {
      case: "a hover when tabs open on click",
      action: "click",
      gesture: "hover",
      target: 1,
      active: 0,
      changed: 0
    },
    {
      case: "a hover when tabs open on hover",
      action: "hover",
      gesture: "hover",
      target: 1,
      active: 1,
      changed: 1
    },
    {
      case: "a click when tabs open on hover",
      action: "hover",
      gesture: "click",
      target: 2,
      active: 2,
      changed: 1
    }
  ] satisfies {
    case: string;
    action: Action;
    gesture: "click" | "hover";
    target: number;
    active: number;
    changed: number;
  }[])(
    "shows the right tab after $case",
    async ({ action, gesture, target, active, changed }) => {
      const root = mountRoot(tabsHtml({ ...defaultConfig, action }));
      await initFree([root]);
      const parts = partsOf(root, defaultConfig.id);
      const navItem = nth(parts.navItems, target);

      if (gesture === "click") {
        elementSchema.parse(navItem.querySelector(".label")).click();
      } else {
        hover(navItem);
      }

      expect(stateOf(parts)).toEqual(stateWith(active, active));
      expect(changedEvents).toEqual(
        Array.from({ length: changed }, () => ({
          node: parts.tabs,
          active: nth(parts.items, active),
          tabs: parts.items
        }))
      );
      expect(storedIndex(defaultConfig.id)).toBe(
        changed === 0 ? undefined : String(active)
      );
    }
  );

  it.each([
    { case: "another tab", target: 1 },
    { case: "the last tab", target: 2 },
    { case: "the active tab", target: 0 }
  ])("opens $case from its mobile header", async ({ target }) => {
    const root = mountRoot(tabsHtml(defaultConfig));
    await initFree([root]);
    const parts = partsOf(root, defaultConfig.id);
    const item = nth(parts.items, target);

    nth(parts.mobileButtons, target).click();

    expect(stateOf(parts)).toEqual(stateWith(0, target));
    expect(changedEvents).toEqual([
      { node: item, active: item, tabs: parts.items }
    ]);
    expect(storedIndex(defaultConfig.id)).toBe(String(target));
  });

  it.each([
    {
      case: "above the viewport, under a sticky header",
      top: -300,
      scrollY: 500,
      stickyHeader: 60,
      scrollTop: 140
    },
    {
      case: "above the viewport, without a sticky header",
      top: -300,
      scrollY: 500,
      stickyHeader: undefined,
      scrollTop: 200
    },
    {
      case: "inside the viewport",
      top: 100,
      scrollY: 50,
      stickyHeader: 60,
      scrollTop: 0
    }
  ])(
    "scrolls to a mobile header that ends up $case",
    async ({ top, scrollY, stickyHeader, scrollTop }) => {
      const sticky =
        stickyHeader === undefined
          ? ""
          : `<div class="brz-section__header-sticky-item" style="height: ${stickyHeader}px"></div>`;
      const root = mountRoot(`${sticky}${tabsHtml(defaultConfig)}`);
      await initFree([root]);
      const parts = partsOf(root, defaultConfig.id);
      const header = nth(parts.mobileHeaders, 1);
      const rect = new DOMRect(0, top, 300, 40);

      jest.spyOn(header, "getBoundingClientRect").mockReturnValue(rect);
      jest
        .spyOn(header, "getClientRects")
        .mockReturnValue(Object.assign([rect], { item: () => rect }));
      replacedProperties.push(
        jest.replaceProperty(window, "scrollY", scrollY),
        jest.replaceProperty(window, "pageYOffset", scrollY)
      );
      jest.useFakeTimers();

      header.click();
      jest.advanceTimersByTime(100);
      jest.advanceTimersByTime(400);

      expect({
        html: document.documentElement.scrollTop,
        body: document.body.scrollTop
      }).toEqual({ html: scrollTop, body: scrollTop });
    }
  );

  it.each([
    { case: "another tab", stored: "2", active: 2, changed: 1 },
    { case: "the tab already active", stored: "0", active: 0, changed: 0 },
    { case: "a tab that no longer exists", stored: "7", active: 0, changed: 0 },
    { case: "a negative index", stored: "-1", active: 0, changed: 0 },
    { case: "a fractional index", stored: "1.5", active: 0, changed: 0 },
    {
      case: "something that is not a number",
      stored: "second",
      active: 0,
      changed: 0
    }
  ])("restores $case from storage", async ({ stored, active, changed }) => {
    localStorage.setItem(`brz-tabs-active:${defaultConfig.id}`, stored);
    const root = mountRoot(tabsHtml(defaultConfig));
    await initFree([root]);
    const parts = partsOf(root, defaultConfig.id);

    expect(stateOf(parts)).toEqual(stateWith(active, active));
    expect(changedEvents).toEqual(
      Array.from({ length: changed }, () => ({
        node: parts.tabs,
        active: nth(parts.items, active),
        tabs: parts.items
      }))
    );
  });

  it.each([
    {
      case: "ArrowRight in horizontal tabs",
      orientation: "horizontal",
      from: 0,
      key: "ArrowRight",
      active: 1,
      focused: 1
    },
    {
      case: "ArrowLeft on the first horizontal tab",
      orientation: "horizontal",
      from: 0,
      key: "ArrowLeft",
      active: 2,
      focused: 2
    },
    {
      case: "ArrowDown in horizontal tabs",
      orientation: "horizontal",
      from: 0,
      key: "ArrowDown",
      active: 0,
      focused: 1
    },
    {
      case: "ArrowUp in horizontal tabs",
      orientation: "horizontal",
      from: 0,
      key: "ArrowUp",
      active: 0,
      focused: 2
    },
    {
      case: "ArrowDown in vertical tabs",
      orientation: "vertical",
      from: 0,
      key: "ArrowDown",
      active: 1,
      focused: 1
    },
    {
      case: "ArrowUp on the first vertical tab",
      orientation: "vertical",
      from: 0,
      key: "ArrowUp",
      active: 2,
      focused: 2
    },
    {
      case: "ArrowRight in vertical tabs",
      orientation: "vertical",
      from: 0,
      key: "ArrowRight",
      active: 0,
      focused: 0
    },
    {
      case: "End",
      orientation: "horizontal",
      from: 0,
      key: "End",
      active: 2,
      focused: 2
    },
    {
      case: "Home",
      orientation: "horizontal",
      from: 2,
      key: "Home",
      active: 0,
      focused: 0
    },
    {
      case: "Enter on another tab",
      orientation: "horizontal",
      from: 1,
      key: "Enter",
      active: 1,
      focused: 1
    },
    {
      case: "Space on another tab",
      orientation: "horizontal",
      from: 2,
      key: " ",
      active: 2,
      focused: 2
    }
  ] satisfies {
    case: string;
    orientation: Orientation;
    from: number;
    key: string;
    active: number;
    focused: number;
  }[])(
    "follows the keyboard on the tab list: $case",
    async ({ orientation, from, key, active, focused }) => {
      const root = mountRoot(tabsHtml({ ...defaultConfig, orientation }));
      await initFree([root]);
      const parts = partsOf(root, defaultConfig.id);
      const button = nth(parts.navButtons, from);

      button.focus();
      press(button, key);

      expect(stateOf(parts)).toEqual(stateWith(active, active));
      expect(focusedIndex(parts.navButtons)).toBe(focused);
      expect(attrs(parts.navButtons, "tabindex")).toEqual(
        parts.navButtons.map((_, index) => (index === active ? "0" : "-1"))
      );
    }
  );

  it.each([
    { case: "Enter", from: 1, key: "Enter", open: 1, focused: 1 },
    { case: "Space", from: 2, key: " ", open: 2, focused: 2 },
    { case: "ArrowDown", from: 0, key: "ArrowDown", open: 0, focused: 1 },
    { case: "ArrowRight", from: 2, key: "ArrowRight", open: 0, focused: 0 },
    { case: "ArrowUp", from: 0, key: "ArrowUp", open: 0, focused: 2 },
    { case: "ArrowLeft", from: 1, key: "ArrowLeft", open: 0, focused: 0 },
    { case: "Home", from: 2, key: "Home", open: 0, focused: 0 },
    { case: "End", from: 0, key: "End", open: 0, focused: 2 }
  ])(
    "follows the keyboard on the mobile headers: $case",
    async ({ from, key, open, focused }) => {
      const root = mountRoot(tabsHtml(defaultConfig));
      await initFree([root]);
      const parts = partsOf(root, defaultConfig.id);
      const button = nth(parts.mobileButtons, from);

      button.focus();
      press(button, key);

      expect(stateOf(parts)).toEqual(stateWith(0, open));
      expect(focusedIndex(parts.mobileButtons)).toBe(focused);
    }
  );

  it("keeps two tabs elements on one page apart", async () => {
    const other: TabsConfig = { ...defaultConfig, id: "tabs-b" };
    const root = mountRoot(`${tabsHtml(defaultConfig)}${tabsHtml(other)}`);
    await initFree([root]);
    const first = partsOf(root, defaultConfig.id);
    const second = partsOf(root, other.id);

    nth(second.navButtons, 2).click();
    nth(second.mobileButtons, 1).click();

    expect(stateOf(first)).toEqual(stateWith(0, 0));
    expect(stateOf(second)).toEqual(stateWith(2, 1));
    expect(changedEvents.map((event) => event.node)).toEqual([
      second.tabs,
      nth(second.items, 1)
    ]);
    expect({
      first: storedIndex(defaultConfig.id),
      second: storedIndex(other.id)
    }).toEqual({ first: undefined, second: "1" });
  });

  it.each([
    {
      case: "the label of a tab",
      part: "navButtons",
      target: 1,
      state: stateWith(1, 1)
    },
    {
      case: "a mobile header",
      part: "mobileButtons",
      target: 2,
      state: stateWith(0, 2)
    }
  ] satisfies {
    case: string;
    part: "navButtons" | "mobileButtons";
    target: number;
    state: State;
  }[])(
    "has changed tab when a click on $case reaches the page around it",
    async ({ part, target, state }) => {
      const root = mountRoot(tabsHtml(defaultConfig));
      await initFree([root]);
      const parts = partsOf(root, defaultConfig.id);
      const seen = stopClicksAt(root, () => stateOf(parts));

      nth(parts[part], target).click();

      expect(seen).toEqual([state]);
      expect(changedEvents).toHaveLength(1);
    }
  );

  it.each([
    { case: "its tab bar", part: "navButtons", state: stateWith(1, 1) },
    { case: "a mobile header", part: "mobileButtons", state: stateWith(0, 1) }
  ] satisfies {
    case: string;
    part: "navButtons" | "mobileButtons";
    state: State;
  }[])(
    "answers once from $case in a root initialised inside another",
    async ({ part, state }) => {
      const other: TabsConfig = { ...defaultConfig, id: "tabs-b" };
      const outer = mountRoot(tabsHtml(defaultConfig));
      await initFree([outer]);
      const inner = document.createElement("div");
      inner.innerHTML = tabsHtml(other);
      outer.append(inner);
      await initFree([inner]);
      const parts = partsOf(inner, other.id);

      nth(parts[part], 1).click();

      expect(stateOf(parts)).toEqual(state);
      expect(stateOf(partsOf(outer, defaultConfig.id))).toEqual(
        stateWith(0, 0)
      );
      expect(changedEvents).toHaveLength(1);
    }
  );

  it.each([
    {
      case: "the tabs inside",
      clicked: "tabs-b",
      active: {
        "tabs-a": { nav: [0], items: [0] },
        "tabs-b": { nav: [1], items: [1] }
      }
    },
    {
      case: "the tabs around",
      clicked: "tabs-a",
      active: {
        "tabs-a": { nav: [1], items: [1] },
        "tabs-b": { nav: [0], items: [0] }
      }
    }
  ])(
    "keeps tabs placed in a tab apart on a click in the tab bar of $case",
    async ({ clicked, active }) => {
      const inside = tabsHtml({ ...defaultConfig, id: "tabs-b" });
      const root = mountRoot(tabsHtml(defaultConfig).replace("Body 0", inside));
      await initFree([root]);
      const tabsOf = (id: string): HTMLElement =>
        elementSchema.parse(
          root.querySelector(`[${makeAttr("tabs-id")}="${id}"]`)
        );
      const target = tabsOf(clicked);

      elementSchema
        .parse(nth(ownParts(target).navItems, 1).querySelector(".label"))
        .click();

      expect({
        "tabs-a": ownActive(tabsOf("tabs-a")),
        "tabs-b": ownActive(tabsOf("tabs-b"))
      }).toEqual(active);
      expect(changedEvents.map((event) => event.node)).toEqual([target]);
    }
  );

  it.each([
    { case: "that open on click", action: "click" },
    { case: "that open on hover", action: "hover" }
  ] satisfies { case: string; action: Action }[])(
    "listens for the clicks of every tabs element $case with one listener on body",
    async ({ action }) => {
      const root = mountRoot(
        `${tabsHtml({ ...defaultConfig, action })}${tabsHtml({ ...defaultConfig, action, id: "tabs-b" })}`
      );
      const listeners = trackClickListeners();
      await initFree([root]);
      const targets = listeners.targets();
      listeners.restore();

      expect(targets).toEqual([document.body]);
    }
  );
});
