import { z } from "zod";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  initFree,
  loadFreeRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";

// The published Disqus comments block, initialised the way a page does it: the
// free bootstrap with the real manifest receives `init.dom` and loads this
// export, which configures Disqus from the block's attributes and injects its
// embed script. jsdom does not fetch the script.

interface DisqusPage {
  url: unknown;
  identifier: unknown;
}

const disqusConfigSchema = z.custom<(this: { page: DisqusPage }) => void>(
  (value) => typeof value === "function"
);

function disqusScripts(): HTMLScriptElement[] {
  return Array.from(document.querySelectorAll("script")).filter((script) =>
    script.src.includes("disqus.com")
  );
}

function configuredPage(): DisqusPage {
  const context = { page: { url: "unset", identifier: "unset" } };
  const config = disqusConfigSchema.parse(Reflect.get(window, "disqus_config"));
  config.call(context);
  return context.page;
}

beforeAll(async () => {
  silenceConsole();
  await loadFreeRuntime({ kind: "real" });
});

afterAll(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  for (const script of disqusScripts()) {
    script.remove();
  }
  Reflect.deleteProperty(window, "disqus_config");
  document.body.innerHTML = "";
});

describe("Comments on a published page", () => {
  it.each([
    {
      case: "every attribute",
      attributes: `data-shortname="brizy" data-url="https://site.com/post" data-identifier="post-1"`,
      src: "https://brizy.disqus.com/embed.js",
      page: { url: "https://site.com/post", identifier: "post-1" }
    },
    {
      case: "no attributes",
      attributes: "",
      src: "https://undefined.disqus.com/embed.js",
      page: { url: undefined, identifier: undefined }
    }
  ])(
    "configures Disqus from a block with $case",
    async ({ attributes, src, page }) => {
      const root = mountRoot(`<div id="disqus_thread" ${attributes}></div>`);

      await initFree([root]);
      const scripts = disqusScripts();

      expect(
        scripts.map((script) => ({
          src: script.src,
          consent: script.getAttribute(makeAttr("consent")),
          hasTimestamp: script.hasAttribute("data-timestamp"),
          inHead: script.parentElement === document.head
        }))
      ).toEqual([
        { src, consent: "marketing", hasTimestamp: true, inHead: true }
      ]);
      expect(configuredPage()).toStrictEqual(page);
    }
  );
});
