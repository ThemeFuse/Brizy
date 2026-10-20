// Keys, sent to the element a browser would have focused.

import {
  type KeyName,
  type Modifiers,
  NO_MODIFIERS,
  hover,
  keyDown,
  mouseUp
} from "../__fixtures__/env";
import {
  COLORS,
  SOLID_COLORS,
  option,
  optionWith,
  plainSelect
} from "../__fixtures__/markup";
import {
  type Scene,
  scene,
  standard,
  useSelect2Env
} from "../__fixtures__/suite";

useSelect2Env();

const ALT: Modifiers = { ...NO_MODIFIERS, altKey: true };
const CTRL: Modifiers = { ...NO_MODIFIERS, ctrlKey: true };

type Target = "selection" | "dropdownSearch" | "inlineSearch";

const targetOf = (scene: Scene, target: Target): HTMLElement => {
  switch (target) {
    case "selection":
      return scene.selection();
    case "dropdownSearch":
      return scene.dropdownSearch();
    case "inlineSearch":
      return scene.inlineSearch();
  }
};

interface ClosedCase {
  case: string;
  attributes: string;
  placeholder: string | undefined;
  target: Target;
  key: KeyName;
  modifiers: Modifiers;
  opens: boolean;
  prevented: boolean;
}

describe("a key on a closed select", () => {
  it.each<ClosedCase>([
    {
      case: "Enter on a single selection",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      key: "Enter",
      modifiers: NO_MODIFIERS,
      opens: true,
      prevented: true
    },
    {
      case: "Space on a single selection",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      key: " ",
      modifiers: NO_MODIFIERS,
      opens: true,
      prevented: true
    },
    {
      case: "alt + ArrowDown on a single selection",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      key: "ArrowDown",
      modifiers: ALT,
      opens: true,
      prevented: true
    },
    {
      case: "ArrowDown on a single selection",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      key: "ArrowDown",
      modifiers: NO_MODIFIERS,
      opens: false,
      prevented: false
    },
    {
      case: "ArrowUp on a single selection",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      key: "ArrowUp",
      modifiers: NO_MODIFIERS,
      opens: false,
      prevented: false
    },
    {
      case: "Escape on a single selection",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      key: "Escape",
      modifiers: NO_MODIFIERS,
      opens: false,
      prevented: false
    },
    {
      case: "a letter on a single selection",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      key: "a",
      modifiers: NO_MODIFIERS,
      opens: false,
      prevented: false
    },
    {
      case: "Enter on a disabled single selection",
      attributes: "disabled",
      placeholder: undefined,
      target: "selection",
      key: "Enter",
      modifiers: NO_MODIFIERS,
      opens: false,
      prevented: true
    },
    {
      case: "Enter in the search of a multiple select",
      attributes: "multiple",
      placeholder: "Pick colors",
      target: "inlineSearch",
      key: "Enter",
      modifiers: NO_MODIFIERS,
      opens: true,
      prevented: true
    },
    {
      case: "Space in the search of a multiple select",
      attributes: "multiple",
      placeholder: "Pick colors",
      target: "inlineSearch",
      key: " ",
      modifiers: NO_MODIFIERS,
      opens: true,
      prevented: true
    },
    {
      case: "ArrowDown in the search of a multiple select",
      attributes: "multiple",
      placeholder: "Pick colors",
      target: "inlineSearch",
      key: "ArrowDown",
      modifiers: NO_MODIFIERS,
      opens: false,
      prevented: false
    },
    {
      case: "Enter on the selection of a multiple select",
      attributes: "multiple",
      placeholder: "Pick colors",
      target: "selection",
      key: "Enter",
      modifiers: NO_MODIFIERS,
      opens: true,
      prevented: true
    }
  ])(
    "$case",
    ({ attributes, placeholder, target, key, modifiers, opens, prevented }) => {
      const mounted = scene(plainSelect(attributes, COLORS), (parent) => ({
        ...standard(parent),
        placeholder
      }));

      const event = keyDown(targetOf(mounted, target), key, modifiers);

      expect(mounted.isOpen()).toBe(opens);
      expect(event.defaultPrevented).toBe(prevented);
    }
  );
});

interface OpenCase {
  case: string;
  attributes: string;
  placeholder: string | undefined;
  target: Target;
  keys: Array<{ key: KeyName; modifiers: Modifiers }>;
  isOpen: boolean;
  values: string[];
  highlighted: string | undefined;
}

const plain = (key: KeyName): { key: KeyName; modifiers: Modifiers } => ({
  key,
  modifiers: NO_MODIFIERS
});

describe("keys on an open select", () => {
  it.each<OpenCase>([
    {
      case: "ArrowDown moves the highlight down",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [plain("ArrowDown"), plain("ArrowDown")],
      isOpen: true,
      values: [""],
      highlighted: "Green"
    },
    {
      case: "ArrowDown stops at the last result",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [
        plain("ArrowDown"),
        plain("ArrowDown"),
        plain("ArrowDown"),
        plain("ArrowDown"),
        plain("ArrowDown")
      ],
      isOpen: true,
      values: [""],
      highlighted: "Blue"
    },
    {
      case: "ArrowUp moves the highlight up and stops at the first result",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [
        plain("ArrowDown"),
        plain("ArrowDown"),
        plain("ArrowUp"),
        plain("ArrowUp"),
        plain("ArrowUp")
      ],
      isOpen: true,
      values: [""],
      highlighted: "Color"
    },
    {
      case: "Enter selects the highlighted result and closes",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [plain("ArrowDown"), plain("ArrowDown"), plain("Enter")],
      isOpen: false,
      values: ["green"],
      highlighted: undefined
    },
    {
      case: "Enter on the selected result only closes",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [plain("Enter")],
      isOpen: false,
      values: [""],
      highlighted: undefined
    },
    {
      case: "Escape closes",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [plain("ArrowDown"), plain("Escape")],
      isOpen: false,
      values: [""],
      highlighted: undefined
    },
    {
      case: "Tab closes",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [plain("ArrowDown"), plain("Tab")],
      isOpen: false,
      values: [""],
      highlighted: undefined
    },
    {
      case: "alt + ArrowUp closes",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [{ key: "ArrowUp", modifiers: ALT }],
      isOpen: false,
      values: [""],
      highlighted: undefined
    },
    {
      case: "ctrl + Space selects the highlighted result",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [plain("ArrowDown"), { key: " ", modifiers: CTRL }],
      isOpen: false,
      values: ["red"],
      highlighted: undefined
    },
    {
      case: "Space alone changes nothing",
      attributes: "",
      placeholder: undefined,
      target: "selection",
      keys: [plain("ArrowDown"), plain(" ")],
      isOpen: true,
      values: [""],
      highlighted: "Red"
    },
    {
      case: "the keys work from the dropdown search field",
      attributes: "",
      placeholder: undefined,
      target: "dropdownSearch",
      keys: [plain("ArrowDown"), plain("ArrowDown"), plain("Enter")],
      isOpen: false,
      values: ["green"],
      highlighted: undefined
    },
    {
      case: "Escape works from the dropdown search field",
      attributes: "",
      placeholder: undefined,
      target: "dropdownSearch",
      keys: [plain("Escape")],
      isOpen: false,
      values: [""],
      highlighted: undefined
    },
    {
      case: "the keys work from the search of a multiple select",
      attributes: "multiple",
      placeholder: "Pick colors",
      target: "inlineSearch",
      keys: [plain("ArrowDown"), plain("ArrowDown"), plain("Enter")],
      isOpen: false,
      values: ["blue"],
      highlighted: undefined
    },
    {
      case: "ctrl + Space selects the highlighted result of a multiple select",
      attributes: "multiple",
      placeholder: "Pick colors",
      target: "inlineSearch",
      keys: [plain("ArrowDown"), { key: " ", modifiers: CTRL }],
      isOpen: false,
      values: ["green"],
      highlighted: undefined
    }
  ])(
    "$case",
    ({
      attributes,
      placeholder,
      target,
      keys,
      isOpen,
      values,
      highlighted
    }) => {
      const mounted = scene(plainSelect(attributes, COLORS), (parent) => ({
        ...standard(parent),
        placeholder
      }));

      mounted.handle.open();
      keys.forEach(({ key, modifiers }) => {
        keyDown(targetOf(mounted, target), key, modifiers);
      });

      expect(mounted.isOpen()).toBe(isOpen);
      expect(mounted.values()).toEqual(values);
      expect(mounted.highlighted()).toBe(highlighted);
    }
  );

  it("skips disabled results", () => {
    const mounted = scene(
      plainSelect("", [
        option("red", "Red"),
        optionWith("green", "Green", "disabled"),
        option("blue", "Blue")
      ]),
      standard
    );

    mounted.handle.open();
    keyDown(mounted.selection(), "ArrowDown", NO_MODIFIERS);

    expect(mounted.highlighted()).toBe("Blue");
  });

  it("points the selection and the search at the highlighted result", () => {
    const mounted = scene(plainSelect("", COLORS), standard);

    mounted.handle.open();
    keyDown(mounted.selection(), "ArrowDown", NO_MODIFIERS);

    const red = mounted.result("Red");

    expect(red.id).not.toBe("");
    expect(mounted.selection().getAttribute("aria-activedescendant")).toBe(
      red.id
    );
    expect(mounted.dropdownSearch().getAttribute("aria-activedescendant")).toBe(
      red.id
    );
  });

  it("drops the pointers when the highlighted result has no id", () => {
    const mounted = scene(plainSelect("", COLORS), standard);

    mounted.handle.open();
    keyDown(mounted.selection(), "ArrowDown", NO_MODIFIERS);
    keyDown(mounted.selection(), "ArrowUp", NO_MODIFIERS);

    expect(mounted.highlighted()).toBe("Color");
    expect(mounted.dropdownSearch().hasAttribute("aria-activedescendant")).toBe(
      false
    );
  });

  it("prevents the default action of the keys it handles", () => {
    const mounted = scene(plainSelect("", COLORS), standard);

    mounted.handle.open();

    const prevented = (
      ["ArrowDown", "ArrowUp", "a", " ", "Enter"] satisfies KeyName[]
    ).map((key) => {
      if (!mounted.isOpen()) {
        mounted.handle.open();
      }

      return keyDown(mounted.selection(), key, NO_MODIFIERS).defaultPrevented;
    });

    expect(prevented).toEqual([true, true, false, true, true]);
  });

  it("only closes a multiple select on Enter on a result that is already selected", () => {
    const mounted = scene(plainSelect("multiple", SOLID_COLORS), standard);

    mounted.handle.open();
    mouseUp(mounted.result("Green"), { ...NO_MODIFIERS, ctrlKey: true });
    hover(mounted.result("Green"));
    keyDown(mounted.inlineSearch(), "Enter", NO_MODIFIERS);

    expect(mounted.values()).toEqual(["green"]);
    expect(mounted.isOpen()).toBe(false);
  });
});
