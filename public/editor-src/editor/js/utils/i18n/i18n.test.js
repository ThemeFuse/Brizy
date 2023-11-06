import { makeAttr, makeDataAttr, makeDataAttrString } from "./attribute";
import { translate } from "./translate";

describe("Testing 'translate' function", function () {
  test("Should return key if it's not in the dictionary", () => {
    expect(translate({}, "key")).toBe("key");
  });

  test("Should return translation if key is present in the dictionary", () => {
    expect(translate({ key: "cheie" }, "key")).toBe("cheie");
  });
});

describe("Testing 'makeAttr' function", function () {
  test("Added data-brz in front of attribute", () => {
    expect(makeAttr("population")).toBe("data-brz-population");
  });
});

describe("Testing 'makeDataAttr' function", function () {
  test("Added data-brz-translate in front of attribute", () => {
    expect(
      makeDataAttr({ name: "population", value: "rich", translatable: true })
    ).toStrictEqual({ "data-brz-translate-population": "rich" });
  });

  test("Added data-brz in front of attribute", () => {
    expect(makeDataAttr({ name: "population", value: "rich" })).toStrictEqual({
      "data-brz-population": "rich"
    });
  });
});

describe("Testing 'makeDataAttrString' function", function () {
  test("Added data-brz in front of attribute", () => {
    expect(makeDataAttrString({ name: "population" })).toBe(
      "[data-brz-population]"
    );
  });

  test("Added data-brz in front of attribute and value", () => {
    expect(makeDataAttrString({ name: "population", value: "rich" })).toBe(
      "[data-brz-population=rich]"
    );
  });

  test("Added data-brz-translatable in front of attribute and value", () => {
    expect(
      makeDataAttrString({
        name: "population",
        value: "rich",
        translatable: true
      })
    ).toBe("[data-brz-translatable-population=rich]");
  });
});
