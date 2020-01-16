import {
  HOVER,
  NORMAL,
  states,
  valueToState,
  stateToValue,
  defaultState,
  hasState,
  haveState
} from "visual/utils/stateMode/index";

describe("Testing `states` function", () => {
  test("Return all current states with `normal` state as first element", () => {
    expect(states()).toEqual([NORMAL, HOVER]);
  });
});

describe("Testing `valueToState` function", () => {
  test("Composition test. stateToValue(stateToValue(state) == stateToValue(state)", () => {
    [...states(), "invalid-state"].map(v =>
      expect(stateToValue(stateToValue(v))).toBe(stateToValue(v))
    );
  });

  test("For 'tabNormal' state should return 'normal'", () => {
    expect(valueToState("tabNormal")).toBe(NORMAL);
  });

  test("For 'tabHover' state should return 'hover'", () => {
    expect(valueToState("tabHover")).toBe(HOVER);
  });

  test("Any other value that is not a valid state, return 'normal'", () => {
    expect(valueToState("test")).toBe(NORMAL);
  });

  test("Identity test. Always return same state if it is valid", () => {
    expect(valueToState(NORMAL)).toBe(NORMAL);
    expect(valueToState(HOVER)).toBe(HOVER);

    expect(valueToState(stateToValue(NORMAL))).toBe(NORMAL);
    expect(valueToState(stateToValue(HOVER))).toBe(HOVER);

    states().map(state => expect(valueToState(state)).toBe(state));
  });

  test("Always return `normal` state if the state is invalid", () => {
    expect(valueToState(undefined)).toBe(NORMAL);
    expect(valueToState(1)).toBe(NORMAL);
    expect(valueToState("test")).toBe(NORMAL);
  });
});

describe("Testing 'stateToValue' function", () => {
  test("Composition test. valueToState(valueToState(state) == valueToState(state)", () => {
    ["tabNormal", "tabHover", "invalidValue"].map(v =>
      expect(valueToState(valueToState(v))).toBe(valueToState(v))
    );
  });

  test("For 'normal' state should return 'tabNormal'", () => {
    expect(stateToValue(NORMAL)).toBe("tabNormal");
  });

  test("For 'hover' state should return 'tabHover'", () => {
    expect(stateToValue(HOVER)).toBe("tabHover");
  });

  test("Any other value that is not a valid state, return 'tabNormal'", () => {
    expect(stateToValue("test")).toBe("tabNormal");
  });
});

describe("Test 'sateToValue and 'valueToState' composition laws", function() {
  test("valueToState(stateToValue(state)) == state. The law applies only when state is valid", () => {
    states().map(s => expect(valueToState(stateToValue(s))).toBe(s));
  });

  test("stateToValue(valueToState(value)) == value. The law applies only when value is a valid state value", () => {
    ["tabNormal", "tabHover"].map(v =>
      expect(stateToValue(valueToState(v))).toBe(v)
    );
  });
});

describe("Testing 'defaultState' function", () => {
  test("Should return 'normal'", () => {
    expect(defaultState()).toBe(NORMAL);
  });
});

describe("Testing 'hasState' function", () => {
  test("By default, options support only default state, if the states key is not defined or empty", () => {
    expect(hasState(defaultState(), {})).toBe(true);
    expect(hasState(HOVER, {})).toBe(false);
    expect(hasState(defaultState(), { states: [] })).toBe(true);
    expect(hasState(HOVER, { states: [] })).toBe(false);
  });

  test("Return 'true' if 'states' key contain the requested state", () => {
    expect(hasState(NORMAL, { states: [NORMAL] })).toBe(true);
    expect(hasState(HOVER, { states: [NORMAL, HOVER] })).toBe(true);
  });
});

describe("Testing 'haveState' function", () => {
  test("By default, options support only default state, if the states key is not defined or empty", () => {
    const options = [{}, { states: [] }];

    expect(haveState(defaultState(), options)).toBe(true);
    expect(haveState(HOVER, options)).toBe(false);
    expect(haveState(defaultState(), options)).toBe(true);
    expect(haveState(HOVER, options)).toBe(false);
  });

  test("Return 'true' if 'states' key contain the requested state", () => {
    const options = [{ states: [NORMAL] }, { states: [NORMAL, HOVER] }];

    expect(haveState(NORMAL, options)).toBe(true);
    expect(haveState(HOVER, options)).toBe(true);
  });
});
