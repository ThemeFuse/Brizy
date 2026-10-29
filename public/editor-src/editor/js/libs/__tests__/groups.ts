// What each base lib group publishes. rspack builds a group entry with
// `library: "BrizyLibs"` (pro: `"BrizyProLibs"`), so the entry's exports are
// exactly what export code reads through `getFreeLibs()` / `getProLibs()`.

describe("a lib group entry", () => {
  it.each([
    {
      group: "group-1",
      load: () => import("../group-1"),
      exports: ["Flatpickr", "Scrollbars", "select2"]
    },
    {
      group: "group-2",
      load: () => import("../group-2"),
      exports: ["countdown", "createSlider", "onSlider"]
    },
    {
      group: "group-3",
      load: () => import("../group-3"),
      exports: ["Animation", "Motions"]
    },
    {
      group: "group-7",
      load: () => import("../group-7"),
      exports: ["initEkklesiaPopups"]
    },
    {
      group: "group-1-pro",
      load: () => import("../group-1-pro"),
      exports: ["Gallery", "ImagesLoaded", "Isotope"]
    }
  ])("$group publishes $exports", async ({ load, exports }) => {
    expect(Object.keys(await load()).sort()).toEqual(exports);
  });

  it.each([
    { case: "a page without jQuery", page: undefined },
    { case: "a page with its own jQuery", page: { fn: {} } }
  ])("neither publishes nor replaces jQuery on $case", async ({ page }) => {
    jest.resetModules();
    Object.defineProperty(window, "jQuery", {
      configurable: true,
      writable: true,
      value: page
    });

    await import("../group-1");
    await import("../group-2");
    await import("../group-3");
    await import("../group-7");
    await import("../group-1-pro");

    expect(Reflect.get(window, "jQuery")).toBe(page);

    Reflect.deleteProperty(window, "jQuery");
  });
});
