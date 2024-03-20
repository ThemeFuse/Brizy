import {
  filterByState,
  itemStates,
  stateIcon,
  stateTitle
} from "visual/component/Options/types/common/StateMode/utils";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";

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

describe("Testing 'filterByState' function", () => {
  test("Return only options that have specific state", () => {
    const item: ToolbarItemType = {
      id: "test",
      type: "tabs",
      tabs: [
        {
          id: "tab1",
          options: [
            {
              id: "text1",
              type: "inputText",
              states: ["hover"]
            }
          ]
        },
        {
          id: "tab2",
          options: [
            {
              id: "text2",
              type: "inputText",
              states: ["active"]
            }
          ]
        }
      ]
    };
    const result: ToolbarItemType = {
      id: "test",
      type: "tabs",
      tabs: [
        {
          id: "tab1",
          options: [
            {
              id: "text1",
              type: "inputText",
              states: ["hover"]
            }
          ]
        }
      ]
    };

    expect(filterByState("hover", item)).toStrictEqual(result);
  });
});

describe("Testing 'itemStates' function", () => {
  test("Just return item.states", () => {
    const item: ToolbarItemType = {
      id: "test",
      type: "inputText",
      states: ["normal", "hover"]
    };

    expect(itemStates(item)).toStrictEqual(["normal", "hover"]);
  });

  test("If item has no states, return ['normal']", () => {
    const item: ToolbarItemType = {
      id: "test",
      type: "inputText"
    };

    expect(itemStates(item)).toStrictEqual(["normal"]);
  });

  test("If item has children items, include their states also", () => {
    const item: ToolbarItemType = {
      id: "test",
      type: "tabs",
      states: ["normal"],
      tabs: [
        {
          id: "tab1",
          options: [
            {
              id: "text1",
              type: "inputText",
              states: ["hover"]
            }
          ]
        },
        {
          id: "tab2",
          options: [
            {
              id: "text2",
              type: "inputText",
              states: ["active"]
            }
          ]
        }
      ]
    };

    expect(itemStates(item)).toStrictEqual(["hover", "active", "normal"]);
  });
});

describe("Testing 'stateIcon' function", function () {
  test.each([
    [NORMAL, "nc-circle"],
    [HOVER, "nc-hover"],
    [ACTIVE, "nc-target"]
  ])(`For '%s' return '%s'`, (state, icon) => {
    expect(stateIcon(state)).toBe(icon);
  });
});

describe("Testing 'stateTitle' function", function () {
  test.each([
    [NORMAL, "Normal"],
    [HOVER, "Hover"],
    [ACTIVE, "Active"]
  ])(`For '%s' return '%s'`, (state, icon) => {
    expect(stateTitle(state)).toBe(icon);
  });
});
