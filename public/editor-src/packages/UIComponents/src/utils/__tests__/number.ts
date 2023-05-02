import { read } from "../number";

describe("Testing NumberSpec Type implementation", function () {
  test.each([-1, 0, 1, -1.1, 0.1, 1.1, "-1", "0", "1", "-1.1", "0.1", "1.1"])(
    "Returned value should not return undefined",
    (v) => {
      expect(read(v)).not.toBe(undefined);
    }
  );

  test.each([undefined, null, "", "a", "1a", "a1", {}, []])(
    "read(%s) should return undefined",
    (v) => {
      expect(read(v)).toBe(undefined);
    }
  );
});
