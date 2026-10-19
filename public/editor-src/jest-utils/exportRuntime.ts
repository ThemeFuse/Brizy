import { noop } from "es-toolkit";

// The published-page runtime as tests drive it. The free bootstrap
// (`bootstraps/preview`) creates `window.Brz` and runs the free component
// manifest on every `init.dom`; the pro bootstrap (`bootstraps/pro/index.preview`)
// needs that object and runs the pro manifest on `init.dom` and `init.pro.dom`.
// Every load starts from a fresh module registry, so a test file can load the
// runtime again with a different manifest. Tests talk to the runtime only
// through `window.Brz`, with the native node the published page emits.

const FREE_MANIFEST = "visual/bootstraps/preview/componentManifest";
const PRO_MANIFEST = "visual/bootstraps/pro/componentManifest";

export interface RuntimeEntry {
  selector: string;
  path: () => Promise<unknown>;
}

export type RuntimeManifest = Record<string, RuntimeEntry>;

export type ManifestSource =
  | { kind: "real" }
  | { kind: "mocked"; componentManifest: RuntimeManifest };

export type ProEvent = "init.dom" | "init.pro.dom";

// A jQuery set as the dispatcher meets it: an array-like of nodes with `get()`.
class JQuerySetStandIn implements ArrayLike<HTMLElement> {
  readonly [index: number]: HTMLElement;
  readonly length: number;

  constructor(nodes: HTMLElement[]) {
    Object.assign(this, nodes);
    this.length = nodes.length;
  }

  get(): HTMLElement[] {
    return Array.from(this);
  }
}

export function jQuerySetOf(nodes: HTMLElement[]): ArrayLike<HTMLElement> {
  return new JQuerySetStandIn(nodes);
}

function installManifest(path: string, source: ManifestSource): void {
  switch (source.kind) {
    case "real":
      jest.dontMock(path);
      return;
    case "mocked":
      jest.doMock(path, () => ({
        componentManifest: source.componentManifest
      }));
      return;
  }
}

// Every step of a dispatch (dynamic imports, the async listeners) settles in
// microtasks, so a few macrotask turns drain it completely.
export async function flushRuntime(): Promise<void> {
  for (let turn = 0; turn < 3; turn++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

export function nextInitComplete(): Promise<void> {
  return new Promise((resolve) => {
    const unbind = window.Brz.on("init.complete", () => {
      unbind();
      resolve();
    });
  });
}

// The free bootstrap emits its own `init.dom` for `document.body` one frame
// after it loads; `onAlways` catches that `init.complete` whether it already
// happened or not, so later waits only see the emissions a test makes.
function initialInitComplete(): Promise<void> {
  return new Promise((resolve) => {
    window.Brz.onAlways("init.complete", () => resolve());
  });
}

export async function loadFreeRuntime(free: ManifestSource): Promise<void> {
  jest.resetModules();
  installManifest(FREE_MANIFEST, free);
  await import("visual/bootstraps/preview");
  await initialInitComplete();
}

export async function loadProRuntime(
  free: ManifestSource,
  pro: ManifestSource
): Promise<void> {
  await loadFreeRuntime(free);
  installManifest(PRO_MANIFEST, pro);
  await import("visual/bootstraps/pro/index.preview");
  await flushRuntime();
}

// Emits `init.dom` with any payload and resolves once the free bootstrap
// reports `init.complete`.
export async function emitFree(payload: unknown): Promise<void> {
  const complete = nextInitComplete();
  window.Brz.emit("init.dom", payload);
  await complete;
}

// Initialises each root the way the published page does: one native node per
// `init.dom`.
export async function initFree(nodes: HTMLElement[]): Promise<void> {
  for (const node of nodes) {
    await emitFree(node);
  }
}

// The pro bootstrap emits no completion event, so the dispatch is drained.
export async function emitPro(
  event: ProEvent,
  payload: unknown
): Promise<void> {
  window.Brz.emit(event, payload);
  await flushRuntime();
}

export async function initPro(
  event: ProEvent,
  nodes: HTMLElement[]
): Promise<void> {
  for (const node of nodes) {
    await emitPro(event, node);
  }
}

// A real export module, whatever root type its default export takes.
export type ExportLoader = () => Promise<{ default: (root: never) => unknown }>;

export function loadersOf(
  manifest: Record<string, { export: ExportLoader }>
): Record<string, ExportLoader> {
  return Object.fromEntries(
    Object.entries(manifest).map(([name, entry]) => [name, entry.export])
  );
}

export interface ContractReport {
  loaded: Set<string>;
  called: Set<string>;
  failures: Map<string, unknown>;
}

export function createContractReport(): ContractReport {
  return { loaded: new Set(), called: new Set(), failures: new Map() };
}

// Every real export behind a selector that matches any child, so one dispatch
// on a root with a child calls all of them with exactly what the dispatcher
// passes. Load errors, synchronous throws and rejected promises are recorded
// per component; the dispatcher still sees them as before.
export function contractManifest(
  loaders: Record<string, ExportLoader>,
  report: ContractReport
): RuntimeManifest {
  return Object.fromEntries(
    Object.entries(loaders).map(([name, load]) => [
      name,
      {
        selector: "*",
        path: async () => {
          try {
            const module = await load();
            report.loaded.add(name);
            return {
              default: (root: unknown) => {
                report.called.add(name);
                try {
                  const result: unknown = Reflect.apply(
                    module.default,
                    undefined,
                    [root]
                  );
                  Promise.resolve(result).catch((error: unknown) => {
                    report.failures.set(name, error);
                  });
                  return result;
                } catch (error) {
                  report.failures.set(name, error);
                  throw error;
                }
              }
            };
          } catch (error) {
            report.failures.set(name, error);
            throw error;
          }
        }
      }
    ])
  );
}

// A runtime loaded by one test keeps its `document` listeners; the returned
// function removes every listener added since, so it cannot answer a later test.
export function trackDocumentListeners(): VoidFunction {
  const listen = jest.spyOn(document, "addEventListener");

  return () => {
    for (const [type, listener] of listen.mock.calls) {
      document.removeEventListener(type, listener);
    }
    listen.mockRestore();
  };
}

// Stands in for a listener of the page around an element: it records what
// `read` returns when the click arrives and lets the click go no further.
export function stopClicksAt<T>(ancestor: HTMLElement, read: () => T): T[] {
  const seen: T[] = [];

  ancestor.addEventListener("click", (event) => {
    seen.push(read());
    event.stopPropagation();
  });

  return seen;
}

export interface ClickListeners {
  targets: () => EventTarget[];
  restore: VoidFunction;
}

// Every target that is given a click listener from now on.
export function trackClickListeners(): ClickListeners {
  const listen = jest.spyOn(EventTarget.prototype, "addEventListener");

  return {
    targets: () =>
      listen.mock.calls.flatMap(([type], index) => {
        const target: unknown = listen.mock.contexts[index];

        return type === "click" && target instanceof EventTarget
          ? [target]
          : [];
      }),
    restore: () => listen.mockRestore()
  };
}

export function mountRoot(html: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.append(root);
  return root;
}

class InertIntersectionObserver {
  observe = noop;
  unobserve = noop;
  disconnect = noop;
  takeRecords = (): [] => [];
}

// jsdom has no IntersectionObserver; several export modules construct one
// when they are imported.
export function installIntersectionObserver(): void {
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: InertIntersectionObserver
  });
}

class InertLibrary {}

// Some exports return before touching their root when a lib group bundle is
// missing (`getFreeLibs()` / `getProLibs()`). Inert stand-ins let those exports
// reach their root handling; with an empty root no lib is ever constructed.
export function installInertLibs(
  bundle: "BrizyLibs" | "BrizyProLibs",
  names: string[]
): void {
  Object.defineProperty(window, bundle, {
    configurable: true,
    writable: true,
    value: Object.fromEntries(names.map((name) => [name, InertLibrary]))
  });
}

export function silenceConsole(): {
  log: jest.SpyInstance;
  warn: jest.SpyInstance;
  error: jest.SpyInstance;
} {
  return {
    log: jest.spyOn(console, "log").mockImplementation(noop),
    warn: jest.spyOn(console, "warn").mockImplementation(noop),
    error: jest.spyOn(console, "error").mockImplementation(noop)
  };
}
