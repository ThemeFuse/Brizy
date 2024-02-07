import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { reduce, reduceR } from "../reduce";

// region Mocks
jest.mock(
  "visual/component/Options/types/AdvancedSettings.jsx",
  () => undefined
);
jest.mock("visual/component/Options/types/BlockThumbnail.jsx", () => undefined);
jest.mock("visual/component/Options/types/Button.jsx", () => undefined);
jest.mock("visual/component/Options/types/ButtonTooltip.jsx", () => undefined);
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
jest.mock("visual/component/Options/types/GBConditions.tsx", () => undefined);
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

describe("Testing 'reduce' function", () => {
  test("Reduce items outside-in", () => {
    const getPath = (acc: string[], i: ToolbarItemType): string[] => [
      ...acc,
      i.id
    ];
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

    expect(reduce(getPath, [], item)).toStrictEqual([
      "test",
      "test11",
      "test12",
      "test21",
      "test22"
    ]);
  });
});

describe("Testing 'reduceR' function", () => {
  test("Reduce items inside-out", () => {
    const getPath = (acc: string[], i: ToolbarItemType): string[] => [
      ...acc,
      i.id
    ];
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

    expect(reduceR(getPath, [], item)).toStrictEqual([
      "test11",
      "test12",
      "test21",
      "test22",
      "test"
    ]);
  });
});
