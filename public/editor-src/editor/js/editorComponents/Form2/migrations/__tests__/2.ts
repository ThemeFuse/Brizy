import { ElementModel } from "visual/component/Elements/Types";
import { m2 } from "../2";

describe("Testing form m2 migration", () => {
  test.each<[ElementModel, ElementModel]>([
    [
      {
        options: ["Option 1", "Option 2"],
        items: []
      },
      {
        options: ["Option 1", "Option 2"],
        items: [
          {
            type: "Form2FieldOption",
            value: {
              value: "Option 1",
              label: "Option 1"
            }
          },
          {
            type: "Form2FieldOption",
            value: {
              value: "Option 2",
              label: "Option 2"
            }
          }
        ]
      }
    ],
    [
      {
        options: ["Option 1"],
        items: []
      },
      {
        options: ["Option 1"],
        items: [
          {
            type: "Form2FieldOption",
            value: {
              value: "Option 1",
              label: "Option 1"
            }
          }
        ]
      }
    ],
    [
      {
        options: [],
        items: []
      },
      {
        options: [],
        items: []
      }
    ],
    [
      {
        options: undefined,
        items: []
      },
      {
        options: undefined,
        items: []
      }
    ],
    [
      {
        options: null,
        items: []
      },
      {
        options: null,
        items: []
      }
    ],
    [
      {
        options: "",
        items: []
      },
      {
        options: "",
        items: []
      }
    ]
  ])("Options array to ElementModel", (v, resolve) => {
    const migrated = m2.cb(v);
    expect(migrated).toStrictEqual(resolve);
  });
});
