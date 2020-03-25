import {
  filterByState,
  flatten,
  stateIcon,
  stateTitle
} from "visual/component/Options/types/common/StateMode/utils";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import * as State from "visual/utils/stateMode";

describe("Testing 'filterByState' function", () => {
  const normHover = { id: "1", states: [NORMAL, HOVER] };
  const hover = { id: "1", states: [HOVER] };
  const empty = { id: "1", states: [] };
  const noStates = { id: "1" };

  test("Return only options that have specific state", () => {
    const options = [normHover, hover];
    const result = [normHover];

    expect(filterByState(NORMAL, options)).toEqual(result);
  });

  test("Options with null or empty 'states' key, support defaultState()", () => {
    const options = [empty, noStates];
    const result = [empty, noStates];

    expect(filterByState(State.empty, options)).toEqual(result);
  });

  test("For 'grid' option type, check options that it wraps", () => {
    const options = [
      normHover,
      hover,
      { type: "grid", columns: [{ options: [normHover] }] }
    ];

    expect(filterByState(HOVER, options)).toMatchObject(options);
  });
});

describe("Testing 'flatten' function", () => {
  const options = [
    { id: "1", type: "test1" },
    { id: "2", type: "test2" },
    { id: "3", type: "test3" }
  ];

  test("Return same options list if it doesn't contain 'grid' option type", () => {
    expect(flatten(options)).toEqual(options);
  });

  test("Extract 'grid' option type option in the list", () => {
    const withGrid = [
      ...options,
      {
        id: "4",
        type: "grid",
        columns: [{ options: [...options, ...options] }]
      }
    ];

    expect(flatten(withGrid)).toEqual([...options, ...options, ...options]);
  });

  test("Extract nested 'grid' option type option in the list", () => {
    const withGrid = [
      ...options,
      {
        id: "4",
        type: "grid",
        columns: [
          {
            options: [
              ...options,
              { id: "5", type: "grid", columns: [{ options: [...options] }] }
            ]
          }
        ]
      }
    ];

    expect(flatten(withGrid)).toEqual([...options, ...options, ...options]);
  });

  test("Parse for nested options only for 'grid' option type", () => {
    const withGrid = [
      ...options,
      {
        id: "4",
        type: "none-grid",
        columns: [{ options: options }]
      }
    ];

    expect(flatten(withGrid)).toEqual(withGrid);
  });
});

describe("Testing 'stateIcon' function", function() {
  test.each([
    [NORMAL, "nc-circle"],
    [HOVER, "nc-hover"],
    [ACTIVE, "nc-target"]
  ])(`For '%s' return '%s'`, (state, icon) => {
    expect(stateIcon(state)).toBe(icon);
  });
});

describe("Testing 'stateTitle' function", function() {
  test.each([
    [NORMAL, "Normal"],
    [HOVER, "Hover"],
    [ACTIVE, "Active"]
  ])(`For '%s' return '%s'`, (state, icon) => {
    expect(stateTitle(state)).toBe(icon);
  });
});
