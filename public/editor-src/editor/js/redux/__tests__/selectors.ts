import { noop } from "es-toolkit";
import type { Asset } from "visual/bootstraps/compiler/common/transforms/assets";
import {
  ConfigCommon,
  Mode
} from "visual/global/Config/types/configs/ConfigCommon";
import { updateGlobalBlock } from "visual/redux/actions2";
import { blocksData } from "visual/redux/reducers/blocksData";
import {
  currentOverlayGlobalBlockSelector,
  globalBlocksHTMLInPageSelector,
  globalBlocksIdsInPageWithPopupsWithOverlaysSelector,
  overlayGlobalBlocksAssembledSelector
} from "visual/redux/selectors";
import { ReduxState, StoreChanged } from "visual/redux/types";
import type { BlockHtml } from "visual/types/Block";
import { GlobalBlockOverlay, GlobalBlockPopup } from "visual/types/GlobalBlock";

// Overlay-type global blocks (e.g. Cookie Banner) are, like popups,
// never part of blocksOrder. These tests cover the two legs that keep the
// save/publish path from deadlocking:
//  1. overlay edits must be observable by the runtime compiler
//     (overlayGlobalBlocksAssembledSelector, condition-unfiltered).
//  2. once compiled, the overlay's HTML must be reachable for publish
//     (globalBlocksIdsInPageWithPopupsWithOverlaysSelector / globalBlocksHTMLInPageSelector).

const config: ConfigCommon = {
  project: { id: "" },
  container: { id: 1 },
  editorVersion: "1",
  mode: Mode.page,
  onUpdate: noop,
  onCompile: noop
};

const overlayGB: GlobalBlockOverlay = {
  uid: "overlay-uid",
  title: "Cookie Banner",
  status: "publish",
  position: null,
  dependencies: [],
  rules: [],
  dataVersion: 1,
  meta: { type: "overlay", subtype: "cookieBanner", extraFontStyles: [] },
  data: {
    type: "CookieBanner",
    blockId: "CookieBanner",
    value: { _id: "overlay-uid", items: [], color: "#000000" }
  }
};

const popupGB: GlobalBlockPopup = {
  uid: "popup-uid",
  title: "Newsletter Popup",
  status: "publish",
  position: null,
  dependencies: [],
  rules: [],
  dataVersion: 1,
  meta: { type: "popup", extraFontStyles: [] },
  data: {
    type: "SectionPopup",
    blockId: "SectionPopup",
    value: { _id: "popup-uid", items: [] }
  }
};

// A normal page block that references the global popup, the same way
// getModelPopups discovers popups embedded in the page tree.
const pageBlock = {
  type: "Section",
  blockId: "Section",
  value: {
    _id: "page-block-uid",
    items: [
      {
        type: "GlobalBlock",
        blockId: "GlobalBlock",
        value: { _id: "popup-uid" }
      }
    ]
  }
};

const baseState: ReduxState = {
  project: {
    id: "project",
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
    id: "p1",
    status: "draft",
    data: { items: [] },
    dataVersion: 1,
    dependencies: []
  },
  menuData: [],
  symbols: { element: undefined, classes: [] },
  symbolsCSS: {},
  globalBlocks: {
    "overlay-uid": overlayGB,
    "popup-uid": popupGB
  },
  changedGBIds: [],
  blocksOrder: ["page-block-uid"],
  blocksData: {
    "page-block-uid": pageBlock,
    "overlay-uid": overlayGB.data,
    "popup-uid": popupGB.data
  },
  blocksHtml: {
    storeGeneration: 0,
    compiledGeneration: 0,
    initialized: true,
    blocks: {}
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
      alignment: "right",
      activeTab: undefined,
      expanded: false
    },
    showHiddenElements: false,
    currentRole: "admin",
    currentLanguage: "default",
    currentOverlay: "none"
  },
  styles: [],
  extraStyles: [],
  extraFontStyles: [],
  authorized: "disconnect",
  syncAllowed: false,
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
};

describe("overlayGlobalBlocksAssembledSelector", () => {
  it("returns the overlay-type global block regardless of blocksOrder/page rules", () => {
    const overlays = overlayGlobalBlocksAssembledSelector(baseState);

    expect(overlays.map((o) => o.uid)).toEqual(["overlay-uid"]);
  });

  it("does not include normal or popup global blocks", () => {
    const overlays = overlayGlobalBlocksAssembledSelector(baseState);

    expect(overlays.some((o) => o.uid === "popup-uid")).toBe(false);
  });

  it("reflects a value change made via UPDATE_GLOBAL_BLOCK, the same input Runtime diffs in shouldComponentUpdate", () => {
    const before = overlayGlobalBlocksAssembledSelector(baseState).map(
      (o) => o.data
    );

    const updatedData = {
      ...overlayGB.data,
      value: { ...overlayGB.data.value, color: "#ff0000" }
    };

    const nextBlocksData = blocksData(
      baseState.blocksData,
      updateGlobalBlock({ uid: "overlay-uid", data: updatedData, config }),
      baseState
    );

    const nextState: ReduxState = {
      ...baseState,
      blocksData: nextBlocksData
    };

    const after = overlayGlobalBlocksAssembledSelector(nextState).map(
      (o) => o.data
    );

    expect(after).not.toEqual(before);
    expect(after[0].value.color).toBe("#ff0000");
  });
});

describe("globalBlocksIdsInPageWithPopupsWithOverlaysSelector", () => {
  it("includes the overlay uid even though it is never part of blocksOrder", () => {
    const ids = globalBlocksIdsInPageWithPopupsWithOverlaysSelector(
      baseState,
      config
    );

    expect(ids).toContain("overlay-uid");
  });

  it("still includes referenced popup uids (no regression)", () => {
    const ids = globalBlocksIdsInPageWithPopupsWithOverlaysSelector(
      baseState,
      config
    );

    expect(ids).toContain("popup-uid");
  });
});

const emptyAsset: Asset = {
  name: "main",
  score: 0,
  pro: false,
  content: { type: "inline", content: "", attr: {} }
};

const compiledHtml = (html: string): BlockHtml => ({
  html,
  assets: {
    freeStyles: {
      main: emptyAsset,
      generic: [],
      libsMap: [],
      libsSelectors: [],
      pageFonts: [],
      pageStyles: []
    },
    freeScripts: {
      main: emptyAsset,
      version: "",
      generic: [],
      libsMap: [],
      libsSelectors: []
    }
  }
});

describe("globalBlocksHTMLInPageSelector", () => {
  it("surfaces the overlay's compiled HTML when present in blocksHtml.blocks", () => {
    const overlayHtml = compiledHtml("<div>cookie banner</div>");
    const popupHtml = compiledHtml("<div>popup</div>");
    const stateWithHtml: ReduxState = {
      ...baseState,
      blocksHtml: {
        ...baseState.blocksHtml,
        blocks: {
          "overlay-uid": overlayHtml,
          "popup-uid": popupHtml
        }
      }
    };

    const htmls = globalBlocksHTMLInPageSelector(stateWithHtml, config);

    expect(htmls["overlay-uid"]).toEqual(overlayHtml);
    // regression: popup HTML is still reachable alongside the overlay's
    expect(htmls["popup-uid"]).toEqual(popupHtml);
  });

  it("is undefined for an overlay that has not been compiled yet", () => {
    const htmls = globalBlocksHTMLInPageSelector(baseState, config);

    expect(htmls["overlay-uid"]).toBeUndefined();
  });
});

// currentOverlayGlobalBlockSelector resolves ui.currentOverlay (a uid, or
// "none") against the condition-filtered overlays, so the component no longer
// has to find the object itself.
const allowedOverlayGB: GlobalBlockOverlay = {
  ...overlayGB,
  // an "all" rule with type 1 (include) is what makes the overlay usable here
  rules: [{ type: 1 }]
};

const stateWithOverlay = (
  overlay: GlobalBlockOverlay,
  currentOverlay: string
): ReduxState => ({
  ...baseState,
  globalBlocks: { ...baseState.globalBlocks, "overlay-uid": overlay },
  ui: { ...baseState.ui, currentOverlay }
});

describe("currentOverlayGlobalBlockSelector", () => {
  it.each([
    {
      case: "the selected uid matches an allowed overlay",
      overlay: allowedOverlayGB,
      currentOverlay: "overlay-uid",
      out: "overlay-uid"
    },
    {
      case: 'no overlay is selected ("none")',
      overlay: allowedOverlayGB,
      currentOverlay: "none",
      out: undefined
    },
    {
      case: "the selected overlay is not allowed on this page",
      overlay: overlayGB,
      currentOverlay: "overlay-uid",
      out: undefined
    }
  ])("returns $out when $case", ({ overlay, currentOverlay, out }) => {
    const result = currentOverlayGlobalBlockSelector(
      stateWithOverlay(overlay, currentOverlay),
      config
    );

    expect(result?.uid).toBe(out);
  });
});
