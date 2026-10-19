import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxState } from "visual/redux/types";
import type { Block } from "visual/types/Block";
import { PageRepository } from "../page.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

const column = (id: string) => ({
  type: "Column",
  value: { _id: id, width: 100, items: [] }
});

/** row-1 holds `count` columns; row-2 always holds one, as a move source. */
const buildBlocksData = (count: number) =>
  ({
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
                    items: Array.from({ length: count }, (_, i) =>
                      column(`col-${i}`)
                    )
                  }
                },
                {
                  type: "Row",
                  value: { _id: "row-2", items: [column("col-other")] }
                }
              ]
            }
          }
        ]
      }
    } as Block
  }) as Record<string, Block>;

const makeRepository = (count: number) => {
  const blocksData = buildBlocksData(count);
  const dispatch = jest.fn();
  const getState = () => ({ blocksData }) as unknown as ReduxState;

  return {
    repository: new PageRepository(getState, dispatch, {} as ConfigCommon),
    dispatch
  };
};

// All three insertion paths must answer the same question the same way.
const paths = {
  add: (repository: PageRepository) =>
    repository.addElement({ containerId: "row-1", elementType: "Column" }),
  move: (repository: PageRepository) =>
    repository.moveElement({
      elementId: "col-other",
      targetContainerId: "row-1"
    }),
  duplicate: (repository: PageRepository) =>
    repository.duplicateElement({ elementId: "col-0" })
};

describe("insertion paths agree on container restrictions", () => {
  it.each(["add", "move", "duplicate"] as const)(
    "%s refuses a 7th column in a Row capped at 6",
    (path) => {
      const { repository, dispatch } = makeRepository(6);

      const result = paths[path](repository);

      expect(result.success).toBe(false);
      expect(result.error).toContain("maximum 6 children");
      expect(dispatch).not.toHaveBeenCalled();
    }
  );

  it.each(["add", "move", "duplicate"] as const)(
    "%s allows a column when the Row has room",
    (path) => {
      const { repository } = makeRepository(3);

      expect(paths[path](repository).success).toBe(true);
    }
  );
});

// Column > Wrapper > element is the standard shape for Text, Image, Button,
// Icon, Menu and Video, and the whole Wrapper is cloned into the grandparent.
describe("duplicateElement of a wrapped leaf", () => {
  const wrapped = (leafType: string, leafId: string) =>
    ({
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
                                    { type: leafType, value: { _id: leafId } }
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
    }) as Record<string, Block>;

  const repositoryFor = (leafType: string, leafId: string) => {
    const blocksData = wrapped(leafType, leafId);
    const getState = () => ({ blocksData }) as unknown as ReduxState;

    return new PageRepository(getState, jest.fn(), {} as ConfigCommon);
  };

  it.each([
    { case: "a RichText", leafType: "RichText", leafId: "text-1" },
    { case: "an Image", leafType: "Image", leafId: "img-1" },
    // Button and Icon are in Wrapper's `forbidden` list.
    { case: "a Button", leafType: "Button", leafId: "btn-1" },
    { case: "an Icon", leafType: "Icon", leafId: "icon-1" }
  ])("duplicates $case inside a Wrapper", ({ leafType, leafId }) => {
    const result = repositoryFor(leafType, leafId).duplicateElement({
      elementId: leafId
    });

    expect(result.success).toBe(true);
  });

  it("duplicates the Wrapper itself when addressed directly", () => {
    const result = repositoryFor("RichText", "text-1").duplicateElement({
      elementId: "wrap-1"
    });

    expect(result.success).toBe(true);
  });
});
