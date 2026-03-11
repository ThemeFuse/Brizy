import { DESKTOP } from "visual/utils/responsiveMode";
import { bindStateToOption } from "visual/utils/stateMode/editorComponent";
import { ToolbarItemType } from "../../editorComponents/ToolbarItemType";
import { states } from "./index";

// region Mocks
jest.mock("visual/component/Options/types/dev/Typography/index.tsx", () => ({
  Typography: {}
}));
jest.mock("visual/component/Options/types/dev/IconSetter/index.tsx", () => ({
  IconSetter: {}
}));
jest.mock("visual/component/EyeDropper/index.tsx", () => ({
  EyeDropper: {}
}));
// endregion

describe("Testing `bindStateToOption` function", () => {
  const options: ToolbarItemType[] = [
    {
      id: "test1",
      type: "number"
    },
    {
      id: "test2",
      type: "inputText"
    }
  ];

  const optionsWithState: ToolbarItemType[] = [
    {
      id: "test1",
      type: "number"
    },
    {
      id: "test2",
      type: "inputText",
      states: ["normal", "hover"]
    }
  ];

  const tabsWithState: ToolbarItemType = {
    id: "test",
    type: "tabs",
    tabs: [
      {
        id: "1",
        options: optionsWithState
      },
      {
        id: "2",
        options: options
      }
    ]
  };

  const gridWithState: ToolbarItemType = {
    id: "test",
    type: "grid",
    columns: [
      {
        id: "col-1",
        options: optionsWithState
      },
      {
        id: "col-2",
        options: options
      }
    ]
  };

  const wrapInState = (options: ToolbarItemType[]): ToolbarItemType => ({
    id: "tabsState",
    type: "stateMode",
    states: states(),
    options
  });

  test("Always return same option if it is not `tabs` or `popover` type", () => {
    const option: ToolbarItemType = {
      id: "test",
      type: "group",
      options: [
        {
          id: "test-2",
          type: "number"
        }
      ]
    };

    expect(bindStateToOption(states(), option, DESKTOP)).toBe(option);
  });

  describe("Dealing with popover", () => {
    test("If popover has options that support 2 or more state modes, wrap them in `stateMode` option", () => {
      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: optionsWithState
      };

      const resultPopover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: [wrapInState(optionsWithState)]
      };

      expect(bindStateToOption(states(), popover, DESKTOP)).toStrictEqual(
        resultPopover
      );
    });

    test("If popover has options that do not support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options
      };

      const resultPopover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options
      };

      expect(bindStateToOption(states(), popover, DESKTOP)).toStrictEqual(
        resultPopover
      );
    });

    test("If popover has other popover as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: [
          {
            id: "my-option",
            type: "popover",
            options: optionsWithState
          }
        ]
      };

      expect(bindStateToOption(states(), popover, DESKTOP)).toStrictEqual(
        popover
      );
    });

    test("If popover has tabs as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: [tabsWithState]
      };

      expect(bindStateToOption(states(), popover, DESKTOP)).toStrictEqual(
        popover
      );
    });

    test("If tabs has an option as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs",
        tabs: [
          {
            id: "1",
            options: [gridWithState]
          },
          { id: "2", options }
        ]
      };

      const result: ToolbarItemType = {
        id: "my-option",
        type: "tabs",
        tabs: [
          {
            id: "1",
            options: [wrapInState([gridWithState])]
          },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input, DESKTOP)).toStrictEqual(result);
    });
  });

  describe("Dealing with tabs", () => {
    test("If tabs has options that support 2 or more state modes, wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs",
        tabs: [
          { id: "1", options: optionsWithState },
          { id: "2", options }
        ]
      };

      const result: ToolbarItemType = {
        id: "my-option",
        type: "tabs",
        tabs: [
          {
            id: "1",
            options: [
              {
                id: "tabsState",
                type: "stateMode",
                states: states(),
                options: optionsWithState
              }
            ]
          },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input, DESKTOP)).toStrictEqual(result);
    });

    test("If tabs has options that do not support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs",
        tabs: [
          { id: "1", options },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input, DESKTOP)).toStrictEqual(input);
    });

    test("If tabs has popover as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs",
        tabs: [
          {
            id: "1",
            options: [
              {
                id: "my-option",
                type: "popover",
                options: optionsWithState
              }
            ]
          },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input, DESKTOP)).toStrictEqual(input);
    });

    test("If tabs has other tabs as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs",
        tabs: [
          {
            id: "1",
            options: [tabsWithState]
          },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input, DESKTOP)).toStrictEqual(input);
    });

    test("If popover has an option as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: [gridWithState]
      };

      const result: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: [wrapInState([gridWithState])]
      };

      expect(bindStateToOption(states(), input, DESKTOP)).toStrictEqual(result);
    });
  });

  describe("Dealing with statesConfig", () => {
    const statesConfig1 = {
      normal: { icon: "nc-icon-1", title: "Normal State" },
      hover: { icon: "nc-icon-2", title: "Hover State" }
    };

    const statesConfig2 = {
      normal: { icon: "nc-icon-3", title: "Normal State Override" },
      active: { icon: "nc-icon-4", title: "Active State" }
    };

    test("Popover with options that have statesConfig should pass it to stateMode option", () => {
      const optionsWithStatesConfig: ToolbarItemType[] = [
        {
          id: "test1",
          type: "number"
        },
        {
          id: "test2",
          type: "inputText",
          states: ["normal", "hover"],
          statesConfig: statesConfig1
        }
      ];

      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: optionsWithStatesConfig
      };

      const result = bindStateToOption(states(), popover, DESKTOP);

      expect(result.type).toBe("popover");
      expect((result as any).options).toHaveLength(1);
      expect((result as any).options[0].type).toBe("stateMode");
      expect((result as any).options[0].statesConfig).toStrictEqual(
        statesConfig1
      );
    });

    test("Popover with multiple options that have statesConfig should merge them", () => {
      const optionsWithMultipleStatesConfig: ToolbarItemType[] = [
        {
          id: "test1",
          type: "inputText",
          states: ["normal", "hover"],
          statesConfig: statesConfig1
        },
        {
          id: "test2",
          type: "number",
          states: ["normal", "active"],
          statesConfig: statesConfig2
        }
      ];

      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: optionsWithMultipleStatesConfig
      };

      const result = bindStateToOption(states(), popover, DESKTOP);

      expect(result.type).toBe("popover");
      expect((result as any).options[0].type).toBe("stateMode");
      // Later configs should override earlier ones
      expect((result as any).options[0].statesConfig).toStrictEqual({
        normal: statesConfig2.normal, // Overridden by statesConfig2
        hover: statesConfig1.hover,
        active: statesConfig2.active
      });
    });

    test("Popover with options that have no statesConfig should not include statesConfig", () => {
      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: optionsWithState
      };

      const result = bindStateToOption(states(), popover, DESKTOP);

      expect(result.type).toBe("popover");
      expect((result as any).options[0].type).toBe("stateMode");
      expect((result as any).options[0].statesConfig).toBeUndefined();
    });

    test("Tabs with options that have statesConfig should pass it to stateMode option", () => {
      const tabOptionsWithStatesConfig: ToolbarItemType[] = [
        {
          id: "test1",
          type: "number"
        },
        {
          id: "test2",
          type: "inputText",
          states: ["normal", "hover"],
          statesConfig: statesConfig1
        }
      ];

      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs",
        tabs: [
          { id: "1", options: tabOptionsWithStatesConfig },
          { id: "2", options }
        ]
      };

      const result = bindStateToOption(states(), input, DESKTOP);

      expect(result.type).toBe("tabs");
      expect((result as any).tabs[0].options[0].type).toBe("stateMode");
      expect((result as any).tabs[0].options[0].statesConfig).toStrictEqual(
        statesConfig1
      );
      // Second tab should not have statesConfig
      expect((result as any).tabs[1].options).toBe(options);
    });

    test("Tabs with multiple tabs having statesConfig should pass it correctly to each", () => {
      const tab1Options: ToolbarItemType[] = [
        {
          id: "test1",
          type: "inputText",
          states: ["normal", "hover"],
          statesConfig: statesConfig1
        }
      ];

      const tab2Options: ToolbarItemType[] = [
        {
          id: "test2",
          type: "number",
          states: ["normal", "active"],
          statesConfig: statesConfig2
        }
      ];

      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs",
        tabs: [
          { id: "1", options: tab1Options },
          { id: "2", options: tab2Options }
        ]
      };

      const result = bindStateToOption(states(), input, DESKTOP);

      expect(result.type).toBe("tabs");
      expect((result as any).tabs[0].options[0].statesConfig).toStrictEqual(
        statesConfig1
      );
      expect((result as any).tabs[1].options[0].statesConfig).toStrictEqual(
        statesConfig2
      );
    });

    test("Popover with mixed options (some with statesConfig, some without) should only collect from those with it", () => {
      const mixedOptions: ToolbarItemType[] = [
        {
          id: "test1",
          type: "number"
        },
        {
          id: "test2",
          type: "inputText",
          states: ["normal", "hover"],
          statesConfig: statesConfig1
        },
        {
          id: "test3",
          type: "switch",
          states: ["normal", "hover"]
        }
      ];

      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: mixedOptions
      };

      const result = bindStateToOption(states(), popover, DESKTOP);

      expect(result.type).toBe("popover");
      expect((result as any).options[0].type).toBe("stateMode");
      // Should only have statesConfig from test2
      expect((result as any).options[0].statesConfig).toStrictEqual(
        statesConfig1
      );
    });

    test("Popover with options that have statesConfig but no states should not wrap in stateMode", () => {
      const optionsWithoutStates: ToolbarItemType[] = [
        {
          id: "test1",
          type: "number",
          statesConfig: statesConfig1
        }
      ];

      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover",
        options: optionsWithoutStates
      };

      const result = bindStateToOption(states(), popover, DESKTOP);

      expect(result.type).toBe("popover");
      // Should not wrap in stateMode since no options have states
      expect((result as any).options).toBe(optionsWithoutStates);
    });
  });
});
