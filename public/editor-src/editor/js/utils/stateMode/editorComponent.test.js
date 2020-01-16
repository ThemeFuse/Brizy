import { bindStateToOption } from "visual/utils/stateMode/editorComponent";
import { HOVER, NORMAL } from "visual/utils/stateMode/index";

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
