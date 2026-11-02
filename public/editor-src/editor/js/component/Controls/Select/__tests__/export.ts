// The select control of the first form version on a published page.

import selectExport from "visual/component/Controls/Select/export";
import {
  SELECT_STYLE,
  selectField
} from "visual/editorComponents/Form/__fixtures__/form";
import {
  clearPage,
  click,
  mount,
  query,
  queryAll,
  queryInput
} from "visual/libs/select2/__fixtures__/env";
import {
  stopClicksAt,
  trackClickListeners
} from "../../../../../../jest-utils/exportRuntime";

beforeEach(() => {
  clearPage();
});

afterEach(() => {
  clearPage();
});

interface Control {
  root: HTMLElement;
  node: HTMLElement;
  current: () => HTMLElement;
  options: () => HTMLElement;
  option: (value: string) => HTMLElement;
  input: () => HTMLInputElement;
  display: () => string;
}

const controlOf = (root: HTMLElement, node: HTMLElement): Control => ({
  root,
  node,
  current: () => query(node, ".brz-control__select-current"),
  options: () => query(node, ".brz-control__select-options"),
  option: (value) =>
    query(node, `.brz-control__select-options [data-value="${value}"]`),
  input: () => queryInput(node, "input[type=hidden]"),
  display: () => query(node, ".brz-control__select-options").style.display
});

function control(options: string[]): Control {
  const root = mount(
    SELECT_STYLE + selectField({ label: "Size", required: false, options })
  );

  selectExport(root);

  return controlOf(root, query(root, ".brz-control__select"));
}

describe("the list of options", () => {
  it("opens and closes on a click on the current value", () => {
    const { current, display } = control(["S", "M"]);
    const seen: string[] = [display()];

    click(current());
    seen.push(display());
    click(current());
    seen.push(display());
    click(current());
    seen.push(display());

    expect(seen).toEqual(["", "block", "none", "block"]);
  });

  it.each([
    { case: "outside the control", inside: false, display: "none" },
    { case: "inside the control", inside: true, display: "block" }
  ])("on a click $case", ({ inside, display: expected }) => {
    const { root, current, options, display } = control(["S", "M"]);
    const outside = document.createElement("p");
    root.append(outside);

    click(current());
    click(inside ? options() : outside);

    expect(display()).toBe(expected);
  });

  it("belongs to its own control", () => {
    const root = mount(
      SELECT_STYLE +
        selectField({ label: "Size", required: false, options: ["S", "M"] }) +
        selectField({ label: "Color", required: false, options: ["Red"] })
    );

    selectExport(root);

    const [size, color] = queryAll(root, ".brz-control__select").map((node) =>
      controlOf(root, node)
    );

    click(size.current());
    click(color.current());

    expect([size.display(), color.display()]).toEqual(["none", "block"]);
  });
});

describe("a click on an option", () => {
  it("makes it the value, marks it and closes the list", () => {
    const { current, option, input, display } = control(["S", "M", "L"]);

    click(current());
    click(option("M"));

    expect(input().value).toBe("M");
    expect(query(current(), ".brz-control__select-option").innerHTML).toBe(
      "<b>M</b>"
    );
    expect(option("M").classList.contains("active")).toBe(true);
    expect(display()).toBe("none");

    click(current());
    click(option("L"));

    expect(input().value).toBe("L");
    expect(
      [option("S"), option("M"), option("L")].map((node) =>
        node.classList.contains("active")
      )
    ).toEqual([false, false, true]);
  });
});

describe("a change event on the hidden input", () => {
  it("puts the control back to its first option and empties the value", () => {
    const { current, option, input } = control(["S", "M"]);

    click(option("M"));
    input().dispatchEvent(new Event("change", { bubbles: true }));

    expect(input().value).toBe("");
    expect(query(current(), ".brz-control__select-option").innerHTML).toBe(
      "<b>S</b>"
    );
  });
});

describe("a click that reaches the page around the control", () => {
  it.each([
    {
      case: "on the current value",
      target: (select: Control) => select.current(),
      state: { display: "block", value: "" }
    },
    {
      case: "on an option",
      target: (select: Control) => select.option("M"),
      state: { display: "none", value: "M" }
    }
  ])("finds the control already updated $case", ({ target, state }) => {
    const select = control(["S", "M"]);
    const read = () => ({
      display: select.display(),
      value: select.input().value
    });
    const seen = stopClicksAt(select.root, read);

    click(target(select));

    expect(seen).toEqual([state]);
    expect(read()).toEqual(state);
  });
});

describe("a control in a root initialised inside another", () => {
  it("opens once", () => {
    const outer = mount(
      SELECT_STYLE +
        selectField({ label: "Size", required: false, options: ["S", "M"] })
    );
    selectExport(outer);
    const inner = document.createElement("div");
    inner.innerHTML = selectField({
      label: "Color",
      required: false,
      options: ["Red"]
    });
    outer.append(inner);
    selectExport(inner);
    const [size, color] = queryAll(outer, ".brz-control__select").map((node) =>
      controlOf(outer, node)
    );

    click(color.current());

    expect([size.display(), color.display()]).toEqual(["none", "block"]);
  });
});

describe("the click listeners of the controls", () => {
  it("are one on body for every control of the page", () => {
    const root = mount(
      SELECT_STYLE +
        selectField({ label: "Size", required: false, options: ["S", "M"] }) +
        selectField({ label: "Color", required: false, options: ["Red"] })
    );
    const listeners = trackClickListeners();
    selectExport(root);
    const targets = listeners.targets();
    listeners.restore();

    expect(targets).toEqual([document.body]);
  });
});
