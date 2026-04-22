import type { ElementModelType2 } from "visual/component/Elements/Types";
import type { FromTo } from "visual/editorComponents/Page/utils/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { Block } from "visual/types/Block";
import { buildMoveFromTo } from "../dnd";

// Helper to create element with a fixed ID
function el(
  type: string,
  id: string,
  items: ElementModelType2[] = [],
  extra: Record<string, unknown> = {}
): ElementModelType2 {
  return {
    type,
    value: { _id: id, items, ...extra }
  } as ElementModelType2;
}

// Helper to create a block structure
function createBlock(
  id: string,
  items: ElementModelType2[],
  type = ElementTypes.Section
): Block {
  return { type, value: { _id: id, items } } as Block;
}

// Common from shape for row/column/shortcode (excludes addable)
type FromWithPath = { itemType: string; itemPath: string[] };

describe("buildMoveFromTo", () => {
  interface MoveFromToTestCase {
    name: string;
    setup: () => {
      block: Block;
      sourceElement: ElementModelType2;
      sourceRelativePath: string[];
      targetContainer: ElementModelType2;
      targetIndex: number;
    };
    assert: (fromTo: FromTo) => void;
  }

  const testCases: MoveFromToTestCase[] = [
    // Row moves
    {
      name: "build FromRow when moving a Row to a SectionItem",
      setup() {
        const row = el(ElementTypes.Row, "row-1", [
          el(ElementTypes.Column, "col-1")
        ]);
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [row]);
        const targetSectionItem = el(ElementTypes.SectionItem, "si-2");
        const block = createBlock("block-1", [sectionItem, targetSectionItem]);

        return {
          block,
          sourceElement: row,
          sourceRelativePath: ["value", "items", "0", "value", "items", "0"],
          targetContainer: targetSectionItem,
          targetIndex: 0
        };
      },
      assert(fromTo) {
        const from = fromTo.from as FromWithPath;
        expect(from.itemType).toBe("row");
        expect(from.itemPath).toEqual(["si-1", "items", "0"]);
        expect(fromTo.to.containerType).toBe("section");
        expect(fromTo.to.itemPath).toEqual(["si-2", "items", "0"]);
      }
    },
    {
      name: "build FromRow when moving a Row to a Column",
      setup() {
        const row = el(ElementTypes.Row, "row-1");
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [row]);
        const targetColumn = el(ElementTypes.Column, "col-target");
        const block = createBlock("block-1", [sectionItem, targetColumn]);

        return {
          block,
          sourceElement: row,
          sourceRelativePath: ["value", "items", "0", "value", "items", "0"],
          targetContainer: targetColumn,
          targetIndex: 2
        };
      },
      assert(fromTo) {
        const from = fromTo.from as FromWithPath;
        expect(from.itemType).toBe("row");
        expect(from.itemPath).toEqual(["si-1", "items", "0"]);
        expect(fromTo.to.containerType).toBe("column");
        expect(fromTo.to.itemPath).toEqual(["col-target", "items", "2"]);
      }
    },

    // Column moves
    {
      name: "build FromColumn when moving a Column to a Row",
      setup() {
        const col1 = el(ElementTypes.Column, "col-1");
        const col2 = el(ElementTypes.Column, "col-2");
        const sourceRow = el(ElementTypes.Row, "row-1", [col1, col2]);
        const targetRow = el(ElementTypes.Row, "row-2");
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [
          sourceRow,
          targetRow
        ]);
        const block = createBlock("block-1", [sectionItem]);

        return {
          block,
          sourceElement: col1,
          sourceRelativePath: [
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0"
          ],
          targetContainer: targetRow,
          targetIndex: 0
        };
      },
      assert(fromTo) {
        const from = fromTo.from as FromWithPath & {
          containerPath: string[];
          containerType: string;
        };
        expect(from.itemType).toBe("column");
        expect(from.itemPath).toEqual(["row-1", "items", "0"]);
        expect(from.containerPath).toEqual(["row-1", "items"]);
        expect(from.containerType).toBe("row");
        expect(fromTo.to.containerType).toBe("row");
        expect(fromTo.to.itemPath).toEqual(["row-2", "items", "0"]);
        expect((fromTo.to as { containerPath: string[] }).containerPath).toEqual(["row-2", "items"]);
      }
    },
    {
      name: "build FromColumn when moving a Column to a SectionItem",
      setup() {
        const col = el(ElementTypes.Column, "col-1");
        const row = el(ElementTypes.Row, "row-1", [col]);
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [row]);
        const targetSectionItem = el(ElementTypes.SectionItem, "si-2");
        const block = createBlock("block-1", [sectionItem, targetSectionItem]);

        return {
          block,
          sourceElement: col,
          sourceRelativePath: [
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0"
          ],
          targetContainer: targetSectionItem,
          targetIndex: 0
        };
      },
      assert(fromTo) {
        const from = fromTo.from as FromWithPath;
        expect(from.itemType).toBe("column");
        expect(from.itemPath).toEqual(["row-1", "items", "0"]);
        expect(fromTo.to.containerType).toBe("section");
        expect(fromTo.to.itemPath).toEqual(["si-2", "items", "0"]);
      }
    },
    {
      name: "build FromColumn to column container type by default",
      setup() {
        const col = el(ElementTypes.Column, "col-1");
        const row = el(ElementTypes.Row, "row-1", [col]);
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [row]);
        const targetColumn = el(ElementTypes.Column, "col-target");
        const block = createBlock("block-1", [sectionItem, targetColumn]);

        return {
          block,
          sourceElement: col,
          sourceRelativePath: [
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0"
          ],
          targetContainer: targetColumn,
          targetIndex: 1
        };
      },
      assert(fromTo) {
        expect(fromTo.from.itemType).toBe("column");
        expect(fromTo.to.containerType).toBe("column");
        expect(fromTo.to.itemPath).toEqual(["col-target", "items", "1"]);
      }
    },

    // Shortcode moves - regular element
    {
      name: "build FromShortcode for regular element in Column",
      setup() {
        const richText = el(ElementTypes.RichText, "rt-1");
        const sourceColumn = el(ElementTypes.Column, "col-1", [richText]);
        const targetColumn = el(ElementTypes.Column, "col-2");
        const row = el(ElementTypes.Row, "row-1", [sourceColumn, targetColumn]);
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [row]);
        const block = createBlock("block-1", [sectionItem]);

        return {
          block,
          sourceElement: richText,
          sourceRelativePath: [
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0"
          ],
          targetContainer: targetColumn,
          targetIndex: 0
        };
      },
      assert(fromTo) {
        const from = fromTo.from as {
          itemType: string;
          itemIndex: number;
          itemPath: string[];
          containerPath: string[];
          containerType: string;
        };
        expect(from.itemType).toBe("shortcode");
        expect(from.itemIndex).toBe(0);
        expect(from.itemPath).toEqual(["col-1", "items", "0"]);
        expect(from.containerPath).toEqual(["col-1", "items"]);
        expect(from.containerType).toBe("column");
        expect(fromTo.to.containerType).toBe("column");
        expect(fromTo.to.itemPath).toEqual(["col-2", "items", "0"]);
      }
    },
    {
      name: "build FromShortcode for element in SectionItem (section target)",
      setup() {
        const richText = el(ElementTypes.RichText, "rt-1");
        const sourceSectionItem = el(ElementTypes.SectionItem, "si-1", [
          richText
        ]);
        const targetSectionItem = el(ElementTypes.SectionItem, "si-2");
        const block = createBlock("block-1", [
          sourceSectionItem,
          targetSectionItem
        ]);

        return {
          block,
          sourceElement: richText,
          sourceRelativePath: ["value", "items", "0", "value", "items", "0"],
          targetContainer: targetSectionItem,
          targetIndex: 1
        };
      },
      assert(fromTo) {
        const from = fromTo.from as {
          itemType: string;
          containerPath: string[];
          containerType: string;
        };
        expect(from.itemType).toBe("shortcode");
        expect(from.containerPath).toEqual(["si-1", "items"]);
        expect(from.containerType).toBe("section");
        expect(fromTo.to.containerType).toBe("section");
        expect(fromTo.to.itemPath).toEqual(["si-2", "items", "1"]);
      }
    },

    // Shortcode moves - Wrapper handling
    {
      name: "use Wrapper parent as from container when element is inside Wrapper",
      setup() {
        const richText = el(ElementTypes.RichText, "rt-1");
        const wrapper = el(ElementTypes.Wrapper, "wrap-1", [richText]);
        const sourceColumn = el(ElementTypes.Column, "col-1", [wrapper]);
        const targetColumn = el(ElementTypes.Column, "col-2");
        const row = el(ElementTypes.Row, "row-1", [sourceColumn, targetColumn]);
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [row]);
        const block = createBlock("block-1", [sectionItem]);

        return {
          block,
          sourceElement: richText,
          sourceRelativePath: [
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0"
          ],
          targetContainer: targetColumn,
          targetIndex: 0
        };
      },
      assert(fromTo) {
        const from = fromTo.from as {
          itemType: string;
          itemIndex: number;
          itemPath: string[];
          containerPath: string[];
          containerType: string;
        };
        expect(from.itemType).toBe("shortcode");
        // Wrapper's parent is col-1, wrapper is at index 0
        expect(from.containerPath).toEqual(["col-1", "items"]);
        expect(from.itemPath).toEqual(["col-1", "items", "0"]);
        expect(from.itemIndex).toBe(0);
        expect(from.containerType).toBe("column");
      }
    },
    {
      name: "use Wrapper2 parent as from container when element is inside Wrapper2",
      setup() {
        const button = el(ElementTypes.Button, "btn-1");
        const wrapper2 = el(ElementTypes.Wrapper2, "wrap2-1", [button]);
        const otherEl = el(ElementTypes.RichText, "rt-1");
        const sourceColumn = el(ElementTypes.Column, "col-1", [
          otherEl,
          wrapper2
        ]);
        const targetColumn = el(ElementTypes.Column, "col-2");
        const row = el(ElementTypes.Row, "row-1", [sourceColumn, targetColumn]);
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [row]);
        const block = createBlock("block-1", [sectionItem]);

        return {
          block,
          sourceElement: button,
          sourceRelativePath: [
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "1",
            "value", "items", "0"
          ],
          targetContainer: targetColumn,
          targetIndex: 0
        };
      },
      assert(fromTo) {
        const from = fromTo.from as {
          itemType: string;
          itemIndex: number;
          itemPath: string[];
          containerPath: string[];
          containerType: string;
        };
        expect(from.itemType).toBe("shortcode");
        // Wrapper2's parent is col-1, wrapper2 is at index 1
        expect(from.containerPath).toEqual(["col-1", "items"]);
        expect(from.itemPath).toEqual(["col-1", "items", "1"]);
        expect(from.itemIndex).toBe(1);
        expect(from.containerType).toBe("column");
      }
    },

    // Shortcode moves - Cloneable handling
    {
      name: "use Cloneable as from container when element is inside Cloneable",
      setup() {
        const button1 = el(ElementTypes.Button, "btn-1");
        const button2 = el(ElementTypes.Button, "btn-2");
        const cloneable = el(ElementTypes.Cloneable, "clone-1", [
          button1,
          button2
        ]);
        const sourceColumn = el(ElementTypes.Column, "col-1", [cloneable]);
        const targetColumn = el(ElementTypes.Column, "col-2");
        const row = el(ElementTypes.Row, "row-1", [sourceColumn, targetColumn]);
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [row]);
        const block = createBlock("block-1", [sectionItem]);

        return {
          block,
          sourceElement: button1,
          sourceRelativePath: [
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0"
          ],
          targetContainer: targetColumn,
          targetIndex: 0
        };
      },
      assert(fromTo) {
        const from = fromTo.from as {
          itemType: string;
          itemIndex: number;
          itemPath: string[];
          containerPath: string[];
          containerType: string;
        };
        expect(from.itemType).toBe("shortcode");
        expect(from.containerPath).toEqual(["clone-1", "items"]);
        expect(from.itemPath).toEqual(["clone-1", "items", "0"]);
        expect(from.itemIndex).toBe(0);
        expect(from.containerType).toBe("cloneable");
      }
    },

    // Top-level element (sourceParentPath.length === 0)
    {
      name: "use block as from container for top-level element",
      setup() {
        const sectionItem1 = el(ElementTypes.SectionItem, "si-1");
        const sectionItem2 = el(ElementTypes.SectionItem, "si-2");
        const block = createBlock("block-1", [sectionItem1, sectionItem2]);

        return {
          block,
          sourceElement: sectionItem1,
          sourceRelativePath: ["value", "items", "0"],
          targetContainer: sectionItem2,
          targetIndex: 0
        };
      },
      assert(fromTo) {
        const from = fromTo.from as {
          itemType: string;
          itemIndex: number;
          itemPath: string[];
          containerPath: string[];
          containerType: string;
        };
        expect(from.itemType).toBe("shortcode");
        expect(from.containerPath).toEqual(["block-1", "items"]);
        expect(from.itemPath).toEqual(["block-1", "items", "0"]);
        expect(from.itemIndex).toBe(0);
        // Section (block type) maps to "column" via mapToDndContainerType default
        expect(from.containerType).toBe("column");
        // SectionItem target maps to "section"
        expect(fromTo.to.containerType).toBe("section");
      }
    },

    // Target index in to path
    {
      name: "include targetIndex in to.itemIndex for shortcode moves",
      setup() {
        const richText = el(ElementTypes.RichText, "rt-1");
        const sourceColumn = el(ElementTypes.Column, "col-1", [richText]);
        const existing = el(ElementTypes.Image, "img-1");
        const targetColumn = el(ElementTypes.Column, "col-2", [existing]);
        const row = el(ElementTypes.Row, "row-1", [sourceColumn, targetColumn]);
        const sectionItem = el(ElementTypes.SectionItem, "si-1", [row]);
        const block = createBlock("block-1", [sectionItem]);

        return {
          block,
          sourceElement: richText,
          sourceRelativePath: [
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0",
            "value", "items", "0"
          ],
          targetContainer: targetColumn,
          targetIndex: 1
        };
      },
      assert(fromTo) {
        expect(fromTo.to.itemPath).toEqual(["col-2", "items", "1"]);
        expect(
          (fromTo.to as { itemIndex?: number }).itemIndex
        ).toBe(1);
      }
    }
  ];

  it.each(testCases)(
    "should $name",
    ({ setup, assert }) => {
      const {
        block,
        sourceElement,
        sourceRelativePath,
        targetContainer,
        targetIndex
      } = setup();
      const fromTo = buildMoveFromTo(
        block,
        sourceElement,
        sourceRelativePath,
        targetContainer,
        targetIndex
      );
      assert(fromTo);
    }
  );
});
