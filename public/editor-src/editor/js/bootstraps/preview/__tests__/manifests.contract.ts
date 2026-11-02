import { componentsManifest } from "visual/component/index.export";
import { editorComponentsManifest as cloudEditorComponents } from "visual/editorComponents/index.export";
import { editorComponentsManifest as wpEditorComponents } from "visual/editorComponents/index.export.wp";
import {
  contractManifest,
  createContractReport,
  type ExportLoader,
  flushRuntime,
  initFree,
  installInertLibs,
  installIntersectionObserver,
  loadersOf,
  loadFreeRuntime,
  mountRoot,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";

// Every export the free manifests reference must accept the root the free
// dispatcher passes. The dispatcher runs each real export once on a root with
// one empty child; a component fails when its chunk does not load or its
// export throws (synchronously or through a rejected promise). The dispatcher
// swallows those errors on a published page, so this is where they surface.
//
// Jest resolves `./Foo/export` to the default file, never to `export.wp.*`,
// so the WordPress variants and the export file no manifest references are
// listed by hand.

const variants: { case: string; loaders: Record<string, ExportLoader> }[] = [
  {
    case: "Cloud",
    loaders: {
      ...loadersOf(cloudEditorComponents),
      ...loadersOf(componentsManifest),
      editorComponentsShopifyQuantity: () =>
        import("visual/editorComponents/Shopify/Quantity/export")
    }
  },
  {
    case: "WordPress",
    loaders: {
      ...loadersOf(wpEditorComponents),
      ...loadersOf(componentsManifest),
      loginWordPress: () =>
        import("visual/editorComponents/Login/export/index.wp")
    }
  }
];

beforeAll(() => {
  silenceConsole();
  installIntersectionObserver();
  installInertLibs("BrizyLibs", ["Animation"]);
});

afterAll(() => {
  jest.restoreAllMocks();
});

// One dispatch loads every export module and its dependencies; on a cold
// transform cache (CI) that alone takes longer than Jest's 5 s default.
const LOAD_ALL_EXPORTS_TIMEOUT = 60_000;

describe.each(variants)("the free $case manifest", ({ loaders }) => {
  const report = createContractReport();

  beforeAll(async () => {
    localStorage.clear();
    await loadFreeRuntime({
      kind: "mocked",
      componentManifest: contractManifest(loaders, report)
    });
    await initFree([mountRoot("<div></div>")]);
    await flushRuntime();
  }, LOAD_ALL_EXPORTS_TIMEOUT);

  afterAll(() => {
    document.body.innerHTML = "";
    localStorage.clear();
  });

  it.each(Object.keys(loaders))(
    "%s accepts the root the dispatcher passes",
    (name) => {
      expect(report.failures.get(name)).toBeUndefined();
      expect({
        loaded: report.loaded.has(name),
        called: report.called.has(name)
      }).toEqual({ loaded: true, called: true });
    }
  );
});
