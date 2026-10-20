import type { APIGlobalBlocks } from "visual/global/Config/types/configs/blocks/GlobalBlocks";
import {
  type ConfigCommon,
  Mode
} from "visual/global/Config/types/configs/ConfigCommon";
import type { Rule } from "visual/types/Rule";
import { updateGBRules } from "visual/utils/api";
import type { ApiRule } from "visual/utils/api/adapter";
import { t } from "visual/utils/i18n";

// updateGBRules never compiles HTML, but importing the api barrel pulls in the
// HTML compiler transitively. Stub it so the test stays light and focused.
jest.mock("visual/bootstraps/compiler/common/utils/prepareHTML", () => ({
  prepareHTML: jest.fn()
}));

type UpdateRules = NonNullable<APIGlobalBlocks["updateRules"]>;

// A real "specific page" CollectionItemRule as produced by the editor.
const collectionItemRuleFixture: Rule = {
  type: 1,
  appliedFor: 1,
  entityType: "/collection_types/119534",
  mode: "specific",
  entityValues: ["/collection_items/219755"]
};

// The real wire ApiRule the editor->wire adapter must produce on Cloud
// (`mode` is preserved because isCloud(config) is true).
const expectedApiRule: ApiRule = {
  type: 1,
  appliedFor: 1,
  entityType: "/collection_types/119534",
  entityValues: ["/collection_items/219755"],
  mode: "specific"
};

const makeConfig = (globalBlocks: APIGlobalBlocks): ConfigCommon => ({
  project: { id: "project-1" },
  container: { id: 1 },
  editorVersion: "1.0.0",
  mode: Mode.page,
  onUpdate: () => undefined,
  onCompile: () => undefined,
  api: { globalBlocks }
});

const setTarget = (target: typeof TARGET): void => {
  Object.defineProperty(globalThis, "TARGET", {
    value: target,
    configurable: true,
    writable: true
  });
};

const currentTarget = TARGET;

describe("updateGBRules", () => {
  // isCloud(config) reads the global TARGET, so force a Cloud target to
  // exercise the Cloud editor->wire conversion (which keeps `mode`).
  beforeAll(() => {
    setTarget("Cloud");
  });

  afterAll(() => {
    setTarget(currentTarget);
  });

  it("converts editor rules to wire ApiRules and calls updateRules with the right payload", async () => {
    const updateRules = jest.fn(((res) =>
      res({ success: true })) satisfies UpdateRules);

    await updateGBRules(
      "uid-1",
      [collectionItemRuleFixture],
      3,
      makeConfig({ updateRules })
    );

    expect(updateRules.mock.calls).toStrictEqual([
      [
        expect.any(Function),
        expect.any(Function),
        { uid: "uid-1", rules: [expectedApiRule], dataVersion: 3 }
      ]
    ]);
  });

  it("rejects when no globalBlocks.updateRules handler is configured", async () => {
    await expect(
      updateGBRules("uid-1", [collectionItemRuleFixture], 3, makeConfig({}))
    ).rejects.toBe(t("API: No globalBlocks updateRules found."));
  });
});
