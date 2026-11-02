// Where the dropdown goes and how it follows the page. Sizes and positions are stubbed.

import {
  type Box,
  type LayoutRule,
  NO_MODIFIERS,
  type Viewport,
  keyDown,
  query,
  stubLayout
} from "../__fixtures__/env";
import {
  COLORS,
  type OptionMarkup,
  option,
  optionWith,
  plainSelect
} from "../__fixtures__/markup";
import { scene, standard, useSelect2Env } from "../__fixtures__/suite";

useSelect2Env();

const WRAPPER = ".select2-container--open:not(.select2)";

interface Layout {
  parent: "static" | "relative";
  parentBox: Box;
  container: Box;
  dropdownHeight: number;
  viewport: Viewport;
}

const layout = ({
  parent,
  parentBox,
  container,
  dropdownHeight,
  viewport
}: Layout): void => {
  const rules: LayoutRule[] = [
    { selector: ".parent", position: parent, box: parentBox },
    {
      selector: ".select2.select2-container",
      position: "static",
      box: container
    },
    {
      selector: ".select2-dropdown",
      position: "static",
      box: { top: 0, left: 0, width: container.width, height: dropdownHeight }
    }
  ];

  stubLayout(rules, viewport);
};

const PARENT: Box = { top: 100, left: 50, width: 400, height: 600 };

const roomy: Layout = {
  parent: "relative",
  parentBox: PARENT,
  container: { top: 200, left: 60, width: 300, height: 40 },
  dropdownHeight: 120,
  viewport: { height: 800, scrollTop: 0 }
};

interface PlaceCase {
  case: string;
  layout: Layout;
  top: string;
  left: string;
  direction: "below" | "above";
}

describe("the dropdown", () => {
  it("lives in the dropdown parent only while it is open", () => {
    const { handle, parent } = scene(plainSelect("", COLORS), standard);

    expect(parent.querySelector(".select2-dropdown")).toBeNull();

    handle.open();
    expect(query(parent, WRAPPER).parentElement).toBe(parent);

    handle.close();
    expect(parent.querySelector(".select2-dropdown")).toBeNull();
  });

  it.each<PlaceCase>([
    {
      case: "below the container when there is room",
      layout: roomy,
      top: "140px",
      left: "10px",
      direction: "below"
    },
    {
      case: "above the container when there is room only above",
      layout: {
        ...roomy,
        container: { top: 700, left: 60, width: 300, height: 40 }
      },
      top: "480px",
      left: "10px",
      direction: "above"
    },
    {
      case: "below the container when there is room on neither side",
      layout: {
        ...roomy,
        container: { top: 50, left: 60, width: 300, height: 40 },
        dropdownHeight: 800
      },
      top: "-10px",
      left: "10px",
      direction: "below"
    },
    {
      case: "below the container on a scrolled page",
      layout: {
        ...roomy,
        container: { top: 700, left: 60, width: 300, height: 40 },
        viewport: { height: 800, scrollTop: 500 }
      },
      top: "640px",
      left: "10px",
      direction: "below"
    },
    {
      case: "relative to the page when the parent is not positioned",
      layout: { ...roomy, parent: "static" },
      top: "240px",
      left: "60px",
      direction: "below"
    }
  ])("is placed $case", ({ layout: stubs, top, left, direction }) => {
    layout(stubs);

    const { handle, parent, container } = scene(
      plainSelect("", COLORS),
      standard
    );

    handle.open();

    const wrapper = query(parent, WRAPPER);

    expect({ top: wrapper.style.top, left: wrapper.style.left }).toEqual({
      top,
      left
    });
    expect(wrapper.style.position).toBe("absolute");
    expect(
      query(parent, ".select2-dropdown").classList.contains(
        `select2-dropdown--${direction}`
      )
    ).toBe(true);
    expect(
      container().classList.contains(`select2-container--${direction}`)
    ).toBe(true);
  });

  it("is as wide as the container", () => {
    layout(roomy);

    const { handle, parent } = scene(plainSelect("", COLORS), standard);

    handle.open();

    expect(query(parent, ".select2-dropdown").style.width).toBe("300px");
  });

  it("stays above until there is room only below", () => {
    const above: Layout = {
      ...roomy,
      container: { top: 700, left: 60, width: 300, height: 40 }
    };
    layout(above);

    const { handle, parent, container } = scene(
      plainSelect("", COLORS),
      standard
    );

    handle.open();

    const wrapper = query(parent, WRAPPER);
    const direction = (): string =>
      container().classList.contains("select2-container--above")
        ? "above"
        : "below";

    layout({
      ...roomy,
      container: { top: 400, left: 60, width: 300, height: 40 }
    });
    window.dispatchEvent(new Event("scroll"));

    expect([direction(), wrapper.style.top]).toEqual(["above", "180px"]);

    layout({
      ...roomy,
      container: { top: 50, left: 60, width: 300, height: 40 }
    });
    window.dispatchEvent(new Event("scroll"));

    expect([direction(), wrapper.style.top]).toEqual(["below", "-10px"]);
  });

  it.each([
    { event: "scroll" },
    { event: "resize" },
    { event: "orientationchange" }
  ])(
    "follows the container on a window $event while it is open",
    ({ event }) => {
      layout(roomy);

      const { handle, parent } = scene(plainSelect("", COLORS), standard);

      handle.open();

      const wrapper = query(parent, WRAPPER);
      const dropdown = query(parent, ".select2-dropdown");

      layout({
        ...roomy,
        container: { top: 260, left: 90, width: 320, height: 40 }
      });
      window.dispatchEvent(new Event(event));

      expect([
        wrapper.style.top,
        wrapper.style.left,
        dropdown.style.width
      ]).toEqual(["200px", "40px", "320px"]);

      handle.close();
      layout(roomy);
      window.dispatchEvent(new Event(event));

      expect([
        wrapper.style.top,
        wrapper.style.left,
        dropdown.style.width
      ]).toEqual(["200px", "40px", "320px"]);
    }
  );

  it("holds a scrollable ancestor in place while it is open", () => {
    const { handle, root } = scene(
      `<div class="scroller" style="overflow-y: scroll">${plainSelect("", COLORS)}</div>`,
      standard
    );
    const scroller = query(root, ".scroller");
    const scrollTo = (top: number): number => {
      scroller.scrollTop = top;
      scroller.dispatchEvent(new Event("scroll"));

      return scroller.scrollTop;
    };

    scroller.scrollTop = 30;
    handle.open();

    expect(scrollTo(80)).toBe(30);

    handle.close();

    expect(scrollTo(80)).toBe(80);
  });
});

describe("the results list", () => {
  const FIVE: OptionMarkup[] = [
    option("one", "One"),
    option("two", "Two"),
    option("three", "Three"),
    option("four", "Four"),
    option("five", "Five")
  ];

  const resultsLayout = (): void => {
    const rows: LayoutRule[] = FIVE.map((_, index) => ({
      selector: `.select2-results__option:nth-child(${index + 1})`,
      position: "static",
      box: { top: 300 + index * 40, left: 0, width: 200, height: 40 }
    }));

    stubLayout(
      [
        {
          selector: ".select2-results__options",
          position: "static",
          box: { top: 300, left: 0, width: 200, height: 100 }
        },
        ...rows
      ],
      { height: 800, scrollTop: 0 }
    );
  };

  it("scrolls to keep the highlighted result in view", () => {
    resultsLayout();

    const { handle, selection, parent } = scene(
      plainSelect("", FIVE),
      standard
    );
    const list = (): HTMLElement => query(parent, ".select2-results__options");
    const scrolled: number[] = [];

    handle.open();

    (
      [
        "ArrowDown",
        "ArrowDown",
        "ArrowDown",
        "ArrowUp",
        "ArrowUp",
        "ArrowUp"
      ] as const
    ).forEach((key) => {
      keyDown(selection(), key, NO_MODIFIERS);
      scrolled.push(list().scrollTop);
    });

    expect(scrolled).toEqual([0, 20, 80, 80, 80, 0]);
  });

  it.each([
    { case: "a result near the top", selected: "three", scrollTop: 0 },
    { case: "a result further down", selected: "five", scrollTop: 80 }
  ])("opens scrolled to $case", ({ selected, scrollTop }) => {
    resultsLayout();

    const { handle, parent } = scene(
      plainSelect(
        "",
        FIVE.map(({ value, text }) =>
          optionWith(value, text, value === selected ? "selected" : "")
        )
      ),
      standard
    );

    handle.open();

    expect(query(parent, ".select2-results__options").scrollTop).toBe(
      scrollTop
    );
  });
});
