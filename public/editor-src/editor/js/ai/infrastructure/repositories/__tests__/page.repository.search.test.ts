import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxState } from "visual/redux/types";
import type { Block } from "visual/types/Block";
import type {
  BrizyToolResult,
  SearchElementsResult
} from "../../../entities/models";
import { PageRepository } from "../page.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

const blocksData = {
  "sec-1": {
    type: "Section",
    value: {
      _id: "sec-1",
      items: [
        { type: "Button", value: { _id: "btn-1", text: "Buy now" } },
        { type: "Image", value: { _id: "img-1" } },
        { type: "RichText", value: { _id: "rt-1", text: "Hello" } }
      ]
    }
  } as Block
} as Record<string, Block>;

const makeRepository = () => {
  const getState = () =>
    ({ blocksData, blocksOrder: ["sec-1"] }) as unknown as ReduxState;

  return new PageRepository(getState, jest.fn(), {} as ConfigCommon);
};

const ids = (result: BrizyToolResult<SearchElementsResult>): string[] =>
  result.success ? (result.data?.elements ?? []).map((e) => e.id) : [];

// An uncompilable pattern must be an error, not a silently dropped filter.
describe("PageRepository.searchElements — regex filters", () => {
  it.each([
    {
      case: "an uncompilable typeRegex",
      params: { typeRegex: "[" },
      name: "typeRegex"
    },
    {
      case: "an over-long typeRegex",
      params: { typeRegex: "a".repeat(327) },
      name: "typeRegex"
    },
    {
      case: "an uncompilable textRegex",
      params: { textRegex: "Buy(" },
      name: "textRegex"
    }
  ])("rejects $case instead of returning everything", ({ params, name }) => {
    const result = makeRepository().searchElements(params);

    expect(result.success).toBe(false);
    expect(result.error).toContain(name);
  });

  it.each([
    {
      case: "a valid typeRegex",
      params: { typeRegex: "^Button$" },
      expected: ["btn-1"]
    },
    {
      case: "a valid textRegex",
      params: { textRegex: "^Buy" },
      expected: ["btn-1"]
    },
    { case: "an exact type", params: { type: "Image" }, expected: ["img-1"] }
  ])("still filters with $case", ({ params, expected }) => {
    const result = makeRepository().searchElements(params);

    expect(result.success).toBe(true);
    expect(ids(result)).toEqual(expected);
  });

  it("returns everything only when no filter was asked for", () => {
    const result = makeRepository().searchElements({});

    expect(result.success).toBe(true);
    expect(ids(result)).toEqual(["sec-1", "btn-1", "img-1", "rt-1"]);
  });
});
