import { empty } from "./ElementValue";

describe("Test empty", function() {
  test("Should be {id: undefined, title: undefined}", () => {
    expect(empty).toEqual({ id: undefined, title: undefined });
  });
});
