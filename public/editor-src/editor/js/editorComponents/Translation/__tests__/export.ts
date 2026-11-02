// The published language switcher, with the `group-1` bundle loaded as on the page.

import {
  hover,
  type KeyName,
  keyDown,
  markupOf,
  mount,
  mouseDown,
  mouseUp,
  NO_MODIFIERS,
  nextFrame,
  nextTimers,
  query,
  queryAll,
  stubLayout
} from "visual/libs/select2/__fixtures__/env";
import {
  type LanguageMarkup,
  translation
} from "visual/libs/select2/__fixtures__/markup";
import { useGroup1Env } from "visual/libs/select2/__fixtures__/suite";

useGroup1Env();

afterEach(() => {
  window.location.hash = "";
});

const LANGUAGES: LanguageMarkup[] = [
  { code: "en", name: "English", selected: true },
  { code: "ro", name: "Română", selected: false },
  { code: "fr", name: "Français", selected: false }
];

type Flag = "on" | "off";

interface Switcher {
  root: HTMLElement;
  element: HTMLElement;
  selection: () => HTMLElement;
  result: (text: string) => HTMLElement;
  highlighted: () => string | undefined;
  isOpen: () => boolean;
}

async function switcher(
  showFlags: Flag,
  showName: Flag,
  languages: LanguageMarkup[]
): Promise<Switcher> {
  const { default: init } = await import(
    "visual/editorComponents/Translation/export"
  );
  const root = mount(translation({ showFlags, showName, languages }));
  const element = query(root, ".brz-translation");

  init(root);

  return {
    root,
    element,
    selection: () => query(element, ".select2-selection"),
    result: (text) => {
      const found = queryAll(element, ".select2-results__option").find(
        (node) => node.textContent === text
      );

      if (!found) {
        throw new Error(`no result with the text ${text}`);
      }

      return found;
    },
    highlighted: () =>
      element.querySelector(".select2-results__option--highlighted")
        ?.textContent ?? undefined,
    isOpen: () =>
      query(element, ".select2.select2-container").classList.contains(
        "select2-container--open"
      )
  };
}

describe("the markup", () => {
  it.each<{ showFlags: Flag; showName: Flag }>([
    { showFlags: "on", showName: "on" },
    { showFlags: "on", showName: "off" },
    { showFlags: "off", showName: "on" },
    { showFlags: "off", showName: "off" }
  ])(
    "with flags $showFlags and names $showName",
    async ({ showFlags, showName }) => {
      const { element, selection } = await switcher(
        showFlags,
        showName,
        LANGUAGES
      );

      expect(markupOf(element)).toMatchSnapshot("closed");

      mouseDown(selection());
      await nextTimers();

      expect(markupOf(element)).toMatchSnapshot("open");
    }
  );

  it("is left alone when the switcher has no select", async () => {
    const { default: init } = await import(
      "visual/editorComponents/Translation/export"
    );
    const root = mount(
      `<div class="brz-translation"><div class="brz-translation__dc"></div></div>`
    );

    init(root);

    expect(root.innerHTML).toBe(
      `<div class="brz-translation"><div class="brz-translation__dc"></div></div>`
    );
  });

  it("is built for every switcher under the root", async () => {
    const { default: init } = await import(
      "visual/editorComponents/Translation/export"
    );
    const root = mount(
      translation({ showFlags: "on", showName: "on", languages: LANGUAGES }) +
        translation({ showFlags: "off", showName: "on", languages: LANGUAGES })
    );

    init(root);

    expect(root.querySelectorAll(".select2.select2-container")).toHaveLength(2);
  });
});

describe("choosing a language", () => {
  it.each([
    { case: "its link", text: "Română", hash: "#lang-ro" },
    { case: "another link", text: "Français", hash: "#lang-fr" }
  ])("goes to $case", async ({ text, hash }) => {
    const { selection, result, isOpen } = await switcher("on", "on", LANGUAGES);

    mouseDown(selection());
    mouseUp(result(text), NO_MODIFIERS);

    expect(window.location.hash).toBe(hash);
    expect(isOpen()).toBe(false);
  });

  it("stays on the page when the current language is chosen again", async () => {
    const { selection, result, isOpen } = await switcher("on", "on", LANGUAGES);

    mouseDown(selection());
    mouseUp(result("English"), NO_MODIFIERS);

    expect(window.location.hash).toBe("");
    expect(isOpen()).toBe(false);
  });
});

describe("the dropdown", () => {
  it("is capped at four rows and gets a custom scrollbar while open", async () => {
    stubLayout(
      [
        {
          selector: ".select2-results__option",
          position: "static",
          box: { top: 0, left: 0, width: 120, height: 30 }
        }
      ],
      { height: 800, scrollTop: 0 }
    );

    const { element, selection } = await switcher("on", "on", LANGUAGES);

    mouseDown(selection());
    await nextTimers();

    const dropdown = query(element, ".select2-dropdown");

    expect(dropdown.style.maxHeight).toBe("120px");
    expect(dropdown.classList.contains("ps")).toBe(true);
    expect(dropdown.querySelectorAll(".ps__rail-x, .ps__rail-y")).toHaveLength(
      2
    );

    mouseDown(selection());

    expect(dropdown.querySelectorAll(".ps__rail-x, .ps__rail-y")).toHaveLength(
      0
    );
  });

  it("opens inside the switcher", async () => {
    const { element, selection } = await switcher("on", "on", LANGUAGES);

    mouseDown(selection());

    expect(
      query(element, ".select2-dropdown").parentElement?.parentElement
    ).toBe(query(element, ".brz-translation__dc"));
  });
});

describe("the keyboard", () => {
  interface KeyCase {
    case: string;
    keys: KeyName[];
    isOpen: boolean;
    hash: string;
    active: string | undefined;
  }

  it.each<KeyCase>([
    {
      case: "Enter opens the dropdown",
      keys: ["Enter"],
      isOpen: true,
      hash: "",
      active: "English"
    },
    {
      case: "Space opens the dropdown",
      keys: [" "],
      isOpen: true,
      hash: "",
      active: "English"
    },
    {
      case: "ArrowDown opens the dropdown",
      keys: ["ArrowDown"],
      isOpen: true,
      hash: "",
      active: "English"
    },
    {
      case: "ArrowUp opens the dropdown",
      keys: ["ArrowUp"],
      isOpen: true,
      hash: "",
      active: "English"
    },
    {
      case: "a letter does nothing",
      keys: ["a"],
      isOpen: false,
      hash: "",
      active: undefined
    },
    {
      case: "ArrowDown moves to the next language",
      keys: ["Enter", "ArrowDown"],
      isOpen: true,
      hash: "",
      active: "Română"
    },
    {
      case: "ArrowUp moves back",
      keys: ["Enter", "ArrowDown", "ArrowDown", "ArrowUp"],
      isOpen: true,
      hash: "",
      active: "Română"
    },
    {
      case: "Enter goes to the highlighted language",
      keys: ["Enter", "ArrowDown", "Enter"],
      isOpen: false,
      hash: "#lang-ro",
      active: undefined
    },
    {
      case: "Space goes to the highlighted language",
      keys: ["Enter", "ArrowDown", "ArrowDown", " "],
      isOpen: false,
      hash: "#lang-fr",
      active: undefined
    },
    {
      case: "Tab goes to the highlighted language",
      keys: ["Enter", "ArrowDown", "Tab"],
      isOpen: false,
      hash: "#lang-ro",
      active: undefined
    },
    {
      case: "Escape closes without choosing",
      keys: ["Enter", "ArrowDown", "Escape"],
      isOpen: false,
      hash: "",
      active: undefined
    }
  ])("$case", async ({ keys, isOpen: expected, hash, active }) => {
    const { element, selection, isOpen } = await switcher(
      "on",
      "on",
      LANGUAGES
    );

    selection().focus();

    for (const key of keys) {
      keyDown(selection(), key, NO_MODIFIERS);
      await nextFrame();
    }

    expect(isOpen()).toBe(expected);
    expect(window.location.hash).toBe(hash);
    expect(
      element.querySelector(".brz-translation-option--active")?.textContent ??
        undefined
    ).toBe(active);
  });

  it("marks the switcher while the selection has the focus", async () => {
    const { element, selection } = await switcher("on", "on", LANGUAGES);
    const focused = (): boolean =>
      element.classList.contains("brz-translation--keyboard-focus");

    selection().focus();
    expect(focused()).toBe(true);

    selection().blur();
    expect(focused()).toBe(false);
  });

  it("keeps the selection described as a combobox as it opens and closes", async () => {
    const { selection } = await switcher("on", "on", LANGUAGES);
    const described = (): Array<string | null> =>
      [
        "role",
        "tabindex",
        "aria-haspopup",
        "aria-expanded",
        "aria-disabled",
        "aria-required"
      ].map((name) => selection().getAttribute(name));

    expect(described()).toEqual([
      "combobox",
      "0",
      "listbox",
      "false",
      "false",
      null
    ]);

    mouseDown(selection());

    expect(described()).toEqual([
      "combobox",
      "0",
      "listbox",
      "true",
      "false",
      null
    ]);

    mouseDown(selection());

    expect(described()).toEqual([
      "combobox",
      "0",
      "listbox",
      "false",
      "false",
      null
    ]);
  });

  it("moves the active mark with the pointer once a key is pressed", async () => {
    const { element, selection, result } = await switcher(
      "on",
      "on",
      LANGUAGES
    );

    keyDown(selection(), "Enter", NO_MODIFIERS);
    await nextFrame();
    hover(result("Français"));
    keyDown(selection(), "ArrowUp", NO_MODIFIERS);
    await nextFrame();

    expect(
      element.querySelector(".brz-translation-option--active")?.textContent
    ).toBe("Română");
  });
});
