import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { filter } from "../filter";

// region Mocks
jest.mock(
  "visual/component/Options/types/AdvancedSettings.jsx",
  () => undefined
);
jest.mock("visual/component/Options/types/BlockThumbnail.jsx", () => undefined);
jest.mock("visual/component/Options/types/Button.jsx", () => undefined);
jest.mock("visual/component/Options/types/ButtonTooltip.jsx", () => undefined);
jest.mock("visual/component/Options/types/CheckGroup.jsx", () => undefined);
jest.mock("visual/component/Options/types/ColorFields.jsx", () => undefined);
jest.mock("visual/component/Options/types/ColorPalette2.jsx", () => undefined);
jest.mock(
  "visual/component/Options/types/ColorPaletteEditor.jsx",
  () => undefined
);
jest.mock("visual/component/Options/types/ColorPicker2.jsx", () => undefined);
jest.mock("visual/component/Options/types/FontFamily.jsx", () => undefined);
jest.mock("visual/component/Options/types/FontStyle.jsx", () => undefined);
jest.mock(
  "visual/component/Options/types/FontStyleEditor/index.tsx",
  () => undefined
);
jest.mock("visual/component/Options/types/FormApps.js", () => undefined);
jest.mock("visual/component/Options/types/GBConditions.tsx", () => undefined);
jest.mock("visual/component/Options/types/Grid.jsx", () => undefined);
jest.mock("visual/component/Options/types/Input.jsx", () => undefined);
jest.mock(
  "visual/component/Options/types/IntegrationsApps.js",
  () => undefined
);
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
jest.mock("visual/component/Options/types/PromptIcon.jsx", () => undefined);
jest.mock("visual/component/Options/types/RadioGroup.jsx", () => undefined);
jest.mock("visual/component/Options/types/Range2.jsx", () => undefined);
jest.mock("visual/component/Options/types/Select.jsx", () => undefined);
jest.mock("visual/component/Options/types/Stepper.jsx", () => undefined);
jest.mock("visual/component/Options/types/Toggle.jsx", () => undefined);
jest.mock("visual/component/Options/types/Tabs.jsx", () => undefined);
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

test("Return item back if it respects the predicate", () => {
  const predicate = (i: ToolbarItemType): boolean => i.devices === "desktop";
  const item: ToolbarItemType = {
    id: "test",
    type: "number-dev",
    devices: "desktop"
  };

  expect(filter(predicate, item)).toBe(item);
});

test("Return undefined back if item does not respect the predicate", () => {
  const predicate = (i: ToolbarItemType): boolean => i.devices === "responsive";
  const item: ToolbarItemType = {
    id: "test",
    type: "number-dev",
    devices: "desktop"
  };

  expect(filter(predicate, item)).toBe(undefined);
});

test("Apply filter on inner items", () => {
  const predicate = (i: ToolbarItemType): boolean => i.devices === "desktop";
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
  const result: ToolbarItemType = {
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
          }
        ]
      }
    ]
  };

  expect(filter(predicate, item)).toStrictEqual(result);
});
