// Options, given in code and through data attributes of the select.

import type { MountOptions } from "../__fixtures__/driver";
import {
  NO_MODIFIERS,
  mouseUp,
  query,
  stubLayout,
  textsOf
} from "../__fixtures__/env";
import { COLORS, plainSelect } from "../__fixtures__/markup";
import { scene, standard, useSelect2Env } from "../__fixtures__/suite";

useSelect2Env();

const sized =
  (width: string) =>
  (parent: HTMLElement): MountOptions => ({
    ...standard(parent),
    width
  });

describe("the width of the container", () => {
  it.each([
    {
      case: "a css value",
      attributes: "",
      width: "100%",
      style: "width: 100%;"
    },
    {
      case: "another css value",
      attributes: "",
      width: "300px",
      style: "width: 300px;"
    },
    {
      case: "the style of the select",
      attributes: `style="color: red; width: 12.5em"`,
      width: "style",
      style: "width: 12.5em;"
    },
    {
      case: "a style without a width",
      attributes: `style="color: red"`,
      width: "style",
      style: undefined
    },
    {
      case: "no style at all",
      attributes: "",
      width: "style",
      style: undefined
    },
    {
      case: "resolve, with a width in the style",
      attributes: `style="width: 240px"`,
      width: "resolve",
      style: "width: 240px;"
    },
    {
      case: "resolve, with a percent width in the style",
      attributes: `style="width:50%"`,
      width: "resolve",
      style: "width: 50%;"
    },
    {
      case: "resolve, without a width in the style",
      attributes: "",
      width: "resolve",
      style: "width: auto;"
    },
    {
      case: "the element, without a measurable width",
      attributes: "",
      width: "element",
      style: "width: auto;"
    }
  ])("comes from $case", ({ attributes, width, style }) => {
    const { container } = scene(plainSelect(attributes, COLORS), sized(width));

    expect(container().getAttribute("style") ?? undefined).toBe(style);
  });

  it.each([
    { width: "element", style: "width: 150px;" },
    { width: "resolve", style: "width: 150px;" },
    { width: "computedstyle", style: "width: 150px;" }
  ])("comes from the measured select for $width", ({ width, style }) => {
    stubLayout(
      [
        {
          selector: "select",
          position: "static",
          box: { top: 0, left: 0, width: 150, height: 30 }
        }
      ],
      { height: 800, scrollTop: 0 }
    );

    const { container } = scene(plainSelect("", COLORS), sized(width));

    expect(container().getAttribute("style")).toBe(style);
  });
});

describe("a data attribute of the select", () => {
  it("sets the placeholder", () => {
    const { rendered, handle, parent } = scene(
      plainSelect(`data-placeholder="From the markup"`, COLORS),
      standard
    );

    expect(rendered().textContent).toBe("From the markup");

    handle.open();

    expect(textsOf(parent, ".select2-results__option")).toEqual([
      "Red",
      "Green",
      "Blue"
    ]);
  });

  it("wins over the option given in code", () => {
    const { rendered, container } = scene(
      plainSelect(
        `data-placeholder="From the markup" data-width="50%"`,
        COLORS
      ),
      (parent) => ({ ...standard(parent), placeholder: "From the code" })
    );

    expect(rendered().textContent).toBe("From the markup");
    expect(container().getAttribute("style")).toBe("width: 50%;");
  });

  it("shows the dropdown search", () => {
    const { handle, parent } = scene(
      plainSelect(`data-minimum-results-for-search="0"`, COLORS),
      standard
    );

    handle.open();

    expect(
      query(parent, ".select2-search--dropdown").classList.contains(
        "select2-search--hide"
      )
    ).toBe(false);
  });

  it("keeps the dropdown open after a selection", () => {
    const { handle, result, isOpen, values } = scene(
      plainSelect(`data-close-on-select="false"`, COLORS),
      standard
    );

    handle.open();
    mouseUp(result("Green"), NO_MODIFIERS);

    expect(values()).toEqual(["green"]);
    expect(isOpen()).toBe(true);
  });

  it("lets the dropdown be wider than the container", () => {
    const { handle, parent } = scene(
      plainSelect(`data-dropdown-auto-width="true"`, COLORS),
      standard
    );

    handle.open();

    expect(query(parent, ".select2-dropdown").getAttribute("style")).toBe(
      "width: auto; min-width: 0px; position: relative;"
    );
  });

  it("names the theme and the direction", () => {
    const { container } = scene(
      plainSelect(`data-theme="classic" data-dir="rtl"`, COLORS),
      standard
    );

    expect(container().className).toBe(
      "select2 select2-container select2-container--classic"
    );
    expect(container().getAttribute("dir")).toBe("rtl");
  });

  it("is ignored when select2 has no such option", () => {
    const { rendered, container, handle, parent } = scene(
      plainSelect(
        `data-brz-placeholder="Not for select2" data-brz-type="Select" data-value="red" data-brz-max-item-dropdown="5"`,
        COLORS
      ),
      standard
    );

    handle.open();

    expect(rendered().textContent).toBe("Color");
    expect(container().getAttribute("style")).toBe("width: 100%;");
    expect(textsOf(parent, ".select2-results__option")).toEqual([
      "Color",
      "Red",
      "Green",
      "Blue"
    ]);
  });
});

describe("the dropdown width option", () => {
  it("makes the dropdown at least as wide as the container", () => {
    stubLayout(
      [
        {
          selector: ".select2.select2-container",
          position: "static",
          box: { top: 0, left: 0, width: 220, height: 40 }
        }
      ],
      { height: 800, scrollTop: 0 }
    );

    const { handle, parent } = scene(
      plainSelect("", COLORS),
      (dropdownParent) => ({
        ...standard(dropdownParent),
        dropdownAutoWidth: true
      })
    );

    handle.open();

    expect(query(parent, ".select2-dropdown").getAttribute("style")).toBe(
      "width: auto; min-width: 220px; position: relative;"
    );
  });
});
