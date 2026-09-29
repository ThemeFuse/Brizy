import { z } from "zod";
import {
  initPro,
  loadProRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";

// The published Switcher (a pro element), initialised the way a page does it:
// the free and pro bootstraps with their real manifests receive
// `init.pro.dom`, and the pro one loads this export.

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

function flags(
  root: HTMLElement,
  selector: string,
  className: string
): boolean[] {
  return Array.from(root.querySelectorAll(selector)).map((node) =>
    node.classList.contains(className)
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
      const contents = Array.from(
        root.querySelectorAll(".brz-switcher__content--tab")
      );

      query(root, click).click();

      expect({
        contents: flags(
          root,
          ".brz-switcher__content--tab",
          "brz-switcher__content--tab--active"
        ),
        buttons: flags(root, buttons, activeButtonClass),
        nav: flags(root, navSelector, navActiveClass),
        selected: Array.from(root.querySelectorAll(buttons)).map((button) =>
          button.getAttribute("aria-selected")
        ),
        panelsHidden: contents.map((content) =>
          content.getAttribute("aria-hidden")
        )
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
});
