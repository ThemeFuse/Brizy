import { z } from "zod";
import { type ClickRule, onBodyClick } from "../delegate";

// `onBodyClick` on a page: each test starts from a body without listeners.

const elementSchema = z.instanceof(Element);

const pageHtml = `
  <section class="outer card">
    <div class="card inner">
      <button class="button"><svg class="icon"><path class="shape"></path></svg></button>
    </div>
  </section>
  <p class="aside">Aside</p>
`;

function mount(): HTMLElement {
  const root = document.createElement("div");

  root.innerHTML = pageHtml;
  document.body.append(root);

  return root;
}

function query(selector: string): Element {
  return elementSchema.parse(document.body.querySelector(selector));
}

function click(target: Element): MouseEvent {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });

  target.dispatchEvent(event);

  return event;
}

// A rule that writes down the element it was given.
function rule(selector: string, log: string[], name: string): ClickRule {
  return {
    selector,
    handler: (element) => {
      log.push(`${name}:${element.getAttribute("class")}`);
    }
  };
}

afterEach(() => {
  jest.restoreAllMocks();
  document.body.replaceWith(document.createElement("body"));
});

describe("onBodyClick", () => {
  it.each([
    { case: "one rule", rules: 1 },
    { case: "several rules", rules: 4 }
  ])("puts one capturing click listener on body for $case", ({ rules }) => {
    const listen = jest.spyOn(EventTarget.prototype, "addEventListener");

    onBodyClick(
      Array.from({ length: rules }, () => rule(".button", [], "rule"))
    );

    expect(
      listen.mock.calls.map(([type, , capture], index) => ({
        onBody: listen.mock.contexts[index] === document.body,
        type,
        capture
      }))
    ).toEqual([{ onBody: true, type: "click", capture: true }]);
  });

  it.each([
    {
      case: "the element itself",
      target: ".button",
      selector: ".button",
      got: ["rule:button"]
    },
    {
      case: "a node inside it",
      target: ".shape",
      selector: ".button",
      got: ["rule:button"]
    },
    {
      case: "an svg element",
      target: ".shape",
      selector: ".icon",
      got: ["rule:icon"]
    },
    {
      case: "the nearest of two that match",
      target: ".button",
      selector: ".card",
      got: ["rule:card inner"]
    },
    {
      case: "an element next to it",
      target: ".aside",
      selector: ".button",
      got: []
    },
    { case: "its container", target: ".outer", selector: ".button", got: [] },
    { case: "body itself", target: "body", selector: "body", got: [] }
  ])("answers a click on $case", ({ target, selector, got }) => {
    mount();
    const log: string[] = [];
    onBodyClick([rule(selector, log, "rule")]);

    click(target === "body" ? document.body : query(target));

    expect(log).toEqual(got);
  });

  it("runs each rule once per click, in the order given", () => {
    mount();
    const log: string[] = [];
    onBodyClick([
      rule(".outer", log, "first"),
      rule(".button", log, "second"),
      rule(".aside", log, "third")
    ]);

    click(query(".shape"));
    click(query(".aside"));

    expect(log).toEqual(["first:outer card", "second:button", "third:aside"]);
  });

  it("runs a rule ahead of the listeners of the page", () => {
    mount();
    const log: string[] = [];
    query(".button").addEventListener("click", () => log.push("button"));
    query(".outer").addEventListener("click", () => log.push("outer"));
    onBodyClick([rule(".button", log, "rule")]);

    click(query(".shape"));

    expect(log).toEqual(["rule:button", "button", "outer"]);
  });

  it.each([
    {
      case: "an ancestor",
      stopAt: ".outer",
      log: ["rule:button", "button", "outer"]
    },
    { case: "the element", stopAt: ".button", log: ["rule:button", "button"] },
    { case: "a node inside the element", stopAt: ".icon", log: ["rule:button"] }
  ])(
    "still runs a rule when $case stops the click",
    ({ stopAt, log: expected }) => {
      mount();
      const log: string[] = [];
      query(".button").addEventListener("click", () => log.push("button"));
      query(".outer").addEventListener("click", () => log.push("outer"));
      query(stopAt).addEventListener("click", (event) =>
        event.stopPropagation()
      );
      onBodyClick([rule(".button", log, "rule")]);

      click(query(".shape"));

      expect(log).toEqual(expected);
    }
  );

  it("keeps the click from everything else when a rule stops it", () => {
    mount();
    const log: string[] = [];
    const onDocument = (): number => log.push("document");
    query(".shape").addEventListener("click", () => log.push("shape"));
    query(".button").addEventListener("click", () => log.push("button"));
    query(".outer").addEventListener("click", () => log.push("outer"));
    document.addEventListener("click", onDocument);
    onBodyClick([
      {
        selector: ".button",
        handler: (_element, event) => {
          log.push("rule");
          event.preventDefault();
          event.stopPropagation();
        }
      }
    ]);

    const event = click(query(".shape"));
    document.removeEventListener("click", onDocument);

    expect(log).toEqual(["rule"]);
    expect(event.defaultPrevented).toBe(true);
  });

  it("finds the element after an earlier listener took the target off the page", () => {
    mount();
    const log: string[] = [];
    const icon = query(".icon");
    onBodyClick([{ selector: ".button", handler: () => icon.remove() }]);
    onBodyClick([rule(".inner", log, "rule")]);

    click(query(".shape"));

    expect(icon.isConnected).toBe(false);
    expect(log).toEqual(["rule:card inner"]);
  });

  it("keeps the listeners of two calls apart", () => {
    mount();
    const log: string[] = [];
    onBodyClick([rule(".button", log, "first")]);
    onBodyClick([rule(".button", log, "second")]);

    click(query(".button"));

    expect(log).toEqual(["first:button", "second:button"]);
  });
});
