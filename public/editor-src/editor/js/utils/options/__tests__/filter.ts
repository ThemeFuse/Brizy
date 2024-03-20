import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { filter } from "../filter";

// region Mocks
jest.mock(
  "visual/component/Options/types/AdvancedSettings.jsx",
  () => undefined
);
jest.mock("visual/component/Options/types/BlockThumbnail.jsx", () => undefined);
jest.mock("visual/component/Options/types/CheckGroup.jsx", () => undefined);
jest.mock("visual/component/Options/types/ColorPalette2.jsx", () => undefined);
jest.mock(
  "visual/component/Options/types/ColorPaletteEditor.jsx",
  () => undefined
);
jest.mock(
  "visual/component/Options/types/FontStyleEditor/index.tsx",
  () => undefined
);
jest.mock(
  "visual/component/Options/types/PopupConditions.jsx",
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

test("Return item back if it respects the predicate", () => {
  const predicate = (i: ToolbarItemType): boolean => i.devices === "desktop";
  const item: ToolbarItemType = {
    id: "test",
    type: "number",
    devices: "desktop"
  };

  expect(filter(predicate, item)).toBe(item);
});

test("Return undefined back if item does not respect the predicate", () => {
  const predicate = (i: ToolbarItemType): boolean => i.devices === "responsive";
  const item: ToolbarItemType = {
    id: "test",
    type: "number",
    devices: "desktop"
  };

  expect(filter(predicate, item)).toBe(undefined);
});

test("Apply filter on inner items", () => {
  const predicate = (i: ToolbarItemType): boolean => i.devices === "desktop";
  const item: ToolbarItemType = {
    id: "test",
    type: "tabs",
    devices: "desktop",
    tabs: [
      {
        id: "tab1",
        options: [
          {
            id: "test11",
            type: "number",
            devices: "desktop"
          },
          {
            id: "test12",
            type: "number",
            devices: "responsive"
          }
        ]
      },
      {
        id: "tab2",
        options: [
          {
            id: "test21",
            type: "number",
            devices: "responsive"
          },
          {
            id: "test22",
            type: "number",
            devices: "responsive"
          }
        ]
      }
    ]
  };
  const result: ToolbarItemType = {
    id: "test",
    type: "tabs",
    devices: "desktop",
    tabs: [
      {
        id: "tab1",
        options: [
          {
            id: "test11",
            type: "number",
            devices: "desktop"
          }
        ]
      }
    ]
  };

  expect(filter(predicate, item)).toStrictEqual(result);
});
