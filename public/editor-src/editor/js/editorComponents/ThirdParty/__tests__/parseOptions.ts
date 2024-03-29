import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { Value } from "../index";
import { getComponentProps } from "../utils";

jest.mock("visual/utils/screenshots/index.ts", () => undefined);
jest.mock("visual/component/Prompts/index.tsx", () => undefined);
jest.mock(
  "visual/component/Controls/AiText/controls/AiDropdown.tsx",
  () => undefined
);

interface testCase {
  options: ToolbarItemType[];
  v: Omit<Value, "thirdPartyId">;
}

const testCase: Array<testCase> = [
  {
    options: [
      {
        id: "toolbarSettings",
        type: "popover",
        position: 1,
        options: [
          {
            id: "price",
            label: "Price",
            type: "inputText"
          }
        ]
      }
    ],
    v: {
      toolbarSettings: "",
      price: 600
    }
  },
  {
    options: [
      {
        id: "toolbarSettings",
        type: "popover",
        position: 1,
        options: [
          {
            id: "price",
            label: "Price",
            type: "inputText"
          }
        ]
      },
      {
        id: "toolbarSettings2",
        type: "popover",
        position: 2,
        options: [
          {
            id: "tabsCurrentElement",
            type: "tabs",
            tabs: [
              {
                id: "tabCurrentElementUpload",
                label: "Audio",
                options: [
                  {
                    id: "url",
                    label: "Link",
                    type: "inputText",
                    placeholder: "SoundCloud Link"
                  },
                  {
                    id: "autoPlay",
                    label: "Autoplay",
                    type: "number"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    v: {
      toolbarSettings: "123",
      price: 1234,
      toolbarSettings2: "33",
      tabsCurrentElement: "2",
      url: "google.com",
      autoPlay: true
    }
  },
  {
    options: [
      {
        id: "toolbarSettings",
        type: "popover",
        position: 3,
        options: [
          {
            id: "price",
            label: "Price",
            type: "inputText"
          },
          {
            id: "discount",
            label: "Discount",
            type: "inputText"
          }
        ]
      }
    ],
    v: {
      toolbarSettings: "",
      price: 600,
      discount: 10
    }
  }
];

describe("Testing 'getComponentProps' function", () => {
  test.each(testCase)(
    "getComponentProps must be return props object from Value",
    ({ options, v }) => {
      expect(getComponentProps(v, options)).toEqual(v);
    }
  );
});
