import { DESKTOP } from "visual/utils/responsiveMode";
import { bindStateToOption } from "visual/utils/stateMode/editorComponent";
import { ToolbarItemType } from "../../editorComponents/ToolbarItemType";
import { states } from "./index";

// region Mocks
jest.mock(
  "visual/component/Options/types/AdvancedSettings.jsx",
  () => undefined
);
jest.mock("visual/component/Options/types/BlockThumbnail.jsx", () => undefined);
jest.mock("visual/component/Options/types/CheckGroup.jsx", () => undefined);
jest.mock(
  "visual/component/Options/types/ColorPaletteEditor.jsx",
  () => undefined
);
jest.mock(
  "visual/component/Options/types/FontStyleEditor/index.tsx",
  () => undefined
);
jest.mock("visual/component/Options/types/Toggle.jsx", () => undefined);
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
});
