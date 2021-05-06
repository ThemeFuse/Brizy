import { readWithChoices } from "./union";

test("Testing 'readWithChoices' function", () => {
  expect(readWithChoices(["a", "b"])("a")).toEqual("a");
  expect(readWithChoices(["a", "b"])("b")).toEqual("b");
  expect(readWithChoices(["a", "b"])("c")).toEqual(undefined);
  expect(readWithChoices(["a", "b"])(1)).toEqual(undefined);

  expect(readWithChoices([1, 2])(1)).toEqual(1);
  expect(readWithChoices([1, 2])(2)).toEqual(2);
  expect(readWithChoices([1, 2])(3)).toEqual(undefined);
  expect(readWithChoices([1, 2])("1")).toEqual(undefined);
  expect(readWithChoices([1, 2])({})).toEqual(undefined);
});
