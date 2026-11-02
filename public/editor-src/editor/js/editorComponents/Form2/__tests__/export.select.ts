// The select fields of a published Form2, with the `group-1` bundle loaded as on the page.

import {
  click,
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
  queryInput,
  querySelect,
  stubLayout
} from "visual/libs/select2/__fixtures__/env";
import {
  COLORS,
  type FormSelectMarkup,
  formSelect
} from "visual/libs/select2/__fixtures__/markup";
import { useGroup1Env } from "visual/libs/select2/__fixtures__/suite";
import {
  settleTransport,
  stubTransport
} from "../../../../../jest-utils/formTransport";
import { ACTION, form2 } from "../__fixtures__/form";

useGroup1Env();

const base: FormSelectMarkup = {
  id: "color",
  label: "Color",
  multiple: false,
  required: false,
  placeholder: undefined,
  defaultValue: "",
  options: COLORS
};

const SUCCESS = {
  kind: "response",
  status: 200,
  contentType: "application/json",
  body: `{"success":true}`
} as const;

interface Page {
  root: HTMLElement;
  form: HTMLElement;
  item: HTMLElement;
  field: HTMLElement;
  select: HTMLSelectElement;
  selection: () => HTMLElement;
  rendered: () => HTMLElement;
  result: (text: string) => HTMLElement;
  isOpen: () => boolean;
  open: VoidFunction;
  choose: (text: string) => void;
  submit: () => Promise<void>;
}

async function page(markup: FormSelectMarkup): Promise<Page> {
  const { default: init } = await import(
    "visual/editorComponents/Form2/export"
  );
  const root = mount(form2({ attributes: ACTION, fields: formSelect(markup) }));
  const form = query(root, "form");
  const field = query(root, ".brz-forms2__field-select");
  const selection = (): HTMLElement => query(field, ".select2-selection");
  const result = (text: string): HTMLElement => {
    const found = queryAll(field, ".select2-results__option").find(
      (node) => node.textContent === text
    );

    if (!found) {
      throw new Error(`no result with the text ${text}`);
    }

    return found;
  };
  const isOpen = (): boolean =>
    query(field, ".select2.select2-container").classList.contains(
      "select2-container--open"
    );
  const open = (): void => {
    if (isOpen()) {
      return;
    }

    if (markup.multiple) {
      click(selection());
    } else {
      mouseDown(selection());
    }
  };

  init(root);

  return {
    root,
    form,
    item: query(root, ".brz-forms2__item"),
    field,
    select: querySelect(field, "select"),
    selection,
    rendered: () => query(field, ".select2-selection__rendered"),
    result,
    isOpen,
    open,
    choose: (text) => {
      open();
      mouseUp(result(text), NO_MODIFIERS);
    },
    submit: async () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
      await settleTransport();
    }
  };
}

interface MarkupCase {
  case: string;
  markup: FormSelectMarkup;
}

const markupCases: MarkupCase[] = [
  { case: "a single select", markup: base },
  {
    case: "a single select with a placeholder",
    markup: { ...base, placeholder: "Pick a color" }
  },
  {
    case: "a single select with a default value",
    markup: { ...base, placeholder: "Pick a color", defaultValue: "green" }
  },
  {
    case: "a required single select",
    markup: { ...base, placeholder: "Pick a color", required: true }
  },
  {
    case: "a multiple select with a placeholder",
    markup: { ...base, multiple: true, placeholder: "Pick colors" }
  },
  {
    case: "a multiple select with default values",
    markup: {
      ...base,
      multiple: true,
      placeholder: "Pick colors",
      defaultValue: "red, blue"
    }
  }
];

describe("the markup", () => {
  it.each(markupCases)("of $case", async ({ markup }) => {
    const { field, open } = await page(markup);

    expect(markupOf(field)).toMatchSnapshot("closed");

    open();
    await nextTimers();

    expect(markupOf(field)).toMatchSnapshot("open");
  });

  it("keeps the arrow of the form in place of the one select2 draws", async () => {
    const { field } = await page(base);

    expect(field.querySelector(".select2-selection__arrow")).toBeNull();
    expect(
      query(field, ".select2-selection").lastElementChild?.classList.contains(
        "brz-forms2__select--arrow"
      )
    ).toBe(true);
  });

  it("shows the chosen option of a select without a placeholder", async () => {
    const { rendered, choose } = await page(base);

    choose("Green");

    expect(rendered().textContent).toBe("Green");
  });
});

describe("the dropdown", () => {
  const rows = (): void =>
    stubLayout(
      [
        {
          selector: ".select2-results__option",
          position: "static",
          box: { top: 0, left: 0, width: 200, height: 40 }
        }
      ],
      { height: 800, scrollTop: 0 }
    );

  it("is capped at the number of rows the field asks for", async () => {
    rows();

    const { field, open } = await page(base);

    open();
    await nextTimers();

    expect(query(field, ".select2-dropdown").style.maxHeight).toBe("200px");
  });

  it("gets a custom scrollbar while it is open", async () => {
    rows();

    const { field, open, selection } = await page(base);

    open();
    await nextTimers();

    const dropdown = query(field, ".select2-dropdown");

    expect(dropdown.classList.contains("ps")).toBe(true);
    expect(dropdown.querySelectorAll(".ps__rail-x, .ps__rail-y")).toHaveLength(
      2
    );

    mouseDown(selection());

    expect(dropdown.querySelectorAll(".ps__rail-x, .ps__rail-y")).toHaveLength(
      0
    );
  });

  it("marks a multiple field while it is open", async () => {
    const { field, open, selection } = await page({
      ...base,
      multiple: true,
      placeholder: "Pick colors"
    });
    const opened = (): boolean =>
      field.classList.contains("brz-forms2__field-select--multiple--opened");

    open();
    await nextTimers();
    expect(opened()).toBe(true);

    click(selection());
    expect(opened()).toBe(false);
  });

  it("does not mark a single field", async () => {
    const { field, open } = await page(base);

    open();
    await nextTimers();

    expect(
      field.classList.contains("brz-forms2__field-select--multiple--opened")
    ).toBe(false);
  });

  it("hands the focus back to a marked field after a choice with the mouse", async () => {
    const { field, selection, choose } = await page(base);

    choose("Green");
    await nextTimers();

    expect(document.activeElement).toBe(selection());
    expect(
      field.classList.contains("brz-forms2__field-select--keyboard-focus")
    ).toBe(true);
  });
});

describe("the keyboard on a single select", () => {
  interface KeyCase {
    case: string;
    keys: KeyName[];
    isOpen: boolean;
    value: string;
    active: string | undefined;
  }

  it.each<KeyCase>([
    {
      case: "Enter opens the dropdown",
      keys: ["Enter"],
      isOpen: true,
      value: "",
      active: "Red"
    },
    {
      case: "Space opens the dropdown",
      keys: [" "],
      isOpen: true,
      value: "",
      active: "Red"
    },
    {
      case: "ArrowDown opens the dropdown",
      keys: ["ArrowDown"],
      isOpen: true,
      value: "",
      active: "Red"
    },
    {
      case: "ArrowUp opens the dropdown",
      keys: ["ArrowUp"],
      isOpen: true,
      value: "",
      active: "Red"
    },
    {
      case: "a letter does nothing",
      keys: ["a"],
      isOpen: false,
      value: "",
      active: undefined
    },
    {
      case: "ArrowDown moves to the next option",
      keys: ["Enter", "ArrowDown"],
      isOpen: true,
      value: "",
      active: "Green"
    },
    {
      case: "ArrowUp moves back",
      keys: ["Enter", "ArrowDown", "ArrowDown", "ArrowUp"],
      isOpen: true,
      value: "",
      active: "Green"
    },
    {
      case: "Enter chooses the highlighted option",
      keys: ["Enter", "ArrowDown", "Enter"],
      isOpen: false,
      value: "green",
      active: undefined
    },
    {
      case: "Space chooses the highlighted option",
      keys: ["Enter", "ArrowDown", "ArrowDown", " "],
      isOpen: false,
      value: "blue",
      active: undefined
    },
    {
      case: "Tab chooses the highlighted option",
      keys: ["Enter", "ArrowDown", "Tab"],
      isOpen: false,
      value: "green",
      active: undefined
    },
    {
      case: "Escape closes without choosing",
      keys: ["Enter", "ArrowDown", "Escape"],
      isOpen: false,
      value: "",
      active: undefined
    }
  ])("$case", async ({ keys, isOpen: expected, value, active }) => {
    const { field, select, selection, isOpen } = await page({
      ...base,
      placeholder: "Pick a color"
    });

    selection().focus();

    for (const key of keys) {
      keyDown(selection(), key, NO_MODIFIERS);
      await nextFrame();
    }

    expect(isOpen()).toBe(expected);
    expect(select.value).toBe(value);
    expect(
      field.querySelector(".brz-forms2__select-option--active")?.textContent ??
        undefined
    ).toBe(active);
  });

  it("marks the field while the selection has the focus", async () => {
    const { field, selection } = await page(base);
    const focused = (): boolean =>
      field.classList.contains("brz-forms2__field-select--keyboard-focus");

    selection().focus();
    expect(focused()).toBe(true);

    selection().blur();
    expect(focused()).toBe(false);
  });
});

describe("the keyboard on a multiple select", () => {
  it.each<{ key: KeyName }>([
    { key: "Enter" },
    { key: " " },
    { key: "ArrowDown" },
    { key: "ArrowUp" }
  ])("$key in the search field opens the dropdown", async ({ key }) => {
    const { field, isOpen, select } = await page({
      ...base,
      multiple: true,
      placeholder: "Pick colors"
    });

    keyDown(queryInput(field, ".select2-search__field"), key, NO_MODIFIERS);
    await nextFrame();

    expect(isOpen()).toBe(true);
    expect([...select.selectedOptions]).toHaveLength(0);
  });

  it("Enter in the search field of an open dropdown chooses the highlighted option", async () => {
    const { field, isOpen, select, open } = await page({
      ...base,
      multiple: true,
      placeholder: "Pick colors"
    });
    const search = queryInput(field, ".select2-search__field");

    open();
    keyDown(search, "ArrowDown", NO_MODIFIERS);
    await nextFrame();

    expect(
      field.querySelector(".brz-forms2__select-option--active")?.textContent
    ).toBe("Green");

    keyDown(search, "Enter", NO_MODIFIERS);
    await nextFrame();

    expect([...select.selectedOptions].map((item) => item.value)).toEqual([
      "green"
    ]);
    expect(isOpen()).toBe(false);
  });
});

describe("the selection described for assistive technology", () => {
  it.each([
    {
      case: "a single select",
      markup: base,
      attributes: ["combobox", "0", "listbox", "false", "false", null]
    },
    {
      case: "a required single select",
      markup: { ...base, required: true },
      attributes: ["combobox", "0", "listbox", "false", "false", "true"]
    },
    {
      case: "a multiple select",
      markup: { ...base, multiple: true, placeholder: "Pick colors" },
      attributes: ["combobox", "-1", "listbox", "false", "false", null]
    }
  ])("of $case", async ({ markup, attributes }) => {
    const { selection, open } = await page(markup);
    const described = (): Array<string | null> =>
      [
        "role",
        "tabindex",
        "aria-haspopup",
        "aria-expanded",
        "aria-disabled",
        "aria-required"
      ].map((name) => selection().getAttribute(name));

    expect(described()).toEqual(attributes);

    open();

    expect(described()[3]).toBe("true");
  });
});

describe("the value that is sent", () => {
  it.each([
    {
      case: "a single select",
      markup: { ...base, placeholder: "Pick a color" },
      choices: ["Green"],
      value: "green"
    },
    {
      case: "a single select left alone",
      markup: { ...base, placeholder: "Pick a color" },
      choices: [],
      value: ""
    },
    {
      case: "a single select with a default value",
      markup: { ...base, placeholder: "Pick a color", defaultValue: "blue" },
      choices: [],
      value: "blue"
    },
    {
      case: "a multiple select",
      markup: { ...base, multiple: true, placeholder: "Pick colors" },
      choices: ["Blue", "Red"],
      value: "red,blue"
    },
    {
      case: "a multiple select with default values and one more",
      markup: {
        ...base,
        multiple: true,
        placeholder: "Pick colors",
        defaultValue: "red"
      },
      choices: ["Green"],
      value: "red,green"
    }
  ])("of $case", async ({ markup, choices, value }) => {
    const transport = stubTransport(SUCCESS);
    const { choose, submit } = await page(markup);

    choices.forEach((text) => choose(text));
    await submit();
    transport.restore();

    expect(transport.requests).toHaveLength(1);

    const [request] = transport.requests;
    const sent =
      request.body.kind === "form"
        ? request.body.entries.find(([name]) => name === "data")?.[1]
        : undefined;

    expect(JSON.parse(sent ?? "null")).toEqual([
      {
        name: "color",
        value,
        required: false,
        type: "Select",
        label: "Color"
      }
    ]);
  });
});

describe("a required select", () => {
  const errors = (item: HTMLElement): string[] =>
    [...item.classList].filter((name) => name.includes("--error")).sort();

  it.each([
    {
      case: "single",
      markup: { ...base, placeholder: "Pick a color", required: true }
    },
    {
      case: "multiple",
      markup: {
        ...base,
        multiple: true,
        placeholder: "Pick colors",
        required: true
      }
    }
  ])(
    "$case, blocks the submit until an option is chosen",
    async ({ markup }) => {
      const transport = stubTransport(SUCCESS);
      const { item, choose, submit, form } = await page(markup);

      await submit();

      expect(transport.requests).toHaveLength(0);
      expect(errors(item)).toEqual([
        "brz-forms2__item--error",
        "brz-forms2__item--error-required"
      ]);
      expect(form.querySelector(".brz-forms2__alert")?.className).toBe(
        "brz-forms2__alert brz-forms2__alert--empty"
      );

      choose("Green");

      expect(errors(item)).toEqual([]);

      await submit();
      transport.restore();

      expect(transport.requests).toHaveLength(1);
    }
  );
});

describe("a successful submit", () => {
  it.each([
    {
      case: "a single select back to its placeholder",
      markup: { ...base, placeholder: "Pick a color" },
      choices: ["Green"]
    },
    {
      case: "a single select without a placeholder back to its first option",
      markup: base,
      choices: ["Green"]
    },
    {
      case: "a multiple select back to its placeholder",
      markup: { ...base, multiple: true, placeholder: "Pick colors" },
      choices: ["Green", "Blue"]
    }
  ])("puts $case", async ({ markup, choices }) => {
    const transport = stubTransport(SUCCESS);
    const { field, choose, submit } = await page(markup);

    choices.forEach((text) => choose(text));
    await submit();
    transport.restore();

    expect(markupOf(query(field, ".select2-selection"))).toMatchSnapshot();
  });
});
