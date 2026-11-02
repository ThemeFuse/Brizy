import { z } from "zod";
import { encodeToString } from "visual/utils/string";
import {
  initPro,
  loadProRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";
import { publishLibGroup } from "../../../../../jest-utils/libGroups";

// The published image gallery layouts, driven through the pro dispatcher. The
// layout libs are recorders, so the tests see what the export asks of them.

const ACTIVE = "brz-image__gallery-filter__item--active";

const masonry = {
  type: "masonry",
  settings: {
    itemSelector: ".brz-image__gallery-item",
    masonry: { columnWidth: ".brz-image__gallery-item" }
  }
};
const justified = { type: "justified", settings: { rowHeight: 200 } };
const grid = { type: "grid" };

const gallery = (settings: unknown): string =>
  `<div class="brz-image__gallery">` +
  `<div class="brz-image__gallery--filter-wrapper">` +
  `<ul class="brz-image__gallery-filter">` +
  `<li class="brz-image__gallery-filter__item" data-filter="*">All</li>` +
  `<li class="brz-image__gallery-filter__item" data-filter="tag-a">A</li>` +
  `<li class="brz-image__gallery-filter__item" data-filter="tag-b">B</li>` +
  `</ul></div>` +
  `<div class="brz-image__gallery-wrapper" data-settings="${encodeToString(settings)}">` +
  `<div class="brz-image__gallery-item tag-a"></div>` +
  `<div class="brz-image__gallery-item tag-b"></div>` +
  `</div></div>`;

interface Built {
  lib: "isotope" | "gallery";
  wrapper: unknown;
  settings: unknown;
}

interface Arranged {
  lib: "isotope" | "gallery";
  wrapper: unknown;
  options: unknown;
}

interface Changed {
  node: unknown;
  details: unknown;
}

const built: Built[] = [];
const arranged: Arranged[] = [];
const changed: Changed[] = [];

class RecordingIsotope {
  constructor(
    private readonly wrapper: unknown,
    settings: unknown
  ) {
    built.push({ lib: "isotope", wrapper, settings });
  }

  arrange(options: unknown): void {
    arranged.push({ lib: "isotope", wrapper: this.wrapper, options });
  }
}

class RecordingGallery {
  constructor(
    private readonly wrapper: unknown,
    settings: unknown
  ) {
    built.push({ lib: "gallery", wrapper, settings });
  }

  arrange(options: unknown): void {
    arranged.push({ lib: "gallery", wrapper: this.wrapper, options });
  }
}

function imagesLoaded(_: unknown, onLoaded: VoidFunction): void {
  onLoaded();
}

const elementSchema = z.instanceof(HTMLElement);

const wrapperOf = (root: HTMLElement): HTMLElement =>
  elementSchema.parse(root.querySelector(".brz-image__gallery-wrapper"));

const tagOf = (root: HTMLElement, filter: string): HTMLElement =>
  elementSchema.parse(root.querySelector(`[data-filter="${filter}"]`));

// Earlier galleries stay subscribed to the page; only this one's calls count.
const arrangedOn = (wrapper: HTMLElement): Omit<Arranged, "wrapper">[] =>
  arranged
    .filter((entry) => entry.wrapper === wrapper)
    .map(({ lib, options }) => ({ lib, options }));

async function mountGallery(settings: unknown): Promise<HTMLElement> {
  const root = mountRoot(gallery(settings));

  await initPro("init.pro.dom", [root]);

  return root;
}

beforeAll(async () => {
  silenceConsole();
  publishLibGroup("BrizyProLibs", {
    Isotope: RecordingIsotope,
    ImagesLoaded: imagesLoaded,
    Gallery: RecordingGallery
  });
  await loadProRuntime(
    { kind: "mocked", componentManifest: {} },
    {
      kind: "mocked",
      componentManifest: {
        imageGallery: {
          selector: ".brz-image__gallery, .brz-image__gallery-lightbox",
          path: () => import("../export")
        }
      }
    }
  );
  window.Brz.on("elements.gallery.changed", (node: unknown, details: unknown) =>
    changed.push({ node, details })
  );
});

afterEach(() => {
  built.length = 0;
  arranged.length = 0;
  changed.length = 0;
  document.body.innerHTML = "";
});

afterAll(() => {
  Reflect.deleteProperty(window, "BrizyProLibs");
  jest.restoreAllMocks();
});

describe("a published image gallery", () => {
  it.each([
    { case: "masonry", settings: masonry, lib: "isotope" },
    { case: "justified", settings: justified, lib: "gallery" }
  ])(
    "lays out a $case gallery once its images have loaded and announces it",
    async ({ settings, lib }) => {
      const root = await mountGallery(settings);
      const wrapper = wrapperOf(root);

      expect(built).toEqual([{ lib, wrapper, settings: settings.settings }]);
      expect(changed).toEqual([
        { node: wrapper, details: { type: settings.type } }
      ]);
    }
  );

  it("leaves a grid gallery to the stylesheet", async () => {
    await mountGallery(grid);

    expect(built).toEqual([]);
    expect(changed).toEqual([]);
  });

  it.each([
    {
      case: "a masonry gallery by a tag",
      settings: masonry,
      clicks: ["tag-a"],
      active: "tag-a",
      out: [{ lib: "isotope", options: { filter: ".tag-a" } }]
    },
    {
      case: "a masonry gallery by a tag and then by all",
      settings: masonry,
      clicks: ["tag-a", "*"],
      active: "*",
      out: [
        { lib: "isotope", options: { filter: ".tag-a" } },
        { lib: "isotope", options: { filter: "*" } }
      ]
    },
    {
      case: "a masonry gallery by the tag that is already active",
      settings: masonry,
      clicks: ["*"],
      active: "*",
      out: []
    },
    {
      case: "a justified gallery by a tag",
      settings: justified,
      clicks: ["tag-b"],
      active: "tag-b",
      out: [{ lib: "gallery", options: { filter: "tag-b" } }]
    },
    {
      case: "a justified gallery by a tag and then by all",
      settings: justified,
      clicks: ["tag-b", "*"],
      active: "*",
      out: [
        { lib: "gallery", options: { filter: "tag-b" } },
        { lib: "gallery", options: { filter: "*" } }
      ]
    },
    {
      case: "a grid gallery",
      settings: grid,
      clicks: ["tag-a"],
      active: "tag-a",
      out: []
    }
  ])("filters $case", async ({ settings, clicks, active, out }) => {
    const root = await mountGallery(settings);

    for (const filter of clicks) {
      tagOf(root, filter).click();
    }

    expect(arrangedOn(wrapperOf(root))).toEqual(out);
    expect(
      Array.from(root.querySelectorAll(`.${ACTIVE}`)).map((tag) =>
        tag.getAttribute("data-filter")
      )
    ).toEqual([active]);
  });

  it.each([
    {
      case: "shows only the tagged items",
      clicks: ["tag-a"],
      out: ["block", "none"]
    },
    {
      case: "shows every item again",
      clicks: ["tag-a", "*"],
      out: ["block", "block"]
    }
  ])("a grid gallery $case after $clicks", async ({ clicks, out }) => {
    const root = await mountGallery(grid);

    for (const filter of clicks) {
      tagOf(root, filter).click();
    }

    expect(
      Array.from(
        root.querySelectorAll<HTMLElement>(".brz-image__gallery-item")
      ).map((item) => item.style.display)
    ).toEqual(out);
  });

  it.each([
    {
      event: "elements.tabs.changed",
      settings: masonry,
      out: [{ lib: "isotope", options: {} }]
    },
    {
      event: "elements.accordion.changed",
      settings: masonry,
      out: [{ lib: "isotope", options: {} }]
    },
    {
      event: "elements.switcher.changed",
      settings: masonry,
      out: [{ lib: "isotope", options: {} }]
    },
    {
      event: "elements.megamenu.opened",
      settings: masonry,
      out: [{ lib: "isotope", options: {} }]
    },
    {
      event: "elements.mmenu.panel.opened",
      settings: masonry,
      out: [{ lib: "isotope", options: {} }]
    },
    {
      event: "elements.tabs.changed",
      settings: justified,
      out: [{ lib: "gallery", options: undefined }]
    },
    { event: "elements.tabs.changed", settings: grid, out: [] }
  ])(
    "lays a $settings.type gallery out again on $event of its container, and only of its container",
    async ({ event, settings, out }) => {
      const root = await mountGallery(settings);
      const wrapper = wrapperOf(root);

      window.Brz.emit(event, document.createElement("div"));
      const afterAnotherContainer = arrangedOn(wrapper);
      window.Brz.emit(event, root);

      expect({ afterAnotherContainer, after: arrangedOn(wrapper) }).toEqual({
        afterAnotherContainer: [],
        after: out
      });
    }
  );

  it("lays a justified gallery out again when the window is resized", async () => {
    const root = await mountGallery(justified);

    window.dispatchEvent(new Event("resize"));

    expect(arrangedOn(wrapperOf(root))).toEqual([
      { lib: "gallery", options: undefined }
    ]);
  });
});
