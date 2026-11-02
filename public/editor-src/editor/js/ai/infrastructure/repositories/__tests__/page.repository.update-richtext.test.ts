import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxState } from "visual/redux/types";
import type { Block } from "visual/types/Block";
import { PageRepository } from "../page.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

const makeRepository = (text: string) => {
  const blocksData = {
    "block-1": {
      type: "Section",
      value: {
        _id: "block-1",
        items: [{ type: "RichText", value: { _id: "rt-1", text } }]
      }
    } as Block
  } as Record<string, Block>;
  const dispatch = jest.fn();
  const getState = () =>
    ({ blocksData, currentStyle: { fontStyles: [] } }) as unknown as ReduxState;

  return {
    repository: new PageRepository(getState, dispatch, {} as ConfigCommon),
    dispatch
  };
};

// The agent reads success as "the text changed". A find that matches nothing
// used to succeed, so the agent told the user a replacement had happened.
describe("PageRepository.updateRichText — findText", () => {
  it.each([
    {
      case: "text that is present",
      text: "<p>The cat sat</p>",
      findText: "cat",
      success: true,
      dispatches: 1
    },
    {
      case: "text that is absent",
      text: "<p>The dog sat</p>",
      findText: "cat",
      success: false,
      dispatches: 0
    },
    {
      case: "an empty element",
      text: "",
      findText: "cat",
      success: false,
      dispatches: 0
    },
    {
      case: "an omitted findText, which replaces all text",
      text: "",
      findText: undefined,
      success: true,
      dispatches: 1
    }
  ])(
    "$case: success is $success",
    ({ text, findText, success, dispatches }) => {
      const { repository, dispatch } = makeRepository(text);

      const result = repository.updateRichText({
        elementId: "rt-1",
        findText,
        replaceWith: "dog"
      });

      expect(result.success).toBe(success);
      expect(dispatch).toHaveBeenCalledTimes(dispatches);
    }
  );

  it("names the missing text so the agent can tell the user", () => {
    const { repository } = makeRepository("<p>The dog sat</p>");

    const result = repository.updateRichText({
      elementId: "rt-1",
      findText: "cat",
      replaceWith: "dog"
    });

    expect(result).toEqual({
      success: false,
      error:
        'Text "cat" was not found in element "rt-1"; nothing was changed. Do not call it again and do not replace the whole text instead: tell the user the text is not there.'
    });
  });
});
