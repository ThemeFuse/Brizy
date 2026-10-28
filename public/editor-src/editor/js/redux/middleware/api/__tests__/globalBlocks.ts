import { prepareHTML } from "visual/bootstraps/compiler/common/utils/prepareHTML";
import type { APIGlobalBlocks } from "visual/global/Config/types/configs/blocks/GlobalBlocks";
import {
  type ConfigCommon,
  Mode
} from "visual/global/Config/types/configs/ConfigCommon";
import type { GetConfig } from "visual/providers/ConfigProvider/types";
import { createStore } from "visual/redux/store";
import { type ReduxState, StoreChanged } from "visual/redux/types";
import type { GlobalBlockNormal } from "visual/types/GlobalBlock";
import type { Rule } from "visual/types/Rule";
import type { ApiRule } from "visual/utils/api/adapter";
import type { ActionUpdateGBRules } from "../../../actions2";
import { handleGlobalBlocks } from "../globalBlocks";
import type { Data } from "../types";

// The rules-only save must never compile HTML. Stubbing the compiler keeps the
// import light AND lets us assert it is never invoked in this path.
jest.mock("visual/bootstraps/compiler/common/utils/prepareHTML", () => ({
  prepareHTML: jest.fn()
}));

type UpdateRules = NonNullable<APIGlobalBlocks["updateRules"]>;

interface Case {
  case: string;
  id: string;
  handler: UpdateRules;
  expectedHandlerCalls: unknown[][];
  expectedSuccessCalls: unknown[][];
  expectedFailCalls: unknown[][];
}

// A real "specific page" CollectionItemRule as produced by the editor.
const collectionItemRuleFixture: Rule = {
  type: 1,
  appliedFor: 1,
  entityType: "/collection_types/119534",
  mode: "specific",
  entityValues: ["/collection_items/219755"]
};

// The real wire ApiRule expected on Cloud (mode preserved).
const expectedApiRule: ApiRule = {
  type: 1,
  appliedFor: 1,
  entityType: "/collection_types/119534",
  entityValues: ["/collection_items/219755"],
  mode: "specific"
};

const makeGlobalBlock = (
  overrides: Partial<GlobalBlockNormal>
): GlobalBlockNormal => ({
  uid: "gb-1",
  data: {
    type: "Section",
    value: { _id: "gb-1", items: [] },
    blockId: "block-1"
  },
  status: "draft",
  rules: [collectionItemRuleFixture],
  position: null,
  dataVersion: 2,
  dependencies: [],
  meta: { type: "normal", extraFontStyles: [] },
  ...overrides
});

const makeState = (globalBlocks: ReduxState["globalBlocks"]): ReduxState => ({
  project: {
    id: "project-1",
    dataVersion: 1,
    data: {
      selectedKit: "",
      selectedStyle: "",
      styles: [],
      extraStyles: [],
      extraFontStyles: [],
      font: "",
      fonts: {},
      disabledElements: [],
      pinnedElements: []
    }
  },
  page: {
    id: "page-1",
    data: { items: [] },
    dataVersion: 1,
    status: "publish",
    dependencies: []
  },
  menuData: [],
  symbols: { element: undefined, classes: [] },
  symbolsCSS: {},
  globalBlocks,
  changedGBIds: [],
  blocksOrder: [],
  blocksData: {},
  blocksHtml: {
    storeGeneration: 0,
    compiledGeneration: 0,
    blocks: {},
    initialized: false
  },
  fonts: {},
  ui: {
    deviceMode: "desktop",
    activeElement: null,
    activeElementMeta: null,
    leftSidebar: { drawerContentType: null },
    rightSidebar: {
      type: "options",
      isOpen: false,
      lock: undefined,
      alignment: "left",
      activeTab: undefined,
      expanded: false
    },
    showHiddenElements: false,
    currentRole: "admin",
    currentLanguage: "en",
    currentOverlay: "none"
  },
  styles: [],
  extraStyles: [],
  extraFontStyles: [],
  authorized: "connected",
  syncAllowed: true,
  copiedElement: { path: [], value: { items: [] } },
  storeWasChanged: StoreChanged.unchanged,
  error: null,
  currentStyleId: "",
  currentStyle: { id: "", title: "", fontStyles: [], colorPalette: [] },
  screenshots: { _published: {} },
  history: {
    currSnapshot: null,
    prevSnapshot: null,
    canUndo: false,
    canRedo: false
  }
});

const makeConfig = (updateRules: UpdateRules): ConfigCommon => ({
  project: { id: "project-1" },
  container: { id: 1 },
  editorVersion: "1.0.0",
  mode: Mode.page,
  onUpdate: () => undefined,
  onCompile: () => undefined,
  api: { globalBlocks: { updateRules } }
});

const makeAction = (
  id: string,
  meta: ActionUpdateGBRules["meta"]
): ActionUpdateGBRules => ({
  type: "UPDATE_GB_RULES",
  payload: { id, rules: [collectionItemRuleFixture] },
  meta
});

const invoke = (
  action: ActionUpdateGBRules,
  config: ConfigCommon,
  state: ReduxState
): void => {
  const getConfig: GetConfig = () => config;
  const data: Data = {
    action,
    state,
    store: createStore(),
    oldState: state,
    getConfig,
    apiHandler: () => undefined,
    editorMode: Mode.page
  };

  handleGlobalBlocks(data);
};

// Flush microtasks + one macrotask so the .then/.catch on updateGBRules runs.
const tick = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 0));

// isCloud(config) reads the global TARGET, so force a Cloud target to exercise
// the Cloud editor->wire conversion (which keeps `mode`).
const setTarget = (target: typeof TARGET): void => {
  Object.defineProperty(globalThis, "TARGET", {
    value: target,
    configurable: true,
    writable: true
  });
};

const currentTarget = TARGET;

describe("handleGlobalBlocks - UPDATE_GB_RULES", () => {
  beforeAll(() => {
    setTarget("Cloud");
  });

  afterAll(() => {
    setTarget(currentTarget);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const cases: Case[] = [
    {
      case: "saves only the rules via updateRules and calls syncSuccess",
      id: "gb-1",
      handler: (res) => res({ success: true }),
      expectedHandlerCalls: [
        [
          expect.any(Function),
          expect.any(Function),
          {
            uid: "gb-1",
            rules: [expectedApiRule],
            dataVersion: 2,
            status: "draft"
          }
        ]
      ],
      expectedSuccessCalls: [[]],
      expectedFailCalls: []
    },
    {
      case: "carries the handler's rejection reason to syncFail",
      id: "gb-1",
      handler: (_res, rej) => rej("boom"),
      expectedHandlerCalls: [
        [
          expect.any(Function),
          expect.any(Function),
          {
            uid: "gb-1",
            rules: [expectedApiRule],
            dataVersion: 2,
            status: "draft"
          }
        ]
      ],
      expectedSuccessCalls: [],
      expectedFailCalls: [[{ message: "boom" }]]
    },
    {
      case: "calls syncFail without reaching the handler on an unknown id",
      id: "gb-unknown",
      handler: (res) => res({ success: true }),
      expectedHandlerCalls: [],
      expectedSuccessCalls: [],
      expectedFailCalls: [[{ message: undefined }]]
    }
  ];

  it.each(cases)(
    "$case",
    async ({
      id,
      handler,
      expectedHandlerCalls,
      expectedSuccessCalls,
      expectedFailCalls
    }) => {
      const updateRules = jest.fn(handler);
      const syncSuccess = jest.fn();
      const syncFail = jest.fn();

      invoke(
        makeAction(id, { syncSuccess, syncFail }),
        makeConfig(updateRules),
        makeState({ "gb-1": makeGlobalBlock({}) })
      );

      await tick();

      expect(updateRules.mock.calls).toStrictEqual(expectedHandlerCalls);
      expect(syncSuccess.mock.calls).toStrictEqual(expectedSuccessCalls);
      expect(syncFail.mock.calls).toStrictEqual(expectedFailCalls);

      // Rules-only save must not recompile the block.
      expect(prepareHTML).not.toHaveBeenCalled();
    }
  );
});
