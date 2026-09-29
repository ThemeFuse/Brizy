import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxState } from "visual/redux/types";
import type { Block } from "visual/types/Block";
import { PageRepository } from "../page.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

const sectionItem = (id: string) => ({
  type: "SectionItem",
  value: { _id: id, items: [] }
});

const columnItem = (id: string) => ({
  type: "Column",
  value: { _id: id, width: 100, items: [] }
});

const buildBlocksData = (
  blockType: string,
  itemType: "SectionItem" | "Column",
  ids: string[]
) => {
  const items = ids.map((id) =>
    itemType === "SectionItem" ? sectionItem(id) : columnItem(id)
  );

  return {
    "block-1":
      blockType === "Row"
        ? ({
            type: "Section",
            value: {
              _id: "block-1",
              items: [
                {
                  type: "SectionItem",
                  value: {
                    _id: "si-1",
                    items: [{ type: "Row", value: { _id: "row-1", items } }]
                  }
                }
              ]
            }
          } as Block)
        : ({
            type: blockType,
            value: { _id: "block-1", items }
          } as Block)
  } as Record<string, Block>;
};

const makeRepository = (
  blockType: string,
  itemType: "SectionItem" | "Column",
  ids: string[]
) => {
  const blocksData = buildBlocksData(blockType, itemType, ids);
  const dispatch = jest.fn();
  const getState = () => ({ blocksData }) as unknown as ReduxState;

  return {
    repository: new PageRepository(getState, dispatch, {} as ConfigCommon),
    dispatch
  };
};

// Emptying these bricks the block: CONTAINER_REDIRECTS resolves to items[0],
// so every later add is refused, including the one that would repair it.
describe("PageRepository.removeElement — last child of a structural container", () => {
  it.each([
    {
      case: "a Section",
      blockType: "Section",
      itemType: "SectionItem" as const
    },
    {
      case: "a SectionHeader",
      blockType: "SectionHeader",
      itemType: "SectionItem" as const
    },
    { case: "a Row", blockType: "Row", itemType: "Column" as const }
  ])("refuses to remove the only child of $case", ({ blockType, itemType }) => {
    const { repository, dispatch } = makeRepository(blockType, itemType, [
      "only-1"
    ]);

    const result = repository.removeElement({ elementId: "only-1" });

    expect(result.success).toBe(false);
    expect(result.error).toContain("must have at least 1 child");
    expect(dispatch).not.toHaveBeenCalled();
  });

  it.each([
    {
      case: "a Section",
      blockType: "Section",
      itemType: "SectionItem" as const
    },
    { case: "a Row", blockType: "Row", itemType: "Column" as const }
  ])(
    "still removes one of two children of $case",
    ({ blockType, itemType }) => {
      const { repository, dispatch } = makeRepository(blockType, itemType, [
        "first-1",
        "second-1"
      ]);

      const result = repository.removeElement({ elementId: "first-1" });

      expect(result.success).toBe(true);
      expect(dispatch).toHaveBeenCalledTimes(1);
    }
  );

  it("points the caller at removeBlock for a block-level container", () => {
    const { repository } = makeRepository("Section", "SectionItem", ["only-1"]);

    const result = repository.removeElement({ elementId: "only-1" });

    expect(result.error).toContain("removeBlock");
  });
});
