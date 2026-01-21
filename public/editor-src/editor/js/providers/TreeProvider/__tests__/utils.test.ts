import type { ElementModelType2 } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { Block } from "visual/types/Block";
import { makeBlock } from "../utils";
import {
  CUSTOM_ID_TYPES,
  WRAPPER_TYPES,
  getCurrentWrapperElementId,
  removeBlockWithWrapper,
  setHiddenElement,
  supportsCustomId,
  supportsShowOnDevice,
  updateBlockTitle
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

  describe("supportsCustomId", () => {
    test("returns true for blocks that support customID", () => {
      expect(supportsCustomId(ElementTypes.Row)).toBe(true);
      expect(supportsCustomId(ElementTypes.Column)).toBe(true);
      expect(supportsCustomId(ElementTypes.Button)).toBe(true);
      expect(supportsCustomId(ElementTypes.Icon)).toBe(true);
      expect(supportsCustomId(ElementTypes.Wrapper)).toBe(true);
      expect(supportsCustomId(ElementTypes.StoryWrapper)).toBe(true);
      expect(supportsCustomId(ElementTypes.Cloneable)).toBe(true);
      expect(supportsCustomId(ElementTypes.Form2Field)).toBe(true);
      expect(supportsCustomId(ElementTypes.Section)).toBe(true);
      expect(supportsCustomId(ElementTypes.Leadific)).toBe(true);
    });

    test("returns false for blocks that don't support customID", () => {
      expect(supportsCustomId(ElementTypes.RichText)).toBe(false);
      expect(supportsCustomId(ElementTypes.Image)).toBe(false);
      expect(supportsCustomId(ElementTypes.Spacer)).toBe(false);
      expect(supportsCustomId(ElementTypes.Video)).toBe(false);
    });

    test("CUSTOM_ID_TYPES set contains correct types", () => {
      expect(CUSTOM_ID_TYPES.has(ElementTypes.Row)).toBe(true);
      expect(CUSTOM_ID_TYPES.has(ElementTypes.Column)).toBe(true);
      expect(CUSTOM_ID_TYPES.has(ElementTypes.Button)).toBe(true);
      expect(CUSTOM_ID_TYPES.has(ElementTypes.Icon)).toBe(true);
      expect(CUSTOM_ID_TYPES.has(ElementTypes.Wrapper)).toBe(true);
      expect(CUSTOM_ID_TYPES.has(ElementTypes.StoryWrapper)).toBe(true);
      expect(CUSTOM_ID_TYPES.has(ElementTypes.Cloneable)).toBe(true);
      expect(CUSTOM_ID_TYPES.has(ElementTypes.Form2Field)).toBe(true);
      expect(CUSTOM_ID_TYPES.has(ElementTypes.Section)).toBe(true);
      expect(CUSTOM_ID_TYPES.has(ElementTypes.Leadific)).toBe(true);
    });
  });

  describe("updateBlockTitle", () => {
    test("updates anchorName for block level blocks (Section)", () => {
      const blocks: Block[] = [
        makeBlock("S", ElementTypes.Section, [], { anchorName: "old-anchor" })
      ];

      const updated = updateBlockTitle(blocks, "S", "new-anchor");

      expect(updated[0].value.anchorName).toBe("new-anchor");
      // Original blocks should not be mutated
      expect(blocks[0].value.anchorName).toBe("old-anchor");
    });

    test("updates anchorName for block level blocks (SectionHeader)", () => {
      const blocks: Block[] = [
        makeBlock("SH", ElementTypes.SectionHeader, [], {
          anchorName: "old-header"
        })
      ];

      const updated = updateBlockTitle(blocks, "SH", "new-header");

      expect(updated[0].value.anchorName).toBe("new-header");
    });

    test("updates anchorName for block level blocks (SectionFooter)", () => {
      const blocks: Block[] = [
        makeBlock("SF", ElementTypes.SectionFooter, [], {
          anchorName: "old-footer"
        })
      ];

      const updated = updateBlockTitle(blocks, "SF", "new-footer");

      expect(updated[0].value.anchorName).toBe("new-footer");
    });

    test("updates customID for blocks that support it (Row)", () => {
      const blocks: Block[] = [
        makeBlock("R", ElementTypes.Row, [], { customID: "old-row-id" })
      ];

      const updated = updateBlockTitle(blocks, "R", "new-row-id");

      expect(updated[0].value.customID).toBe("new-row-id");
      // Original blocks should not be mutated
      expect(blocks[0].value.customID).toBe("old-row-id");
    });

    test("updates customID for blocks that support it (Column)", () => {
      const blocks: Block[] = [
        makeBlock("C", ElementTypes.Column, [], { customID: "old-col-id" })
      ];

      const updated = updateBlockTitle(blocks, "C", "new-col-id");

      expect(updated[0].value.customID).toBe("new-col-id");
    });

    test("updates customID for blocks that support it (Button)", () => {
      const blocks: Block[] = [
        makeBlock("BTN", ElementTypes.Button, [], { customID: "old-btn-id" })
      ];

      const updated = updateBlockTitle(blocks, "BTN", "new-btn-id");

      expect(updated[0].value.customID).toBe("new-btn-id");
    });

    test("updates customID for blocks that support it (Icon)", () => {
      const blocks: Block[] = [
        makeBlock("ICON", ElementTypes.Icon, [], { customID: "old-icon-id" })
      ];

      const updated = updateBlockTitle(blocks, "ICON", "new-icon-id");

      expect(updated[0].value.customID).toBe("new-icon-id");
    });

    test("updates customID for blocks that support it (Wrapper)", () => {
      const blocks: Block[] = [
        makeBlock("W", ElementTypes.Wrapper, [], { customID: "old-wrapper-id" })
      ];

      const updated = updateBlockTitle(blocks, "W", "new-wrapper-id");

      expect(updated[0].value.customID).toBe("new-wrapper-id");
    });

    test("updates customID for blocks that support it (Cloneable)", () => {
      const blocks: Block[] = [
        makeBlock("CLONE", ElementTypes.Cloneable, [], {
          customID: "old-clone-id"
        })
      ];

      const updated = updateBlockTitle(blocks, "CLONE", "new-clone-id");

      expect(updated[0].value.customID).toBe("new-clone-id");
    });

    test("updates parent customID when block doesn't support it but parent does", () => {
      const blocks: Block[] = [
        makeBlock(
          "R",
          ElementTypes.Row,
          [makeBlock("RICHTEXT", ElementTypes.RichText)],
          { customID: "old-row-id" }
        )
      ];

      const updated = updateBlockTitle(blocks, "RICHTEXT", "new-title");

      // Parent Row should have customID updated
      expect(updated[0].value.customID).toBe("new-title");
      // RichText block should remain unchanged
      const richtext = (updated[0].value.items as Block[])[0];
      expect(richtext.value._id).toBe("RICHTEXT");
    });

    test("updates parent customID for nested blocks", () => {
      const blocks: Block[] = [
        makeBlock(
          "R",
          ElementTypes.Row,
          [
            makeBlock(
              "C",
              ElementTypes.Column,
              [makeBlock("RICHTEXT", ElementTypes.RichText)],
              { customID: "old-col-id" }
            )
          ],
          { customID: "old-row-id" }
        )
      ];

      const updated = updateBlockTitle(blocks, "RICHTEXT", "new-title");

      // Nearest parent that supports customID (Column) should be updated
      const col = (updated[0].value.items as Block[])[0];
      expect(col.value.customID).toBe("new-title");
      // Row should remain unchanged
      expect(updated[0].value.customID).toBe("old-row-id");
    });

    test("returns unchanged blocks when block doesn't support customID and has no parent that does", () => {
      const blocks: Block[] = [makeBlock("RICHTEXT", ElementTypes.RichText)];

      const updated = updateBlockTitle(blocks, "RICHTEXT", "new-title");

      // Should return the same blocks unchanged
      expect(updated).toEqual(blocks);
      expect(updated[0].value._id).toBe("RICHTEXT");
    });

    test("returns unchanged blocks when block ID is not found", () => {
      const blocks: Block[] = [
        makeBlock("R", ElementTypes.Row, [], { customID: "row-id" })
      ];

      const updated = updateBlockTitle(blocks, "NONEXISTENT", "new-title");

      // Should return the same blocks unchanged
      expect(updated).toEqual(blocks);
      expect(updated[0].value.customID).toBe("row-id");
    });

    test("preserves all other properties when updating", () => {
      const blocks: Block[] = [
        makeBlock("R", ElementTypes.Row, [], {
          customID: "old-id",
          cssId: "css-id",
          cssClass: "css-class",
          customClassName: "custom-class",
          showOnDesktop: "on",
          showOnTablet: "on",
          showOnMobile: "on"
        })
      ];

      const updated = updateBlockTitle(blocks, "R", "new-id");

      expect(updated[0].value.customID).toBe("new-id");
      expect(updated[0].value.cssId).toBe("css-id");
      expect(updated[0].value.cssClass).toBe("css-class");
      expect(updated[0].value.customClassName).toBe("custom-class");
      expect(updated[0].value.showOnDesktop).toBe("on");
      expect(updated[0].value.showOnTablet).toBe("on");
      expect(updated[0].value.showOnMobile).toBe("on");
    });

    test("handles nested structure correctly", () => {
      const blocks: Block[] = [
        makeBlock(
          "S",
          ElementTypes.Section,
          [
            makeBlock(
              "R",
              ElementTypes.Row,
              [
                makeBlock(
                  "C",
                  ElementTypes.Column,
                  [
                    makeBlock("BTN", ElementTypes.Button, [], {
                      customID: "old-btn-id"
                    })
                  ],
                  { customID: "old-col-id" }
                )
              ],
              { customID: "old-row-id" }
            )
          ],
          { anchorName: "old-section-anchor" }
        )
      ];

      // Update Button - should update Button's customID
      const updatedBtn = updateBlockTitle(blocks, "BTN", "new-btn-id");
      const btn = (
        (updatedBtn[0].value.items as Block[])[0].value.items as Block[]
      )[0].value.items as Block[];
      expect(btn[0].value.customID).toBe("new-btn-id");

      // Update Column - should update Column's customID
      const updatedCol = updateBlockTitle(blocks, "C", "new-col-id");
      const col = (
        (updatedCol[0].value.items as Block[])[0].value.items as Block[]
      )[0];
      expect(col.value.customID).toBe("new-col-id");

      // Update Section - should update Section's anchorName
      const updatedSec = updateBlockTitle(blocks, "S", "new-section-anchor");
      expect(updatedSec[0].value.anchorName).toBe("new-section-anchor");
    });

    test("handles multiple blocks at root level", () => {
      const blocks: Block[] = [
        makeBlock("S1", ElementTypes.Section, [], {
          anchorName: "section-1"
        }),
        makeBlock("S2", ElementTypes.Section, [], {
          anchorName: "section-2"
        }),
        makeBlock("R", ElementTypes.Row, [], { customID: "row-1" })
      ];

      const updated = updateBlockTitle(blocks, "S2", "new-section-2");

      expect(updated[0].value.anchorName).toBe("section-1"); // Unchanged
      expect(updated[1].value.anchorName).toBe("new-section-2"); // Updated
      expect(updated[2].value.customID).toBe("row-1"); // Unchanged
    });

    test("creates customID property if it doesn't exist", () => {
      const blocks: Block[] = [
        makeBlock("R", ElementTypes.Row, []) // No customID in value
      ];

      const updated = updateBlockTitle(blocks, "R", "new-id");

      expect(updated[0].value.customID).toBe("new-id");
    });

    test("creates anchorName property if it doesn't exist", () => {
      const blocks: Block[] = [
        makeBlock("S", ElementTypes.Section, []) // No anchorName in value
      ];

      const updated = updateBlockTitle(blocks, "S", "new-anchor");

      expect(updated[0].value.anchorName).toBe("new-anchor");
    });
  });
});
