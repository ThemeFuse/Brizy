import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import { getRootClassNames } from "../utils";

const baseConfig = { mode: Mode.page } as ConfigCommon;

const pageRootClassNames = [
  "brz",
  "brz-root__container",
  "brz-reset-all",
  "brz-root__container-page"
];

const storyRootClassNames = [
  "brz",
  "brz-root__container",
  "brz-reset-all",
  "brz-root__container-story"
];

const popupBaseClassNames = ["brz", "brz-conditions-popup"];

describe("getRootClassNames", () => {
  it("returns separate class tokens for page mode", () => {
    expect(getRootClassNames(baseConfig)).toEqual(pageRootClassNames);
  });

  it.each([Mode.internal_story, Mode.external_story])(
    "returns separate class tokens for story mode (%s)",
    (mode) => {
      expect(getRootClassNames({ ...baseConfig, mode })).toEqual(
        storyRootClassNames
      );
    }
  );

  describe("popup mode", () => {
    it.each([
      {
        mode: Mode.internal_popup,
        expected: [...popupBaseClassNames, "brz-conditions-internal-popup"]
      },
      {
        mode: Mode.external_popup,
        expected: [...popupBaseClassNames, "brz-conditions-external-popup"]
      }
    ])("returns separate class tokens for $mode", ({ mode, expected }) => {
      expect(getRootClassNames({ ...baseConfig, mode })).toEqual(expected);
    });

    it.each([Mode.internal_popup, Mode.external_popup])(
      "does not add embedded class when embedded is false (%s)",
      (mode) => {
        const result = getRootClassNames({
          ...baseConfig,
          mode,
          ui: { popupSettings: { embedded: false } }
        });

        expect(result).not.toContain("brz-conditions-popup--static");
      }
    );

    it.each([
      {
        mode: Mode.internal_popup,
        expected: [
          ...popupBaseClassNames,
          "brz-conditions-internal-popup",
          "brz-conditions-popup--static"
        ]
      },
      {
        mode: Mode.external_popup,
        expected: [
          ...popupBaseClassNames,
          "brz-conditions-external-popup",
          "brz-conditions-popup--static"
        ]
      }
    ])("adds embedded class when embedded is true ($mode)", ({ mode, expected }) => {
      expect(
        getRootClassNames({
          ...baseConfig,
          mode,
          ui: { popupSettings: { embedded: true } }
        })
      ).toEqual(expected);
    });

    it.each([Mode.internal_popup, Mode.external_popup])(
      "does not return space-joined class strings (%s)",
      (mode) => {
        const result = getRootClassNames({ ...baseConfig, mode });

        result.forEach((className) => {
          expect(className).not.toMatch(/\s/);
        });
      }
    );
  });

  it("does not return space-joined class strings", () => {
    const result = getRootClassNames(baseConfig);

    expect(result).toHaveLength(4);
    result.forEach((className) => {
      expect(className).not.toMatch(/\s/);
    });
  });
});
