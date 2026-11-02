import {
  GlobalBlock,
  GlobalBlockNormal,
  GlobalBlockOverlay,
  GlobalBlockPopup
} from "../GlobalBlock";
import { isGlobalBlock, isGlobalOverlay, isGlobalPopup } from "../utils";

const base = {
  uid: "gb-1",
  data: { type: "Section", blockId: "Section", value: {} },
  status: "publish" as const,
  rules: [],
  position: null,
  dataVersion: 1,
  dependencies: []
};

const normalBlock: GlobalBlockNormal = {
  ...base,
  meta: { type: "normal", extraFontStyles: [] }
};

const popupBlock: GlobalBlockPopup = {
  ...base,
  meta: { type: "popup", extraFontStyles: [] }
};

const overlayBlock: GlobalBlockOverlay = {
  ...base,
  meta: { type: "overlay", subtype: "cookieBanner", extraFontStyles: [] }
};

describe("isGlobalOverlay", () => {
  test("returns true for an overlay block", () => {
    expect(isGlobalOverlay(overlayBlock)).toBe(true);
  });

  test.each<GlobalBlock>([normalBlock, popupBlock])(
    "returns false for non-overlay blocks",
    (block) => {
      expect(isGlobalOverlay(block)).toBe(false);
    }
  );
});

describe("isGlobalBlock", () => {
  test("returns true for a normal block", () => {
    expect(isGlobalBlock(normalBlock)).toBe(true);
  });

  test.each<GlobalBlock>([popupBlock, overlayBlock])(
    "returns false for non-normal blocks",
    (block) => {
      expect(isGlobalBlock(block)).toBe(false);
    }
  );
});

test("isGlobalPopup still returns false for an overlay block", () => {
  expect(isGlobalPopup(overlayBlock)).toBe(false);
});
