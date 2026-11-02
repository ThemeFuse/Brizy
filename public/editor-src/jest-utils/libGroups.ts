// A lib group bundle as a published page sees it. rspack builds every group
// entry (`libs/group-*`) with `library: "BrizyLibs"` (pro: `"BrizyProLibs"`)
// and `libraryTarget: "window"`, so loading a group replaces that global with
// the entry's exports; export code reads it through `getFreeLibs()` /
// `getProLibs()`. Importing the entry in a test also runs its side effects
// (plugins it registers), exactly like the page does.

export type LibBundle = "BrizyLibs" | "BrizyProLibs";

// `window.BrizyLibs` is typed with members a single group does not provide, so
// the value is installed through a property descriptor instead of an assignment.
export function publishLibGroup(bundle: LibBundle, exports: object): void {
  Object.defineProperty(window, bundle, {
    configurable: true,
    writable: true,
    value: { ...exports }
  });
}
