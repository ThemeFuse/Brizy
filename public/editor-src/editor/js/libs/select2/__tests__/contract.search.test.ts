// The search fields: the inline one of a multiple select and the one in the dropdown.

import type { MountOptions } from "../__fixtures__/driver";
import {
  NO_MODIFIERS,
  click,
  keyDown,
  keyUp,
  markupOf,
  nextTimers,
  query,
  stubLayout,
  textsOf,
  type
} from "../__fixtures__/env";
import {
  COLORS,
  option,
  optionWith,
  plainSelect
} from "../__fixtures__/markup";
import { scene, standard, useSelect2Env } from "../__fixtures__/suite";

useSelect2Env();

const RESULTS = ".select2-results__option";

const picking =
  (placeholder: string) =>
  (parent: HTMLElement): MountOptions => ({
    ...standard(parent),
    placeholder
  });

const LANGUAGES = [
  option("", "Language"),
  option("ro", "Română"),
  option("fr", "Français"),
  option("es", "Español"),
  option("de", "Deutsch")
];

describe("the search of a multiple select", () => {
  it.each([
    { case: "a part of the text", term: "re", results: ["Red", "Green"] },
    { case: "another letter case", term: "BL", results: ["Blue"] },
    { case: "an empty term", term: "", results: ["Red", "Green", "Blue"] },
    { case: "only spaces", term: "   ", results: ["Red", "Green", "Blue"] }
  ])("opens the dropdown with the results for $case", ({ term, results }) => {
    const { inlineSearch, parent, isOpen } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );

    type(inlineSearch(), term);

    expect(isOpen()).toBe(true);
    expect(textsOf(parent, RESULTS)).toEqual(results);
  });

  it.each([
    { term: "romana", results: ["Română"] },
    { term: "FRANCAIS", results: ["Français"] },
    { term: "espanol", results: ["Español"] },
    { term: "ñol", results: ["Español"] },
    { term: "a", results: ["Română", "Français", "Español"] }
  ])("ignores accents: $term", ({ term, results }) => {
    const { inlineSearch, parent } = scene(
      plainSelect("multiple", LANGUAGES),
      picking("Pick languages")
    );

    type(inlineSearch(), term);

    expect(textsOf(parent, RESULTS)).toEqual(results);
  });

  it("says so when nothing matches", () => {
    const { inlineSearch, parent } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );

    type(inlineSearch(), "zzz");

    expect(markupOf(query(parent, ".select2-results"))).toMatchSnapshot();
  });

  it("shows every result again once the term is gone", () => {
    const { inlineSearch, parent } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );

    type(inlineSearch(), "zzz");
    type(inlineSearch(), "");

    expect(textsOf(parent, RESULTS)).toEqual(["Red", "Green", "Blue"]);
  });

  it("keeps a group with the children that match", () => {
    const { inlineSearch, parent } = scene(
      `<div class="parent"><select multiple><optgroup label="Warm"><option value="red">Red</option><option value="orange">Orange</option></optgroup><optgroup label="Cold"><option value="blue">Blue</option></optgroup></select></div>`,
      standard
    );

    type(inlineSearch(), "ora");

    expect(markupOf(query(parent, ".select2-results"))).toMatchSnapshot();
  });

  it("forgets the term when the dropdown closes", () => {
    const { inlineSearch, handle } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );

    type(inlineSearch(), "re");
    handle.close();

    expect(inlineSearch().value).toBe("");
  });

  it("searches on a key up when no input event came first", () => {
    const { inlineSearch, parent } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );

    inlineSearch().value = "bl";
    keyUp(inlineSearch(), "a", NO_MODIFIERS);

    expect(textsOf(parent, RESULTS)).toEqual(["Blue"]);
  });

  it.each([{ key: "Shift" as const }, { key: "Tab" as const }])(
    "does not search on a key up of $key",
    ({ key }) => {
      const { inlineSearch, isOpen } = scene(
        plainSelect("multiple", COLORS),
        picking("Pick colors")
      );

      inlineSearch().value = "bl";
      keyUp(inlineSearch(), key, NO_MODIFIERS);

      expect(isOpen()).toBe(false);
    }
  );

  it("stops searching on key up once an input event was seen", () => {
    const { inlineSearch, parent } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );

    type(inlineSearch(), "re");
    inlineSearch().value = "bl";
    keyUp(inlineSearch(), "a", NO_MODIFIERS);

    expect(textsOf(parent, RESULTS)).toEqual(["Red", "Green"]);
  });

  it("removes the last choice on Backspace in an empty field and searches for its text", () => {
    const { inlineSearch, parent, values, isOpen } = scene(
      plainSelect("multiple", [
        optionWith("red", "Red", "selected"),
        optionWith("green", "Green", "selected"),
        option("blue", "Blue")
      ]),
      standard
    );

    const event = keyDown(inlineSearch(), "Backspace", NO_MODIFIERS);

    expect(values()).toEqual(["red"]);
    expect(inlineSearch().value).toBe("Green");
    expect(event.defaultPrevented).toBe(true);
    expect(isOpen()).toBe(true);
    expect(textsOf(parent, RESULTS)).toEqual(["Green"]);
  });

  it("keeps the choices on Backspace in a field with text", () => {
    const { inlineSearch, values } = scene(
      plainSelect("multiple", [
        optionWith("red", "Red", "selected"),
        option("blue", "Blue")
      ]),
      standard
    );

    inlineSearch().value = "b";
    const event = keyDown(inlineSearch(), "Backspace", NO_MODIFIERS);

    expect(values()).toEqual(["red"]);
    expect(event.defaultPrevented).toBe(false);
  });

  it.each([
    { case: "an empty field", term: "", width: "0.75em" },
    { case: "three characters", term: "abc", width: "3em" }
  ])("is as wide as its text needs, $case", ({ term, width }) => {
    const { inlineSearch } = scene(plainSelect("multiple", COLORS), standard);

    type(inlineSearch(), term);

    expect(inlineSearch().style.width).toBe(width);
  });

  it("is as wide as the selection while it shows the placeholder", () => {
    stubLayout(
      [
        {
          selector: ".select2-selection__rendered",
          position: "static",
          box: { top: 0, left: 0, width: 240, height: 30 }
        }
      ],
      { height: 800, scrollTop: 0 }
    );

    const { inlineSearch } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );

    expect(inlineSearch().style.width).toBe("240px");
  });

  it.each([
    { case: "without text toggles the dropdown", term: "", isOpen: false },
    { case: "with text leaves the dropdown open", term: "re", isOpen: true }
  ])("a click on the field $case", ({ term, isOpen: expected }) => {
    const { inlineSearch, handle, isOpen } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );

    handle.open();
    inlineSearch().value = term;
    click(inlineSearch());

    expect(isOpen()).toBe(expected);
  });

  it("keeps its key downs to itself", () => {
    const { inlineSearch, parent } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );
    const heard: string[] = [];
    parent.addEventListener("keydown", (event) => heard.push(event.key));

    keyDown(inlineSearch(), "a", NO_MODIFIERS);

    expect(heard).toEqual([]);
  });

  it("points at the highlighted result and at the results list while open", () => {
    const { inlineSearch, handle, result, parent } = scene(
      plainSelect("multiple", COLORS),
      picking("Pick colors")
    );

    handle.open();

    expect(inlineSearch().getAttribute("aria-controls")).toBe(
      query(parent, ".select2-results__options").id
    );
    expect(inlineSearch().getAttribute("aria-activedescendant")).toBe(
      result("Red").id
    );

    handle.close();

    expect(inlineSearch().hasAttribute("aria-controls")).toBe(false);
    expect(inlineSearch().hasAttribute("aria-activedescendant")).toBe(false);
  });
});

describe("the search in the dropdown of a single select", () => {
  const searchable =
    (minimumResultsForSearch: number) =>
    (parent: HTMLElement): MountOptions => ({
      ...standard(parent),
      minimumResultsForSearch
    });

  it.each([
    { case: "no minimum", minimum: 0, hidden: false },
    { case: "as many results as the minimum", minimum: 4, hidden: false },
    { case: "fewer results than the minimum", minimum: 5, hidden: true },
    { case: "a negative minimum", minimum: -1, hidden: true },
    {
      case: "an infinite minimum",
      minimum: Number.POSITIVE_INFINITY,
      hidden: true
    }
  ])("is hidden or not with $case", ({ minimum, hidden }) => {
    const { handle, parent } = scene(
      plainSelect("", COLORS),
      searchable(minimum)
    );

    handle.open();

    expect(
      query(parent, ".select2-search--dropdown").classList.contains(
        "select2-search--hide"
      )
    ).toBe(hidden);
  });

  it("filters the results and forgets the term on close", () => {
    const { handle, dropdownSearch, parent } = scene(
      plainSelect("", COLORS),
      searchable(0)
    );

    handle.open();
    type(dropdownSearch(), "re");

    expect(textsOf(parent, RESULTS)).toEqual(["Red", "Green"]);

    handle.close();
    handle.open();

    expect(dropdownSearch().value).toBe("");
    expect(textsOf(parent, RESULTS)).toEqual(["Color", "Red", "Green", "Blue"]);
  });

  it("searches on a key up when no input event came first", () => {
    const { handle, dropdownSearch, parent } = scene(
      plainSelect("", COLORS),
      searchable(0)
    );

    handle.open();
    dropdownSearch().value = "bl";
    keyUp(dropdownSearch(), "a", NO_MODIFIERS);

    expect(textsOf(parent, RESULTS)).toEqual(["Blue"]);
  });

  it("stays shown while a term hides results below the minimum", () => {
    const { handle, dropdownSearch, parent } = scene(
      plainSelect("", COLORS),
      searchable(4)
    );

    handle.open();
    type(dropdownSearch(), "bl");

    expect(
      query(parent, ".select2-search--dropdown").classList.contains(
        "select2-search--hide"
      )
    ).toBe(false);
  });

  it("takes the focus once the dropdown is open and gives it back on close", async () => {
    const { handle, dropdownSearch, selection } = scene(
      plainSelect("", COLORS),
      searchable(0)
    );

    handle.open();
    await nextTimers();

    expect(document.activeElement === dropdownSearch()).toBe(true);
    expect(dropdownSearch().getAttribute("tabindex")).toBe("0");

    handle.close();

    expect(document.activeElement === selection()).toBe(true);
  });
});
