import { getVisibleSectionIds } from "./viewport";

const INNER_HEIGHT = 1000;

interface FakeSectionOpts {
  id: string;
  className?: string;
  top: number;
  height: number;
}

const makeSection = ({
  id,
  className = "brz-section",
  top,
  height
}: FakeSectionOpts): HTMLElement => {
  const el = document.createElement("div");
  el.id = id;
  el.className = className;
  el.getBoundingClientRect = () =>
    ({
      top,
      bottom: top + height,
      height,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: top,
      toJSON: () => ({})
    }) as DOMRect;
  return el;
};

describe("getVisibleSectionIds", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const mount = (els: HTMLElement[]): void => {
    els.forEach((el) => document.body.appendChild(el));
  };

  test("includes a fully visible section", () => {
    mount([makeSection({ id: "s1", top: 100, height: 400 })]);
    expect(getVisibleSectionIds(document, INNER_HEIGHT)).toEqual(["s1"]);
  });

  test("excludes a section with less than 50% visible", () => {
    // 800px tall, starting at 700 -> only 300px (37.5%) visible
    mount([makeSection({ id: "s1", top: 700, height: 800 })]);
    expect(getVisibleSectionIds(document, INNER_HEIGHT)).toEqual([]);
  });

  test("includes a section with exactly 50% visible", () => {
    // 800px tall, starting at 600 -> 400px (50%) visible
    mount([makeSection({ id: "s1", top: 600, height: 800 })]);
    expect(getVisibleSectionIds(document, INNER_HEIGHT)).toEqual(["s1"]);
  });

  test("includes a majority-visible footer (.brz-footer)", () => {
    mount([
      makeSection({
        id: "footer",
        className: "brz-footer",
        top: 100,
        height: 200
      })
    ]);
    expect(getVisibleSectionIds(document, INNER_HEIGHT)).toEqual(["footer"]);
  });

  test("returns only the majority-visible ids in DOM order", () => {
    mount([
      makeSection({ id: "header", className: "brz-section", top: 0, height: 80 }),
      makeSection({ id: "s1", top: 90, height: 400 }),
      // partly above viewport: 500 tall from -400 -> 100px visible (20%)
      makeSection({ id: "s2", top: -400, height: 500 }),
      makeSection({
        id: "footer",
        className: "brz-footer",
        top: 500,
        height: 300
      })
    ]);
    expect(getVisibleSectionIds(document, INNER_HEIGHT)).toEqual([
      "header",
      "s1",
      "footer"
    ]);
  });

  test("skips zero-height and id-less elements", () => {
    const noId = makeSection({ id: "", top: 0, height: 400 });
    const zero = makeSection({ id: "zero", top: 0, height: 0 });
    mount([noId, zero, makeSection({ id: "s1", top: 0, height: 400 })]);
    expect(getVisibleSectionIds(document, INNER_HEIGHT)).toEqual(["s1"]);
  });
});
