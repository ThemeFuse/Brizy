import { OUTSET, toType, types } from "./type";

describe("Testing 'toType' function", function() {
  test("Return value if it is a valid type", () => {
    types.map(t => expect(toType({}, t)).toBe(t));
  });

  test("Return orElse if value is not valid type", () => {
    const orElse = {};
    [undefined, null, 1, "test", []].map(t =>
      expect(toType(orElse, t)).toBe(orElse)
    );
  });
});
