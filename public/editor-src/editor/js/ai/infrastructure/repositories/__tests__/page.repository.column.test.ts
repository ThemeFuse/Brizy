import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxState } from "visual/redux/types";
import type { Block } from "visual/types/Block";
import { PageRepository } from "../page.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

const column = (id: string, width: number) => ({
  type: "Column",
  value: { _id: id, width, items: [] }
});

const buildBlocksData = (columns: ReturnType<typeof column>[]) =>
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
              items: [{ type: "Row", value: { _id: "row-1", items: columns } }]
            }
          }
        ]
      }
    } as Block
  }) as Record<string, Block>;

const makeRepository = (columns: ReturnType<typeof column>[]) => {
  const blocksData = buildBlocksData(columns);
  const written: Block[] = [];
  const dispatch = jest.fn((action) => {
    if (action?.payload?.data) written.push(action.payload.data);
    return action;
  });
  const getState = () => ({ blocksData }) as unknown as ReduxState;

  return {
    repository: new PageRepository(getState, dispatch, {} as ConfigCommon),
    storedWidth: (id: string): number | undefined => {
      const block = written[written.length - 1];
      const cols =
        block?.value?.items?.[0]?.value?.items?.[0]?.value?.items ?? [];
      return cols.find((c: { value: { _id: string } }) => c.value._id === id)
        ?.value?.width;
    }
  };
};

const update = (repository: PageRepository, elementId: string, width: number) =>
  repository.updateColumn({
    elementId,
    elementType: "Column",
    changes: { width }
  });

describe("PageRepository.updateColumn width", () => {
  // A lone column has no siblings to take the remainder, so it always spans
  // the row: only 100% applies, and any other width fails instead of being
  // reported as changed.
  it.each([
    { case: "a negative width", width: -50, ok: false },
    { case: "zero", width: 0, ok: false },
    { case: "an over-100 width", width: 1000, ok: false },
    { case: "a plausible width", width: 50, ok: false },
    { case: "the full row width", width: 100, ok: true }
  ])("a single-column row accepts $case: $ok", ({ width, ok }) => {
    const { repository, storedWidth } = makeRepository([column("col-a", 100)]);

    const result = update(repository, "col-a", width);

    expect(result.success).toBe(ok);
    expect(storedWidth("col-a")).toBe(ok ? 100 : undefined);
  });

  it("tells the agent a lone column keeps the full width", () => {
    const { repository } = makeRepository([column("col-a", 100)]);

    const result = update(repository, "col-a", 50);

    expect(result).toEqual({
      success: false,
      error:
        "A single column always spans the full row, so its width stays 100% and 50% was not applied. Do not call it again: tell the user the width cannot change while the column is alone in its row."
    });
  });

  it.each([
    { case: "below the minimum", width: 1, ok: false },
    { case: "leaving a sibling below the minimum", width: 99, ok: false },
    { case: "within range", width: 60, ok: true }
  ])("a two-column row still validates $case", ({ width, ok }) => {
    const { repository, storedWidth } = makeRepository([
      column("col-a", 50),
      column("col-b", 50)
    ]);

    const result = update(repository, "col-a", width);

    expect(result.success).toBe(ok);

    if (ok) {
      expect(storedWidth("col-a")).toBe(width);
      expect(storedWidth("col-b")).toBe(100 - width);
    }
  });
});
