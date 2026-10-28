import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxState } from "visual/redux/types";
import type { Block } from "visual/types/Block";
import { PageRepository } from "../page.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

/**
 * block-1 Section > si-1 SectionItem
 *   ├── row-1 Row > col-a Column > wrap-1 Wrapper > text-1 RichText
 *   │                            > wrap-2 Wrapper > img-1  Image
 *   └── tabs-1 Tabs > tab-1 Tab
 */
const buildBlocksData = () =>
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
                          width: 100,
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
                },
                {
                  type: "Tabs",
                  value: {
                    _id: "tabs-1",
                    items: [{ type: "Tab", value: { _id: "tab-1", items: [] } }]
                  }
                }
              ]
            }
          }
        ]
      }
    } as Block
  }) as Record<string, Block>;

const makeRepository = () => {
  const blocksData = buildBlocksData();
  const dispatch = jest.fn();
  const getState = () => ({ blocksData }) as unknown as ReduxState;

  return {
    repository: new PageRepository(getState, dispatch, {} as ConfigCommon),
    dispatch
  };
};

describe("PageRepository.addElement — the insert must actually land", () => {
  // changeValueAfterDND returns the block untouched when the items path cannot
  // be resolved, so the insert must be confirmed before dispatching.
  it.each([
    { case: "a RichText", containerId: "text-1" },
    { case: "an Image", containerId: "img-1" }
  ])("refuses to add into $case, and writes nothing", ({ containerId }) => {
    const { repository, dispatch } = makeRepository();

    const result = repository.addElement({
      containerId,
      elementType: "Button"
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("cannot contain child elements");
    expect(dispatch).not.toHaveBeenCalled();
  });

  // The check observes the outcome rather than classifying the type, so every
  // container that genuinely accepts an insert keeps working.
  it.each([
    { case: "a Column", containerId: "col-a" },
    { case: "a Row", containerId: "row-1" },
    { case: "a SectionItem", containerId: "si-1" },
    { case: "a Tab", containerId: "tab-1" },
    { case: "a Tabs", containerId: "tabs-1" }
  ])("still adds into $case", ({ containerId }) => {
    const { repository, dispatch } = makeRepository();

    const result = repository.addElement({
      containerId,
      elementType: "Button"
    });

    expect(result.success).toBe(true);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("writes a block whose container really gained a child", () => {
    const { repository, dispatch } = makeRepository();

    repository.addElement({ containerId: "col-a", elementType: "Button" });

    const written = dispatch.mock.calls[0][0].payload.data;
    const column = written.value.items[0].value.items[0].value.items[0].value;

    // col-a held two wrappers; the Button arrives as a third child
    expect(column._id).toBe("col-a");
    expect(column.items).toHaveLength(3);
  });
});
