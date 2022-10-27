import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { map } from "../map";

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
jest.mock("visual/component/Options/types/dev/IconSetter/index.tsx", () => ({
  IconSetter: {}
}));
// endregion

test("Return the modifiers applied on the item", () => {
  const mapper = (i: ToolbarItemType): ToolbarItemType => ({
    ...i,
    devices: "responsive"
  });
  const item: ToolbarItemType = {
    id: "test",
    type: "number-dev",
    devices: "desktop"
  };
  const result: ToolbarItemType = {
    id: "test",
    type: "number-dev",
    devices: "responsive"
  };

  expect(map(mapper, item)).toStrictEqual(result);
});

test("Apply map function in children items too", () => {
  const mapper = (i: ToolbarItemType): ToolbarItemType => ({
    ...i,
    devices: "responsive"
  });
  const item: ToolbarItemType = {
    id: "test",
    type: "tabs-dev",
    devices: "desktop",
    tabs: [
      {
        id: "tab1",
        options: [
          {
            id: "test11",
            type: "number-dev",
            devices: "desktop"
          },
          {
            id: "test12",
            type: "number-dev",
            devices: "desktop"
          }
        ]
      },
      {
        id: "tab2",
        options: [
          {
            id: "test21",
            type: "number-dev",
            devices: "desktop"
          },
          {
            id: "test22",
            type: "number-dev",
            devices: "desktop"
          }
        ]
      }
    ]
  };
  const result: ToolbarItemType = {
    id: "test",
    type: "tabs-dev",
    devices: "responsive",
    tabs: [
      {
        id: "tab1",
        options: [
          {
            id: "test11",
            type: "number-dev",
            devices: "responsive"
          },
          {
            id: "test12",
            type: "number-dev",
            devices: "responsive"
          }
        ]
      },
      {
        id: "tab2",
        options: [
          {
            id: "test21",
            type: "number-dev",
            devices: "responsive"
          },
          {
            id: "test22",
            type: "number-dev",
            devices: "responsive"
          }
        ]
      }
    ]
  };

  expect(map(mapper, item)).toStrictEqual(result);
});
