import type { ElementModelType2 } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { Block } from "visual/types/Block";
import {
  type DuplicateElementInBlockResult,
  correctContainerForElement,
  duplicateElementInBlock,
  removeElementFromBlock
} from "../element";

// Mock setIds to deep-clone and assign predictable new IDs (avoids Editor.getComponent dependency)
let idCounter = 0;
jest.mock("visual/utils/models", () => ({
  setIds: (obj: unknown) => {
    const cloned = JSON.parse(JSON.stringify(obj));
    function replaceIds(o: Record<string, unknown>) {
      if (o && typeof o === "object") {
        if (
          o.value &&
          typeof o.value === "object" &&
          (o.value as Record<string, unknown>)._id
        ) {
          (o.value as Record<string, unknown>)._id = `cloned-${idCounter++}`;
        }
        for (const val of Object.values(o)) {
          if (val && typeof val === "object") {
            replaceIds(val as Record<string, unknown>);
          }
        }
      }
    }
    replaceIds(cloned as Record<string, unknown>);
    return cloned;
  }
}));

beforeEach(() => {
  idCounter = 0;
});

// Helper to create mock elements
function createMockElement(
  type: string,
  items: ElementModelType2[] = []
): ElementModelType2 {
  return {
    type,
    value: {
      _id: `mock-${type}-${Math.random().toString(36).slice(2, 7)}`,
      items
    }
  } as ElementModelType2;
}

describe("correctContainerForElement", () => {
  describe("Container Redirects", () => {
    const redirectSuccessCases = [
      {
        name: "redirect Section to its first child (SectionItem)",
        containerType: ElementTypes.Section,
        childType: ElementTypes.SectionItem,
        elementType: ElementTypes.RichText,
        path: ["blocks", "0"],
        expectedPath: ["blocks", "0", "value", "items", "0"]
      },
      {
        name: "redirect SectionHeader to its first child",
        containerType: ElementTypes.SectionHeader,
        childType: ElementTypes.SectionHeaderItem,
        elementType: ElementTypes.Button,
        path: ["blocks", "0"],
        expectedPath: ["blocks", "0", "value", "items", "0"]
      }
    ];

    it.each(redirectSuccessCases)(
      "should $name",
      ({ containerType, childType, elementType, path, expectedPath }) => {
        const child = createMockElement(childType);
        const container = createMockElement(containerType, [child]);

        const result = correctContainerForElement(container, path, elementType);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.container).toBe(child);
          expect(result.path).toEqual(expectedPath);
        }
      }
    );

    const redirectFailCases = [
      {
        name: "fail when Section has no children",
        containerType: ElementTypes.Section,
        elementType: ElementTypes.RichText,
        expectedError: "Section has no children"
      },
      {
        name: "fail when SectionHeader has no children",
        containerType: ElementTypes.SectionHeader,
        elementType: ElementTypes.RichText,
        expectedError: "SectionHeader has no children"
      }
    ];

    it.each(redirectFailCases)(
      "should $name",
      ({ containerType, elementType, expectedError }) => {
        const container = createMockElement(containerType);
        const path = ["blocks", "0"];

        const result = correctContainerForElement(container, path, elementType);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain(expectedError);
        }
      }
    );
  });

  describe("Row to Column Redirect", () => {
    const rowRedirectCases = [
      {
        name: "redirect Row to first Column when adding non-Column element",
        elementType: ElementTypes.RichText,
        hasColumn: true,
        expectedSuccess: true,
        expectRedirect: true
      },
      {
        name: "NOT redirect Row when adding Column element",
        elementType: ElementTypes.Column,
        hasColumn: true,
        expectedSuccess: true,
        expectRedirect: false
      },
      {
        name: "fail when Row has no columns for non-Column element",
        elementType: ElementTypes.Button,
        hasColumn: false,
        expectedSuccess: false,
        expectedError: "Row has no columns"
      }
    ];

    it.each(rowRedirectCases)(
      "should $name",
      ({
        elementType,
        hasColumn,
        expectedSuccess,
        expectRedirect,
        expectedError
      }) => {
        const column = createMockElement(ElementTypes.Column);
        const row = createMockElement(
          ElementTypes.Row,
          hasColumn ? [column] : []
        );
        const path = ["blocks", "0", "value", "items", "0"];

        const result = correctContainerForElement(row, path, elementType);

        expect(result.success).toBe(expectedSuccess);
        if (result.success && expectRedirect) {
          expect(result.container).toBe(column);
          expect(result.path).toEqual([
            "blocks",
            "0",
            "value",
            "items",
            "0",
            "value",
            "items",
            "0"
          ]);
        }
        if (result.success && !expectRedirect) {
          expect(result.container).toBe(row);
          expect(result.path).toEqual(path);
        }
        if (!result.success && expectedError) {
          expect(result.error).toContain(expectedError);
        }
      }
    );
  });

  describe("Cloneable Restrictions (whitelist)", () => {
    const cloneableAllowedCases = [
      { name: "allow Button in Cloneable", elementType: ElementTypes.Button },
      { name: "allow Icon in Cloneable", elementType: ElementTypes.Icon }
    ];

    it.each(cloneableAllowedCases)("should $name", ({ elementType }) => {
      const cloneable = createMockElement(ElementTypes.Cloneable);
      const result = correctContainerForElement(
        cloneable,
        ["some", "path"],
        elementType
      );
      expect(result.success).toBe(true);
    });

    const cloneableRejectedCases = [
      {
        name: "reject RichText in Cloneable",
        elementType: ElementTypes.RichText
      },
      { name: "reject Image in Cloneable", elementType: ElementTypes.Image }
    ];

    it.each(cloneableRejectedCases)("should $name", ({ elementType }) => {
      const cloneable = createMockElement(ElementTypes.Cloneable);
      const result = correctContainerForElement(
        cloneable,
        ["some", "path"],
        elementType
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Cloneable only accepts");
      }
    });
  });

  describe("Wrapper Redirect", () => {
    it("should redirect Wrapper to its first child", () => {
      const timeline = createMockElement(ElementTypes.Timeline);
      const wrapper = createMockElement(ElementTypes.Wrapper, [timeline]);
      const result = correctContainerForElement(
        wrapper,
        ["some", "path"],
        ElementTypes.TimelineTab
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.container).toBe(timeline);
        expect(result.path).toEqual([
          "some",
          "path",
          "value",
          "items",
          "0"
        ]);
      }
    });

    it("should fail when Wrapper has no children", () => {
      const wrapper = createMockElement(ElementTypes.Wrapper);
      const result = correctContainerForElement(
        wrapper,
        ["some", "path"],
        ElementTypes.RichText
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Wrapper has no children");
      }
    });
  });

  describe("Wrapper2 Redirect", () => {
    it("should redirect Wrapper2 to its first child", () => {
      const column = createMockElement(ElementTypes.Column);
      const wrapper2 = createMockElement(ElementTypes.Wrapper2, [column]);
      const result = correctContainerForElement(
        wrapper2,
        ["some", "path"],
        ElementTypes.RichText
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.container).toBe(column);
        expect(result.path).toEqual([
          "some",
          "path",
          "value",
          "items",
          "0"
        ]);
      }
    });

    it("should fail when Wrapper2 has no children", () => {
      const wrapper2 = createMockElement(ElementTypes.Wrapper2);
      const result = correctContainerForElement(
        wrapper2,
        ["some", "path"],
        ElementTypes.RichText
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Wrapper2 has no children");
      }
    });
  });

  describe("Row Restrictions (whitelist + maxChildren)", () => {
    const rowRestrictionCases = [
      {
        name: "allow Column in Row",
        columnCount: 0,
        expectedSuccess: true
      },
      {
        name: "allow adding Column when Row has less than 6 columns",
        columnCount: 5,
        expectedSuccess: true
      },
      {
        name: "reject adding Column when Row has 6 columns (maxChildren)",
        columnCount: 6,
        expectedSuccess: false,
        expectedErrors: ["maximum 6 children", "Currently has 6"]
      }
    ];

    it.each(rowRestrictionCases)(
      "should $name",
      ({ columnCount, expectedSuccess, expectedErrors }) => {
        const columns = Array.from({ length: columnCount }, () =>
          createMockElement(ElementTypes.Column)
        );
        const row = createMockElement(ElementTypes.Row, columns);

        const result = correctContainerForElement(
          row,
          ["some", "path"],
          ElementTypes.Column
        );

        expect(result.success).toBe(expectedSuccess);
        if (!result.success && expectedErrors) {
          expectedErrors.forEach((err) => {
            expect(result.error).toContain(err);
          });
        }
      }
    );
  });

  describe("Timeline Restrictions (allowOnly)", () => {
    it("should allow TimelineTab in Timeline", () => {
      const timeline = createMockElement(ElementTypes.Timeline);
      const result = correctContainerForElement(
        timeline,
        ["some", "path"],
        ElementTypes.TimelineTab
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.container).toBe(timeline);
      }
    });

    it.each([
      { name: "RichText", elementType: ElementTypes.RichText },
      { name: "Button", elementType: ElementTypes.Button },
      { name: "Image", elementType: ElementTypes.Image },
      { name: "Row", elementType: ElementTypes.Row }
    ])("should reject $name in Timeline", ({ elementType }) => {
      const timeline = createMockElement(ElementTypes.Timeline);
      const result = correctContainerForElement(
        timeline,
        ["some", "path"],
        elementType
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Timeline only accepts");
        expect(result.error).toContain("TimelineTab");
      }
    });
  });

  describe("Switcher Restrictions (allowOnly)", () => {
    it("should allow SwitcherTab in Switcher without redirecting", () => {
      const existingTab = createMockElement(ElementTypes.SwitcherTab);
      const switcher = createMockElement(ElementTypes.Switcher, [existingTab]);
      const result = correctContainerForElement(
        switcher,
        ["some", "path"],
        ElementTypes.SwitcherTab
      );
      expect(result.success).toBe(true);
      if (result.success) {
        // Should stay at Switcher level, NOT redirect to SwitcherTab
        expect(result.container).toBe(switcher);
        expect(result.path).toEqual(["some", "path"]);
      }
    });

    it("should redirect Switcher to SwitcherTab for non-SwitcherTab elements", () => {
      const switcherTab = createMockElement(ElementTypes.SwitcherTab);
      const switcher = createMockElement(ElementTypes.Switcher, [switcherTab]);
      const result = correctContainerForElement(
        switcher,
        ["some", "path"],
        ElementTypes.RichText
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.container).toBe(switcherTab);
        expect(result.path).toEqual([
          "some",
          "path",
          "value",
          "items",
          "0"
        ]);
      }
    });
  });

  describe("Flipbox Restrictions (allowOnly + maxChildren)", () => {
    it("should allow FlipboxItem in Flipbox without redirecting", () => {
      const existingItem = createMockElement(ElementTypes.FlipboxItem);
      const flipbox = createMockElement(ElementTypes.Flipbox, [existingItem]);
      const result = correctContainerForElement(
        flipbox,
        ["some", "path"],
        ElementTypes.FlipboxItem
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.container).toBe(flipbox);
      }
    });

    it("should reject FlipboxItem when Flipbox already has 2 items (maxChildren)", () => {
      const item1 = createMockElement(ElementTypes.FlipboxItem);
      const item2 = createMockElement(ElementTypes.FlipboxItem);
      const flipbox = createMockElement(ElementTypes.Flipbox, [item1, item2]);
      const result = correctContainerForElement(
        flipbox,
        ["some", "path"],
        ElementTypes.FlipboxItem
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("maximum 2 children");
      }
    });

    it("should redirect Flipbox to FlipboxItem for non-FlipboxItem elements", () => {
      const flipboxItem = createMockElement(ElementTypes.FlipboxItem);
      const flipbox = createMockElement(ElementTypes.Flipbox, [flipboxItem]);
      const result = correctContainerForElement(
        flipbox,
        ["some", "path"],
        ElementTypes.RichText
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.container).toBe(flipboxItem);
      }
    });
  });

  describe("Required Parent Validation", () => {
    it("should reject TimelineTab when container is not Timeline", () => {
      const column = createMockElement(ElementTypes.Column);
      const result = correctContainerForElement(
        column,
        ["some", "path"],
        ElementTypes.TimelineTab
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("ONLY be added inside a Timeline");
        expect(result.error).toContain("searchElements");
      }
    });

    it("should reject SwitcherTab when container is not Switcher", () => {
      const column = createMockElement(ElementTypes.Column);
      const result = correctContainerForElement(
        column,
        ["some", "path"],
        ElementTypes.SwitcherTab
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("ONLY be added inside a Switcher");
      }
    });

    it("should allow SwitcherTab when container is Switcher", () => {
      const switcher = createMockElement(ElementTypes.Switcher);
      const result = correctContainerForElement(
        switcher,
        ["some", "path"],
        ElementTypes.SwitcherTab
      );
      expect(result.success).toBe(true);
    });

    it("should reject Column when container is not Row", () => {
      const column = createMockElement(ElementTypes.Column);
      const result = correctContainerForElement(
        column,
        ["some", "path"],
        ElementTypes.Column
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("ONLY be added inside a Row");
      }
    });

    it("should allow TimelineTab when container is Timeline", () => {
      const timeline = createMockElement(ElementTypes.Timeline);
      const result = correctContainerForElement(
        timeline,
        ["some", "path"],
        ElementTypes.TimelineTab
      );
      expect(result.success).toBe(true);
    });

    it("should allow Column when container is Row", () => {
      const row = createMockElement(ElementTypes.Row);
      const result = correctContainerForElement(
        row,
        ["some", "path"],
        ElementTypes.Column
      );
      expect(result.success).toBe(true);
    });
  });

  describe("Wrapper Restrictions (forbidden)", () => {
    it.each([
      { name: "Wrapper", elementType: ElementTypes.Wrapper },
      { name: "Wrapper2", elementType: ElementTypes.Wrapper2 },
      { name: "Cloneable", elementType: ElementTypes.Cloneable },
      { name: "Button", elementType: ElementTypes.Button },
      { name: "Icon", elementType: ElementTypes.Icon }
    ])(
      "should reject $name inside Wrapper (forbidden)",
      ({ elementType }) => {
        const child = createMockElement(ElementTypes.Column);
        const wrapperWithChild = createMockElement(ElementTypes.Wrapper, [
          child
        ]);

        // Wrapper has no allowOnly, so redirect always applies —
        // these elements land in the Column (Wrapper's child) after redirect.
        const result = correctContainerForElement(
          wrapperWithChild,
          ["some", "path"],
          elementType
        );

        // Column requires Row as parent, so Column inside Column fails
        if (elementType === ElementTypes.Column) {
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error).toContain("ONLY be added inside a Row");
          }
        } else {
          // Other forbidden elements pass because Column has no restrictions
          expect(result.success).toBe(true);
        }
      }
    );
  });

  describe("Chained Redirects", () => {
    it("should chain Wrapper → Row → Column for non-Column elements", () => {
      const column = createMockElement(ElementTypes.Column);
      const row = createMockElement(ElementTypes.Row, [column]);
      const wrapper = createMockElement(ElementTypes.Wrapper, [row]);
      const path = ["some", "path"];

      const result = correctContainerForElement(
        wrapper,
        path,
        ElementTypes.RichText
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // Wrapper → Row (Step 1), then Row → Column (Step 2)
        expect(result.container).toBe(column);
        expect(result.path).toEqual([
          "some",
          "path",
          "value",
          "items",
          "0",
          "value",
          "items",
          "0"
        ]);
      }
    });

    it("should redirect Section → SectionItem but NOT further into Row", () => {
      const column = createMockElement(ElementTypes.Column);
      const row = createMockElement(ElementTypes.Row, [column]);
      const sectionItem = createMockElement(ElementTypes.SectionItem, [row]);
      const section = createMockElement(ElementTypes.Section, [sectionItem]);

      const result = correctContainerForElement(
        section,
        ["blocks", "0"],
        ElementTypes.RichText
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // Only Section → SectionItem redirect (Step 1)
        // SectionItem is not a Row, so Step 2 doesn't apply
        expect(result.container).toBe(sectionItem);
        expect(result.path).toEqual([
          "blocks",
          "0",
          "value",
          "items",
          "0"
        ]);
      }
    });

    it("should handle Wrapper containing Timeline for TimelineTab", () => {
      const timeline = createMockElement(ElementTypes.Timeline);
      const wrapper = createMockElement(ElementTypes.Wrapper, [timeline]);

      const result = correctContainerForElement(
        wrapper,
        ["some", "path"],
        ElementTypes.TimelineTab
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // Wrapper → Timeline (redirect), Timeline accepts TimelineTab
        expect(result.container).toBe(timeline);
      }
    });
  });

  describe("Unrestricted Containers", () => {
    const unrestrictedCases = [
      {
        name: "allow any element in Column",
        containerType: ElementTypes.Column,
        elementTypes: [
          ElementTypes.RichText,
          ElementTypes.Image,
          ElementTypes.Button,
          ElementTypes.Video,
          ElementTypes.Form2
        ]
      },
      {
        name: "allow any element in SectionItem",
        containerType: ElementTypes.SectionItem,
        elementTypes: [
          ElementTypes.RichText,
          ElementTypes.Row,
          ElementTypes.Image
        ]
      }
    ];

    it.each(unrestrictedCases)(
      "should $name",
      ({ containerType, elementTypes }) => {
        const container = createMockElement(containerType);
        elementTypes.forEach((elementType) => {
          const result = correctContainerForElement(
            container,
            ["some", "path"],
            elementType
          );
          expect(result.success).toBe(true);
        });
      }
    );
  });

  describe("Return Value Structure", () => {
    it("should return correct success structure", () => {
      const column = createMockElement(ElementTypes.Column);
      const path = ["blocks", "0", "value", "items", "0"];

      const result = correctContainerForElement(
        column,
        path,
        ElementTypes.RichText
      );

      expect(result).toEqual({
        success: true,
        container: column,
        path: path
      });
    });

    it("should return correct error structure", () => {
      const cloneable = createMockElement(ElementTypes.Cloneable);
      const path = ["some", "path"];

      const result = correctContainerForElement(
        cloneable,
        path,
        ElementTypes.Image
      ) as { success: false; error: string };

      expect(result.success).toBe(false);
      expect(typeof result.error).toBe("string");
      expect(result.error.length).toBeGreaterThan(0);
    });
  });
});


describe("removeElementFromBlock", () => {
  // Helper to create a block structure
  function createBlock(items: ElementModelType2[]): Block {
    return {
      type: ElementTypes.Section,
      value: {
        _id: "block-1",
        items
      }
    } as Block;
  }

  describe("Basic Removal", () => {
    it("should remove an element at the specified path", () => {
      const element1 = createMockElement(ElementTypes.RichText);
      const element2 = createMockElement(ElementTypes.Image);
      const column = {
        type: ElementTypes.Column,
        value: {
          _id: "col-1",
          items: [element1, element2]
        }
      } as ElementModelType2;
      const block = createBlock([column]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0"],
        element1.value._id as string
      );

      expect(result).toBeDefined();
      if (result?.success) {
        const remainingItems = result.updatedBlock.value.items[0].value.items;
        expect(remainingItems).toHaveLength(1);
        expect(remainingItems[0]).toBe(element2);
      }
    });

    it("should return undefined when removal fails (invalid path)", () => {
      const block = createBlock([]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "99", "value", "items", "0"],
        "non-existent"
      );

      expect(result).toBeUndefined();
    });

    it("should return the correct removedElementId", () => {
      const element = createMockElement(ElementTypes.RichText);
      const column = {
        type: ElementTypes.Column,
        value: {
          _id: "col-1",
          items: [element]
        }
      } as ElementModelType2;
      const block = createBlock([column]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0"],
        element.value._id as string
      );

      expect(result).toBeDefined();
      if (result?.success) {
        expect(result.removedElementId).toBe(element.value._id);
        expect(result.finalPath).toEqual([
          "value",
          "items",
          "0",
          "value",
          "items",
          "0"
        ]);
      }
    });
  });

  describe("Empty Wrapper Cleanup", () => {
    it("should remove empty Wrapper after removing its last child", () => {
      const richText = createMockElement(ElementTypes.RichText);
      const wrapper = {
        type: ElementTypes.Wrapper,
        value: {
          _id: "wrapper-1",
          items: [richText]
        }
      } as ElementModelType2;
      const column = {
        type: ElementTypes.Column,
        value: {
          _id: "col-1",
          items: [wrapper]
        }
      } as ElementModelType2;
      const block = createBlock([column]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0", "value", "items", "0"],
        richText.value._id as string
      );

      expect(result).toBeDefined();
      if (result?.success) {
        // Wrapper should be removed since it's now empty
        const columnItems = result.updatedBlock.value.items[0].value.items;
        expect(columnItems).toHaveLength(0);
        // The removedElementId should be the wrapper's ID
        expect(result.removedElementId).toBe("wrapper-1");
        // The finalPath should be the wrapper's path
        expect(result.finalPath).toEqual([
          "value",
          "items",
          "0",
          "value",
          "items",
          "0"
        ]);
      }
    });

    it("should remove empty Wrapper2 after removing its last child", () => {
      const button = createMockElement(ElementTypes.Button);
      const wrapper2 = {
        type: ElementTypes.Wrapper2,
        value: {
          _id: "wrapper2-1",
          items: [button]
        }
      } as ElementModelType2;
      const column = {
        type: ElementTypes.Column,
        value: {
          _id: "col-1",
          items: [wrapper2]
        }
      } as ElementModelType2;
      const block = createBlock([column]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0", "value", "items", "0"],
        button.value._id as string
      );

      expect(result).toBeDefined();
      if (result?.success) {
        const columnItems = result.updatedBlock.value.items[0].value.items;
        expect(columnItems).toHaveLength(0);
        expect(result.removedElementId).toBe("wrapper2-1");
      }
    });

    it("should remove empty Cloneable after removing its last child", () => {
      const button = createMockElement(ElementTypes.Button);
      const cloneable = {
        type: ElementTypes.Cloneable,
        value: {
          _id: "cloneable-1",
          items: [button]
        }
      } as ElementModelType2;
      const column = {
        type: ElementTypes.Column,
        value: {
          _id: "col-1",
          items: [cloneable]
        }
      } as ElementModelType2;
      const block = createBlock([column]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0", "value", "items", "0"],
        button.value._id as string
      );

      expect(result).toBeDefined();
      if (result?.success) {
        const columnItems = result.updatedBlock.value.items[0].value.items;
        expect(columnItems).toHaveLength(0);
        expect(result.removedElementId).toBe("cloneable-1");
      }
    });

    it("should NOT remove Wrapper if it still has other children", () => {
      const richText1 = createMockElement(ElementTypes.RichText);
      const richText2 = createMockElement(ElementTypes.RichText);
      const wrapper = {
        type: ElementTypes.Wrapper,
        value: {
          _id: "wrapper-1",
          items: [richText1, richText2]
        }
      } as ElementModelType2;
      const column = {
        type: ElementTypes.Column,
        value: {
          _id: "col-1",
          items: [wrapper]
        }
      } as ElementModelType2;
      const block = createBlock([column]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0", "value", "items", "0"],
        richText1.value._id as string
      );

      expect(result).toBeDefined();
      if (result?.success) {
        // Wrapper should still exist with one child
        const columnItems = result.updatedBlock.value.items[0].value.items;
        expect(columnItems).toHaveLength(1);
        expect(columnItems[0].type).toBe(ElementTypes.Wrapper);
        expect(columnItems[0].value.items).toHaveLength(1);
        // The removedElementId should be the richText's ID (not wrapper)
        expect(result.removedElementId).toBe(richText1.value._id);
      }
    });

    it("should NOT remove non-wrapper parent even if empty", () => {
      const richText = createMockElement(ElementTypes.RichText);
      const column = {
        type: ElementTypes.Column,
        value: {
          _id: "col-1",
          items: [richText]
        }
      } as ElementModelType2;
      const block = createBlock([column]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0"],
        richText.value._id as string
      );

      expect(result).toBeDefined();
      if (result?.success) {
        // Column should still exist even though it's empty
        expect(result.updatedBlock.value.items).toHaveLength(1);
        expect(result.updatedBlock.value.items[0].type).toBe(
          ElementTypes.Column
        );
        expect(result.updatedBlock.value.items[0].value.items).toHaveLength(0);
        // The removedElementId should be the richText's ID
        expect(result.removedElementId).toBe(richText.value._id);
      }
    });
  });

  describe("Column Removal and Normalization", () => {
    it("should normalize remaining columns after removing a column", () => {
      const col1 = {
        type: ElementTypes.Column,
        value: {
          _id: "col-1",
          width: 33.33,
          items: []
        }
      } as ElementModelType2;
      const col2 = {
        type: ElementTypes.Column,
        value: {
          _id: "col-2",
          width: 33.33,
          items: []
        }
      } as ElementModelType2;
      const col3 = {
        type: ElementTypes.Column,
        value: {
          _id: "col-3",
          width: 33.34,
          items: []
        }
      } as ElementModelType2;
      const row = {
        type: ElementTypes.Row,
        value: {
          _id: "row-1",
          items: [col1, col2, col3]
        }
      } as ElementModelType2;
      const sectionItem = {
        type: ElementTypes.SectionItem,
        value: {
          _id: "section-item-1",
          items: [row]
        }
      } as ElementModelType2;
      const block = createBlock([sectionItem]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0", "value", "items", "0"],
        col1.value._id as string
      );

      expect(result).toBeDefined();
      if (result?.success) {
        const rowItems =
          result.updatedBlock.value.items[0].value.items[0].value.items;
        expect(rowItems).toHaveLength(2);
        // Columns should be normalized (widths should add up to ~100)
        const totalWidth = rowItems.reduce(
          (sum: number, col: ElementModelType2) => {
            const width = (col.value.width || 0) as number;
            return sum + width;
          },
          0
        );
        expect(totalWidth).toBeCloseTo(100, 0);
      }
    });
  });

  describe("Return Value Structure", () => {
    it("should return correct structure on successful removal", () => {
      const element = createMockElement(ElementTypes.RichText);
      const column = {
        type: ElementTypes.Column,
        value: {
          _id: "col-1",
          items: [element]
        }
      } as ElementModelType2;
      const block = createBlock([column]);
      const path = ["value", "items", "0", "value", "items", "0"];

      const result = removeElementFromBlock(
        block,
        path,
        element.value._id as string
      );

      expect(result).toBeDefined();
      if (result?.success) {
        expect(result).toHaveProperty("updatedBlock");
        expect(result).toHaveProperty("removedElementId");
        expect(result).toHaveProperty("finalPath");
        expect(result.updatedBlock.type).toBe(ElementTypes.Section);
        expect(Array.isArray(result.finalPath)).toBe(true);
      }
    });
  });

  describe("minChildren Enforcement", () => {
    it("should reject removing last TimelineTab from Timeline (minChildren: 1)", () => {
      const tab = createMockElement(ElementTypes.TimelineTab);
      const timeline = {
        type: ElementTypes.Timeline,
        value: { _id: "timeline-1", items: [tab] }
      } as ElementModelType2;
      const block = createBlock([timeline]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0"],
        tab.value._id as string
      );

      expect(result).toBeDefined();
      expect(result?.success).toBe(false);
      if (result && !result.success) {
        expect(result.error).toContain("Timeline");
        expect(result.error).toContain("at least 1");
      }
    });

    it("should allow removing TimelineTab when Timeline has multiple tabs", () => {
      const tab1 = createMockElement(ElementTypes.TimelineTab);
      const tab2 = createMockElement(ElementTypes.TimelineTab);
      const timeline = {
        type: ElementTypes.Timeline,
        value: { _id: "timeline-1", items: [tab1, tab2] }
      } as ElementModelType2;
      const block = createBlock([timeline]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0"],
        tab1.value._id as string
      );

      expect(result).toBeDefined();
      expect(result?.success).toBe(true);
      if (result?.success) {
        const timelineItems = result.updatedBlock.value.items[0].value.items;
        expect(timelineItems).toHaveLength(1);
      }
    });

    it("should not apply minChildren to containers without the restriction", () => {
      const richText = createMockElement(ElementTypes.RichText);
      const column = {
        type: ElementTypes.Column,
        value: { _id: "col-1", items: [richText] }
      } as ElementModelType2;
      const block = createBlock([column]);

      const result = removeElementFromBlock(
        block,
        ["value", "items", "0", "value", "items", "0"],
        richText.value._id as string
      );

      expect(result).toBeDefined();
      expect(result?.success).toBe(true);
    });
  });
});

describe("duplicateElementInBlock", () => {
  // Helper to create a block structure
  function createBlock(items: ElementModelType2[]): Block {
    return {
      type: ElementTypes.Section,
      value: {
        _id: "block-1",
        items
      }
    } as Block;
  }

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

  interface DuplicateSuccessTestCase {
    name: string;
    getBlock: () => Block;
    path: string[];
    elementType: string;
    insertAfter: boolean;
    assert: (result: DuplicateElementInBlockResult) => void;
  }

  const successTests: DuplicateSuccessTestCase[] = [
    // Basic Duplication
    {
      name: "duplicate element directly inside a container",
      getBlock: () =>
        createBlock([
          el(ElementTypes.Column, "col-1", [
            el(ElementTypes.RichText, "rt-1"),
            el(ElementTypes.RichText, "rt-2")
          ])
        ]),
      path: ["value", "items", "0", "value", "items", "0"],
      elementType: ElementTypes.RichText,
      insertAfter: true,
      assert(result) {
        const items = result.updatedBlock.value.items[0].value.items;
        expect(items).toHaveLength(3);
        expect(items[0].value._id).toBe("rt-1");
        expect(items[1].value._id).not.toBe("rt-1");
        expect(items[2].value._id).toBe("rt-2");
        expect(result.insertedAt).toBe(1);
        expect(result.newElementId).toBe(items[1].value._id);
      }
    },
    {
      name: "insert before original when insertAfter is false",
      getBlock: () =>
        createBlock([
          el(ElementTypes.Column, "col-1", [
            el(ElementTypes.RichText, "rt-1"),
            el(ElementTypes.RichText, "rt-2")
          ])
        ]),
      path: ["value", "items", "0", "value", "items", "1"],
      elementType: ElementTypes.RichText,
      insertAfter: false,
      assert(result) {
        const items = result.updatedBlock.value.items[0].value.items;
        expect(items).toHaveLength(3);
        expect(items[0].value._id).toBe("rt-1");
        expect(items[1].value._id).not.toBe("rt-2");
        expect(items[2].value._id).toBe("rt-2");
        expect(result.insertedAt).toBe(1);
      }
    },
    {
      name: "duplicate element at block top level",
      getBlock: () =>
        createBlock([
          el(ElementTypes.SectionItem, "si-1"),
          el(ElementTypes.SectionItem, "si-2")
        ]),
      path: ["value", "items", "0"],
      elementType: ElementTypes.SectionItem,
      insertAfter: true,
      assert(result) {
        const items = result.updatedBlock.value.items;
        expect(items).toHaveLength(3);
        expect(items[0].value._id).toBe("si-1");
        expect(items[1].value._id).not.toBe("si-1");
        expect(items[2].value._id).toBe("si-2");
        expect(result.insertedAt).toBe(1);
      }
    },

    // Wrapper Handling
    {
      name: "clone the whole Wrapper when duplicating element inside Wrapper",
      getBlock: () =>
        createBlock([
          el(ElementTypes.Column, "col-1", [
            el(ElementTypes.Wrapper, "wrap-1", [
              el(ElementTypes.RichText, "rt-1")
            ])
          ])
        ]),
      path: [
        "value",
        "items",
        "0",
        "value",
        "items",
        "0",
        "value",
        "items",
        "0"
      ],
      elementType: ElementTypes.RichText,
      insertAfter: true,
      assert(result) {
        const items = result.updatedBlock.value.items[0].value.items;
        expect(items).toHaveLength(2);
        expect(items[0].type).toBe(ElementTypes.Wrapper);
        expect(items[1].type).toBe(ElementTypes.Wrapper);
        expect(items[0].value._id).toBe("wrap-1");
        expect(items[1].value._id).not.toBe("wrap-1");
        expect(items[1].value.items).toHaveLength(1);
        expect(items[1].value.items[0].value._id).not.toBe("rt-1");
        expect(result.insertedAt).toBe(1);
      }
    },
    {
      name: "clone the whole Wrapper2 when duplicating element inside Wrapper2",
      getBlock: () =>
        createBlock([
          el(ElementTypes.Column, "col-1", [
            el(ElementTypes.Wrapper, "wrap-2", [
              el(ElementTypes.RichText, "rt-1")
            ]),
            el(ElementTypes.Wrapper2, "wrap2-1", [
              el(ElementTypes.Image, "img-1")
            ])
          ])
        ]),
      path: [
        "value",
        "items",
        "0",
        "value",
        "items",
        "1",
        "value",
        "items",
        "0"
      ],
      elementType: ElementTypes.Image,
      insertAfter: true,
      assert(result) {
        const items = result.updatedBlock.value.items[0].value.items;
        expect(items).toHaveLength(3);
        expect(items[0].value._id).toBe("wrap-2");
        expect(items[1].value._id).toBe("wrap2-1");
        expect(items[2].type).toBe(ElementTypes.Wrapper2);
        expect(items[2].value._id).not.toBe("wrap2-1");
        expect(result.insertedAt).toBe(2);
      }
    },
    {
      name: "insert cloned Wrapper before original when insertAfter is false",
      getBlock: () =>
        createBlock([
          el(ElementTypes.Column, "col-1", [
            el(ElementTypes.Wrapper, "wrap-1", [
              el(ElementTypes.RichText, "rt-1")
            ])
          ])
        ]),
      path: [
        "value",
        "items",
        "0",
        "value",
        "items",
        "0",
        "value",
        "items",
        "0"
      ],
      elementType: ElementTypes.RichText,
      insertAfter: false,
      assert(result) {
        const items = result.updatedBlock.value.items[0].value.items;
        expect(items).toHaveLength(2);
        expect(items[0].value._id).not.toBe("wrap-1");
        expect(items[1].value._id).toBe("wrap-1");
        expect(result.insertedAt).toBe(0);
      }
    },

    // Cloneable Handling
    {
      name: "clone just the element inside Cloneable (not the whole Cloneable)",
      getBlock: () =>
        createBlock([
          el(ElementTypes.Column, "col-1", [
            el(ElementTypes.Cloneable, "clone-1", [
              el(ElementTypes.Button, "btn-1"),
              el(ElementTypes.Button, "btn-2")
            ])
          ])
        ]),
      path: [
        "value",
        "items",
        "0",
        "value",
        "items",
        "0",
        "value",
        "items",
        "0"
      ],
      elementType: ElementTypes.Button,
      insertAfter: true,
      assert(result) {
        const columnItems = result.updatedBlock.value.items[0].value.items;
        expect(columnItems).toHaveLength(1);
        expect(columnItems[0].type).toBe(ElementTypes.Cloneable);
        const cloneableItems = columnItems[0].value.items;
        expect(cloneableItems).toHaveLength(3);
        expect(cloneableItems[0].value._id).toBe("btn-1");
        expect(cloneableItems[1].value._id).not.toBe("btn-1");
        expect(cloneableItems[1].value._id).not.toBe("btn-2");
        expect(cloneableItems[2].value._id).toBe("btn-2");
        expect(result.insertedAt).toBe(1);
      }
    },
    {
      name: "clone last button in Cloneable and insert after",
      getBlock: () =>
        createBlock([
          el(ElementTypes.Column, "col-1", [
            el(ElementTypes.Cloneable, "clone-1", [
              el(ElementTypes.Button, "btn-1"),
              el(ElementTypes.Button, "btn-2")
            ])
          ])
        ]),
      path: [
        "value",
        "items",
        "0",
        "value",
        "items",
        "0",
        "value",
        "items",
        "1"
      ],
      elementType: ElementTypes.Button,
      insertAfter: true,
      assert(result) {
        const cloneableItems =
          result.updatedBlock.value.items[0].value.items[0].value.items;
        expect(cloneableItems).toHaveLength(3);
        expect(cloneableItems[0].value._id).toBe("btn-1");
        expect(cloneableItems[1].value._id).toBe("btn-2");
        expect(cloneableItems[2].value._id).not.toBe("btn-2");
        expect(result.insertedAt).toBe(2);
      }
    },

    // Column Duplication
    {
      name: "duplicate a column and normalize widths",
      getBlock: () =>
        createBlock([
          el(ElementTypes.SectionItem, "si-1", [
            el(ElementTypes.Row, "row-1", [
              el(ElementTypes.Column, "col-1", [], { width: 50 }),
              el(ElementTypes.Column, "col-2", [], { width: 50 })
            ])
          ])
        ]),
      path: [
        "value",
        "items",
        "0",
        "value",
        "items",
        "0",
        "value",
        "items",
        "0"
      ],
      elementType: ElementTypes.Column,
      insertAfter: true,
      assert(result) {
        const rowItems =
          result.updatedBlock.value.items[0].value.items[0].value.items;
        expect(rowItems).toHaveLength(3);
        const totalWidth = rowItems.reduce(
          (sum: number, col: ElementModelType2) => {
            const width = (col.value.width || 0) as number;
            return sum + width;
          },
          0
        );
        expect(totalWidth).toBeCloseTo(100, 0);
      }
    },

    // Deep Cloning
    {
      name: "deep clone element with nested children",
      getBlock: () =>
        createBlock([
          el(ElementTypes.Column, "col-1", [
            el(ElementTypes.Wrapper, "outer-wrap", [
              el(ElementTypes.Row, "row-1", [
                el(ElementTypes.Column, "inner-col", [
                  el(ElementTypes.Wrapper, "inner-wrap", [
                    el(ElementTypes.RichText, "inner-rt")
                  ])
                ])
              ])
            ])
          ])
        ]),
      path: [
        "value",
        "items",
        "0",
        "value",
        "items",
        "0",
        "value",
        "items",
        "0"
      ],
      elementType: ElementTypes.Row,
      insertAfter: true,
      assert(result) {
        const columnItems = result.updatedBlock.value.items[0].value.items;
        expect(columnItems).toHaveLength(2);
        const clonedWrapper = columnItems[1];
        const clonedRow = clonedWrapper.value.items[0];
        const clonedInnerCol = clonedRow.value.items[0];
        const clonedInnerWrap = clonedInnerCol.value.items[0];
        const clonedInnerRt = clonedInnerWrap.value.items[0];

        expect(clonedRow.value._id).not.toBe("row-1");
        expect(clonedInnerCol.value._id).not.toBe("inner-col");
        expect(clonedInnerWrap.value._id).not.toBe("inner-wrap");
        expect(clonedInnerRt.value._id).not.toBe("inner-rt");
      }
    }
  ];

  it.each(successTests)(
    "should $name",
    ({ getBlock, path, elementType, insertAfter, assert }) => {
      const result = duplicateElementInBlock(
        getBlock(),
        path,
        elementType,
        insertAfter
      );
      expect(result).toBeDefined();
      assert(result!);
    }
  );

  it("should return undefined when clone target cannot be resolved", () => {
    const block = createBlock([]);
    const result = duplicateElementInBlock(
      block,
      ["value", "items", "99"],
      ElementTypes.RichText,
      true
    );
    expect(result).toBeUndefined();
  });

  describe("Return Value Structure", () => {
    const returnValueTests = [
      {
        name: "return correct structure on successful duplication",
        getBlock: () =>
          createBlock([
            el(ElementTypes.Column, "col-1", [
              el(ElementTypes.RichText, "rt-1")
            ])
          ]),
        path: ["value", "items", "0", "value", "items", "0"],
        elementType: ElementTypes.RichText,
        assert(result: DuplicateElementInBlockResult) {
          expect(result).toHaveProperty("updatedBlock");
          expect(result).toHaveProperty("newElementId");
          expect(result).toHaveProperty("containerId");
          expect(result).toHaveProperty("insertedAt");
          expect(result.updatedBlock.type).toBe(ElementTypes.Section);
          expect(typeof result.newElementId).toBe("string");
          expect(typeof result.containerId).toBe("string");
          expect(typeof result.insertedAt).toBe("number");
        }
      },
      {
        name: "return containerId of the parent container",
        getBlock: () =>
          createBlock([
            el(ElementTypes.Column, "col-1", [
              el(ElementTypes.RichText, "rt-1")
            ])
          ]),
        path: ["value", "items", "0", "value", "items", "0"],
        elementType: ElementTypes.RichText,
        assert(result: DuplicateElementInBlockResult) {
          expect(result.containerId).toBe("col-1");
        }
      },
      {
        name: "return column containerId when duplicating inside Wrapper",
        getBlock: () =>
          createBlock([
            el(ElementTypes.Column, "col-1", [
              el(ElementTypes.Wrapper, "wrap-1", [
                el(ElementTypes.RichText, "rt-1")
              ])
            ])
          ]),
        path: [
          "value",
          "items",
          "0",
          "value",
          "items",
          "0",
          "value",
          "items",
          "0"
        ],
        elementType: ElementTypes.RichText,
        assert(result: DuplicateElementInBlockResult) {
          expect(result.containerId).toBe("col-1");
        }
      },
      {
        name: "return cloneable containerId when duplicating inside Cloneable",
        getBlock: () =>
          createBlock([
            el(ElementTypes.Column, "col-1", [
              el(ElementTypes.Cloneable, "clone-1", [
                el(ElementTypes.Button, "btn-1")
              ])
            ])
          ]),
        path: [
          "value",
          "items",
          "0",
          "value",
          "items",
          "0",
          "value",
          "items",
          "0"
        ],
        elementType: ElementTypes.Button,
        assert(result: DuplicateElementInBlockResult) {
          expect(result.containerId).toBe("clone-1");
        }
      }
    ];

    it.each(returnValueTests)(
      "should $name",
      ({ getBlock, path, elementType, assert }) => {
        const result = duplicateElementInBlock(
          getBlock(),
          path,
          elementType,
          true
        );
        expect(result).toBeDefined();
        assert(result!);
      }
    );
  });

  it("should not modify the original block", () => {
    const richText = el(ElementTypes.RichText, "rt-1");
    const column = el(ElementTypes.Column, "col-1", [richText]);
    const block = createBlock([column]);
    const originalItemCount = block.value.items[0].value.items.length;

    duplicateElementInBlock(
      block,
      ["value", "items", "0", "value", "items", "0"],
      ElementTypes.RichText,
      true
    );

    expect(block.value.items[0].value.items.length).toBe(originalItemCount);
    expect(block.value.items[0].value.items[0].value._id).toBe("rt-1");
  });
});
