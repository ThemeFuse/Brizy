import { z } from "zod";
import {
  initPro,
  loadProRuntime,
  mountRoot,
  silenceConsole,
  stopClicksAt,
  trackClickListeners
} from "../../../../../jest-utils/exportRuntime";

// The published Switcher, a pro element loaded through the real pro manifest.

function contentHtml(active: boolean, index: number): string {
  return `<div class="brz-switcher__content--tab${
    active ? " brz-switcher__content--tab--active" : ""
  }"><div class="brz-d-xs-flex brz-flex-xs-column">Tab ${index}</div></div>`;
}

const style1Html = `
  <div class="brz-switcher">
    <div class="brz-switcher__nav brz-switcher__nav--active">
      <div class="brz-switcher__nav--item brz-switcher__nav--item--active">First</div>
      <div class="brz-switcher__nav--item">Second</div>
    </div>
    ${contentHtml(true, 0)}${contentHtml(false, 1)}
  </div>
`;

const style2Html = `
  <div class="brz-switcher brz-switcher--style2">
    <div class="brz-switcher__nav2">
      <div class="brz-switcher__nav2--button brz-switcher__nav2__item--active"><span class="brz-switcher__nav2__item">First</span></div>
      <div class="brz-switcher__nav2--control brz-switcher__nav2--control--active"></div>
      <div class="brz-switcher__nav2--button"><span class="brz-switcher__nav2__item">Second</span></div>
    </div>
    ${contentHtml(true, 0)}${contentHtml(false, 1)}
  </div>
`;

const elementSchema = z.instanceof(HTMLElement);
const changedDetailsSchema = z.object({
  active: elementSchema,
  tabs: z.array(elementSchema)
});

function query(root: HTMLElement, selector: string): HTMLElement {
  return elementSchema.parse(root.querySelector(selector));
}

function queryAll(root: ParentNode, selector: string): HTMLElement[] {
  return z
    .array(elementSchema)
    .parse(Array.from(root.querySelectorAll(selector)));
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

function flags(
  root: HTMLElement,
  selector: string,
  className: string
): boolean[] {
  return Array.from(root.querySelectorAll(selector)).map((node) =>
    node.classList.contains(className)
  );
}

// The active flags of a switcher's own tabs.
function activeContents(switcher: HTMLElement): boolean[] {
  const scope = switcher.matches(".brz-switcher")
    ? switcher
    : query(switcher, ".brz-switcher");

  return flags(
    scope,
    ":scope > .brz-switcher__content--tab",
    "brz-switcher__content--tab--active"
  );
}

interface ChangedEvent {
  switcher: unknown;
  active: HTMLElement;
  tabs: HTMLElement[];
}

const changedEvents: ChangedEvent[] = [];
let unbindChanged: VoidFunction = () => undefined;

beforeAll(async () => {
  silenceConsole();
  await loadProRuntime({ kind: "real" }, { kind: "real" });
  unbindChanged = window.Brz.on(
    "elements.switcher.changed",
    (switcher: unknown, details: unknown) => {
      changedEvents.push({ switcher, ...changedDetailsSchema.parse(details) });
    }
  );
});

afterAll(() => {
  unbindChanged();
  jest.restoreAllMocks();
});

afterEach(() => {
  changedEvents.length = 0;
  document.body.innerHTML = "";
});

describe("Switcher on a published page", () => {
  it.each([
    {
      case: "style 1, the second nav item",
      html: style1Html,
      click: ".brz-switcher__nav--item:nth-child(2)",
      buttons: ".brz-switcher__nav--item",
      activeButtonClass: "brz-switcher__nav--item--active",
      navSelector: ".brz-switcher__nav",
      navActiveClass: "brz-switcher__nav--active"
    },
    {
      case: "style 2, the second button",
      html: style2Html,
      click: ".brz-switcher__nav2--button:nth-child(3)",
      buttons: ".brz-switcher__nav2--button",
      activeButtonClass: "brz-switcher__nav2__item--active",
      navSelector: ".brz-switcher__nav2--control",
      navActiveClass: "brz-switcher__nav2--control--active"
    },
    {
      case: "style 2, the control",
      html: style2Html,
      click: ".brz-switcher__nav2--control",
      buttons: ".brz-switcher__nav2--button",
      activeButtonClass: "brz-switcher__nav2__item--active",
      navSelector: ".brz-switcher__nav2--control",
      navActiveClass: "brz-switcher__nav2--control--active"
    }
  ])(
    "switches to the second tab after a click on $case",
    async ({
      html,
      click,
      buttons,
      activeButtonClass,
      navSelector,
      navActiveClass
    }) => {
      const root = mountRoot(html);
      await initPro("init.pro.dom", [root]);
      const switcher = query(root, ".brz-switcher");
      const contents = queryAll(root, ".brz-switcher__content--tab");

      query(root, click).click();

      expect({
        contents: flags(
          root,
          ".brz-switcher__content--tab",
          "brz-switcher__content--tab--active"
        ),
        buttons: flags(root, buttons, activeButtonClass),
        nav: flags(root, navSelector, navActiveClass),
        selected: attrs(queryAll(root, buttons), "aria-selected"),
        panelsHidden: attrs(contents, "aria-hidden")
      }).toEqual({
        contents: [false, true],
        buttons: [false, true],
        nav: [false],
        selected: ["false", "true"],
        panelsHidden: ["true", "false"]
      });
      expect(changedEvents).toEqual([
        { switcher, active: contents[1], tabs: contents }
      ]);
    }
  );

  it.each([
    {
      case: "style 1",
      html: style1Html,
      list: ".brz-switcher__nav",
      buttons: ".brz-switcher__nav--item"
    },
    {
      case: "style 2",
      html: style2Html,
      list: ".brz-switcher__nav2",
      buttons: ".brz-switcher__nav2--button"
    }
  ])(
    "labels $case for assistive technology",
    async ({ html, list, buttons }) => {
      const root = mountRoot(html);
      await initPro("init.pro.dom", [root]);
      const tabs = queryAll(root, buttons);
      const panels = queryAll(root, ".brz-switcher__content--tab");

      expect({
        listRole: query(root, list).getAttribute("role"),
        roles: attrs(tabs, "role"),
        tabIndexes: attrs(tabs, "tabindex"),
        selected: attrs(tabs, "aria-selected"),
        controls: attrs(tabs, "aria-controls"),
        panelRoles: attrs(panels, "role"),
        panelLabels: attrs(panels, "aria-labelledby"),
        panelsHidden: attrs(panels, "aria-hidden")
      }).toEqual({
        listRole: "tablist",
        roles: ["tab", "tab"],
        tabIndexes: ["0", "-1"],
        selected: ["true", "false"],
        controls: panels.map((panel) => panel.id),
        panelRoles: ["tabpanel", "tabpanel"],
        panelLabels: tabs.map((tab) => tab.id),
        panelsHidden: ["false", "true"]
      });
      expect(new Set([...tabs, ...panels].map((node) => node.id)).size).toBe(4);
      expect(changedEvents).toEqual([]);
    }
  );

  it.each(
    [
      {
        style: "style 1",
        html: style1Html,
        buttons: ".brz-switcher__nav--item"
      },
      {
        style: "style 2",
        html: style2Html,
        buttons: ".brz-switcher__nav2--button"
      }
    ].flatMap((style) => [
      { ...style, key: "Enter", from: 1, active: 1, focused: 1 },
      { ...style, key: " ", from: 0, active: 1, focused: 0 },
      { ...style, key: "ArrowRight", from: 0, active: 0, focused: 1 },
      { ...style, key: "ArrowDown", from: 1, active: 0, focused: 0 },
      { ...style, key: "ArrowLeft", from: 0, active: 0, focused: 1 },
      { ...style, key: "ArrowUp", from: 1, active: 0, focused: 0 },
      { ...style, key: "Home", from: 1, active: 0, focused: 0 },
      { ...style, key: "End", from: 0, active: 0, focused: 1 }
    ])
  )(
    "follows the keyboard in $style: $key from tab $from",
    async ({ html, buttons, key, from, active, focused }) => {
      const root = mountRoot(html);
      await initPro("init.pro.dom", [root]);
      const tabs = queryAll(root, buttons);
      const tab = nth(tabs, from);

      tab.focus();
      press(tab, key);

      expect({
        contents: flags(
          root,
          ".brz-switcher__content--tab",
          "brz-switcher__content--tab--active"
        ),
        selected: attrs(tabs, "aria-selected"),
        tabIndexes: attrs(tabs, "tabindex"),
        focused: focusedIndex(tabs)
      }).toEqual({
        contents: [active === 0, active === 1],
        selected: [String(active === 0), String(active === 1)],
        tabIndexes: [active === 0 ? "0" : "-1", active === 1 ? "0" : "-1"],
        focused
      });
    }
  );

  it.each([
    {
      case: "style 1",
      html: style1Html,
      click: ".brz-switcher__nav--item:nth-child(2)"
    },
    {
      case: "style 2",
      html: style2Html,
      click: ".brz-switcher__nav2--control"
    }
  ])("keeps two $case switchers on one page apart", async ({ html, click }) => {
    const root = mountRoot(`${html}${html}`);
    await initPro("init.pro.dom", [root]);
    const switchers = queryAll(root, ".brz-switcher");
    const second = nth(switchers, 1);

    query(second, click).click();

    expect(
      switchers.map((switcher) =>
        flags(
          switcher,
          ".brz-switcher__content--tab",
          "brz-switcher__content--tab--active"
        )
      )
    ).toEqual([
      [true, false],
      [false, true]
    ]);
    expect(changedEvents.map((event) => event.switcher)).toEqual([second]);
  });

  it.each([
    {
      case: "a style 1 nav item",
      html: style1Html,
      click: ".brz-switcher__nav--item:nth-child(2)"
    },
    {
      case: "a style 2 button",
      html: style2Html,
      click: ".brz-switcher__nav2--button:nth-child(3)"
    },
    {
      case: "the style 2 control",
      html: style2Html,
      click: ".brz-switcher__nav2--control"
    }
  ])(
    "has switched when a click on $case reaches the page around it",
    async ({ html, click }) => {
      const root = mountRoot(html);
      await initPro("init.pro.dom", [root]);
      const seen = stopClicksAt(root, () => activeContents(root));

      query(root, click).click();

      expect(seen).toEqual([[false, true]]);
      expect(changedEvents).toHaveLength(1);
    }
  );

  it.each([
    {
      case: "style 1",
      html: style1Html,
      click: ":scope > .brz-switcher__nav .brz-switcher__nav--item:nth-child(2)"
    },
    {
      case: "style 2",
      html: style2Html,
      click: ":scope > .brz-switcher__nav2 .brz-switcher__nav2--control"
    }
  ])(
    "switches a $case switcher of a root initialised inside another once",
    async ({ html, click }) => {
      const outer = mountRoot(html);
      await initPro("init.pro.dom", [outer]);
      const inner = document.createElement("div");
      inner.innerHTML = html;
      outer.append(inner);
      await initPro("init.pro.dom", [inner]);
      const [first, second] = queryAll(outer, ".brz-switcher");

      query(
        nth(
          [first, second].flatMap((node) => node ?? []),
          1
        ),
        click
      ).click();

      expect(queryAll(outer, ".brz-switcher").map(activeContents)).toEqual([
        [true, false],
        [false, true]
      ]);
      expect(changedEvents.map((event) => event.switcher)).toEqual([second]);
    }
  );

  it.each([
    { case: "style 1", html: style1Html },
    { case: "style 2", html: style2Html }
  ])(
    "listens for the clicks of every $case switcher with one listener on body",
    async ({ html }) => {
      const root = mountRoot(`${html}${html}`);
      const listeners = trackClickListeners();
      await initPro("init.pro.dom", [root]);
      const targets = listeners.targets();
      listeners.restore();

      expect(targets).toEqual([document.body]);
    }
  );
});
