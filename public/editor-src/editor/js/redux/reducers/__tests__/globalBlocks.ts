import {
  type ConfigCommon,
  Mode
} from "visual/global/Config/types/configs/ConfigCommon";
import { type ReduxState, StoreChanged } from "visual/redux/types";
import type { GlobalBlockNormal } from "visual/types/GlobalBlock";
import { BlockTypeRule } from "visual/types/Rule";
import { type ActionUpdatePageStatus, PUBLISH } from "../../actions2";
import { globalBlocks } from "../globalBlocks";

// Publishing the page publishes the global blocks it contains, so the block
// must be visible on the page: an "entire site" include rule is what
// canUseCondition needs to consider the block usable here.
const entireSiteRule = { type: BlockTypeRule.include };

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
  rules: [entireSiteRule],
  position: null,
  dataVersion: 2,
  dependencies: [],
  meta: { type: "normal", extraFontStyles: [] },
  ...overrides
});

const makeState = (overrides: Partial<ReduxState>): ReduxState => ({
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
  globalBlocks: {},
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
  },
  ...overrides
});

const config: ConfigCommon = {
  project: { id: "project-1" },
  container: { id: 1 },
  editorVersion: "1.0.0",
  mode: Mode.page,
  onUpdate: () => undefined,
  onCompile: () => undefined
};

const publishAction: ActionUpdatePageStatus = {
  type: PUBLISH,
  payload: {
    type: "internal",
    status: "publish",
    editorMode: Mode.page,
    config
  }
};

interface Case {
  case: string;
  status: GlobalBlockNormal["status"];
  inPage: boolean;
  expected: GlobalBlockNormal["status"];
}

const cases: Case[] = [
  {
    case: "publishes a draft block used in the page",
    status: "draft",
    inPage: true,
    expected: "publish"
  },
  {
    case: "keeps a published block used in the page published",
    status: "publish",
    inPage: true,
    expected: "publish"
  },
  {
    case: "leaves a scheduled block used in the page scheduled",
    status: "scheduled",
    inPage: true,
    expected: "scheduled"
  },
  {
    case: "leaves a draft block that is neither in the page nor changed",
    status: "draft",
    inPage: false,
    expected: "draft"
  }
];

describe("globalBlocks reducer - PUBLISH", () => {
  it.each(cases)("$case", ({ status, inPage, expected }) => {
    const id = "gb-1";
    const block = makeGlobalBlock({ uid: id, status });
    const state = makeState({
      globalBlocks: { [id]: block },
      blocksOrder: inPage ? [id] : [],
      blocksData: inPage ? { [id]: block.data } : {}
    });

    const result = globalBlocks(state.globalBlocks, publishAction, state);

    expect(result[id].status).toBe(expected);
  });
});
