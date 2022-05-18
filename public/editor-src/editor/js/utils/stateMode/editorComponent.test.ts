import { bindStateToOption } from "visual/utils/stateMode/editorComponent";
import { states } from "./index";
import { ToolbarItemType } from "../../editorComponents/ToolbarItemType";

// region Mocks
jest.mock(
  "visual/component/Options/types/GlobalBlock/index.tsx",
  () => undefined
);
jest.mock(
  "visual/component/Options/types/AdvancedSettings.jsx",
  () => undefined
);
jest.mock("visual/component/Options/types/BlockThumbnail.jsx", () => undefined);
jest.mock("visual/component/Options/types/Button.jsx", () => undefined);
jest.mock("visual/component/Options/types/ButtonTooltip.jsx", () => undefined);
jest.mock("visual/component/Options/types/CheckGroup.jsx", () => undefined);
jest.mock("visual/component/Options/types/CodeMirror.js", () => undefined);
jest.mock("visual/component/Options/types/ColorFields.jsx", () => undefined);
jest.mock("visual/component/Options/types/ColorPalette.jsx", () => undefined);
jest.mock("visual/component/Options/types/ColorPalette2.jsx", () => undefined);
jest.mock(
  "visual/component/Options/types/ColorPaletteEditor.jsx",
  () => undefined
);
jest.mock("visual/component/Options/types/ColorPicker.jsx", () => undefined);
jest.mock("visual/component/Options/types/ColorPicker2.jsx", () => undefined);
jest.mock("visual/component/Options/types/FileUpload.jsx", () => undefined);
jest.mock("visual/component/Options/types/FileUpload.wp.jsx", () => undefined);
jest.mock("visual/component/Options/types/FontFamily.jsx", () => undefined);
jest.mock("visual/component/Options/types/FontStyle.jsx", () => undefined);
jest.mock(
  "visual/component/Options/types/FontStyleEditor.jsx",
  () => undefined
);
jest.mock("visual/component/Options/types/FormApps.js", () => undefined);
jest.mock("visual/component/Options/types/GBConditions.tsx", () => undefined);
jest.mock("visual/component/Options/types/Grid.jsx", () => undefined);
jest.mock("visual/component/Options/types/IconSetter.jsx", () => undefined);
jest.mock("visual/component/Options/types/ImageSetter.jsx", () => undefined);
jest.mock("visual/component/Options/types/Input.jsx", () => undefined);
jest.mock("visual/component/Options/types/InputNumber.js", () => undefined);
jest.mock(
  "visual/component/Options/types/IntegrationsApps.js",
  () => undefined
);
jest.mock("visual/component/Options/types/MultiInput.js", () => undefined);
jest.mock(
  "visual/component/Options/types/MultiInputPickerOptionType.js",
  () => undefined
);
jest.mock("visual/component/Options/types/MultiPicker.jsx", () => undefined);
jest.mock("visual/component/Options/types/Popover.jsx", () => undefined);
jest.mock(
  "visual/component/Options/types/PopupConditions.jsx",
  () => undefined
);
jest.mock("visual/component/Options/types/PromptAddPopup.tsx", () => undefined);
jest.mock("visual/component/Options/types/PromptIcon.jsx", () => undefined);
jest.mock("visual/component/Options/types/RadioGroup.jsx", () => undefined);
jest.mock("visual/component/Options/types/Range.jsx", () => undefined);
jest.mock("visual/component/Options/types/Range2.jsx", () => undefined);
jest.mock("visual/component/Options/types/SavedBlock.tsx", () => undefined);
jest.mock("visual/component/Options/types/Select.jsx", () => undefined);
jest.mock("visual/component/Options/types/Stepper.jsx", () => undefined);
jest.mock("visual/component/Options/types/Switch.jsx", () => undefined);
jest.mock("visual/component/Options/types/Tabs.jsx", () => undefined);
jest.mock("visual/component/Options/types/Textarea.jsx", () => undefined);
jest.mock("visual/component/Options/types/Toggle.jsx", () => undefined);
jest.mock("visual/component/Options/types/dev/Typography/index.tsx", () => ({
  Typography: {}
}));
// endregion

describe("Testing `bindStateToOption` function", () => {
  const options: ToolbarItemType[] = [
    {
      id: "test1",
      type: "number-dev"
    },
    {
      id: "test2",
      type: "inputText-dev"
    }
  ];

  const optionsWithState: ToolbarItemType[] = [
    {
      id: "test1",
      type: "number-dev"
    },
    {
      id: "test2",
      type: "inputText-dev",
      states: ["normal", "hover"]
    }
  ];

  const tabsWithState: ToolbarItemType = {
    id: "test",
    type: "tabs-dev",
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
    type: "grid-dev",
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
    type: "stateMode-dev",
    states: states(),
    options
  });

  test("Always return same option if it is not `tabs` or `popover` type", () => {
    const option: ToolbarItemType = {
      id: "test",
      type: "group-dev",
      options: [
        {
          id: "test-2",
          type: "number-dev"
        }
      ]
    };

    expect(bindStateToOption(states(), option)).toBe(option);
  });

  describe("Dealing with popover", () => {
    test("If popover has options that support 2 or more state modes, wrap them in `stateMode` option", () => {
      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover-dev",
        options: optionsWithState
      };

      const resultPopover: ToolbarItemType = {
        id: "my-option",
        type: "popover-dev",
        options: [wrapInState(optionsWithState)]
      };

      expect(bindStateToOption(states(), popover)).toStrictEqual(resultPopover);
    });

    test("If popover has options that do not support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover-dev",
        options
      };

      const resultPopover: ToolbarItemType = {
        id: "my-option",
        type: "popover-dev",
        options
      };

      expect(bindStateToOption(states(), popover)).toStrictEqual(resultPopover);
    });

    test("If popover has other popover as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover-dev",
        options: [
          {
            id: "my-option",
            type: "popover-dev",
            options: optionsWithState
          }
        ]
      };

      expect(bindStateToOption(states(), popover)).toStrictEqual(popover);
    });

    test("If popover has tabs as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const popover: ToolbarItemType = {
        id: "my-option",
        type: "popover-dev",
        options: [tabsWithState]
      };

      expect(bindStateToOption(states(), popover)).toStrictEqual(popover);
    });

    test("If tabs has an option as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs-dev",
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
        type: "tabs-dev",
        tabs: [
          {
            id: "1",
            options: [wrapInState([gridWithState])]
          },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input)).toStrictEqual(result);
    });
  });

  describe("Dealing with tabs", () => {
    test("If tabs has options that support 2 or more state modes, wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs-dev",
        tabs: [
          { id: "1", options: optionsWithState },
          { id: "2", options }
        ]
      };

      const result: ToolbarItemType = {
        id: "my-option",
        type: "tabs-dev",
        tabs: [
          {
            id: "1",
            options: [
              {
                id: "tabsState",
                type: "stateMode-dev",
                states: states(),
                options: optionsWithState
              }
            ]
          },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input)).toStrictEqual(result);
    });

    test("If tabs has options that do not support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs-dev",
        tabs: [
          { id: "1", options },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input)).toStrictEqual(input);
    });

    test("If tabs has popover as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs-dev",
        tabs: [
          {
            id: "1",
            options: [
              {
                id: "my-option",
                type: "popover-dev",
                options: optionsWithState
              }
            ]
          },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input)).toStrictEqual(input);
    });

    test("If tabs has other tabs as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "tabs-dev",
        tabs: [
          {
            id: "1",
            options: [tabsWithState]
          },
          { id: "2", options }
        ]
      };

      expect(bindStateToOption(states(), input)).toStrictEqual(input);
    });

    test("If popover has an option as children that has options that support support 2 or more state modes, don't wrap them in `stateMode` option", () => {
      const input: ToolbarItemType = {
        id: "my-option",
        type: "popover-dev",
        options: [gridWithState]
      };

      const result: ToolbarItemType = {
        id: "my-option",
        type: "popover-dev",
        options: [wrapInState([gridWithState])]
      };

      expect(bindStateToOption(states(), input)).toStrictEqual(result);
    });
  });
});
