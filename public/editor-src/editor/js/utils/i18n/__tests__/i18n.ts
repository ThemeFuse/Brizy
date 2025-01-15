import { I18n } from "../I18n";
import { makeAttr, makeDataAttr, makeDataAttrString } from "../attribute";
import { t } from "../t";

describe("Testing 'translate' function", function () {
  I18n.init({
    resources: {
      key: "cheie",
      hello: "Noroc"
    }
  });

  test("Should return key if it's not in the dictionary", () => {
    expect(I18n.t("key1")).toBe("key1");
  });

  test("Should return translation if key is present in the dictionary", () => {
    expect(I18n.t("key")).toBe("cheie");
  });

  test("Should return translation if key is present in the dictionary", () => {
    expect(I18n.t("hello")).toBe("Noroc");
  });

  test("T fn: Should return key if it's not in the dictionary", () => {
    expect(t("key1")).toBe("key1");
  });

  test("T fn: Should return translation if key is present in the dictionary", () => {
    expect(t("key")).toBe("cheie");
  });

  test("Should return translation if key is present in the dictionary", () => {
    expect(t("hello")).toBe("Noroc");
  });

  test("Update instance t", () => {
    I18n.update({
      resources: {
        key: "cheie reinoita"
      }
    });
    expect(t("hello")).toBe("hello");
    expect(t("key")).toBe("cheie reinoita");
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
    ).toStrictEqual({ "data-brz-translatable-population": "rich" });
  });

  test("Added data-brz in front of attribute", () => {
    expect(makeDataAttr({ name: "population", value: "rich" })).toStrictEqual({
      "data-brz-population": "rich"
    });
  });
  test("Added data-brz in front of attribute", () => {
    expect(
      makeDataAttr({ name: "population", value: undefined })
    ).toStrictEqual({});
  });
  test("Added data-brz in front of attribute", () => {
    expect(makeDataAttr({ name: "population", value: null })).toStrictEqual({});
  });
  test("Added data-brz in front of attribute", () => {
    expect(makeDataAttr({ name: "population", value: "" })).toStrictEqual({
      "data-brz-population": ""
    });
  });
  test("Added data-brz in front of attribute", () => {
    expect(makeDataAttr({ name: "test", value: 1 })).toStrictEqual({
      "data-brz-test": "1"
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
