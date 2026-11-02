import { z } from "zod";
import type { Literal } from "visual/utils/types/Literal";
import type { MValue } from "visual/utils/value";
import { fixedContainerPlus } from "../utils";

const FIXED = "brz-ed-container-plus--fixed";

type Mark = { fixed: boolean; top: string };

const query = (root: ParentNode, selector: string): HTMLElement =>
  z.instanceof(HTMLElement).parse(root.querySelector(selector));

// The header node sits between two adder buttons; it carries the adder class
// itself and holds a nested adder, neither of which is a sibling.
function mount(initial: Mark): HTMLElement {
  const root = document.createElement("div");
  const className = initial.fixed
    ? `brz-ed-container-plus ${FIXED}`
    : "brz-ed-container-plus";

  root.innerHTML = `
    <div data-key="before" class="${className}"></div>
    <section data-key="node" class="${className}">
      <div data-key="nested" class="${className}"></div>
    </section>
    <div data-key="other" class="other"></div>
    <div data-key="after" class="${className}"></div>
  `;
  root.querySelectorAll<HTMLElement>("[data-key]").forEach((element) => {
    element.style.top = initial.top;
  });
  document.body.append(root);

  return root;
}

const marks = (root: HTMLElement): Record<string, Mark> =>
  Object.fromEntries(
    Array.from(root.querySelectorAll<HTMLElement>("[data-key]")).map(
      (element) => [
        element.dataset.key,
        { fixed: element.classList.contains(FIXED), top: element.style.top }
      ]
    )
  );

afterEach(() => {
  document.body.innerHTML = "";
});

describe("fixedContainerPlus", () => {
  it.each<{
    case: string;
    initial: Mark;
    fixed: MValue<boolean>;
    height: MValue<Literal>;
    out: Mark;
  }>([
    {
      case: "pins the sibling adders under a fixed header",
      initial: { fixed: false, top: "" },
      fixed: true,
      height: 80,
      out: { fixed: true, top: "80px" }
    },
    {
      case: "takes a fractional height",
      initial: { fixed: false, top: "" },
      fixed: true,
      height: 64.5,
      out: { fixed: true, top: "64.5px" }
    },
    {
      case: "takes the height as a string",
      initial: { fixed: false, top: "" },
      fixed: true,
      height: "48",
      out: { fixed: true, top: "48px" }
    },
    {
      case: "moves already pinned adders to a new height",
      initial: { fixed: true, top: "80px" },
      fixed: true,
      height: 120,
      out: { fixed: true, top: "120px" }
    },
    {
      case: "releases the sibling adders",
      initial: { fixed: true, top: "80px" },
      fixed: false,
      height: 80,
      out: { fixed: false, top: "auto" }
    },
    {
      case: "releases the sibling adders when the flag is missing",
      initial: { fixed: true, top: "80px" },
      fixed: undefined,
      height: undefined,
      out: { fixed: false, top: "auto" }
    }
  ])("$case", ({ initial, fixed, height, out }) => {
    const root = mount(initial);

    fixedContainerPlus({ fixed, node: query(root, "[data-key=node]"), height });

    expect(marks(root)).toEqual({
      before: out,
      node: initial,
      nested: initial,
      other: { fixed: false, top: initial.top },
      after: out
    });
  });

  it.each([
    { case: "no node", node: null },
    { case: "a node without a parent", node: document.createElement("section") }
  ])("leaves the page alone for $case", ({ node }) => {
    const initial = { fixed: false, top: "" };
    const root = mount(initial);

    fixedContainerPlus({ fixed: true, node, height: 80 });

    expect(marks(root)).toEqual({
      before: initial,
      node: initial,
      nested: initial,
      other: initial,
      after: initial
    });
  });
});
