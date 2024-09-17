import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { map } from "../map";

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

test("Return the modifiers applied on the item", () => {
  const mapper = (i: ToolbarItemType): ToolbarItemType => ({
    ...i,
    devices: "responsive"
  });
  const item: ToolbarItemType = {
    id: "test",
    type: "number",
    devices: "desktop"
  };
  const result: ToolbarItemType = {
    id: "test",
    type: "number",
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
            devices: "desktop"
          }
        ]
      },
      {
        id: "tab2",
        options: [
          {
            id: "test21",
            type: "number",
            devices: "desktop"
          },
          {
            id: "test22",
            type: "number",
            devices: "desktop"
          }
        ]
      }
    ]
  };
  const result: ToolbarItemType = {
    id: "test",
    type: "tabs",
    devices: "responsive",
    tabs: [
      {
        id: "tab1",
        options: [
          {
            id: "test11",
            type: "number",
            devices: "responsive"
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

  expect(map(mapper, item)).toStrictEqual(result);
});
