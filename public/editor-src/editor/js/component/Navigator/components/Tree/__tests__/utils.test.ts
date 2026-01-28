import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { TreeItems } from "visual/providers/TreeProvider/types";
import { makeBlock } from "visual/providers/TreeProvider/utils";
import type { Block } from "visual/types/Block";
import {
  type FlattenedItem,
  flattenForRender,
  flattenTree,
  isValidParentForChild,
  mergeBlocks,
  removeEmptyContainers,
  treeToBlocks
} from "../utils";

describe("Navigator Tree utils", () => {
  test("treeToBlocks should include nest items", () => {
    const tree: TreeItems = [
      {
        id: "A",
        type: ElementTypes.Section,
        title: "",
        icon: null,
        isHidden: false,
        suffixTitle: null,
        children: [
          {
            id: "B",
            type: ElementTypes.Row,
            title: "",
            icon: null,
            isHidden: false,
            children: null,
            suffixTitle: null
          }
        ]
      }
    ];

    const blocks = treeToBlocks(tree);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].value._id).toBe("A");
    expect(blocks[0].value.items).toHaveLength(1);
    const child = (blocks[0].value.items as Block[])[0];
    expect(child.value._id).toBe("B");
  });

  test("flattenTree and flattenTreeForRender respect visibility rules", () => {
    const items: TreeItems = [
      {
        id: "A",
        type: ElementTypes.Section,
        title: "",
        icon: null,
        isHidden: false,
        visible: true,
        suffixTitle: null,
        children: [
          {
            id: "B",
            type: ElementTypes.Row,
            title: "",
            icon: null,
            isHidden: false,
            visible: false,
            suffixTitle: null,
            children: [
              {
                id: "C",
                type: ElementTypes.Column,
                title: "",
                icon: null,
                isHidden: false,
                visible: true,
                children: null,
                suffixTitle: null
              }
            ]
          }
        ]
      }
    ];

    const flatAll = flattenTree(items);
    expect(flatAll.map((i) => i.id)).toEqual(["A", "B", "C"]);

    const flatRender = flattenForRender(items);
    // B is invisible, but C is kept at the same depth and with parent A
    const ids = flatRender.map((i) => i.id);
    expect(ids).toEqual(["A", "C"]);
    const c = flatRender.find((i) => i.id === "C") as FlattenedItem;
    const a = flatRender.find((i) => i.id === "A") as FlattenedItem;
    expect(c.parentId).toBe(a.id);
  });

  test("isValidParentForChild enforces section/container rules", () => {
    // Root (null) can only contain sections
    expect(isValidParentForChild(null, ElementTypes.Section)).toBe(true);
    expect(isValidParentForChild(null, ElementTypes.Row)).toBe(false);

    // Section can contain non-section children
    expect(isValidParentForChild(ElementTypes.Section, ElementTypes.Row)).toBe(
      true
    );
    expect(
      isValidParentForChild(ElementTypes.Section, ElementTypes.Section)
    ).toBe(false);

    // Row -> Column only
    expect(isValidParentForChild(ElementTypes.Row, ElementTypes.Column)).toBe(
      true
    );
    expect(isValidParentForChild(ElementTypes.Row, ElementTypes.Row)).toBe(
      false
    );

    // Column cannot contain Sections
    expect(
      isValidParentForChild(ElementTypes.Column, ElementTypes.Section)
    ).toBe(false);
    expect(isValidParentForChild(ElementTypes.Column, ElementTypes.Row)).toBe(
      true
    );
  });

  test("isValidParentForChild enforces Story nesting rules", () => {
    // Story can only contain StoryItem
    expect(
      isValidParentForChild(ElementTypes.Story, ElementTypes.StoryItem)
    ).toBe(true);

    // Story cannot contain other elements
    expect(isValidParentForChild(ElementTypes.Story, ElementTypes.Row)).toBe(
      false
    );
    expect(isValidParentForChild(ElementTypes.Story, ElementTypes.Column)).toBe(
      false
    );
    expect(isValidParentForChild(ElementTypes.Story, ElementTypes.Text)).toBe(
      false
    );
    expect(isValidParentForChild(ElementTypes.Story, ElementTypes.Image)).toBe(
      false
    );
    expect(
      isValidParentForChild(ElementTypes.Story, ElementTypes.Section)
    ).toBe(false);
  });

  test("isValidParentForChild allows StoryItem to contain other elements", () => {
    // StoryItem can contain other elements (like a container)
    expect(
      isValidParentForChild(ElementTypes.StoryItem, ElementTypes.Row)
    ).toBe(true);
    expect(
      isValidParentForChild(ElementTypes.StoryItem, ElementTypes.Column)
    ).toBe(true);
    expect(
      isValidParentForChild(ElementTypes.StoryItem, ElementTypes.Text)
    ).toBe(true);
    expect(
      isValidParentForChild(ElementTypes.StoryItem, ElementTypes.Image)
    ).toBe(true);

    // StoryItem cannot contain sections
    expect(
      isValidParentForChild(ElementTypes.StoryItem, ElementTypes.Section)
    ).toBe(false);
  });

  test("mergeBlocks preserves references for unchanged subtrees and values", () => {
    // original blocks with extra properties
    const original: Block[] = [
      makeBlock(
        "A",
        ElementTypes.Section,
        [
          makeBlock(
            "B",
            ElementTypes.Row,
            [
              makeBlock("C", ElementTypes.Column, undefined, { some: "stateC" })
            ],
            { some: "stateB" }
          )
        ],
        { some: "stateA" }
      )
    ];

    const originalA = original[0];
    const originalB = (originalA.value.items as Block[])[0];
    const originalC = (originalB.value.items as Block[])[0];

    // Create a new tree that moves C under A directly (invalid by rules, but mergeBlocks doesn't validate; we only test structure sharing)
    const newTree: Block[] = [
      makeBlock("A", ElementTypes.Section, [
        makeBlock("C", ElementTypes.Column),
        makeBlock("B", ElementTypes.Row)
      ])
    ];

    const merged = mergeBlocks(original, newTree);

    // Root A reference should be reused (children order changed -> may need a new value but object may not be strictly same)
    expect(merged[0].value._id).toBe("A");
    // Reused deep blocks by id reference where possible:
    const mergedChildren = merged[0].value.items as Block[];
    const mergedC = mergedChildren[0];
    const mergedB = mergedChildren[1];

    // Ensure extra values preserved
    expect(mergedB.value.some).toBe("stateB");
    expect(originalC.value.some).toBe("stateC");

    // The reference for C should be reused; B changed its children, so it can be a new object
    expect(mergedC).toBe(originalC);
    expect((mergedB.value as any).items).toBeUndefined();
  });

  describe("removeEmptyContainers", () => {
    test("should remove empty Row containers", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("row1", ElementTypes.Row, []), // Empty row - should be removed
          makeBlock("row2", ElementTypes.Row, [
            makeBlock("column1", ElementTypes.Column, [
              makeBlock("text1", ElementTypes.Text)
            ])
          ]) // Row with content - should be kept
        ])
      ];

      const result = removeEmptyContainers(blocks);

      expect(result).toHaveLength(1);
      expect(result[0].value._id).toBe("section1");
      const sectionItems = result[0].value.items as Block[];
      expect(sectionItems).toHaveLength(1);
      expect(sectionItems[0].value._id).toBe("row2");
    });

    test("should remove empty Cloneable containers", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("clone1", ElementTypes.Cloneable, []), // Empty cloneable - should be removed
          makeBlock("clone2", ElementTypes.Cloneable, [
            makeBlock("button1", ElementTypes.Button)
          ]) // Cloneable with content - should be kept
        ])
      ];

      const result = removeEmptyContainers(blocks);

      expect(result).toHaveLength(1);
      expect(result[0].value._id).toBe("section1");
      const sectionItems = result[0].value.items as Block[];
      expect(sectionItems).toHaveLength(1);
      expect(sectionItems[0].value._id).toBe("clone2");
    });

    test("should remove empty Wrapper containers", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("wrapper1", ElementTypes.Wrapper, []), // Empty wrapper - should be removed
          makeBlock("wrapper2", ElementTypes.Wrapper, [
            makeBlock("text1", ElementTypes.Text)
          ]) // Wrapper with content - should be kept
        ])
      ];

      const result = removeEmptyContainers(blocks);

      expect(result).toHaveLength(1);
      expect(result[0].value._id).toBe("section1");
      const sectionItems = result[0].value.items as Block[];
      expect(sectionItems).toHaveLength(1);
      expect(sectionItems[0].value._id).toBe("wrapper2");
    });

    test("should not remove non-container elements even if they have no children", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("text1", ElementTypes.Text), // Text element - should be kept
          makeBlock("image1", ElementTypes.Image) // Image element - should be kept
        ])
      ];

      const result = removeEmptyContainers(blocks);

      expect(result).toHaveLength(1);
      expect(result[0].value._id).toBe("section1");
      const sectionItems = result[0].value.items as Block[];
      expect(sectionItems).toHaveLength(2);
      expect(sectionItems[0].value._id).toBe("text1");
      expect(sectionItems[1].value._id).toBe("image1");
    });

    test("should recursively remove empty containers at all levels", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("row1", ElementTypes.Row, [
            makeBlock("column1", ElementTypes.Column, [
              makeBlock("wrapper1", ElementTypes.Wrapper, []) // Empty wrapper in column - should be removed
            ])
          ]),
          makeBlock("row2", ElementTypes.Row, []) // Empty row - should be removed
        ])
      ];

      const result = removeEmptyContainers(blocks);

      expect(result).toHaveLength(1);
      expect(result[0].value._id).toBe("section1");
      const sectionItems = result[0].value.items as Block[];
      expect(sectionItems).toHaveLength(1);
      expect(sectionItems[0].value._id).toBe("row1");

      const rowItems = sectionItems[0].value.items as Block[];
      expect(rowItems).toHaveLength(1);
      expect(rowItems[0].value._id).toBe("column1");

      const columnItems = rowItems[0].value.items as Block[];
      expect(columnItems).toHaveLength(0); // Empty wrapper was removed
    });

    test("should handle mixed empty and non-empty containers", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("row1", ElementTypes.Row, []), // Empty row - should be removed
          makeBlock("row2", ElementTypes.Row, [
            makeBlock("column1", ElementTypes.Column, [
              makeBlock("text1", ElementTypes.Text)
            ])
          ]), // Row with content - should be kept
          makeBlock("clone1", ElementTypes.Cloneable, []), // Empty cloneable - should be removed
          makeBlock("clone2", ElementTypes.Cloneable, [
            makeBlock("button1", ElementTypes.Button)
          ]) // Cloneable with content - should be kept
        ])
      ];

      const result = removeEmptyContainers(blocks);

      expect(result).toHaveLength(1);
      expect(result[0].value._id).toBe("section1");
      const sectionItems = result[0].value.items as Block[];
      expect(sectionItems).toHaveLength(2);
      expect(sectionItems[0].value._id).toBe("row2");
      expect(sectionItems[1].value._id).toBe("clone2");
    });

    test("should preserve all values and properties of remaining blocks", () => {
      const blocks: Block[] = [
        makeBlock(
          "section1",
          ElementTypes.Section,
          [
            makeBlock("row1", ElementTypes.Row, []), // Empty row - should be removed
            makeBlock(
              "row2",
              ElementTypes.Row,
              [
                makeBlock(
                  "column1",
                  ElementTypes.Column,
                  [
                    makeBlock("text1", ElementTypes.Text, undefined, {
                      customProp: "value1",
                      width: 50
                    })
                  ],
                  {
                    customProp: "value2",
                    width: 100
                  }
                )
              ],
              {
                customProp: "value3",
                height: 200
              }
            )
          ],
          {
            customProp: "value4",
            background: "red"
          }
        )
      ];

      const result = removeEmptyContainers(blocks);

      expect(result).toHaveLength(1);
      const section = result[0];
      expect(section.value.customProp).toBe("value4");
      expect(section.value.background).toBe("red");

      const sectionItems = section.value.items as Block[];
      expect(sectionItems).toHaveLength(1);
      const row = sectionItems[0];
      expect(row.value.customProp).toBe("value3");
      expect(row.value.height).toBe(200);

      const rowItems = row.value.items as Block[];
      expect(rowItems).toHaveLength(1);
      const column = rowItems[0];
      expect(column.value.customProp).toBe("value2");
      expect(column.value.width).toBe(100);

      const columnItems = column.value.items as Block[];
      expect(columnItems).toHaveLength(1);
      const text = columnItems[0];
      expect(text.value.customProp).toBe("value1");
      expect(text.value.width).toBe(50);
    });

    test("should handle empty input array", () => {
      const blocks: Block[] = [];
      const result = removeEmptyContainers(blocks);
      expect(result).toEqual([]);
    });

    test("should handle blocks with no items property", () => {
      const blocks: Block[] = [
        makeBlock("text1", ElementTypes.Text), // Text has no items property
        makeBlock("image1", ElementTypes.Image) // Image has no items property
      ];

      const result = removeEmptyContainers(blocks);

      expect(result).toHaveLength(2);
      expect(result[0].value._id).toBe("text1");
      expect(result[1].value._id).toBe("image1");
    });
  });
});
