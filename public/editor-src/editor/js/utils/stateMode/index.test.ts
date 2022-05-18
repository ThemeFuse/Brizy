import { HOVER, NORMAL, states, ACTIVE } from "visual/utils/stateMode/index";

describe("Testing `states` function", () => {
  test("Return all current states with `normal` state as first element", () => {
    expect(states()).toEqual([NORMAL, HOVER, ACTIVE]);
  });
});
