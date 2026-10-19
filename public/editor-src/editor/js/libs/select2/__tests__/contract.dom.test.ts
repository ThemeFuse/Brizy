// The select changing under select2: its value, its options, its state, and select2 leaving.

import { mountSelect2 } from "../__fixtures__/driver";
import {
  NO_MODIFIERS,
  markupOf,
  mouseUp,
  nextTimers,
  textsOf
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

const CHOICES = ".select2-selection__choice";

const newOption = (
  value: string,
  text: string,
  selected: boolean
): HTMLOptionElement => {
  const node = document.createElement("option");
  node.value = value;
  node.textContent = text;
  node.selected = selected;

  return node;
};

describe("a change event on the select", () => {
  it("re-renders a single selection from the value", () => {
    const { select, rendered } = scene(plainSelect("", COLORS), standard);

    select.value = "blue";
    select.dispatchEvent(new Event("change", { bubbles: true }));

    expect(rendered().textContent).toBe("Blue");
    expect(rendered().getAttribute("title")).toBe("Blue");
  });

  it("clears a single selection when no option is selected", () => {
    const { select, rendered } = scene(plainSelect("", SOLID_COLORS), standard);

    select.selectedIndex = -1;
    select.dispatchEvent(new Event("change", { bubbles: true }));

    expect(rendered().innerHTML).toBe("");
    expect(rendered().hasAttribute("title")).toBe(false);
  });

  it("re-renders the choices of a multiple select", () => {
    const { select, parent } = scene(
      plainSelect("multiple", SOLID_COLORS),
      standard
    );

    [...select.options].forEach((item) => {
      item.selected = item.value !== "green";
    });
    select.dispatchEvent(new Event("change", { bubbles: true }));

    expect(textsOf(parent, CHOICES)).toEqual(["×Red", "×Blue"]);
  });
});

describe("the options of the select", () => {
  it.each([
    { case: "an added selected option", selected: true, text: "Black" },
    { case: "an added unselected option", selected: false, text: "Red" }
  ])("show in the selection after $case", async ({ selected, text }) => {
    const { select, rendered } = scene(plainSelect("", SOLID_COLORS), standard);

    select.append(newOption("black", "Black", selected));
    await nextTimers();

    expect(rendered().textContent).toBe(text);
  });

  it.each([
    { case: "the selected option is removed", value: "red", text: "Green" },
    { case: "another option is removed", value: "blue", text: "Red" }
  ])("show in the selection after $case", async ({ value, text }) => {
    const { select, rendered } = scene(plainSelect("", SOLID_COLORS), standard);

    select.querySelector(`option[value="${value}"]`)?.remove();
    await nextTimers();

    expect(rendered().textContent).toBe(text);
  });

  it("are read again every time the dropdown opens", () => {
    const { select, handle, parent } = scene(
      plainSelect("", SOLID_COLORS),
      standard
    );

    handle.open();
    handle.close();
    select.append(newOption("black", "Black", false));
    select.querySelector(`option[value="green"]`)?.remove();
    handle.open();

    expect(textsOf(parent, ".select2-results__option")).toEqual([
      "Red",
      "Blue",
      "Black"
    ]);
  });
});

describe("the disabled state of the select", () => {
  it("is followed by the container, which closes", async () => {
    const { select, handle, container, selection, isOpen } = scene(
      plainSelect(`tabindex="3"`, COLORS),
      standard
    );
    const state = (): Array<string | boolean | null> => [
      container().classList.contains("select2-container--disabled"),
      selection().getAttribute("tabindex"),
      selection().getAttribute("aria-disabled"),
      isOpen()
    ];

    handle.open();
    select.disabled = true;
    await nextTimers();

    expect(state()).toEqual([true, "-1", "true", false]);

    select.disabled = false;
    await nextTimers();

    expect(state()).toEqual([false, "3", "false", false]);
  });

  it("is followed by the search field of a multiple select", async () => {
    const { select, inlineSearch, selection } = scene(
      plainSelect("multiple", SOLID_COLORS),
      standard
    );
    const state = (): Array<string | boolean | null> => [
      inlineSearch().disabled,
      inlineSearch().getAttribute("tabindex"),
      selection().getAttribute("tabindex")
    ];

    select.disabled = true;
    await nextTimers();

    expect(state()).toEqual([true, "0", "-1"]);

    select.disabled = false;
    await nextTimers();

    expect(state()).toEqual([false, "0", "-1"]);
  });
});

describe("destroy", () => {
  it.each([
    { case: "a closed single select", attributes: `tabindex="3"`, open: false },
    { case: "an open single select", attributes: "", open: true },
    { case: "a closed multiple select", attributes: "multiple", open: false },
    { case: "an open multiple select", attributes: "multiple", open: true }
  ])("gives back the select of $case", ({ attributes, open }) => {
    const { handle, root } = scene(
      plainSelect(attributes, [
        option("red", "Red"),
        optionWith("green", "Green", "selected")
      ]),
      standard
    );

    if (open) {
      handle.open();
    }

    handle.destroy();

    expect(markupOf(root)).toMatchSnapshot();
  });

  it("stops following the select", async () => {
    const { handle, select, root } = scene(
      plainSelect("", SOLID_COLORS),
      standard
    );

    handle.destroy();

    const before = markupOf(root);

    select.value = "blue";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    select.disabled = true;
    await nextTimers();
    select.disabled = false;

    expect(markupOf(root)).toBe(before);
  });
});

describe("mounting again on the same select", () => {
  it("replaces the first container", () => {
    const { select, parent, root } = scene(
      plainSelect("", SOLID_COLORS),
      standard
    );

    mountSelect2(select, { ...standard(parent), placeholder: undefined });

    expect(root.querySelectorAll(".select2.select2-container")).toHaveLength(1);
    expect(markupOf(root)).toMatchSnapshot();
  });

  it("works like the first time", () => {
    const { select, parent, values } = scene(
      plainSelect("", SOLID_COLORS),
      standard
    );

    const handle = mountSelect2(select, standard(parent));
    handle.open();

    const blue = [...parent.querySelectorAll(".select2-results__option")].find(
      (node) => node.textContent === "Blue"
    );

    if (blue) {
      mouseUp(blue, NO_MODIFIERS);
    }

    expect(values()).toEqual(["blue"]);
    expect(parent.querySelectorAll(".select2-dropdown")).toHaveLength(0);
  });
});
