import {
  bindStateToOption,
  hasState,
  haveState
} from "visual/utils/stateMode/editorComponent";
import { empty, HOVER, NORMAL } from "visual/utils/stateMode/index";

describe("Testing `bindStateToOption` function", () => {
  const onChange = () => {};
  const state = HOVER;
  const options = [
    {
      id: "test1",
      type: "input"
    },
    {
      id: "test2",
      type: "input"
    }
  ];
  const resultOptions = [
    {
      id: "tabsState",
      type: "stateMode",
      value: state,
      options,
      onChange
    }
  ];

  test("Always return same option if it is not `tabs` or `popover` type", () => {
    const option = {
      id: "test",
      type: "test",
      options: [
        {
          id: "test-2",
          type: "input"
        }
      ]
    };

    expect(bindStateToOption(NORMAL, () => {}, option)).toBe(option);
  });

  test("Wrap options in `stateMode` option type for `popover`", () => {
    const popover = {
      id: "popover",
      type: "popover",
      options
    };

    const resultPopover = {
      id: "popover",
      type: "popover",
      options: resultOptions
    };

    expect(bindStateToOption(state, onChange, popover)).toEqual(resultPopover);
  });

  test("Wrap options in `stateMode` option type for `tabs`", () => {
    const tabs = {
      id: "tabs",
      type: "tabs",
      tabs: [{ options }, { options }]
    };
    const resultTabs = {
      id: "tabs",
      type: "tabs",
      tabs: [{ options: resultOptions }, { options: resultOptions }]
    };

    expect(bindStateToOption(state, onChange, tabs)).toEqual(resultTabs);
  });

  test("Always use `normal` state if provided state parameter is and invalid state", () => {
    const option = {
      id: "popover",
      type: "popover",
      options: [{ type: "input" }]
    };

    const result = {
      id: "popover",
      type: "popover",
      options: [
        {
          id: "tabsState",
          type: "stateMode",
          value: NORMAL,
          options: [{ type: "input" }],
          onChange
        }
      ]
    };
    expect(bindStateToOption("test", onChange, option)).toEqual(result);
  });

  test("Handle empty and invalid options. Return same value back", () => {
    [undefined, null].map(v =>
      expect(bindStateToOption(state, onChange, v)).toEqual(v)
    );
  });

  test("'tabs', handle non array 'tabs' key. Return empty array.", () => {
    const option = {
      id: "tabs",
      type: "tabs",
      tabs: 123
    };

    const result = {
      id: "tabs",
      type: "tabs",
      tabs: []
    };
    expect(bindStateToOption(state, onChange, option)).toEqual(result);
  });
});

describe("Testing 'hasState' function", () => {
  test("By default, options support only default state, if the states key is not defined or empty", () => {
    expect(hasState(empty, {})).toBe(true);
    expect(hasState(HOVER, {})).toBe(false);
    expect(hasState(empty, { states: [] })).toBe(true);
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

    expect(haveState(empty, options)).toBe(true);
    expect(haveState(HOVER, options)).toBe(false);
    expect(haveState(empty, options)).toBe(true);
    expect(haveState(HOVER, options)).toBe(false);
  });

  test("Return 'true' if 'states' key contain the requested state", () => {
    const options = [{ states: [NORMAL] }, { states: [NORMAL, HOVER] }];

    expect(haveState(NORMAL, options)).toBe(true);
    expect(haveState(HOVER, options)).toBe(true);
  });
});
