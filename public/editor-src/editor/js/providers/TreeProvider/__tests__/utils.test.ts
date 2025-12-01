import type { ElementModelType2 } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { Block } from "visual/types/Block";
import { makeBlock } from "../utils";
import {
  WRAPPER_TYPES,
  getCurrentWrapperElementId,
  removeBlockWithWrapper,
  setHiddenElement,
  supportsShowOnDevice
} from "../utils";

describe("Navigator context/utils", () => {
  test("WRAPPER_TYPES and supportsShowOnDevice basics", () => {
    expect(WRAPPER_TYPES.has(ElementTypes.Row)).toBe(true);
    expect(WRAPPER_TYPES.has(ElementTypes.Column)).toBe(true);
    expect(supportsShowOnDevice(ElementTypes.Row)).toBe(true);
    expect(supportsShowOnDevice(ElementTypes.Button)).toBe(true);
    expect(supportsShowOnDevice(ElementTypes.Icon)).toBe(true);
    expect(supportsShowOnDevice(ElementTypes.RichText)).toBe(false);
  });

  test("getCurrentWrapperElementId returns nearest wrapper", () => {
    const blocks: Block[] = [
      makeBlock("S", ElementTypes.Section, [
        makeBlock("R", ElementTypes.Row, [
          makeBlock("C", ElementTypes.Column, [
            makeBlock("BTN", ElementTypes.Button)
          ])
        ])
      ])
    ];

    // Wrapper itself
    expect(getCurrentWrapperElementId(blocks, "R")).toBe("R");
    // Non-wrapper -> nearest wrapper parent
    expect(getCurrentWrapperElementId(blocks, "BTN")).toBe("C");
    // Unknown id -> null
    expect(getCurrentWrapperElementId(blocks, "X")).toBeNull();
  });

  test("setHiddenElement toggles target wrapper or nearest parent wrapper", () => {
    const els: ElementModelType2[] = [
      {
        type: ElementTypes.Section,
        value: {
          _id: "S",
          showOnDesktop: "on",
          showOnTablet: "on",
          showOnMobile: "on",
          items: [
            {
              type: ElementTypes.Row,
              value: {
                _id: "R",
                showOnDesktop: "on",
                showOnTablet: "on",
                showOnMobile: "on",
                items: [
                  {
                    type: ElementTypes.Column,
                    value: {
                      _id: "C",
                      showOnDesktop: "on",
                      showOnTablet: "on",
                      showOnMobile: "on",
                      items: [
                        {
                          type: ElementTypes.Button,
                          value: {
                            _id: "BTN",
                            showOnDesktop: "on",
                            showOnTablet: "on",
                            showOnMobile: "on"
                          } as any
                        },
                        {
                          type: ElementTypes.RichText,
                          value: {
                            _id: "RICHTEXT",
                            showOnDesktop: "on",
                            showOnTablet: "on",
                            showOnMobile: "on"
                          } as any
                        }
                      ]
                    }
                  } as any
                ]
              }
            } as any
          ]
        }
      } as any
    ];

    // Target BTN
    const toggledBtn = setHiddenElement(els, "BTN");
    const btn = toggledBtn[0].value.items![0].value.items![0].value.items![0];
    expect(btn.value.showOnDesktop).toBe("off");
    expect(btn.value.showOnTablet).toBe("off");
    expect(btn.value.showOnMobile).toBe("off");

    // Target non-wrapper RICHTEXT -> nearest wrapper is Column "C"
    const toggled = setHiddenElement(els, "RICHTEXT");
    const col = toggled[0].value.items![0].value.items![0];
    expect(col.value.showOnDesktop).toBe("off");
    expect(col.value.showOnTablet).toBe("off");
    expect(col.value.showOnMobile).toBe("off");

    // Target wrapper Row -> toggles itself
    const toggled2 = setHiddenElement(toggled, "R");
    const row = toggled2[0].value.items![0];
    expect(row.value.showOnDesktop).toBe("off"); // was on, toggled to off
    expect(row.value.showOnTablet).toBe("off");
    expect(row.value.showOnMobile).toBe("off");
  });

  test("removeBlockWithWrapper removes wrapper or parent wrapper appropriately", () => {
    const blocks: Block[] = [
      makeBlock("S", ElementTypes.Section, [
        makeBlock("R", ElementTypes.Row, [
          makeBlock("C", ElementTypes.Column, [
            makeBlock("BTN", ElementTypes.Button)
          ])
        ])
      ])
    ];

    // Remove non-wrapper BTN -> remove parent wrapper Column
    const removedCol = removeBlockWithWrapper(blocks, "BTN");
    const secChildren = removedCol[0].value.items as Block[];
    const rowChildren = secChildren[0].value.items as Block[];
    const colChildren = rowChildren.find((b) => b.value._id === "C")?.value
      .items as Block[];
    expect(colChildren).toHaveLength(0);

    // Remove wrapper Row directly
    const removedRow = removeBlockWithWrapper(blocks, "R");
    const secChildren2 = removedRow[0].value.items as Block[];
    expect(secChildren2.find((b) => b.value._id === "R")).toBeUndefined();
  });

  test("removeBlockWithWrapper handles Cloneable correctly", () => {
    // Test with 3 items in Cloneable - removing one should keep Cloneable
    const blocksWith3Items: Block[] = [
      makeBlock("S", ElementTypes.Section, [
        makeBlock("CLONE", ElementTypes.Cloneable, [
          makeBlock("BTN1", ElementTypes.Button),
          makeBlock("BTN2", ElementTypes.Button),
          makeBlock("BTN3", ElementTypes.Button)
        ])
      ])
    ];

    const removed1 = removeBlockWithWrapper(blocksWith3Items, "BTN1");
    const cloneChildren1 = (removed1[0].value.items as Block[])[0].value
      .items as Block[];
    expect(cloneChildren1).toHaveLength(2); // Should have 2 items left
    expect(cloneChildren1.find((b) => b.value._id === "BTN1")).toBeUndefined();
    expect(cloneChildren1.find((b) => b.value._id === "BTN2")).toBeDefined();
    expect(cloneChildren1.find((b) => b.value._id === "BTN3")).toBeDefined();

    // Test with 2 items in Cloneable - removing one should keep Cloneable with 1 item
    const blocksWith2Items: Block[] = [
      makeBlock("S", ElementTypes.Section, [
        makeBlock("CLONE", ElementTypes.Cloneable, [
          makeBlock("BTN1", ElementTypes.Button),
          makeBlock("BTN2", ElementTypes.Button)
        ])
      ])
    ];

    const removed2 = removeBlockWithWrapper(blocksWith2Items, "BTN1");
    const cloneChildren2 = (removed2[0].value.items as Block[])[0].value
      .items as Block[];
    expect(cloneChildren2).toHaveLength(1); // Should have 1 item left
    expect(cloneChildren2.find((b) => b.value._id === "BTN1")).toBeUndefined();
    expect(cloneChildren2.find((b) => b.value._id === "BTN2")).toBeDefined();

    // Test with 1 item in Cloneable - removing it should remove the entire Cloneable
    const blocksWith1Item: Block[] = [
      makeBlock("S", ElementTypes.Section, [
        makeBlock("CLONE", ElementTypes.Cloneable, [
          makeBlock("BTN1", ElementTypes.Button)
        ])
      ])
    ];

    const removed3 = removeBlockWithWrapper(blocksWith1Item, "BTN1");
    const secChildren3 = removed3[0].value.items as Block[];
    expect(secChildren3.find((b) => b.value._id === "CLONE")).toBeUndefined(); // Cloneable should be removed
  });
});
