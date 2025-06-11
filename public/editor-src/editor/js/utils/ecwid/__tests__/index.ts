import { EcwidProductIdWithSlug } from "visual/global/Ecwid/types";
import { getEcwidProductId, isEcwidProductIdWithSlug } from "../index";

describe("testing isEcwidProductIdWithSlug function which contains regex", () => {
  test.each([
    [null, false],
    [undefined, false],
    [1, false],
    ["2", false],
    [false, false],
    ["asd", false],
    ["ecwid-product", false],
    ["ecwid-product/", false],
    ["ecwid-product/1", true],
    ["ecwid-product/13456", true],
    ["ecwid-product/14568567856785678", true]
  ])(
    "should return true/false if %s is ecwid product id with slug",
    (id, expected) => {
      expect(isEcwidProductIdWithSlug(id)).toBe(expected);
    }
  );
});

describe("testing getEcwidProductId function which should split ecwid product id with slug and return only id", () => {
  test.each([
    ["ecwid-product/14568567856785678", 14568567856785678],
    ["ecwid-product/45345", 45345],
    ["ecwid-product/14568", 14568],
    ["ecwid-product/14568", 14568]
  ])("should return the only id without slug", (id, expected) => {
    expect(getEcwidProductId(id as EcwidProductIdWithSlug)).toBe(expected);
  });
});
