import { z } from "zod";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  initPro,
  loadProRuntime,
  mountRoot,
  silenceConsole,
  stopClicksAt,
  trackClickListeners
} from "../../../../../jest-utils/exportRuntime";

// WP Posts masonry: the pro manifest stands in for WP's, the libs are recorders.

const TAGS = ["*", "news", "events"];
const activeClassName = "brz-posts-filter__item--active";

const postsHtml = `
  <div class="brz-posts brz-posts--masonry">
    <div class="brz-posts__filter-wrapper">
      <ul class="brz-ul brz-posts__filter brz-posts__filter--style-1">
        <li class="brz-posts__filter__item brz-posts__filter__item--style-1" data-filter="*">All</li>
        <li class="brz-posts__filter__item brz-posts__filter__item--style-1" data-filter="news">News</li>
        <li class="brz-posts__filter__item brz-posts__filter__item--style-1" data-filter="events"><span class="label">Events</span></li>
      </ul>
    </div>
    <div class="brz-posts__wrapper">
      <div class="brz-posts__item" ${makeAttr("filter")}="news">First</div>
      <div class="brz-posts__item" ${makeAttr("filter")}="events">Second</div>
    </div>
  </div>
`;

const elementSchema = z.instanceof(HTMLElement);

interface Layout {
  wrapper: unknown;
  options: unknown;
}

const layouts: Layout[] = [];
const arrangements: unknown[] = [];

class RecordingIsotope {
  constructor(wrapper: unknown, options: unknown) {
    layouts.push({ wrapper, options });
  }

  arrange(options: unknown): void {
    arrangements.push(options);
  }
}

function imagesLoaded(_: unknown, onLoaded: VoidFunction): void {
  onLoaded();
}

beforeAll(async () => {
  silenceConsole();
  Object.defineProperty(window, "BrizyProLibs", {
    configurable: true,
    writable: true,
    value: { Isotope: RecordingIsotope, ImagesLoaded: imagesLoaded }
  });
  await loadProRuntime(
    { kind: "mocked", componentManifest: {} },
    {
      kind: "mocked",
      componentManifest: {
        posts: {
          selector: ".brz-posts",
          path: () => import("../export.wp")
        }
      }
    }
  );
});

afterEach(() => {
  layouts.length = 0;
  arrangements.length = 0;
  document.body.innerHTML = "";
});

afterAll(() => {
  Reflect.deleteProperty(window, "BrizyProLibs");
  jest.restoreAllMocks();
});

describe("Posts masonry on a published WordPress page", () => {
  it.each([
    { case: "nothing", clicks: [], active: "*", filters: [] },
    {
      case: "a tag",
      clicks: ["[data-filter='news']"],
      active: "news",
      filters: [`[${makeAttr("filter")}*="news"]`]
    },
    {
      case: "a node inside a tag",
      clicks: [".label"],
      active: "events",
      filters: [`[${makeAttr("filter")}*="events"]`]
    },
    {
      case: "a tag and then all",
      clicks: ["[data-filter='news']", "[data-filter='*']"],
      active: "*",
      filters: [`[${makeAttr("filter")}*="news"]`, "*"]
    },
    {
      case: "the active tag",
      clicks: ["[data-filter='*']"],
      active: "*",
      filters: ["*"]
    },
    {
      case: "the list between the tags",
      clicks: [".brz-posts__filter"],
      active: "*",
      filters: []
    }
  ])(
    "filters the posts after a click on $case",
    async ({ clicks, active, filters }) => {
      const root = mountRoot(postsHtml);
      await initPro("init.pro.dom", [root]);

      for (const selector of clicks) {
        elementSchema.parse(root.querySelector(selector)).click();
      }

      expect(layouts).toEqual([
        {
          wrapper: root.querySelector(".brz-posts__wrapper"),
          options: { layoutMode: "masonry" }
        }
      ]);
      expect(
        Array.from(root.querySelectorAll(".brz-posts__filter__item")).map(
          (tag) => tag.classList.contains(activeClassName)
        )
      ).toEqual(TAGS.map((tag) => tag === active));
      expect(arrangements).toEqual(filters.map((filter) => ({ filter })));
    }
  );

  it("has filtered when the click on a tag reaches the page around it", async () => {
    const root = mountRoot(postsHtml);
    await initPro("init.pro.dom", [root]);
    const seen = stopClicksAt(root, () => [...arrangements]);

    elementSchema.parse(root.querySelector("[data-filter='news']")).click();

    expect(seen).toEqual([[{ filter: `[${makeAttr("filter")}*="news"]` }]]);
  });

  it.each([
    { case: "next to another", nested: false },
    { case: "in a root initialised inside another", nested: true }
  ])("filters only its own posts $case", async ({ nested }) => {
    const root = mountRoot(nested ? postsHtml : `${postsHtml}${postsHtml}`);
    await initPro("init.pro.dom", [root]);

    if (nested) {
      const inner = document.createElement("div");
      inner.innerHTML = postsHtml;
      root.append(inner);
      await initPro("init.pro.dom", [inner]);
    }

    const [first, second] = Array.from(root.querySelectorAll(".brz-posts"));

    elementSchema.parse(second?.querySelector("[data-filter='news']")).click();

    expect(
      [first, second].map((posts) =>
        Array.from(
          posts?.querySelectorAll(".brz-posts__filter__item") ?? []
        ).map((tag) => tag.classList.contains(activeClassName))
      )
    ).toEqual([
      [true, false, false],
      [false, true, false]
    ]);
    expect(arrangements).toEqual([
      { filter: `[${makeAttr("filter")}*="news"]` }
    ]);
  });

  it("listens for the tags of every masonry with one listener on body", async () => {
    const root = mountRoot(`${postsHtml}${postsHtml}`);
    const listeners = trackClickListeners();
    await initPro("init.pro.dom", [root]);
    const targets = listeners.targets();
    listeners.restore();

    expect(targets).toEqual([document.body]);
  });
});
