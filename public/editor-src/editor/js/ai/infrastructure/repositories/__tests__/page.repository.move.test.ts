import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxState } from "visual/redux/types";
import type { Block } from "visual/types/Block";
import { PageRepository } from "../page.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

/**
 * block-1 Section
 * └── si-1 SectionItem
 *     └── row-1 Row
 *         ├── col-a Column
 *         │   ├── wrap-1 Wrapper → text-1 RichText
 *         │   └── row-inner Row → col-inner Column
 *         └── col-b Column
 */
const buildBlocksData = (): Record<string, Block> => ({
  "block-1": {
    type: "Section",
    value: {
      _id: "block-1",
      items: [
        {
          type: "SectionItem",
          value: {
            _id: "si-1",
            items: [
              {
                type: "Row",
                value: {
                  _id: "row-1",
                  items: [
                    {
                      type: "Column",
                      value: {
                        _id: "col-a",
                        items: [
                          {
                            type: "Wrapper",
                            value: {
                              _id: "wrap-1",
                              items: [
                                { type: "RichText", value: { _id: "text-1" } }
                              ]
                            }
                          },
                          {
                            type: "Row",
                            value: {
                              _id: "row-inner",
                              items: [
                                {
                                  type: "Column",
                                  value: { _id: "col-inner", items: [] }
                                }
                              ]
                            }
                          }
                        ]
                      }
                    },
                    {
                      type: "Column",
                      value: {
                        _id: "col-b",
                        items: [
                          {
                            type: "Wrapper",
                            value: {
                              _id: "wrap-2",
                              items: [
                                { type: "Image", value: { _id: "img-1" } }
                              ]
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  } as Block
});

const config = {} as ConfigCommon;

const makeRepository = () => {
  const dispatch = jest.fn();
  const blocksData = buildBlocksData();
  const getState = () => ({ blocksData }) as unknown as ReduxState;

  return {
    repository: new PageRepository(getState, dispatch, config),
    dispatch
  };
};

describe("PageRepository.moveElement — subtree containment", () => {
  it.each([
    { case: "the element itself", elementId: "row-1", target: "row-1" },
    { case: "a direct child", elementId: "row-1", target: "col-a" },
    {
      case: "a deeply nested descendant",
      elementId: "row-1",
      target: "col-inner"
    },
    { case: "a wrapper inside itself", elementId: "col-a", target: "wrap-1" },
    { case: "its own leaf", elementId: "wrap-1", target: "text-1" }
  ])(
    "refuses to move an element into $case, and writes nothing",
    ({ elementId, target }) => {
      const { repository, dispatch } = makeRepository();

      const result = repository.moveElement({
        elementId,
        targetContainerId: target
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("into itself or into one of its own");
      expect(dispatch).not.toHaveBeenCalled();
    }
  );

  // The element exists in the tree either way, so the oracle is parentage.
  it.each([
    { case: "an Image", elementId: "wrap-1", target: "img-1" },
    { case: "a RichText", elementId: "wrap-2", target: "text-1" }
  ])(
    "refuses a move onto $case, and writes nothing",
    ({ elementId, target }) => {
      const { repository, dispatch } = makeRepository();

      const result = repository.moveElement({
        elementId,
        targetContainerId: target
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("cannot contain child elements");
      expect(dispatch).not.toHaveBeenCalled();
    }
  );

  it("does not reject a move to a container outside the element", () => {
    const { repository } = makeRepository();

    const result = repository.moveElement({
      elementId: "wrap-1",
      targetContainerId: "col-b"
    });

    expect(result.error ?? "").not.toContain(
      "into itself or into one of its own"
    );
  });
});

describe("PageRepository.moveElement — result reporting", () => {
  // fromContainerId must be the source, not the corrected target.
  it.each([
    {
      case: "to a sibling column in the same row",
      elementId: "wrap-1",
      target: "col-b",
      from: "col-a"
    },
    {
      case: "to a column in a nested row",
      elementId: "wrap-2",
      target: "col-inner",
      from: "col-b"
    }
  ])(
    "reports the container it came from when moving $case",
    ({ elementId, target, from }) => {
      const { repository } = makeRepository();

      const result = repository.moveElement({
        elementId,
        targetContainerId: target
      });

      expect(result.success).toBe(true);
      expect(result.data?.fromContainerId).toBe(from);
      expect(result.data?.fromContainerId).not.toBe(result.data?.toContainerId);
    }
  );
});
