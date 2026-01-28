import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { TreeItems } from "visual/providers/TreeProvider/types";
import { makeBlock } from "visual/providers/TreeProvider/utils";
import type { Block } from "visual/types/Block";
import {
  applyCollapsedWithActive,
  buildTree,
  collectVisibilityKey,
  getLayoutSettings,
  mapCollapsed,
  setLayoutSettings
} from "../utils";

jest.mock("visual/editorComponents/Wrapper/contextMenu", () => ({
  getTranslationsMap: () => ElementTypes
}));

jest.mock("visual/shortcodeComponents/Shortcodes", () => ({
  getSampleShortCodes: () => ({
    Text: { icon: "nc-font" },
    Spacer: { icon: "nc-zoom-e" },
    Video: { icon: "nc-play" },
    Section: { icon: null },
    SectionItem: { icon: null },
    Wrapper: { icon: null },
    Row: { icon: null },
    Column: { icon: null }
  })
}));

// Minimal config stub
const configStub: any = {};

describe("Navigator components/utils", () => {
  beforeEach(() => {
    // Reset localStorage between tests
    localStorage.clear();
  });

  test("buildTree: visibility, children filtering and suffix propagation", () => {
    // Form2 should not display its children in navigator
    const blocks: Block[] = [
      makeBlock(
        "S1",
        ElementTypes.Section,
        [
          makeBlock(
            "R1",
            ElementTypes.Row,
            [
              makeBlock("C1", ElementTypes.Column, [
                // Form2 with a child button that should be ignored in navigator
                makeBlock("F1", ElementTypes.Form2, [
                  makeBlock("BTN1", ElementTypes.Button)
                ])
              ])
            ],
            { showOnDesktop: "off", showOnTablet: "off", showOnMobile: "off" }
          )
        ],
        { anchorName: "#hero" }
      )
    ];

    const tree = buildTree(blocks, configStub, []);

    // Structure: Section -> Row -> Column -> Form2 (no Button)
    expect(tree).toHaveLength(1);
    const sec = tree[0];
    expect(sec.id).toBe("S1");
    expect(sec.title).toMatch(/Section/);
    expect(sec.suffixTitle).toBe("#hero");
    const row = sec.children![0];
    expect(row.type).toBe(ElementTypes.Row);
    expect(row.isHidden).toBe(true); // derived from showOn* off on wrapper

    const col = row.children![0];
    expect(col.type).toBe(ElementTypes.Column);

    const form = col.children![0];
    expect(form.type).toBe(ElementTypes.Form2);
    expect(form.children![0].visible).toBe(false); // children hidden for Form2
  });

  test("collectVisibilityKey produces stable key with nested items", () => {
    const blocks: Block[] = [
      makeBlock(
        "A",
        ElementTypes.Section,
        [
          makeBlock("B", ElementTypes.Row, [
            makeBlock("C", ElementTypes.Column)
          ])
        ],
        { cssId: "root" }
      )
    ];

    const key = collectVisibilityKey(blocks);
    expect(typeof key).toBe("string");
    // verify contains ids and visibility flags (default on)
    expect(key).toContain("A:on:on:on:root");
    expect(key).toContain("B:on:on:on:");
    expect(key).toContain("C:on:on:on:");
  });

  test("mapCollapsed and applyCollapsedWithActive keep state and expand active path", () => {
    const items: TreeItems = [
      {
        id: "A",
        type: "Section",
        title: "",
        icon: null,
        isHidden: false,
        collapsed: true,
        suffixTitle: null,
        children: [
          {
            id: "B",
            type: "Row",
            title: "",
            icon: null,
            isHidden: false,
            collapsed: true,
            suffixTitle: null,
            children: [
              {
                id: "C",
                type: "Column",
                title: "",
                icon: null,
                isHidden: false,
                collapsed: true,
                children: null,
                suffixTitle: null
              }
            ]
          }
        ]
      }
    ];

    const collapsedById = mapCollapsed(items);
    expect(collapsedById.get("A")).toBe(true);
    expect(collapsedById.get("B")).toBe(true);
    expect(collapsedById.get("C")).toBe(true);

    const applied = applyCollapsedWithActive(items, collapsedById, "C");
    const a = applied[0];
    const b = a.children![0];
    const c = b.children![0];

    // Active path A->B->C should be expanded (collapsed=false)
    expect(a.collapsed).toBe(false);
    expect(b.collapsed).toBe(false);
    expect(c.collapsed).toBe(false);
  });

  test("getLayoutSettings/setLayoutSettings read/write and merge safely", () => {
    const defaultWidth = 320;
    // No data -> default
    expect(getLayoutSettings()).toEqual({ width: defaultWidth });

    // Write width only
    setLayoutSettings({ width: defaultWidth });
    expect(getLayoutSettings()).toEqual({ width: defaultWidth });

    // Merge height
    setLayoutSettings({ height: 480 });
    expect(getLayoutSettings()).toEqual({ width: defaultWidth, height: 480 });

    // Malformed JSON should not throw and should return default width
    localStorage.setItem("brz-navigator:layout", "not-json");
    expect(getLayoutSettings()).toEqual({ width: defaultWidth });
  });

  test("buildTree function from pageData", () => {
    const pageData = [
      {
        type: "Section",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                items: [
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--richText"],
                      items: [
                        {
                          type: "RichText",
                          value: {
                            _styles: ["richText"],
                            text: '<h2 class="brz-tp-heading2 brz-text-lg-center"><span class="brz-cp-color2">The Art Of The Smile</span></h2>',
                            _id: "mBPiLHMfxYUk"
                          }
                        }
                      ],
                      _id: "ebIL4kecM_Rn"
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--richText"],
                      items: [
                        {
                          type: "RichText",
                          value: {
                            _styles: ["richText"],
                            text: '<p class="brz-text-lg-center brz-tp-subtitle"><span class="brz-cp-color7"><span>Long years ago, you have to wear two sets of eye glasses, then doctors discovered the lens at the bifocal eye-glasses, then recently they do the same thing.</span></span></p>',
                            _id: "a28PWcCI7Rcl"
                          }
                        }
                      ],
                      mobilePaddingType: "ungrouped",
                      mobilePaddingRightSuffix: "px",
                      mobilePaddingRight: 20,
                      mobilePadding: 0,
                      mobilePaddingSuffix: "px",
                      mobilePaddingLeftSuffix: "px",
                      mobilePaddingLeft: 20,
                      _id: "rZysYa4gsY8l"
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--spacer"],
                      items: [
                        {
                          type: "Spacer",
                          value: {
                            _styles: ["spacer"],
                            height: 30,
                            tabletHeight: 0,
                            mobileHeight: 0,
                            _id: "v03YlyyTiHNh"
                          }
                        }
                      ],
                      showOnTablet: "off",
                      showOnMobile: "off",
                      _id: "uMUxj0jxUX0t"
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--video"],
                      items: [
                        {
                          type: "Video",
                          value: {
                            _styles: ["video"],
                            coverImageWidth: 1500,
                            coverImageHeight: 844,
                            coverImageSrc: "d03-Img-Girl-Pool.jpg",
                            coverPositionX: 50,
                            coverPositionY: 50,
                            bgColorPalette: "color3",
                            tempBgColorPalette: "color3",
                            bgColorOpacity: 1,
                            bgColorHex: "#0ad1bd",
                            tempBgColorOpacity: 1,
                            hoverBgColorPalette: "color1",
                            tempHoverBgColorPalette: "color1",
                            hoverBgColorOpacity: 1,
                            hoverBgColorHex: "#ff7700",
                            tempHoverBgColorOpacity: 1,
                            ratio: "16:9",
                            coverZoom: 101,
                            tabletSize: 100,
                            tabsCurrentElement: "tabCurrentElement",
                            tabsState: "tabNormal",
                            tabsColor: "tabOverlay",
                            borderRadius: 6,
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            borderBottomLeftRadius: 6,
                            borderBottomRightRadius: 6,
                            tempBorderRadius: 6,
                            tempBorderTopLeftRadius: 6,
                            tempBorderTopRightRadius: 6,
                            tempBorderBottomLeftRadius: 6,
                            tempBorderBottomRightRadius: 6,
                            borderStyle: "",
                            borderWidth: 0,
                            borderTopWidth: 0,
                            borderRightWidth: 0,
                            borderBottomWidth: 0,
                            borderLeftWidth: 0,
                            tempBorderTopWidth: 4,
                            tempBorderRightWidth: 4,
                            tempBorderBottomWidth: 4,
                            tempBorderLeftWidth: 4,
                            borderColorOpacity: 0,
                            borderColorPalette: "",
                            colorPalette: "color8",
                            tempColorPalette: "color8",
                            colorOpacity: 1,
                            size: 100,
                            _id: "ckCf2KKAEAIj"
                          }
                        }
                      ],
                      tabletPaddingSuffix: "px",
                      tabletPaddingTopSuffix: "px",
                      tabletPaddingRightSuffix: "px",
                      tabletPaddingBottomSuffix: "px",
                      tabletPaddingLeftSuffix: "px",
                      tabletPadding: 0,
                      tabletPaddingTop: 0,
                      tabletPaddingRight: 0,
                      tabletPaddingBottom: 0,
                      tabletPaddingLeft: 0,
                      tabletPaddingType: "ungrouped",
                      paddingTopSuffix: "px",
                      mobileMarginType: "grouped",
                      _id: "gfFU3ogaDlpy"
                    }
                  }
                ],
                paddingType: "ungrouped",
                paddingTop: 75,
                paddingBottom: 75,
                padding: 75,
                containerSize: 60,
                tabsState: "tabNormal",
                tabsCurrentElement: "",
                tabsColor: "tabOverlay",
                bgImageWidth: 1920,
                bgImageHeight: 1080,
                bgImageSrc: "d03-Img-Tents.jpg",
                bgColorOpacity: 0,
                tempBgColorOpacity: 1,
                borderRadius: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                tempBorderTopLeftRadius: 0,
                tempBorderTopRightRadius: 0,
                tempBorderBottomLeftRadius: 0,
                tempBorderBottomRightRadius: 0,
                bgPositionX: 52,
                bgPositionY: 89,
                _id: "bVyOmtf0T0XO"
              }
            }
          ],
          _id: "d91sRVLrei5j"
        },
        blockId: "block2490light"
      }
    ];

    const tree = buildTree(pageData, {} as ConfigCommon, []);
    const output = [
      {
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: null,
                    collapsed: true,
                    icon: "nc-font",
                    id: "mBPiLHMfxYUk",
                    isHidden: false,
                    title: "RichText",
                    type: "RichText",
                    visible: true,
                    suffixTitle: null
                  }
                ],
                collapsed: true,
                icon: null,
                id: "ebIL4kecM_Rn",
                isHidden: false,
                title: "Wrapper",
                type: "Wrapper",
                visible: false,
                suffixTitle: null
              },
              {
                children: [
                  {
                    children: null,
                    collapsed: true,
                    icon: "nc-font",
                    id: "a28PWcCI7Rcl",
                    isHidden: false,
                    title: "RichText",
                    type: "RichText",
                    visible: true,
                    suffixTitle: null
                  }
                ],
                collapsed: true,
                icon: null,
                id: "rZysYa4gsY8l",
                isHidden: false,
                title: "Wrapper",
                type: "Wrapper",
                visible: false,
                suffixTitle: null
              },
              {
                children: [
                  {
                    children: null,
                    collapsed: true,
                    icon: "nc-zoom-e",
                    id: "v03YlyyTiHNh",
                    isHidden: false,
                    title: "Spacer",
                    type: "Spacer",
                    visible: true,
                    suffixTitle: null
                  }
                ],
                collapsed: true,
                icon: null,
                id: "uMUxj0jxUX0t",
                isHidden: false,
                title: "Wrapper",
                type: "Wrapper",
                visible: false,
                suffixTitle: null
              },
              {
                children: [
                  {
                    children: null,
                    collapsed: true,
                    icon: "nc-play",
                    id: "ckCf2KKAEAIj",
                    isHidden: false,
                    title: "Video",
                    type: "Video",
                    visible: true,
                    suffixTitle: null
                  }
                ],
                collapsed: true,
                icon: null,
                id: "gfFU3ogaDlpy",
                isHidden: false,
                title: "Wrapper",
                type: "Wrapper",
                visible: false,
                suffixTitle: null
              }
            ],
            collapsed: true,
            icon: null,
            id: "bVyOmtf0T0XO",
            isHidden: false,
            title: "SectionItem",
            type: "SectionItem",
            visible: false,
            suffixTitle: null
          }
        ],
        collapsed: true,
        icon: null,
        id: "d91sRVLrei5j",
        isHidden: false,
        title: "Section",
        type: "Section",
        visible: true,
        suffixTitle: null
      }
    ];

    expect(tree).toStrictEqual(output);
  });

  describe("Cloneable display logic", () => {
    test("should show Cloneable with multiple icons and set correct title", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("cloneable1", ElementTypes.Cloneable, [
            makeBlock("icon1", ElementTypes.Icon),
            makeBlock("icon2", ElementTypes.Icon),
            makeBlock("icon3", ElementTypes.Icon)
          ])
        ])
      ];

      const tree = buildTree(blocks, configStub, []);

      expect(tree).toHaveLength(1);
      const section = tree[0];
      expect(section.children).toHaveLength(1);

      const cloneable = section.children![0];
      expect(cloneable.type).toBe(ElementTypes.Cloneable);
      expect(cloneable.title).toBe("Icon Container");
      expect(cloneable.visible).toBe(true);
    });

    test("should show Cloneable with multiple buttons and set correct title", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("cloneable1", ElementTypes.Cloneable, [
            makeBlock("button1", ElementTypes.Button),
            makeBlock("button2", ElementTypes.Button)
          ])
        ])
      ];

      const tree = buildTree(blocks, configStub, []);

      expect(tree).toHaveLength(1);
      const section = tree[0];
      expect(section.children).toHaveLength(1);

      const cloneable = section.children![0];
      expect(cloneable.type).toBe(ElementTypes.Cloneable);
      expect(cloneable.title).toBe("Button Container");
      expect(cloneable.visible).toBe(true);
    });

    test("should hide Cloneable with only one item", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("cloneable1", ElementTypes.Cloneable, [
            makeBlock("button1", ElementTypes.Button)
          ])
        ])
      ];

      const tree = buildTree(blocks, configStub, []);

      expect(tree).toHaveLength(1);
      const section = tree[0];
      expect(section.children).toHaveLength(1);

      const cloneable = section.children![0];
      expect(cloneable.type).toBe(ElementTypes.Cloneable);
      expect(cloneable.visible).toBe(false); // Should be hidden
    });

    test("should hide empty Cloneable", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("cloneable1", ElementTypes.Cloneable, [])
        ])
      ];

      const tree = buildTree(blocks, configStub, []);

      expect(tree).toHaveLength(1);
      const section = tree[0];
      expect(section.children).toHaveLength(1);

      const cloneable = section.children![0];
      expect(cloneable.type).toBe(ElementTypes.Cloneable);
      expect(cloneable.visible).toBe(false); // Should be hidden due to empty content
    });

    test("should hide Cloneable with non-icon/button content", () => {
      const blocks: Block[] = [
        makeBlock("section1", ElementTypes.Section, [
          makeBlock("cloneable1", ElementTypes.Cloneable, [
            makeBlock("text1", ElementTypes.Text),
            makeBlock("text2", ElementTypes.Text)
          ])
        ])
      ];

      const tree = buildTree(blocks, configStub, []);

      expect(tree).toHaveLength(1);
      const section = tree[0];
      expect(section.children).toHaveLength(1);

      const cloneable = section.children![0];
      expect(cloneable.type).toBe(ElementTypes.Cloneable);
      expect(cloneable.visible).toBe(false); // Should be hidden due to non-icon/button content
    });
  });
});
