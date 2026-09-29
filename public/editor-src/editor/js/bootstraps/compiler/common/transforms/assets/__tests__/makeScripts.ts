import { load as cheerioLoad } from "cheerio";
import { noop } from "es-toolkit";
import {
  ConfigCommon,
  Mode
} from "visual/global/Config/types/configs/ConfigCommon";
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
