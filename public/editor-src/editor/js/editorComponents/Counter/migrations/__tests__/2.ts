import { m2 } from "../2";

describe("testing m2 migration", () => {
  test.each([
    // Empty object - no migration needed
    [{}, {}],

    //#region colorHex migration
    [
      { colorHex: "#239ddb" },
      { colorHex: "#239ddb", prefixSuffixColorHex: "#239ddb" }
    ],
    [
      { colorHex: "#ffffff" },
      { colorHex: "#ffffff", prefixSuffixColorHex: "#ffffff" }
    ],
    [{ colorHex: "" }, { colorHex: "", prefixSuffixColorHex: "" }],
    //#endregion

    //#region colorOpacity migration
    [{ colorOpacity: 1 }, { colorOpacity: 1, prefixSuffixColorOpacity: 1 }],
    [
      { colorOpacity: 0.5 },
      { colorOpacity: 0.5, prefixSuffixColorOpacity: 0.5 }
    ],
    [{ colorOpacity: 0 }, { colorOpacity: 0, prefixSuffixColorOpacity: 0 }],
    //#endregion

    //#region colorPalette migration
    [
      { colorPalette: "color3" },
      { colorPalette: "color3", prefixSuffixColorPalette: "color3" }
    ],
    [
      { colorPalette: "color1" },
      { colorPalette: "color1", prefixSuffixColorPalette: "color1" }
    ],
    [{ colorPalette: "" }, { colorPalette: "", prefixSuffixColorPalette: "" }],
    //#endregion

    //#region all color fields together
    [
      {
        colorHex: "#239ddb",
        colorOpacity: 1,
        colorPalette: "color3"
      },
      {
        colorHex: "#239ddb",
        colorOpacity: 1,
        colorPalette: "color3",
        prefixSuffixColorHex: "#239ddb",
        prefixSuffixColorOpacity: 1,
        prefixSuffixColorPalette: "color3"
      }
    ],
    //#endregion

    //#region hoverColorHex migration from v
    [
      { hoverColorHex: "#ff0000" },
      { hoverColorHex: "#ff0000", hoverPrefixSuffixColorHex: "#ff0000" }
    ],
    [
      { hoverColorHex: "#239ddb" },
      { hoverColorHex: "#239ddb", hoverPrefixSuffixColorHex: "#239ddb" }
    ],
    //#endregion

    //#region hoverColorOpacity migration from v
    [
      { hoverColorOpacity: 0.8 },
      { hoverColorOpacity: 0.8, hoverPrefixSuffixColorOpacity: 0.8 }
    ],
    [
      { hoverColorOpacity: 1 },
      { hoverColorOpacity: 1, hoverPrefixSuffixColorOpacity: 1 }
    ],
    //#endregion

    //#region hoverColorPalette migration from v
    [
      { hoverColorPalette: "color3" },
      { hoverColorPalette: "color3", hoverPrefixSuffixColorPalette: "color3" }
    ],
    [
      { hoverColorPalette: "color1" },
      { hoverColorPalette: "color1", hoverPrefixSuffixColorPalette: "color1" }
    ],
    //#endregion

    //#region all hover color fields together from v
    [
      {
        hoverColorHex: "#ff0000",
        hoverColorOpacity: 0.8,
        hoverColorPalette: "color3"
      },
      {
        hoverColorHex: "#ff0000",
        hoverColorOpacity: 0.8,
        hoverColorPalette: "color3",
        hoverPrefixSuffixColorHex: "#ff0000",
        hoverPrefixSuffixColorOpacity: 0.8,
        hoverPrefixSuffixColorPalette: "color3"
      }
    ],
    //#endregion

    //#region all fields together (color + hover)
    [
      {
        colorHex: "#239ddb",
        colorOpacity: 1,
        colorPalette: "color3",
        hoverColorHex: "#ff0000",
        hoverColorOpacity: 0.8,
        hoverColorPalette: "color1"
      },
      {
        colorHex: "#239ddb",
        colorOpacity: 1,
        colorPalette: "color3",
        hoverColorHex: "#ff0000",
        hoverColorOpacity: 0.8,
        hoverColorPalette: "color1",
        prefixSuffixColorHex: "#239ddb",
        prefixSuffixColorOpacity: 1,
        prefixSuffixColorPalette: "color3",
        hoverPrefixSuffixColorHex: "#ff0000",
        hoverPrefixSuffixColorOpacity: 0.8,
        hoverPrefixSuffixColorPalette: "color1"
      }
    ],
    //#endregion

    //#region other keys should remain untouched
    [
      {
        _id: "abcde",
        start: 0,
        end: 100,
        duration: 2,
        colorHex: "#239ddb"
      },
      {
        _id: "abcde",
        start: 0,
        end: 100,
        duration: 2,
        colorHex: "#239ddb",
        prefixSuffixColorHex: "#239ddb"
      }
    ],
    //#endregion

    //#region existing prefixSuffixColor* keys should be overwritten
    [
      {
        colorHex: "#239ddb",
        prefixSuffixColorHex: "#ffffff"
      },
      {
        colorHex: "#239ddb",
        prefixSuffixColorHex: "#239ddb"
      }
    ],
    [
      {
        hoverColorHex: "#ff0000",
        hoverPrefixSuffixColorHex: "#ffffff"
      },
      {
        hoverColorHex: "#ff0000",
        hoverPrefixSuffixColorHex: "#ff0000"
      }
    ],
    //#endregion

    //#region edge cases - null/undefined values
    [{ colorHex: null }, { colorHex: null }],
    [{ colorOpacity: null }, { colorOpacity: null }],
    [{ colorPalette: null }, { colorPalette: null }],
    [{ hoverColorHex: null }, { hoverColorHex: null }],
    [{ hoverColorOpacity: null }, { hoverColorOpacity: null }],
    [{ hoverColorPalette: null }, { hoverColorPalette: null }],
    [
      { colorHex: null, prefixSuffixColorHex: "#239ddb" },
      { colorHex: null, prefixSuffixColorHex: "#239ddb" }
    ],
    [
      { colorOpacity: null, prefixSuffixColorOpacity: 0.5 },
      { colorOpacity: null, prefixSuffixColorOpacity: 0.5 }
    ],
    [
      { colorPalette: null, prefixSuffixColorPalette: "color3" },
      { colorPalette: null, prefixSuffixColorPalette: "color3" }
    ],
    [
      { hoverColorHex: null, hoverPrefixSuffixColorHex: "#ff0000" },
      { hoverColorHex: null, hoverPrefixSuffixColorHex: "#ff0000" }
    ],
    [
      { hoverColorOpacity: null, hoverPrefixSuffixColorOpacity: 0.8 },
      { hoverColorOpacity: null, hoverPrefixSuffixColorOpacity: 0.8 }
    ],
    [
      { hoverColorPalette: null, hoverPrefixSuffixColorPalette: "color3" },
      { hoverColorPalette: null, hoverPrefixSuffixColorPalette: "color3" }
    ],
    //#endregion

    //#region partial migrations
    [
      { colorHex: "#239ddb", colorOpacity: 1 },
      {
        colorHex: "#239ddb",
        colorOpacity: 1,
        prefixSuffixColorHex: "#239ddb",
        prefixSuffixColorOpacity: 1
      }
    ],
    [
      { hoverColorHex: "#ff0000", hoverColorOpacity: 0.8 },
      {
        hoverColorHex: "#ff0000",
        hoverColorOpacity: 0.8,
        hoverPrefixSuffixColorHex: "#ff0000",
        hoverPrefixSuffixColorOpacity: 0.8
      }
    ]
    //#endregion
  ])("standard migration cases", (v, expected) => {
    const migrated = m2.cb({
      v,
      vs: v,
      vd: v,
      renderContext: "editor" as const
    });
    expect(migrated).toStrictEqual(expected);
  });

  test.each([
    //#region hoverColorHex fallback from vd
    [
      {
        v: {},
        vd: { hoverColorHex: "#ff0000" },
        vs: {},
        renderContext: "editor" as const
      },
      { hoverPrefixSuffixColorHex: "#ff0000" }
    ],
    [
      {
        v: {},
        vd: { hoverColorHex: "#239ddb" },
        vs: {},
        renderContext: "editor" as const
      },
      { hoverPrefixSuffixColorHex: "#239ddb" }
    ],
    //#endregion

    //#region hoverColorOpacity fallback from vd
    [
      {
        v: {},
        vd: { hoverColorOpacity: 0.8 },
        vs: {},
        renderContext: "editor" as const
      },
      { hoverPrefixSuffixColorOpacity: 0.8 }
    ],
    [
      {
        v: {},
        vd: { hoverColorOpacity: 1 },
        vs: {},
        renderContext: "editor" as const
      },
      { hoverPrefixSuffixColorOpacity: 1 }
    ],
    //#endregion

    //#region hoverColorPalette fallback from vd
    [
      {
        v: {},
        vd: { hoverColorPalette: "color3" },
        vs: {},
        renderContext: "editor" as const
      },
      { hoverPrefixSuffixColorPalette: "color3" }
    ],
    [
      {
        v: {},
        vd: { hoverColorPalette: "color1" },
        vs: {},
        renderContext: "editor" as const
      },
      { hoverPrefixSuffixColorPalette: "color1" }
    ],
    //#endregion

    //#region hoverColorHex fallback from vs
    [
      {
        v: {},
        vd: {},
        vs: { hoverColorHex: "#ff0000" },
        renderContext: "editor" as const
      },
      { hoverPrefixSuffixColorHex: "#ff0000" }
    ],
    //#endregion

    //#region hoverColorHex fallback from merged vd and vs (vs takes precedence)
    [
      {
        v: {},
        vd: { hoverColorHex: "#000000" },
        vs: { hoverColorHex: "#ff0000" },
        renderContext: "editor" as const
      },
      { hoverPrefixSuffixColorHex: "#ff0000" }
    ],
    //#endregion

    //#region all hover fields fallback from vd/vs
    [
      {
        v: {},
        vd: {
          hoverColorHex: "#ff0000",
          hoverColorOpacity: 0.8,
          hoverColorPalette: "color3"
        },
        vs: {},
        renderContext: "editor" as const
      },
      {
        hoverPrefixSuffixColorHex: "#ff0000",
        hoverPrefixSuffixColorOpacity: 0.8,
        hoverPrefixSuffixColorPalette: "color3"
      }
    ],
    //#endregion

    //#region v takes precedence over vd/vs for hover colors
    [
      {
        v: { hoverColorHex: "#00ff00" },
        vd: { hoverColorHex: "#ff0000" },
        vs: { hoverColorHex: "#0000ff" },
        renderContext: "editor" as const
      },
      {
        hoverColorHex: "#00ff00",
        hoverPrefixSuffixColorHex: "#00ff00"
      }
    ]
    //#endregion
  ])("hover color fallback cases", (data, expected) => {
    const migrated = m2.cb(data);
    expect(migrated).toStrictEqual(expected);
  });
});
