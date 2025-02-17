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
    // eslint-disable-next-line  @typescript-eslint/no-empty-function
    [() => {}, true],
    // eslint-disable-next-line  @typescript-eslint/no-empty-function
    [function () {}, true],
    // eslint-disable-next-line  @typescript-eslint/no-empty-function
    [function test() {}, true],
    // eslint-disable-next-line  @typescript-eslint/no-empty-function
    [(() => () => {})(), true],
    [isFunction, true]
  ])("'%s' is function: ", (input, output) =>
    expect(isFunction(input)).toBe(output)
  );
});
