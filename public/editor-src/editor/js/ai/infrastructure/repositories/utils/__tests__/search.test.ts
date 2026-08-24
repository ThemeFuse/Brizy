import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { Block } from "visual/types/Block";
import type { InternalSearchResult } from "../search";
import { collectElements, toSearchResults } from "../search";

// A Form2Field's searchable text is its stored value merged with the
// component's default content — 17 identical strings on every field. The
// display text must not be that blob.
jest.mock("visual/utils/traverse/common", () => ({
  getComponentDefaultValue: (type: string) =>
    type === "Form2Field"
      ? {
          content: {
            fileText: "Choose File",
            fileTypeErrorMessage: "File Type Not Accepted",
            userAgreementLabel: "I agree to the terms and conditions"
          }
        }
      : undefined
}));

const block = {
  type: ElementTypes.Form2Fields,
  value: {
    _id: "fields-1",
    items: [
      {
        type: ElementTypes.Form2Field,
        value: { _id: "f1", type: "Email", label: "Email Address" }
      }
    ]
  }
} as unknown as Block;

describe("collectElements display text", () => {
  it("uses a field's label instead of its merged searchable text", () => {
    const candidates: InternalSearchResult[] = [];
    collectElements(block, ["block-1"], { type: "Form2Field" }, candidates);

    const [result] = toSearchResults(candidates, 20);

    expect(result.id).toBe("f1");
    expect(result.text).toBe("Email Address");
  });

  it("still matches textRegex against the full searchable text", () => {
    const candidates: InternalSearchResult[] = [];
    collectElements(
      block,
      ["block-1"],
      { type: "Form2Field", textRegex: "Choose File" },
      candidates
    );

    expect(candidates).toHaveLength(1);
  });
});
