import { load as cheerioLoad } from "cheerio";
import { noop } from "es-toolkit";
import {
  ConfigCommon,
  Mode
} from "visual/global/Config/types/configs/ConfigCommon";
import { getLibAsset } from "../../../assetManager/utils";
import { Asset } from "../index";
import { makeScripts } from "../makeScripts";
import { CONSENT_BLOCKER_SCORE } from "../scores";

function makeConfig(overrides: Partial<ConfigCommon> = {}): ConfigCommon {
  return {
    project: { id: "" },
    container: { id: 1 },
    editorVersion: "1.0.0",
    mode: Mode.page,
    onUpdate: noop,
    onCompile: noop,
    urls: {
      about: "",
      api: "",
      projectCloneLink: "",
      assets: "https://assets.example.com",
      editorFonts: "",
      preview: "",
      site: "",
      support: "",
      templateFonts: "",
      upgradeToPro: "",
      editorIcons: "",
      worker: "",
      templateIcons: "",
      screenshot: ""
    },
    ...overrides
  };
}

function docWithBanner() {
  return cheerioLoad(
    `<html><body><div class="brz-cookie-banner"></div></body></html>`
  );
}

// `AssetCode` is the one content variant without an `attr`, so the narrowing
// keeps the reads below typed without an assertion.
function attrOf(asset: Asset): Record<string, string> | undefined {
  return asset.content.type === "code" ? undefined : asset.content.attr;
}

function docWithoutBanner() {
  return cheerioLoad(
    `<html><body><div class="brz-section"></div></body></html>`
  );
}

describe("makeScripts — consent blocker asset", () => {
  test("is added to free.generic when the page has a cookie banner", () => {
    const $doc = docWithBanner();

    const { free } = makeScripts($doc, makeConfig());

    const consentBlocker = free.generic.find(
      (asset) => asset.name === "consentBlocker"
    );

    expect(consentBlocker).toBeDefined();
    expect(consentBlocker?.score).toBe(CONSENT_BLOCKER_SCORE);
    expect(consentBlocker?.pro).toBe(false);
    expect(consentBlocker?.content.type).toBe("inline");

    const content = consentBlocker?.content;

    if (content?.type !== "inline") {
      throw new Error("consent blocker is not an inline asset");
    }

    expect(content.content).toEqual(expect.stringContaining("brz-consent"));
    // No consent attribute: the blocker recognises its own runtime by the
    // `brz-script` class instead.
    expect(consentBlocker && attrOf(consentBlocker)).toEqual({
      class: "brz-script brz-script-consent"
    });
  });

  test("is absent when the page has no cookie banner", () => {
    const $doc = docWithoutBanner();

    const { free } = makeScripts($doc, makeConfig());

    expect(
      free.generic.find((asset) => asset.name === "consentBlocker")
    ).toBeUndefined();
  });
});

describe("makeScripts — Brizy's own scripts are recognised by class", () => {
  const $doc = docWithoutBanner();
  const { free } = makeScripts($doc, makeConfig());
  const { pro } = makeScripts(
    $doc,
    makeConfig({
      pro: {
        version: "2.0.0",
        urls: { assets: "https://assets.example.com/pro" }
      }
    })
  );

  it.each([
    { case: "the free main script", assets: [free.main] },
    { case: "the free libs", assets: free.libsMap },
    { case: "the pro main script", assets: pro ? [pro.main] : [] },
    { case: "the pro libs", assets: pro?.libsMap ?? [] }
  ])(
    "$case carry the brz-script class and no consent attribute",
    ({ assets }) => {
      expect(assets.length).toBeGreaterThan(0);

      assets.forEach((asset) => {
        const attr = attrOf(asset);

        expect(attr).toBeDefined();
        expect(attr).not.toHaveProperty("data-brz-consent");
        expect((attr?.class ?? "").split(" ")).toContain("brz-script");
      });
    }
  );
});

// Which lib group a page gets: `makeScripts` collects the lib selectors found in
// the markup and `getLibAsset` takes the first group of `libs.json` that covers
// them. The WordPress plugin applies the same rule to the same data.

const proConfig = makeConfig({
  pro: { version: "2.0.0", urls: { assets: "https://assets.example.com/pro" } }
});

// A node the selector matches: `.brz-forms2` or `[data-tooltip]`.
function nodeFor(selector: string): string {
  return selector.startsWith(".")
    ? `<div class="${selector.slice(1)}"></div>`
    : `<div ${selector.slice(1, -1)}></div>`;
}

function pageWith(selectors: string[]) {
  return cheerioLoad(
    `<html><body><div class="brz-section"></div>${selectors
      .map(nodeFor)
      .join("")}</body></html>`
  );
}

function freeLibOf(selectors: string[]) {
  const { free } = makeScripts(pageWith(selectors), makeConfig());

  return {
    selectors: free.libsSelectors,
    lib: getLibAsset(free.libsMap, free.libsSelectors)?.name
  };
}

function proLibOf(selectors: string[]) {
  const { pro } = makeScripts(pageWith(selectors), proConfig);

  return {
    selectors: pro?.libsSelectors,
    lib: pro ? getLibAsset(pro.libsMap, pro.libsSelectors)?.name : undefined
  };
}

// One selector of every base group.
const FREE_GROUP: Record<number, string> = {
  1: ".brz-forms2",
  2: ".brz-carousel",
  3: ".brz-animated",
  4: ".brz-bg-slideshow",
  5: ".brz-forms2__calculated",
  6: ".brz-forms2__field-phone",
  7: ".brz-sermonList",
  8: ".brz-section__header--fixed",
  9: ".brz-image__lightbox"
};

const PRO_GROUP: Record<number, string> = {
  1: ".brz-image__gallery",
  2: ".brz-menu__mmenu",
  3: ".brz-lottie",
  4: ".brz-chart"
};

describe("makeScripts — the free lib group of a page", () => {
  it.each([
    { selector: ".brz-forms", lib: "group-1" },
    { selector: ".brz-forms2", lib: "group-1" },
    { selector: ".brz-filters__main", lib: "group-1" },
    { selector: ".brz-translation", lib: "group-1" },
    { selector: ".brz-slick-slider", lib: "group-1_2" },
    { selector: ".brz-carousel", lib: "group-1_2" },
    { selector: ".brz-countdown", lib: "group-1_2" },
    { selector: ".brz-countdown2", lib: "group-1_2" },
    { selector: ".brz-groupSlider", lib: "group-1_2" },
    { selector: ".brz-animated", lib: "group-1_3" },
    { selector: ".brz-motion--effects", lib: "group-1_3" },
    { selector: ".brz-bg-slideshow", lib: "group-1_4" },
    { selector: ".brz-forms2__calculated", lib: "group-1_5" },
    { selector: ".brz-forms2__field-phone", lib: "group-1_6" },
    { selector: ".brz-sermonLayout", lib: "group-1_7" },
    { selector: ".brz-sermonList", lib: "group-1_7" },
    { selector: ".brz-sermonDetail", lib: "group-1_7" },
    { selector: ".brz-sermonFeatured", lib: "group-1_7" },
    { selector: ".brz-staffFeatured", lib: "group-1_7" },
    { selector: ".brz-articleLayout", lib: "group-1_7" },
    { selector: ".brz-staffLayout", lib: "group-1_7" },
    { selector: ".brz-articleList", lib: "group-1_7" },
    { selector: ".brz-articleDetail", lib: "group-1_7" },
    { selector: ".brz-articleFeatured", lib: "group-1_7" },
    { selector: ".brz-section__header--animated", lib: "group-1_8" },
    { selector: ".brz-section__header--fixed", lib: "group-1_8" },
    { selector: ".brz-image__lightbox", lib: "group-1_9" },
    { selector: ".brz-image__gallery-lightbox", lib: "group-1_9" },
    { selector: ".brz-video__lightbox", lib: "group-1_9" }
  ])("is $lib for a page with only $selector", ({ selector, lib }) => {
    expect(freeLibOf([selector])).toEqual({ selectors: [selector], lib });
  });

  it.each([
    { groups: [1, 2], lib: "group-1_2" },
    { groups: [1, 3], lib: "group-1_3" },
    { groups: [1, 4], lib: "group-1_4" },
    { groups: [1, 5], lib: "group-1_5" },
    { groups: [1, 6], lib: "group-1_6" },
    { groups: [1, 7], lib: "group-1_7" },
    { groups: [1, 8], lib: "group-1_8" },
    { groups: [1, 9], lib: "group-1_9" },
    { groups: [2, 3], lib: "group-2_3" },
    { groups: [2, 4], lib: "group-2_4" },
    { groups: [2, 5], lib: "group-2_5" },
    { groups: [2, 6], lib: "group-2_6" },
    { groups: [2, 7], lib: "group-2_7" },
    { groups: [2, 8], lib: "group-2_8" },
    { groups: [2, 9], lib: "group-2_9" },
    { groups: [3, 4], lib: "group-3_4" },
    { groups: [3, 5], lib: "group-3_5" },
    { groups: [3, 6], lib: "group-3_6" },
    { groups: [3, 7], lib: "group-3_7" },
    { groups: [3, 8], lib: "group-3_8" },
    { groups: [3, 9], lib: "group-3_9" },
    { groups: [4, 5], lib: "group-4_5" },
    { groups: [4, 6], lib: "group-4_6" },
    { groups: [4, 7], lib: "group-4_7" },
    { groups: [4, 8], lib: "group-4_8" },
    { groups: [4, 9], lib: "group-4_9" },
    { groups: [5, 6], lib: "group-5_6" },
    { groups: [5, 7], lib: "group-5_7" },
    { groups: [5, 8], lib: "group-5_8" },
    { groups: [5, 9], lib: "group-5_9" },
    { groups: [6, 7], lib: "group-6_7" },
    { groups: [6, 8], lib: "group-6_8" },
    { groups: [6, 9], lib: "group-6_9" },
    { groups: [7, 8], lib: "group-7_8" },
    { groups: [7, 9], lib: "group-7_9" },
    { groups: [8, 9], lib: "group-8_9" },
    { groups: [1, 2, 3], lib: "group-all" },
    { groups: [4, 5, 6], lib: "group-all" },
    { groups: [2, 7, 9], lib: "group-all" },
    { groups: [1, 2, 3, 4, 5, 6, 7, 8, 9], lib: "group-all" }
  ])("is $lib for a page with the groups $groups", ({ groups, lib }) => {
    const selectors = groups.map((group) => FREE_GROUP[group]);

    // Markup order does not matter: the selectors come out in `libs.json` order.
    expect(freeLibOf([...selectors].reverse())).toEqual({ selectors, lib });
  });

  it("is no group for a page with no lib selector", () => {
    expect(freeLibOf([])).toEqual({ selectors: [], lib: undefined });
  });
});

describe("makeScripts — the pro lib group of a page", () => {
  it.each([
    { selector: ".brz-image__gallery", lib: "group-1" },
    { selector: ".brz-posts--masonry", lib: "group-1" },
    { selector: ".brz-menu__mmenu", lib: "group-1_2" },
    { selector: ".brz-mega-menu__portal", lib: "group-1_2" },
    { selector: ".brz-menu__sub-menu", lib: "group-1_2" },
    { selector: ".brz-menu__preview", lib: "group-1_2" },
    { selector: ".brz-tooltip", lib: "group-1_2" },
    { selector: "[data-tooltip]", lib: "group-1_2" },
    { selector: "[data-brz-tooltip]", lib: "group-1_2" },
    { selector: ".brz-lottie", lib: "group-1_3" },
    { selector: ".brz-chart", lib: "group-1_4" }
  ])("is $lib for a page with only $selector", ({ selector, lib }) => {
    expect(proLibOf([selector])).toEqual({ selectors: [selector], lib });
  });

  it.each([
    { groups: [1, 2], lib: "group-1_2" },
    { groups: [1, 3], lib: "group-1_3" },
    { groups: [1, 4], lib: "group-1_4" },
    { groups: [2, 3], lib: "group-2_3" },
    { groups: [2, 4], lib: "group-2_4" },
    { groups: [3, 4], lib: "group-3_4" },
    { groups: [1, 2, 3], lib: "group-all" },
    { groups: [1, 2, 3, 4], lib: "group-all" }
  ])("is $lib for a page with the groups $groups", ({ groups, lib }) => {
    const selectors = groups.map((group) => PRO_GROUP[group]);

    expect(proLibOf([...selectors].reverse())).toEqual({ selectors, lib });
  });

  it("is no group for a page with no lib selector", () => {
    expect(proLibOf([])).toEqual({ selectors: [], lib: undefined });
  });
});

describe("makeScripts — the lib map handed to the backend", () => {
  it.each([
    {
      case: "free",
      config: makeConfig(),
      names: [
        "group-1",
        "group-1_2",
        "group-1_3",
        "group-1_4",
        "group-1_5",
        "group-1_6",
        "group-1_7",
        "group-1_8",
        "group-1_9",
        "group-2",
        "group-2_3",
        "group-2_4",
        "group-2_5",
        "group-2_6",
        "group-2_7",
        "group-2_8",
        "group-2_9",
        "group-3",
        "group-3_4",
        "group-3_5",
        "group-3_6",
        "group-3_7",
        "group-3_8",
        "group-3_9",
        "group-4",
        "group-4_5",
        "group-4_6",
        "group-4_7",
        "group-4_8",
        "group-4_9",
        "group-5",
        "group-5_6",
        "group-5_7",
        "group-5_8",
        "group-5_9",
        "group-6",
        "group-6_7",
        "group-6_8",
        "group-6_9",
        "group-7",
        "group-7_8",
        "group-7_9",
        "group-8",
        "group-8_9",
        "group-9",
        "group-all"
      ],
      urlStart: "https://assets.example.com/editor/js/",
      urlEnd: ".min.js",
      className: "brz-script brz-script-preview-lib",
      score: 20,
      pro: false
    },
    {
      case: "pro",
      config: proConfig,
      names: [
        "group-1",
        "group-1_2",
        "group-1_3",
        "group-1_4",
        "group-2",
        "group-2_3",
        "group-2_4",
        "group-3",
        "group-3_4",
        "group-4",
        "group-all"
      ],
      urlStart: "https://assets.example.com/pro/js/",
      urlEnd: ".pro.min.js",
      className: "brz-script brz-script-preview-lib-pro",
      score: 21,
      pro: true
    }
  ])(
    "lists the $case groups in order, one deferred file each",
    ({ config, names, urlStart, urlEnd, className, score, pro }) => {
      const scripts = makeScripts(pageWith([]), config);
      const libsMap = pro ? scripts.pro?.libsMap : scripts.free.libsMap;

      expect(libsMap).toEqual(
        names.map((name) => ({
          name,
          selectors: expect.any(Array),
          score,
          pro,
          content: {
            type: "file",
            url: `${urlStart}${name}${urlEnd}`,
            attr: { class: className, defer: "true", "data-brz-group": name }
          }
        }))
      );
    }
  );
});
