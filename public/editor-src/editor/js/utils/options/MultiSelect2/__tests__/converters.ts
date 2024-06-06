import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { fromElementModel, toElementModel } from "../converters";

describe("Testing 'fromElementModel' function", function () {
  test("Return empty array if value is not an stringified array of literals", () => {
    const values = [undefined, "", "1,2,3", "[[1,2,3]]"];

    values.map((v) => {
      const m: { [k: string]: MValue<Literal> } = { value: v };
      const get = (k: string): MValue<Literal> => m[k];

      expect(fromElementModel(get)).toEqual({ value: [] });
    });
  });

  test.each([
    ["[1,2,3]", { value: [1, 2, 3] }],
    ['["1","2","3"]', { value: ["1", "2", "3"] }],
    ['["1",2,"3"]', { value: ["1", 2, "3"] }],
    ['["1","2","3",{}]', { value: ["1", "2", "3"] }]
  ])("%s to %s", (a, b) => {
    const m: { [k: string]: MValue<Literal> } = { value: a };
    const get = (k: string): MValue<Literal> => m[k];
    expect(fromElementModel(get)).toEqual(b);
  });
});

describe("Testing 'toElementModel' function", () => {
  test("Should stringify the array value", () => {
    expect(toElementModel({ value: [1, 2, 3] })).toStrictEqual({
      value: "[1,2,3]"
    });
  });
});
