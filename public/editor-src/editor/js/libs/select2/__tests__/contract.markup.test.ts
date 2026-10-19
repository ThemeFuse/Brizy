// The markup select2 builds around a select, closed and open. Driven through the driver only.

import type { MountOptions } from "../__fixtures__/driver";
import { markupOf } from "../__fixtures__/env";
import {
  COLORS,
  type OptionMarkup,
  SOLID_COLORS,
  option,
  optionWith,
  plainSelect
} from "../__fixtures__/markup";
import { scene, standard, useSelect2Env } from "../__fixtures__/suite";

useSelect2Env();

interface MarkupCase {
  case: string;
  attributes: string;
  options: OptionMarkup[];
  placeholder: string | undefined;
}

const cases: MarkupCase[] = [
  {
    case: "a single select",
    attributes: "",
    options: COLORS,
    placeholder: undefined
  },
  {
    case: "a single select with a placeholder",
    attributes: "",
    options: COLORS,
    placeholder: "Pick a color"
  },
  {
    case: "a single select with an empty placeholder",
    attributes: "",
    options: COLORS,
    placeholder: ""
  },
  {
    case: "a multiple select",
    attributes: "multiple",
    options: SOLID_COLORS,
    placeholder: undefined
  },
  {
    case: "a multiple select with a placeholder",
    attributes: "multiple",
    options: COLORS,
    placeholder: "Pick colors"
  },
  {
    case: "a select with an id",
    attributes: `id="color"`,
    options: COLORS,
    placeholder: undefined
  },
  {
    case: "a select with a name that needs cleaning",
    attributes: `name="color[a.b]:c,d"`,
    options: COLORS,
    placeholder: undefined
  },
  {
    case: "a select with a title and a tabindex",
    attributes: `title="Colors" tabindex="3"`,
    options: COLORS,
    placeholder: undefined
  },
  {
    case: "a multiple select with a tabindex",
    attributes: `multiple tabindex="3"`,
    options: SOLID_COLORS,
    placeholder: undefined
  },
  {
    case: "a disabled select",
    attributes: "disabled",
    options: COLORS,
    placeholder: undefined
  },
  {
    case: "a disabled multiple select",
    attributes: "multiple disabled",
    options: SOLID_COLORS,
    placeholder: undefined
  },
  {
    case: "a select with its own direction",
    attributes: `dir="rtl"`,
    options: COLORS,
    placeholder: undefined
  },
  {
    case: "a preselected option",
    attributes: "",
    options: [
      option("", "Color"),
      option("red", "Red"),
      optionWith("green", "Green", "selected"),
      option("blue", "Blue")
    ],
    placeholder: undefined
  },
  {
    case: "a preselected option next to a placeholder",
    attributes: "",
    options: [
      option("", "Color"),
      optionWith("green", "Green", "selected"),
      option("blue", "Blue")
    ],
    placeholder: "Pick a color"
  },
  {
    case: "several preselected options",
    attributes: "multiple",
    options: [
      option("", "Color"),
      optionWith("red", "Red", "selected"),
      option("green", "Green"),
      optionWith("blue", "Blue", "selected")
    ],
    placeholder: "Pick colors"
  },
  {
    case: "an option with a title",
    attributes: "",
    options: [optionWith("red", "Red", `title="The red one" selected`)],
    placeholder: undefined
  },
  {
    case: "a disabled option",
    attributes: "",
    options: [option("red", "Red"), optionWith("green", "Green", "disabled")],
    placeholder: undefined
  },
  {
    case: "text that needs escaping",
    attributes: "",
    options: [option("lt", `a &lt; b &amp; "c" / d\\e`)],
    placeholder: undefined
  },
  {
    case: "an option without text",
    attributes: "",
    options: [option("empty", ""), option("red", "Red")],
    placeholder: undefined
  }
];

const withPlaceholder =
  (placeholder: string | undefined) =>
  (parent: HTMLElement): MountOptions => ({
    ...standard(parent),
    placeholder
  });

describe("the markup", () => {
  it.each(cases)("of $case, closed", ({ attributes, options, placeholder }) => {
    const { parent } = scene(
      plainSelect(attributes, options),
      withPlaceholder(placeholder)
    );

    expect(markupOf(parent)).toMatchSnapshot();
  });

  it.each(cases)("of $case, open", ({ attributes, options, placeholder }) => {
    const { parent, handle } = scene(
      plainSelect(attributes, options),
      withPlaceholder(placeholder)
    );

    handle.open();

    expect(markupOf(parent)).toMatchSnapshot();
  });

  it.each(cases)(
    "of $case, closed again",
    ({ attributes, options, placeholder }) => {
      const { parent, handle } = scene(
        plainSelect(attributes, options),
        withPlaceholder(placeholder)
      );

      handle.open();
      handle.close();

      expect(markupOf(parent)).toMatchSnapshot();
    }
  );
});

describe("groups of options", () => {
  const grouped = `<div class="parent"><select><optgroup label="Warm" title="Warm colors"><option value="red">Red</option><option value="orange" disabled>Orange</option></optgroup><optgroup label="Cold" disabled><option value="blue">Blue</option></optgroup><optgroup label="Empty"></optgroup></select></div>`;

  it("render as nested lists", () => {
    const { parent, handle } = scene(grouped, standard);

    handle.open();

    expect(markupOf(parent)).toMatchSnapshot();
  });
});

describe("the direction", () => {
  it.each([
    {
      case: "comes from the closest ancestor that sets one",
      html: `<div dir="rtl"><div class="parent"><select><option value="a">A</option></select></div></div>`,
      dir: "rtl"
    },
    {
      case: "is ltr when nothing sets one",
      html: plainSelect("", COLORS),
      dir: "ltr"
    }
  ])("$case", ({ html, dir }) => {
    const { container, handle, parent } = scene(html, standard);

    handle.open();

    expect(container().getAttribute("dir")).toBe(dir);
    expect(parent.querySelector(".select2-dropdown")?.getAttribute("dir")).toBe(
      dir
    );
  });
});
