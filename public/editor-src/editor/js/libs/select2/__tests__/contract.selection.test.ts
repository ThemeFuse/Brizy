// Choosing with the mouse, the events that announce it, templates, placeholder and focus.

import type { MountOptions, Select2EventName } from "../__fixtures__/driver";
import { mountSelect2, onSelect2 } from "../__fixtures__/driver";
import {
  NO_MODIFIERS,
  click,
  hover,
  markupOf,
  mount,
  mouseDown,
  mouseUp,
  nextTimers,
  query,
  querySelect
} from "../__fixtures__/env";
import {
  COLORS,
  SOLID_COLORS,
  option,
  optionWith,
  plainSelect
} from "../__fixtures__/markup";
import { scene, standard, useSelect2Env } from "../__fixtures__/suite";

useSelect2Env();

const withPlaceholder =
  (placeholder: string) =>
  (parent: HTMLElement): MountOptions => ({
    ...standard(parent),
    placeholder
  });

describe("a single select", () => {
  it.each([
    { case: "the left button", which: 1, opens: true },
    { case: "the middle button", which: 2, opens: false },
    { case: "the right button", which: 3, opens: false }
  ])("on a mouse down with $case on the selection", ({ which, opens }) => {
    const { selection, isOpen } = scene(plainSelect("", COLORS), standard);

    selection().dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancelable: true, which })
    );

    expect(isOpen()).toBe(opens);
  });

  it("closes on the second mouse down on the selection", () => {
    const { selection, isOpen, events } = scene(
      plainSelect("", COLORS),
      standard
    );

    mouseDown(selection());
    mouseDown(selection());

    expect(isOpen()).toBe(false);
    expect(events).toEqual([
      "select2:opening",
      "select2:open",
      "select2:closing",
      "select2:close"
    ]);
  });

  it("highlights the selected result when it opens", () => {
    const { handle, highlighted } = scene(
      plainSelect("", [
        option("red", "Red"),
        optionWith("green", "Green", "selected"),
        option("blue", "Blue")
      ]),
      standard
    );

    handle.open();

    expect(highlighted()).toBe("Green");
  });

  it("highlights the result under the pointer", () => {
    const { handle, result, highlighted, selection } = scene(
      plainSelect("", COLORS),
      standard
    );

    handle.open();
    hover(result("Blue"));

    expect(highlighted()).toBe("Blue");
    expect(selection().getAttribute("aria-activedescendant")).toBe(
      result("Blue").id
    );
  });

  it("selects the result under a mouse up, closes and says so in order", () => {
    const { handle, result, parent, values, isOpen, events, rendered } = scene(
      plainSelect("", COLORS),
      standard
    );

    handle.open();
    mouseUp(result("Green"), NO_MODIFIERS);

    expect(values()).toEqual(["green"]);
    expect(isOpen()).toBe(false);
    expect(rendered().textContent).toBe("Green");
    expect(rendered().getAttribute("title")).toBe("Green");
    expect(events).toEqual([
      "select2:opening",
      "select2:open",
      "select2:selecting",
      "change",
      "select2:closing",
      "select2:close",
      "select2:select"
    ]);
    expect(markupOf(parent)).toMatchSnapshot();
  });

  it("marks the chosen result as selected the next time it opens", () => {
    const { handle, result, highlighted } = scene(
      plainSelect("", COLORS),
      standard
    );

    handle.open();
    mouseUp(result("Green"), NO_MODIFIERS);
    handle.open();

    expect(result("Green").getAttribute("aria-selected")).toBe("true");
    expect(result("Color").getAttribute("aria-selected")).toBe("false");
    expect(highlighted()).toBe("Green");
  });

  it("only closes on a mouse up on the result that is already selected", () => {
    const { handle, result, values, isOpen, events } = scene(
      plainSelect("", [option("red", "Red"), option("green", "Green")]),
      standard
    );

    handle.open();
    mouseUp(result("Red"), NO_MODIFIERS);

    expect(values()).toEqual(["red"]);
    expect(isOpen()).toBe(false);
    expect(events).toEqual([
      "select2:opening",
      "select2:open",
      "select2:closing",
      "select2:close"
    ]);
  });

  it("ignores a mouse up on a disabled result", () => {
    const { handle, result, values, isOpen } = scene(
      plainSelect("", [
        option("red", "Red"),
        optionWith("green", "Green", "disabled")
      ]),
      standard
    );

    handle.open();
    mouseUp(result("Green"), NO_MODIFIERS);

    expect(values()).toEqual(["red"]);
    expect(isOpen()).toBe(true);
  });

  it("keeps the dropdown open when the selection is made with ctrl held", () => {
    const { handle, result, values, isOpen } = scene(
      plainSelect("", COLORS),
      standard
    );

    handle.open();
    mouseUp(result("Green"), { ...NO_MODIFIERS, ctrlKey: true });

    expect(values()).toEqual(["green"]);
    expect(isOpen()).toBe(true);
    expect(result("Green").getAttribute("aria-selected")).toBe("true");
  });
});

describe("the dropdown", () => {
  it("closes on a mouse down anywhere else on the page", () => {
    const { handle, isOpen, root } = scene(plainSelect("", COLORS), standard);
    const outside = document.createElement("p");
    root.append(outside);

    handle.open();
    mouseDown(outside);

    expect(isOpen()).toBe(false);
  });

  it("stays open on a mouse down inside it", () => {
    const { handle, isOpen, result } = scene(plainSelect("", COLORS), standard);

    handle.open();
    mouseDown(result("Green"));

    expect(isOpen()).toBe(true);
  });

  it("closes when another select is pressed", () => {
    const root = mount(
      `<div class="first">${plainSelect("", COLORS)}</div><div class="second">${plainSelect("", COLORS)}</div>`
    );
    const first = query(root, ".first .parent");
    const second = query(root, ".second .parent");
    const firstHandle = mountSelect2(
      querySelect(first, "select"),
      standard(first)
    );
    mountSelect2(querySelect(second, "select"), standard(second));
    const isOpen = (parent: HTMLElement): boolean =>
      query(parent, ".select2.select2-container").classList.contains(
        "select2-container--open"
      );

    firstHandle.open();
    mouseDown(query(second, ".select2-selection"));

    expect(isOpen(first)).toBe(false);
    expect(isOpen(second)).toBe(true);
  });
});

describe("a multiple select", () => {
  it("opens on a click on the selection and closes on the next", () => {
    const { selection, isOpen } = scene(
      plainSelect("multiple", SOLID_COLORS),
      standard
    );

    click(selection());
    expect(isOpen()).toBe(true);

    click(selection());
    expect(isOpen()).toBe(false);
  });

  it("adds a choice for the result under a mouse up and closes", () => {
    const { handle, result, parent, values, isOpen, events } = scene(
      plainSelect("multiple", SOLID_COLORS),
      standard
    );

    handle.open();
    mouseUp(result("Green"), NO_MODIFIERS);
    handle.open();
    mouseUp(result("Red"), NO_MODIFIERS);

    expect(values()).toEqual(["red", "green"]);
    expect(isOpen()).toBe(false);
    expect(events).toEqual([
      "select2:opening",
      "select2:open",
      "select2:selecting",
      "change",
      "select2:closing",
      "select2:close",
      "select2:select",
      "select2:opening",
      "select2:open",
      "select2:selecting",
      "change",
      "select2:closing",
      "select2:close",
      "select2:select"
    ]);
    expect(markupOf(parent)).toMatchSnapshot();
  });

  it("removes the choice on a mouse up on its selected result", () => {
    const { handle, result, values, events, parent } = scene(
      plainSelect("multiple", [
        optionWith("red", "Red", "selected"),
        optionWith("green", "Green", "selected")
      ]),
      standard
    );

    handle.open();
    mouseUp(result("Red"), NO_MODIFIERS);

    expect(values()).toEqual(["green"]);
    expect(events).toEqual([
      "select2:opening",
      "select2:open",
      "select2:unselecting",
      "change",
      "select2:closing",
      "select2:close",
      "select2:unselect"
    ]);
    expect(markupOf(parent)).toMatchSnapshot();
  });

  it("removes the choice whose remove mark is clicked", () => {
    const { parent, values, events } = scene(
      plainSelect("multiple", [
        optionWith("red", "Red", "selected"),
        optionWith("green", "Green", "selected")
      ]),
      standard
    );

    click(
      query(
        parent,
        `.select2-selection__choice[title="Red"] .select2-selection__choice__remove`
      )
    );

    expect(values()).toEqual(["green"]);
    expect(events).toMatchSnapshot();
    expect(markupOf(parent)).toMatchSnapshot();
  });

  it("keeps a disabled select untouched when a remove mark is clicked", () => {
    const { parent, values, isOpen } = scene(
      plainSelect("multiple disabled", [
        optionWith("red", "Red", "selected"),
        optionWith("green", "Green", "selected")
      ]),
      standard
    );

    click(query(parent, ".select2-selection__choice__remove"));

    expect(values()).toEqual(["red", "green"]);
    expect(isOpen()).toBe(false);
  });

  it("keeps the dropdown open when the selection is made with meta held", () => {
    const { handle, result, values, isOpen } = scene(
      plainSelect("multiple", SOLID_COLORS),
      standard
    );

    handle.open();
    mouseUp(result("Green"), { ...NO_MODIFIERS, metaKey: true });
    mouseUp(result("Blue"), { ...NO_MODIFIERS, metaKey: true });

    expect(values()).toEqual(["green", "blue"]);
    expect(isOpen()).toBe(true);
    expect(result("Green").getAttribute("aria-selected")).toBe("true");
    expect(result("Blue").getAttribute("aria-selected")).toBe("true");
  });
});

describe("a disabled select", () => {
  it.each([
    { case: "single", attributes: "disabled" },
    { case: "multiple", attributes: "multiple disabled" }
  ])("does not open, $case", ({ attributes }) => {
    const { handle, selection, isOpen } = scene(
      plainSelect(attributes, SOLID_COLORS),
      standard
    );

    handle.open();
    mouseDown(selection());
    click(selection());

    expect(isOpen()).toBe(false);
  });
});

describe("an event that is prevented", () => {
  interface PreventCase {
    case: string;
    attributes: string;
    prevented: Select2EventName;
    act: "open" | "close" | "select" | "unselect";
    isOpen: boolean;
    values: string[];
  }

  it.each<PreventCase>([
    {
      case: "opening keeps the dropdown closed",
      attributes: "",
      prevented: "select2:opening",
      act: "open",
      isOpen: false,
      values: ["red"]
    },
    {
      case: "closing keeps the dropdown open",
      attributes: "",
      prevented: "select2:closing",
      act: "close",
      isOpen: true,
      values: ["red"]
    },
    {
      case: "selecting keeps the value",
      attributes: "",
      prevented: "select2:selecting",
      act: "select",
      isOpen: true,
      values: ["red"]
    },
    {
      case: "unselecting keeps the choice",
      attributes: "multiple",
      prevented: "select2:unselecting",
      act: "unselect",
      isOpen: true,
      values: ["red"]
    }
  ])("$case", ({ attributes, prevented, act, isOpen, values }) => {
    const root = mount(
      plainSelect(attributes, [
        optionWith("red", "Red", "selected"),
        option("green", "Green")
      ])
    );
    const parent = query(root, ".parent");
    const select = querySelect(parent, "select");
    const seen: string[] = [];

    onSelect2(select, prevented, (event) => {
      seen.push(prevented);
      event.preventDefault();
    });

    const handle = mountSelect2(select, standard(parent));
    const result = (text: string): HTMLElement =>
      query(parent, `.select2-results__option[id$="-${text}"]`);

    if (act !== "open") {
      handle.open();
    }

    switch (act) {
      case "open":
        handle.open();
        break;
      case "close":
        handle.close();
        break;
      case "select":
        mouseUp(result("green"), NO_MODIFIERS);
        break;
      case "unselect":
        mouseUp(result("red"), NO_MODIFIERS);
        break;
    }

    expect(seen).toEqual([prevented]);
    expect(
      query(parent, ".select2.select2-container").classList.contains(
        "select2-container--open"
      )
    ).toBe(isOpen);
    expect([...select.selectedOptions].map((item) => item.value)).toEqual(
      values
    );
  });
});

describe("templates", () => {
  const flag = (text: unknown): HTMLElement => {
    const node = document.createElement("div");
    node.className = "flag";
    node.textContent = typeof text === "string" ? text : "";

    return node;
  };

  it("render the selection and the results from elements", () => {
    const { handle, parent, result } = scene(
      plainSelect("", [option("en", "English"), option("ro", "Română")]),
      (dropdownParent) => ({
        ...standard(dropdownParent),
        templateSelection: (item) => flag(item.text),
        templateResult: (item) => flag(item.text),
        dropdownAutoWidth: true
      })
    );

    handle.open();
    expect(markupOf(parent)).toMatchSnapshot();

    mouseUp(result("Română"), NO_MODIFIERS);
    expect(markupOf(parent)).toMatchSnapshot();
  });

  it("render the choices of a multiple select from elements", () => {
    const { parent } = scene(
      plainSelect("multiple", [
        optionWith("en", "English", "selected"),
        optionWith("ro", "Română", "selected")
      ]),
      (dropdownParent) => ({
        ...standard(dropdownParent),
        templateSelection: (item) => flag(item.text)
      })
    );

    expect(markupOf(parent)).toMatchSnapshot();
  });

  it("receive the option element and its value", () => {
    const seen: unknown[] = [];
    const { handle } = scene(
      plainSelect("", [
        optionWith("en", "English", `data-flag="/en.svg"`),
        optionWith("ro", "Română", `data-flag="/ro.svg"`)
      ]),
      (dropdownParent) => ({
        ...standard(dropdownParent),
        templateResult: (item) => {
          seen.push([item.id, item.text, item.element?.dataset.flag]);

          return typeof item.text === "string" ? item.text : "";
        }
      })
    );

    handle.open();

    expect(seen).toEqual([
      [undefined, "Searching…", undefined],
      ["en", "English", "/en.svg"],
      ["ro", "Română", "/ro.svg"]
    ]);
  });

  it("escape the text they return", () => {
    const { handle, rendered, result } = scene(
      plainSelect("", [option("a", "plain")]),
      (dropdownParent) => ({
        ...standard(dropdownParent),
        templateSelection: () => `<b>bold</b> & "quoted"`,
        templateResult: () => `<i>italic</i>`
      })
    );

    handle.open();

    expect(rendered().innerHTML).toBe('&lt;b&gt;bold&lt;/b&gt; &amp; "quoted"');
    expect(rendered().textContent).toBe(`<b>bold</b> & "quoted"`);
    expect(result("<i>italic</i>").innerHTML).toBe("&lt;i&gt;italic&lt;/i&gt;");
  });

  it("leave the selection empty for an empty string", () => {
    const { rendered } = scene(plainSelect("", COLORS), (dropdownParent) => ({
      ...standard(dropdownParent),
      templateSelection: () => ""
    }));

    expect(rendered().innerHTML).toBe("");
    expect(rendered().getAttribute("title")).toBe("Color");
  });
});

describe("the placeholder", () => {
  it("leaves the results without the empty option", () => {
    const { handle, results } = scene(
      plainSelect("", COLORS),
      withPlaceholder("Pick a color")
    );

    handle.open();

    expect(results().map((node) => node.textContent)).toEqual([
      "Red",
      "Green",
      "Blue"
    ]);
  });

  it("gives way to the chosen option and comes back with the empty one", () => {
    const { handle, result, rendered, select, parent } = scene(
      plainSelect("", COLORS),
      withPlaceholder("Pick a color")
    );

    handle.open();
    mouseUp(result("Blue"), NO_MODIFIERS);

    expect(rendered().textContent).toBe("Blue");
    expect(parent.querySelector(".select2-selection__placeholder")).toBeNull();

    select.value = "";
    select.dispatchEvent(new Event("change", { bubbles: true }));

    expect(markupOf(rendered())).toMatchSnapshot();
  });

  it("is the placeholder of the search field of a multiple select", () => {
    const { handle, result, inlineSearch } = scene(
      plainSelect("multiple", SOLID_COLORS),
      withPlaceholder("Pick colors")
    );

    expect(inlineSearch().getAttribute("placeholder")).toBe("Pick colors");

    handle.open();
    mouseUp(result("Blue"), NO_MODIFIERS);

    expect(inlineSearch().getAttribute("placeholder")).toBe("");
  });
});

describe("focus", () => {
  it("marks the container while the selection has it", async () => {
    const { selection, container } = scene(plainSelect("", COLORS), standard);

    selection().focus();
    expect(container().classList.contains("select2-container--focus")).toBe(
      true
    );

    selection().blur();
    await nextTimers();
    expect(container().classList.contains("select2-container--focus")).toBe(
      false
    );
  });

  it("returns to the selection when a single select closes", () => {
    const { handle, selection } = scene(plainSelect("", COLORS), standard);

    handle.open();
    handle.close();

    expect(document.activeElement).toBe(selection());
  });

  it("goes to the search field when a multiple select opens and closes", () => {
    const { handle, inlineSearch, container } = scene(
      plainSelect("multiple", SOLID_COLORS),
      standard
    );

    handle.open();
    expect(document.activeElement).toBe(inlineSearch());
    expect(container().classList.contains("select2-container--focus")).toBe(
      true
    );

    handle.close();
    expect(document.activeElement).toBe(inlineSearch());
  });

  it("moves to the selection when the hidden select is focused", () => {
    const { select, selection } = scene(plainSelect("", COLORS), standard);

    select.focus();

    expect(document.activeElement).toBe(selection());
  });
});
