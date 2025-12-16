import { isFunction } from "../index";

describe("Testing isFunction", function () {
  test.each([
    [null, false],
    [undefined, false],
    [NaN, false],
    [{}, false],
    [[], false],
    ["", false],
    [1, false],
    [() => {}, true],
    [function () {}, true],
    [function test() {}, true],
    [(() => () => {})(), true],
    [isFunction, true]
  ])("'%s' is function: ", (input, output) =>
    expect(isFunction(input)).toBe(output)
  );
});
