import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { buttonsValueToMigrate, m2 } from "../2";
import type { Value } from "../../../types";

describe("Testing form m2 migration", () => {
  test.each<[Partial<Value>, Partial<Value>]>([
    [
      {
        test: 1,
        multistep: "on",
        items: []
      },
      {
        test: 1,
        multistep: "on",
        items: []
      }
    ],
    [
      {
        _id: "123",
        multistep: "off",
        items: []
      },
      {
        _id: "123",
        multistep: "off",
        items: []
      }
    ],
    [
      {
        _id: "gooqkx",
        multistep: "on",
        items: [
          {
            type: ElementTypes.Form2Fields,
            value: {
              items: [
                { type: ElementTypes.Form2Field, value: {} },
                { type: ElementTypes.Button, value: {} }
              ]
            }
          },
          {
            type: ElementTypes.Form2Steps,
            value: {
              items: [{ type: ElementTypes.Form2Step, value: {} }]
            }
          },
          { type: ElementTypes.Image, value: {} }
        ]
      },
      {
        _id: "gooqkx",
        multistep: "on",
        items: [
          {
            type: ElementTypes.Form2Fields,
            value: {
              items: [
                { type: ElementTypes.Form2Field, value: {} },
                { type: ElementTypes.Button, value: {} }
              ]
            }
          },
          {
            type: ElementTypes.Form2Steps,
            value: {
              items: [{ type: ElementTypes.Form2Step, value: {} }]
            }
          },
          { type: ElementTypes.Image, value: {} }
        ]
      }
    ],
    [
      {
        _id: "gooqkx",
        multistep: "on",
        items: [
          {
            type: ElementTypes.Form2Fields,
            value: {
              items: [
                { type: ElementTypes.Form2Field, value: {} },
                { type: ElementTypes.Button, value: {} }
              ]
            }
          },
          {
            type: ElementTypes.Form2Steps,
            value: {
              items: [{ type: ElementTypes.Form2Step, value: {} }]
            }
          },
          { type: ElementTypes.Image, value: {} },
          { type: ElementTypes.Button, value: { size: "small" } }
        ]
      },
      {
        _id: "gooqkx",
        multistep: "on",
        items: [
          {
            type: ElementTypes.Form2Fields,
            value: {
              items: [
                { type: ElementTypes.Form2Field, value: {} },
                { type: ElementTypes.Button, value: {} }
              ]
            }
          },
          {
            type: ElementTypes.Form2Steps,
            value: {
              items: [{ type: ElementTypes.Form2Step, value: {} }]
            }
          },
          { type: ElementTypes.Image, value: {} },
          { type: ElementTypes.Button, value: buttonsValueToMigrate }
        ]
      }
    ],
    [
      {
        multistep: "off",
        items: [
          { type: ElementTypes.Button, value: {} },
          { type: ElementTypes.Button, value: {} },
          { type: ElementTypes.Button, value: {} }
        ]
      },
      {
        multistep: "off",
        items: [
          { type: ElementTypes.Button, value: {} },
          { type: ElementTypes.Button, value: {} },
          { type: ElementTypes.Button, value: {} }
        ]
      }
    ],
    [
      {
        multistep: "on",
        items: [
          { type: ElementTypes.Button, value: {} },
          { type: ElementTypes.Button, value: {} },
          { type: ElementTypes.Button, value: {} }
        ]
      },
      {
        multistep: "on",
        items: [
          { type: ElementTypes.Button, value: buttonsValueToMigrate },
          { type: ElementTypes.Button, value: buttonsValueToMigrate },
          { type: ElementTypes.Button, value: buttonsValueToMigrate }
        ]
      }
    ],
    [
      {
        multistep: "off",
        items: [
          {
            type: ElementTypes.Button,
            value: { text: "Next", iconName: "tail-right" }
          },
          {
            type: ElementTypes.Button,
            value: { text: "Next", iconName: "tail-right" }
          }
        ]
      },
      {
        multistep: "off",
        items: [
          {
            type: ElementTypes.Button,
            value: { text: "Next", iconName: "tail-right" }
          },
          {
            type: ElementTypes.Button,
            value: { text: "Next", iconName: "tail-right" }
          }
        ]
      }
    ],
    [
      {
        multistep: "on",
        items: [
          {
            type: ElementTypes.Button,
            value: { text: "Next", iconName: "tail-right" }
          },
          {
            type: ElementTypes.Button,
            value: { text: "Next", iconName: "tail-right" }
          }
        ]
      },
      {
        multistep: "on",
        items: [
          {
            type: ElementTypes.Button,
            value: {
              text: "Next",
              iconName: "tail-right",
              ...buttonsValueToMigrate
            }
          },
          {
            type: ElementTypes.Button,
            value: {
              text: "Next",
              iconName: "tail-right",
              ...buttonsValueToMigrate
            }
          }
        ]
      }
    ],
    [
      {
        multistep: "on",
        items: [
          {
            type: ElementTypes.Button,
            value: {
              text: "Next",
              iconName: "tail-right",
              size: "large",
              paddingRL: 50,
              paddingRLSuffix: "px",
              tabletPaddingRLSuffix: "%",
              mobilePaddingRLSuffix: "%"
            }
          }
        ]
      },
      {
        multistep: "on",
        items: [
          {
            type: ElementTypes.Button,
            value: {
              text: "Next",
              iconName: "tail-right",
              ...buttonsValueToMigrate
            }
          }
        ]
      }
    ],
    [
      {
        multistep: "off",
        items: [
          {
            type: ElementTypes.Button,
            value: {
              text: "Next",
              iconName: "tail-right",
              size: "large",
              paddingRL: 50,
              paddingRLSuffix: "px",
              tabletPaddingRLSuffix: "%",
              mobilePaddingRLSuffix: "%"
            }
          }
        ]
      },
      {
        multistep: "off",
        items: [
          {
            type: ElementTypes.Button,
            value: {
              text: "Next",
              iconName: "tail-right",
              size: "large",
              paddingRL: 50,
              paddingRLSuffix: "px",
              tabletPaddingRLSuffix: "%",
              mobilePaddingRLSuffix: "%"
            }
          }
        ]
      }
    ]
  ])("Multistep buttons width", (v, expected) => {
    const migrated = m2.cb(v);
    expect(migrated).toStrictEqual(expected);
  });
});
