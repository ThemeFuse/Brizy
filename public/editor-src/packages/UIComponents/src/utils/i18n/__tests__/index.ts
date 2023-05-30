import { translate } from "../translate";

describe("Testing 'translate' function", function () {
  test("Should return key if it's not in the dictionary", () => {
    expect(translate({}, "key")).toBe("key");
  });

  test("Should return translation if key is present in the dictionary", () => {
    expect(translate({ key: "cheie" }, "key")).toBe("cheie");
  });
});
