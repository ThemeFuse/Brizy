import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import { getModel, toElement } from "./utils";

describe("Testing 'getModel' function", function() {
  test("Return empty array if value is not an stringified array of literals", () => {
    const values = [undefined, "", "1,2,3", "[[1,2,3]]"];

    values.map(v => {
      const m: { [k: string]: MValue<Literal> } = { value: v };
      const get = (k: string): MValue<Literal> => m[k];

      expect(getModel(get)).toEqual([]);
    });
  });

  test.each([
    ["[1,2,3]", [1, 2, 3]],
    ['["1","2","3"]', ["1", "2", "3"]],
    ['["1",2,"3"]', ["1", 2, "3"]],
    ['["1","2","3",{}]', ["1", "2", "3"]]
  ])("%s to %s", (a, b) => {
    const m: { [k: string]: MValue<Literal> } = { value: a };
    const get = (k: string): MValue<Literal> => m[k];
    expect(getModel(get)).toEqual(b);
  });
});

describe("Testing 'toElement' function", function() {
  [
    [1, 2, 3],
    ["1", "2", "3"],
    [1, "2", 3]
  ].map(v => {
    test(`${v.toString()} to {value: ${JSON.stringify(v)}}`, () => {
      expect(toElement(v)).toEqual({ value: JSON.stringify(v) });
    });
  });
});
