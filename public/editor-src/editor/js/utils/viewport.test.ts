import { getVisibleSectionIds } from "./viewport";

const INNER_HEIGHT = 1000;

interface FakeSection {
  id: string;
  className: string;
  top: number;
  height: number;
}

const section = (id: string, top: number, height: number): FakeSection => ({
  id,
  className: "brz-section",
  top,
  height
});

const footer = (id: string, top: number, height: number): FakeSection => ({
  id,
  className: "brz-footer",
  top,
  height
});

const mount = ({ id, className, top, height }: FakeSection): void => {
  const el = document.createElement("div");
  el.id = id;
  el.className = className;
  el.getBoundingClientRect = () => ({
    top,
    bottom: top + height,
    height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: top,
    toJSON: () => ({})
  });
  document.body.appendChild(el);
};

describe("getVisibleSectionIds", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it.each([
    {
      case: "a fully visible section",
      sections: [section("s1", 100, 400)],
      out: ["s1"]
    },
    {
      // 300 of 800px on screen
      case: "a section with less than half of it on screen",
      sections: [section("s1", 700, 800)],
      out: []
    },
    {
      // 400 of 800px on screen
      case: "a section with exactly half of it on screen",
      sections: [section("s1", 600, 800)],
      out: ["s1"]
    },
    {
      case: "a visible footer",
      sections: [footer("footer", 100, 200)],
      out: ["footer"]
    },
    {
      case: "a section taller than 2x the screen that fills it",
      sections: [section("tall", -700, 2400)],
      out: ["tall"]
    },
    {
      // 500 of 3000px on screen = half the screen
      case: "a tall section covering exactly half the screen",
      sections: [section("tall", 500, 3000)],
      out: ["tall"]
    },
    {
      // 400 of 3000px on screen
      case: "a tall section covering less than half the screen",
      sections: [section("tall", 600, 3000)],
      out: []
    },
    {
      // short: 100px visible, tall: 900px visible
      case: "a tall section below a short visible one",
      sections: [section("short", 0, 100), section("tall", 100, 2500)],
      out: ["tall", "short"]
    },
    {
      // s2: 100 of 500px on screen
      case: "a mix, largest visible area first",
      sections: [
        section("header", 0, 80),
        section("s1", 90, 400),
        section("s2", -400, 500),
        footer("footer", 500, 300)
      ],
      out: ["s1", "footer", "header"]
    },
    {
      case: "equal visible areas, in DOM order",
      sections: [section("a", 0, 400), section("b", 400, 400)],
      out: ["a", "b"]
    },
    {
      case: "zero-height and id-less elements",
      sections: [
        section("", 0, 400),
        section("zero", 0, 0),
        section("s1", 0, 400)
      ],
      out: ["s1"]
    }
  ])("handles $case", ({ sections, out }) => {
    sections.forEach(mount);

    expect(getVisibleSectionIds(document, INNER_HEIGHT)).toEqual(out);
  });
});
