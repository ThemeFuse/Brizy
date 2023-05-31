import { read } from "../number";

describe("Testing read fn", function () {
  test.each([-1, 0, 1, -1.1, 0.1, 1.1, "-1", "0", "1", "-1.1", "0.1", "1.1"])(
    "read(%s) should not return undefined",
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
