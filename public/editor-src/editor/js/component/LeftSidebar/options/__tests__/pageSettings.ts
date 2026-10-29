import { getPageSettings } from "../pageSettings";

describe("getPageSettings", () => {
  it.each([
    { case: "no ui", options: undefined, showOverlays: false, types: [] },
    {
      case: "no ui, overlays present",
      options: undefined,
      showOverlays: true,
      types: ["overlays"]
    },
    {
      case: "enabled and disabled keys",
      options: { membership: true, language: false },
      showOverlays: false,
      types: ["membership"]
    },
    {
      case: "config order kept, overlays last",
      options: { language: true, membership: true },
      showOverlays: true,
      types: ["language", "membership", "overlays"]
    },
    {
      case: "overlays enabled from config only",
      options: { overlays: true },
      showOverlays: false,
      types: []
    },
    {
      case: "an unknown key",
      options: { foo: true },
      showOverlays: false,
      types: []
    }
  ])("lists the settings for $case", ({ options, showOverlays, types }) => {
    const ui = options && { leftSidebar: { pageSettings: { options } } };

    expect(
      getPageSettings(ui, { showOverlays }).map(({ type }) => type)
    ).toEqual(types);
  });
});
