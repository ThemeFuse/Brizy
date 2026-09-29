import $ from "jquery";
import { z } from "zod";
import {
  initFree,
  loadFreeRuntime,
  mountRoot,
  nextInitComplete,
  type RuntimeManifest,
  silenceConsole
} from "../../../../../jest-utils/exportRuntime";

// The free export dispatcher, driven only through `window.Brz.emit("init.dom")`
// with the jQuery payload published pages send. The component manifest is
// replaced by fake components that record which root elements they received —
// whether the dispatcher hands them a jQuery set or a native node.

const receivedRootsSchema = z.union([
  z.instanceof(HTMLElement).transform((node) => [node]),
  z
    .custom<JQuery<HTMLElement>>((value) => value instanceof $)
    .transform((set) => set.get())
]);

interface Call {
  name: string;
  roots: HTMLElement[];
}

type Load = "resolves" | "rejects";
type Run = "returns" | "throws";

interface FakeComponent {
  name: string;
  selector: string;
  load: Load;
  run: Run;
}

const manifest: RuntimeManifest = {};
const calls: Call[] = [];

function register(components: FakeComponent[]): void {
  for (const { name, selector, load, run } of components) {
    manifest[name] = {
      selector,
      path: () =>
        load === "rejects"
          ? Promise.reject(new Error(`${name} chunk failed`))
          : Promise.resolve({
              default: (root: unknown) => {
                calls.push({ name, roots: receivedRootsSchema.parse(root) });
                if (run === "throws") {
                  throw new Error(`${name} failed`);
                }
              }
            })
    };
  }
}

function messages(spy: jest.SpyInstance): string[] {
  return spy.mock.calls.map(([message]) => String(message));
}

let consoleSpy: ReturnType<typeof silenceConsole>;

beforeAll(async () => {
  consoleSpy = silenceConsole();
  await loadFreeRuntime({ kind: "mocked", componentManifest: manifest });
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  for (const name of Object.keys(manifest)) {
    delete manifest[name];
  }
  calls.length = 0;
  document.body.innerHTML = "";
  consoleSpy.warn.mockClear();
  consoleSpy.error.mockClear();
});

const ok = (name: string, selector: string): FakeComponent => ({
  name,
  selector,
  load: "resolves",
  run: "returns"
});

describe("init.dom dispatch", () => {
  it.each([
    {
      case: "a component whose selector matches a descendant",
      html: `<div class="brz-a"></div>`,
      components: [ok("a", ".brz-a")],
      called: ["a"],
      warned: [],
      loadErrors: [],
      runErrors: []
    },
    {
      case: "a component whose selector matches nothing",
      html: `<div class="brz-b"></div>`,
      components: [ok("a", ".brz-a")],
      called: [],
      warned: [],
      loadErrors: [],
      runErrors: []
    },
    {
      case: "a component whose selector matches only the root itself",
      html: `<span></span>`,
      components: [ok("a", "div")],
      called: [],
      warned: [],
      loadErrors: [],
      runErrors: []
    },
    {
      case: "several matching components, in manifest order",
      html: `<div class="brz-a"></div><div class="brz-b"></div>`,
      components: [ok("a", ".brz-a"), ok("b", ".brz-b")],
      called: ["a", "b"],
      warned: [],
      loadErrors: [],
      runErrors: []
    },
    {
      case: "an invalid selector next to a valid one",
      html: `<div class="brz-a"></div>`,
      components: [ok("broken", "[["), ok("a", ".brz-a")],
      called: ["a"],
      warned: ["[Brz] Invalid selector for broken:"],
      loadErrors: [],
      runErrors: []
    },
    {
      case: "a chunk that fails to load next to one that loads",
      html: `<div class="brz-a"></div>`,
      components: [
        { name: "broken", selector: ".brz-a", load: "rejects", run: "returns" },
        ok("a", ".brz-a")
      ],
      called: ["a"],
      warned: [],
      loadErrors: ["[Brz] Failed to load component: broken"],
      runErrors: []
    },
    {
      case: "an export that throws next to one that returns",
      html: `<div class="brz-a"></div>`,
      components: [
        { name: "broken", selector: ".brz-a", load: "resolves", run: "throws" },
        ok("a", ".brz-a")
      ],
      called: ["broken", "a"],
      warned: [],
      loadErrors: [],
      runErrors: ["[Brz] Component initialization failed: broken"]
    }
  ] satisfies {
    case: string;
    html: string;
    components: FakeComponent[];
    called: string[];
    warned: string[];
    loadErrors: string[];
    runErrors: string[];
  }[])(
    "handles $case",
    async ({ html, components, called, warned, loadErrors, runErrors }) => {
      register(components);
      const root = mountRoot(html);

      await initFree([root]);

      expect(calls).toEqual(called.map((name) => ({ name, roots: [root] })));
      expect(messages(consoleSpy.warn)).toEqual(warned);
      expect(messages(consoleSpy.error)).toEqual([...loadErrors, ...runErrors]);
    }
  );

  it("runs no export before every chunk has loaded, and emits init.complete after the last one", async () => {
    let releaseSlowChunk = (): void => undefined;
    const slowChunk = new Promise<void>((resolve) => {
      releaseSlowChunk = resolve;
    });
    const order: string[] = [];
    manifest.slow = {
      selector: ".brz-slow",
      path: async () => {
        await slowChunk;
        return { default: () => order.push("slow") };
      }
    };
    manifest.fast = {
      selector: ".brz-fast",
      path: async () => ({ default: () => order.push("fast") })
    };
    const root = mountRoot(
      `<div class="brz-slow"></div><div class="brz-fast"></div>`
    );
    const complete = nextInitComplete().then(() => order.push("complete"));

    window.Brz.emit("init.dom", $(root));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const beforeRelease = [...order];
    releaseSlowChunk();
    await complete;

    expect({ beforeRelease, after: order }).toEqual({
      beforeRelease: [],
      after: ["slow", "fast", "complete"]
    });
  });

  it("runs nothing for an empty set and still emits init.complete", async () => {
    register([ok("a", ".brz-a")]);
    mountRoot(`<div class="brz-a"></div>`);

    await initFree([]);

    expect(calls).toEqual([]);
  });

  it("runs the exports again when the same root is emitted twice", async () => {
    register([ok("a", ".brz-a")]);
    const root = mountRoot(`<div class="brz-a"></div>`);

    await initFree([root]);
    await initFree([root]);

    expect(calls).toEqual([
      { name: "a", roots: [root] },
      { name: "a", roots: [root] }
    ]);
  });

  it("initialises a component found in the first node of a two-node set", async () => {
    register([ok("a", ".brz-a")]);
    const first = mountRoot(`<div class="brz-a"></div>`);
    const second = mountRoot(`<span></span>`);

    await initFree([first, second]);

    expect(calls).toHaveLength(1);
    expect(calls[0]?.roots).toContain(first);
  });
});
