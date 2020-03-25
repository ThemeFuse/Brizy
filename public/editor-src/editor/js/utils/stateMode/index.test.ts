import {
  HOVER,
  NORMAL,
  states,
  toString,
  ACTIVE,
  mRead,
  StateSpec,
  read
} from "visual/utils/stateMode/index";
import { testMonoid } from "visual/utils/types/Monoid.test";
import { testReader } from "visual/utils/types/Type.test";

describe("Testing `states` function", () => {
  test("Return all current states with `normal` state as first element", () => {
    expect(states()).toEqual([NORMAL, HOVER, ACTIVE]);
  });
});

describe("Testing 'read' function", function() {
  testReader(read, states(), [undefined, null, "1", 2, [], {}]);
});

describe("Testing State monoidal behavior", function() {
  testMonoid(StateSpec, states());
});

describe("Testing 'stateToValue' function", () => {
  test("Composition test. mRead(mRead(state) == mRead(state)", () => {
    ["tabNormal", "tabHover", "invalidValue"].map(v =>
      expect(mRead(mRead(v))).toBe(mRead(v))
    );
  });

  test("For 'normal' state should return 'tabNormal'", () => {
    expect(toString(NORMAL)).toBe("tabNormal");
  });

  test("For 'hover' state should return 'tabHover'", () => {
    expect(toString(HOVER)).toBe("tabHover");
  });
});

describe("Test 'sateToValue and 'mRead' composition laws", function() {
  test("mRead(stateToValue(state)) == state. The law applies only when state is valid", () => {
    states().map(s => expect(mRead(toString(s))).toBe(s));
  });

  test("stateToValue(mRead(value)) == value. The law applies only when value is a valid state value", () => {
    ["tabNormal", "tabHover"].map(v => expect(toString(mRead(v))).toBe(v));
  });
});
