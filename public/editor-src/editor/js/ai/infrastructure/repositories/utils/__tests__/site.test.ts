import type { MenuData } from "visual/global/Config/types/configs/ConfigCommon";
import type { GlobalBlockPosition } from "visual/types/GlobalBlock";
import { removeMenuData, topInsertIndex } from "../site";

const gb = (align: "top" | "bottom"): { position: GlobalBlockPosition } => ({
  position: { align, top: 0, bottom: 0 }
});

describe("removeMenuData", () => {
  const entry = (id: string): MenuData => ({ id, name: id, items: [] });

  it("removes the matching entry in place and reports it", () => {
    const config = { menuData: [entry("a"), entry("b")] };

    expect(removeMenuData(config, "a")).toBe(true);
    expect(config.menuData).toEqual([entry("b")]);
  });

  it("leaves the list alone when nothing matches", () => {
    const config = { menuData: [entry("a")] };

    expect(removeMenuData(config, "/menus/9")).toBe(false);
    expect(config.menuData).toHaveLength(1);
  });

  it("is a no-op when the config carries no menuData", () => {
    expect(removeMenuData({}, "a")).toBe(false);
  });
});

describe("topInsertIndex", () => {
  it("returns the count of leading top-aligned global blocks", () => {
    const blocksOrder = ["h1", "h2", "content", "footer"];
    const globalBlocks = {
      h1: gb("top"),
      h2: gb("top"),
      footer: gb("bottom")
    };

    expect(topInsertIndex(blocksOrder, globalBlocks)).toBe(2);
  });

  it("returns 0 when the first block is not a top global block", () => {
    const blocksOrder = ["content", "footer"];
    const globalBlocks = { footer: gb("bottom") };

    expect(topInsertIndex(blocksOrder, globalBlocks)).toBe(0);
  });

  it("returns 0 for an empty page", () => {
    expect(topInsertIndex([], {})).toBe(0);
  });

  it("stops at a leading bottom-aligned global block (never skips a footer)", () => {
    const blocksOrder = ["footer", "content"];
    const globalBlocks = { footer: gb("bottom") };

    expect(topInsertIndex(blocksOrder, globalBlocks)).toBe(0);
  });

  it("two successive top inserts: the second lands after the first", () => {
    // After call 1, the run's first header (gxfIT) leads blocksOrder and is a
    // live global block. The insert index for call 2's header must be 1, not 0,
    // so headers keep creation order: [gxfIT, gx0t5, ...].
    const blocksOrder = ["gxfIT", "bz111", "cA222"];
    const globalBlocks = { gxfIT: gb("top") };

    expect(topInsertIndex(blocksOrder, globalBlocks)).toBe(1);
  });

  it("counts a leading run header even after its position tag was recomputed away", () => {
    // Live-defect repro: gxfIT still leads blocksOrder and still has a
    // globalBlocks entry, but a publish/position recompute dropped its "top"
    // tag (align no longer "top"). Placement must not regress to index 0.
    const blocksOrder = ["gxfIT", "bz111", "cA222"];
    const globalBlocks = {
      gxfIT: { position: null } as { position: GlobalBlockPosition | null }
    };

    expect(topInsertIndex(blocksOrder, globalBlocks)).toBe(1);
  });

  it("stacks multiple leading run headers regardless of a lost position tag", () => {
    const blocksOrder = ["gxfIT", "gx0t5", "bz111", "cA222"];
    const globalBlocks = {
      gxfIT: { position: null } as { position: GlobalBlockPosition | null },
      gx0t5: { position: null } as { position: GlobalBlockPosition | null }
    };

    // A third header would land at index 2, after both existing headers.
    expect(topInsertIndex(blocksOrder, globalBlocks)).toBe(2);
  });
});
