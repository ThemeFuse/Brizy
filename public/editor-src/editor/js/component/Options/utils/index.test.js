import { isOption, optionMap } from "visual/component/Options/utils/index";

describe("Testing 'isOption' function", () => {
  test("Return 'true' if object has 'id' and 'type' properties", () => {
    expect(isOption({ id: "test", type: "input" })).toBe(true);
  });

  test("Return 'false' if value is missing at least one key", () => {
    expect(isOption({})).toBe(false);
    expect(isOption({ id: "test" })).toBe(false);
    expect(isOption({ type: "input" })).toBe(false);
  });
});

describe("Testing 'optionMap' function", () => {
  test("Return same object if is not an option", () => {
    const fakeOption = { a: 1, b: 2 };
    expect(optionMap(() => null, fakeOption)).toEqual(fakeOption);
  });

  test("Apply function on the option elements", () => {
    const f = o => ({ ...o, test: true });
    const option = {
      id: "test",
      type: "test"
    };
    const rOption = {
      id: "test",
      type: "test",
      test: true
    };
    const nested = {
      ...option,
      options: [
        { ...option, options: { ...option, options: [option, option] } }
      ]
    };

    const rNested = {
      ...rOption,
      options: [
        {
          ...rOption,
          options: { ...rOption, options: [rOption, rOption] }
        }
      ]
    };

    expect(optionMap(f, nested)).toEqual(rNested);
  });
});
