import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { createStore } from "visual/redux/store";
import { cssStyleElementEcwidProductCheckboxPadding } from "../cssStyleElementEcwidProduct";

const getConfig = (): ConfigCommon => ({}) as ConfigCommon;

describe("cssStyleElementEcwidProductCheckboxPadding", () => {
  it.each([
    { case: "small", size: "small", out: "padding: 16em;" },
    { case: "medium", size: "medium", out: "padding: 24em;" },
    { case: "large", size: "large", out: "padding: 32em;" },
    { case: "custom", size: "custom", out: "padding: 5em;" }
  ])("interpolates the suffix for $case", ({ size, out }) => {
    const css = cssStyleElementEcwidProductCheckboxPadding({
      v: {
        checkboxSize: size,
        checkboxCustomSize: 5,
        checkboxCustomSizeSuffix: "em"
      },
      device: "desktop",
      state: "normal",
      store: createStore(),
      getConfig
    });

    expect(css).not.toContain("${");
    expect(css).toBe(out);
  });
});
