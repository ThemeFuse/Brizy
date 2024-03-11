import { CSSProperties } from "react";
import { BreakpointsNames } from "visual/utils/breakpoints/types";
import {
  borderElementModel,
  borderOptionWithSelector,
  emptyCSS,
  generatedCSSSameStyles,
  heightElementModel,
  heightOptionWithStyle,
  mockAllCssObjects
} from "visual/utils/cssStyle/__tests__/cssStyle";
import { AllCSSKeys, GeneratedCSS } from "visual/utils/cssStyle/types";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import {
  addBreakpointsToCSS,
  addBreakpointsToFilteredCSS,
  addSameClassNameToIncreaseSpecificity,
  checkIfSomeKeyWasChanged,
  concatCSSWithBreakpoints,
  concatFinalCSS,
  concatStyles,
  concatStylesByCssObject,
  filterDeviceValues,
  getCSSForCompare,
  getCSSFromSelector,
  getCSSObjectFromStyle,
  getCurrentModelFilteredValues,
  getMissingKeys,
  getMissingPropertiesFromModel,
  getNewGeneratesCSSfromSelector,
  getNewGeneratesCSSfromStyle,
  getNewModel,
  getSelectorAndCssFromCssObject,
  mergeStylesArray,
  objectToCSS,
  removeDuplicateCSSByDevice
} from "../index";

// is only for testing purposes
const _undefined = undefined as unknown;
const _null = null as unknown;
const _NaN = NaN as unknown;

describe("Testing filterDeviceValues that should filter all CSS by devices in vd or vs or v", () => {
  test("With same values, should return empty array", () => {
    expect(
      filterDeviceValues(
        "tablet",
        generatedCSSSameStyles["tablet"],
        generatedCSSSameStyles["desktop"]
      )
    ).toStrictEqual([]);
  });
  test("Test with active, should return unique css", () => {
    expect(
      filterDeviceValues(
        "desktop",
        [...emptyCSS["active"], ".brz-test.active{color:yellow;}"],
        generatedCSSSameStyles["desktop"]
      )
    ).toStrictEqual([".brz-test.active{color:yellow;}"]);
  });
  test("Test with hover, should return unique css", () => {
    expect(
      filterDeviceValues(
        "desktop",
        [...emptyCSS["hover"], ".brz-test:hover{color:black;}"],
        generatedCSSSameStyles["desktop"]
      )
    ).toStrictEqual([".brz-test:hover{color:black;}"]);
  });
  test("Test tablet with different values, should return unique tablet css", () => {
    expect(
      filterDeviceValues(
        "desktop",
        [...generatedCSSSameStyles["tablet"], ".brz-spacer{height:50px;}"],
        generatedCSSSameStyles["desktop"]
      )
    ).toStrictEqual([".brz-spacer{height:50px;}"]);
  });
});

describe("Testing getCSSForCompare that should replace :hover and :active with empty string", () => {
  const css = ".brz-test{color:red}";
  const cssWithHover = ".brz-test:hover{color:red}";
  const cssWithActive = ".brz-test.active{color:red}";
  test("Testing with key as nullish values, should return the same css", () => {
    expect(getCSSForCompare(_undefined as AllCSSKeys, css)).toBe(css);
    expect(getCSSForCompare(_null as AllCSSKeys, css)).toBe(css);
    expect(getCSSForCompare("" as AllCSSKeys, css)).toBe(css);
    expect(getCSSForCompare(_NaN as AllCSSKeys, css)).toBe(css);
  });
  test("Testing with device mode keys, should return the same css", () => {
    expect(getCSSForCompare("desktop", css)).toBe(css);
    expect(getCSSForCompare("tablet", css)).toBe(css);
    expect(getCSSForCompare("mobile", css)).toBe(css);
  });
  test("Testing with hover, should return css without :hover", () => {
    expect(getCSSForCompare("hover", css)).toBe(css);
    expect(getCSSForCompare("hover", cssWithHover)).toBe(css);
  });
  test("Testing with active, should return css without .active", () => {
    expect(getCSSForCompare("active", css)).toBe(css);
    expect(getCSSForCompare("active", cssWithActive)).toBe(css);
  });
});

describe("Testing addSameClassNameToIncreaseSpecificity that should add an extra dynamic className symbol", () => {
  test("addSameClassNameToIncreaseSpecificity", () => {
    expect(addSameClassNameToIncreaseSpecificity("a")).toBe("a");
    expect(addSameClassNameToIncreaseSpecificity("test")).toBe("test");
    expect(addSameClassNameToIncreaseSpecificity("%%")).toBe("%%");
    expect(addSameClassNameToIncreaseSpecificity("&")).toBe("&");
    expect(addSameClassNameToIncreaseSpecificity("&&")).toBe("&&&&");
    expect(addSameClassNameToIncreaseSpecificity("{{WRAPPER}")).toBe(
      "{{WRAPPER}"
    );
    expect(addSameClassNameToIncreaseSpecificity("{{WRAPPER}}")).toBe(
      "{{WRAPPER}}{{WRAPPER}}"
    );
  });
});

describe("Testing getCSSObjectFromStyle that should return CSSObject or undefined", () => {
  test("Empty data, should return undefined", () => {
    expect(
      getCSSObjectFromStyle({
        v: {},
        breakpoint: "desktop",
        option: { id: "asd", type: "slider" }
      })
    ).toStrictEqual(undefined);
  });
  test("Test with option, but empty value", () => {
    expect(
      getCSSObjectFromStyle({
        v: {},
        breakpoint: "desktop",
        option: heightOptionWithStyle
      })
    ).toStrictEqual({ "{{WRAPPER}}": { height: "0" } });
  });
  test("Test with option with valid values", () => {
    expect(
      getCSSObjectFromStyle({
        v: { height: 20, heightSuffix: "px" },
        breakpoint: "desktop",
        option: heightOptionWithStyle
      })
    ).toStrictEqual({ "{{WRAPPER}}": { height: "20px" } });
  });
  test("Test with option with valid values + hover", () => {
    expect(
      getCSSObjectFromStyle({
        v: { height: 30, heightSuffix: "px", hoverHeight: 50 },
        breakpoint: "desktop",
        option: heightOptionWithStyle
      })
    ).toStrictEqual({ "{{WRAPPER}}": { height: "30px" } });
  });
  test("Test with option with valid values + active", () => {
    expect(
      getCSSObjectFromStyle({
        v: { height: 40, heightSuffix: "px", activeHeight: 60 },
        breakpoint: "desktop",
        option: heightOptionWithStyle
      })
    ).toStrictEqual({ "{{WRAPPER}}": { height: "40px" } });
  });
  test("Test with option with valid values + hover + active", () => {
    expect(
      getCSSObjectFromStyle({
        v: {
          height: 10,
          heightSuffix: "px",
          hoverHeight: 20,
          activeHeight: 30
        },
        breakpoint: "desktop",
        option: heightOptionWithStyle
      })
    ).toStrictEqual({ "{{WRAPPER}}": { height: "10px" } });
  });
});

describe("Testing getCSSFromSelector that should return css or undefined", () => {
  test("Empty data, should return border without styles", () => {
    expect(
      getCSSFromSelector({
        v: {},
        breakpoint: "desktop",
        option: borderOptionWithSelector
      })
    ).toStrictEqual(undefined);
  });

  test("Wrong option", () => {
    expect(
      getCSSFromSelector({
        v: {},
        breakpoint: "desktop",
        option: heightOptionWithStyle
      })
    ).toStrictEqual(undefined);
  });
  test("Valid Data", () => {
    expect(
      getCSSFromSelector({
        v: borderElementModel,
        breakpoint: "desktop",
        option: borderOptionWithSelector
      })
    ).toStrictEqual("border:5px solid rgba(115, 119, 127, 1);");
  });
  test("With hover", () => {
    expect(
      getCSSFromSelector({
        v: {
          ...borderElementModel,
          hoverBorderColorHex: "#FF0000"
        },
        breakpoint: "desktop",
        option: borderOptionWithSelector
      })
    ).toStrictEqual("border:5px solid rgba(115, 119, 127, 1);");
  });
});

describe("Testing addBreakpointsToCSS that add breakpoints to generated styles", () => {
  test("addBreakpointsToCSS", () => {
    expect(addBreakpointsToCSS(_undefined as BreakpointsNames, "")).toBe(
      undefined
    );
    expect(
      addBreakpointsToCSS(_null as BreakpointsNames, ".brz{color:red;}")
    ).toBe(undefined);
    expect(addBreakpointsToCSS("desktop", '.test{fontSize:"15px"}')).toBe(
      '.test{fontSize:"15px"}'
    );
    expect(addBreakpointsToCSS("tablet", ".ttt{}")).toBe(
      "@media only screen and (max-width: 991px) and (min-width: 479px){.ttt{}}"
    );
    expect(addBreakpointsToCSS("mobile", '.brz-richText{text:"Brizy"}')).toBe(
      '@media only screen and (max-width: 478px) {.brz-richText{text:"Brizy"}}'
    );
    expect(addBreakpointsToCSS("desktop", _undefined as string)).toBe(
      undefined
    );
    expect(addBreakpointsToCSS("tablet", _null as string)).toBe(
      "@media only screen and (max-width: 991px) and (min-width: 479px){null}"
    );
  });
});

describe("Testing objectToCSS that transform styles object to CSS", () => {
  test("objectToCSS", () => {
    expect(objectToCSS({ height: 30, width: 40 })).toBe("height:30;width:40");

    expect(objectToCSS({ test: 10, test2: 20 } as CSSProperties)).toBe(
      "test:10;test2:20"
    );
    expect(objectToCSS({ color: "red", backgroundSize: "cover" })).toBe(
      "color:red;backgroundSize:cover"
    );
    expect(objectToCSS({} as CSSProperties)).toBe("");
    expect(objectToCSS({ key1: undefined, key2: null } as CSSProperties)).toBe(
      "key1:undefined;key2:null"
    );
  });
});

describe("Testing addBreakpointsToFilteredCSS that add breakpoints to all styles from vd, vs, v", () => {
  test("addBreakpointsToFilteredCSS", () => {
    const defaultCSS = {
      desktop: [".brz-column{max-width:20%}"],
      hover: [".brz-color-red:hover{color:red}"],
      active: [".brz-color-blue.active{color:red}"],
      tablet: ["{{WRAPPER}}{{WRAPPER}}{height:200px}"],
      mobile: [".brz-test{color:red}"]
    };

    expect(
      addBreakpointsToFilteredCSS([defaultCSS, emptyCSS, emptyCSS])
    ).toStrictEqual([
      ".brz-column{max-width:20%}@media only screen and (min-width: 992px){.brz-color-red:hover{color:red}}.brz-color-blue.active{color:red}@media only screen and (max-width: 991px) and (min-width: 479px){{{WRAPPER}}{{WRAPPER}}{height:200px}}@media only screen and (max-width: 478px) {.brz-test{color:red}}",
      "",
      ""
    ]);
    expect(
      addBreakpointsToFilteredCSS([emptyCSS, emptyCSS, emptyCSS])
    ).toStrictEqual(["", "", ""]);

    const defaultCSS2 = {
      ...emptyCSS,
      desktop: [".brz-column{border:1px solid blue}"]
    };
    const rulesCSS = {
      ...emptyCSS,
      desktop: [".brz-column{border:1px solid red}"]
    };

    expect(
      addBreakpointsToFilteredCSS([defaultCSS2, rulesCSS, emptyCSS])
    ).toStrictEqual([
      ".brz-column{border:1px solid blue}",
      ".brz-column{border:1px solid red}",
      ""
    ]);

    const defaultCSS3 = {
      ...emptyCSS,
      desktop: [".brz-spacer{height:50px}"],
      tablet: [".brz-spacer{height:150px}"]
    };
    expect(
      addBreakpointsToFilteredCSS([defaultCSS3, emptyCSS, emptyCSS])
    ).toStrictEqual([
      ".brz-spacer{height:50px}@media only screen and (max-width: 991px) and (min-width: 479px){.brz-spacer{height:150px}}",
      "",
      ""
    ]);

    const defaultCSS4 = {
      ...emptyCSS,
      desktop: [".brz-line{height:10px}"],
      tablet: [".brz-line{height:15px}"]
    };
    const customCSS = {
      ...emptyCSS,
      desktop: [".brz-line{height:20px}"]
    };

    expect(
      addBreakpointsToFilteredCSS([defaultCSS4, emptyCSS, customCSS])
    ).toStrictEqual([
      ".brz-line{height:10px}@media only screen and (max-width: 991px) and (min-width: 479px){.brz-line{height:15px}}",
      "",
      ".brz-line{height:20px}"
    ]);

    const rulesCSS2 = {
      ...emptyCSS,
      mobile: [".asd{color:white}"]
    };

    expect(
      addBreakpointsToFilteredCSS([emptyCSS, rulesCSS2, emptyCSS])
    ).toStrictEqual([
      "",
      "@media only screen and (max-width: 478px) {.asd{color:white}}",
      ""
    ]);
  });
});

describe("Testing concatCSSWithBreakpoints that concatenate default/rules/custom styles", () => {
  test("Empty data", () => {
    expect(concatCSSWithBreakpoints(emptyCSS)).toStrictEqual("");
  });
  test("Concat desktop, should be concated", () => {
    expect(
      concatCSSWithBreakpoints({
        ...emptyCSS,
        desktop: [".brz-image{width:100%}", ".brz-imagegallery{display:flex}"]
      })
    ).toStrictEqual(".brz-image{width:100%}.brz-imagegallery{display:flex}");
  });
  test("Concat with nullish values, should be concated only valid data", () => {
    expect(
      concatCSSWithBreakpoints({
        ...emptyCSS,
        desktop: [".brz-image{width:90%}", _undefined as string]
      })
    ).toStrictEqual(".brz-image{width:90%}");
    expect(
      concatCSSWithBreakpoints({
        ...emptyCSS,
        desktop: [".brz-image{width:80%}", _null as string]
      })
    ).toStrictEqual(".brz-image{width:80%}");
    expect(
      concatCSSWithBreakpoints({
        ...emptyCSS,
        desktop: [".brz-image{width:60%}", ""]
      })
    ).toStrictEqual(".brz-image{width:60%}");
  });
});

describe("Filtering removeDuplicateCSSByDevice that should remove all duplicates from array", () => {
  test("removeDuplicateCSSByDevice", () => {
    expect(
      removeDuplicateCSSByDevice({} as GeneratedCSS<string>)
    ).toStrictEqual({});
    expect(removeDuplicateCSSByDevice(emptyCSS)).toStrictEqual(emptyCSS);
    expect(
      removeDuplicateCSSByDevice({
        ...emptyCSS,
        desktop: ["1", "1", "2"]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: ["1", "2"]
    });
  });
});

describe("Testing getSelectorAndCssFromCssObject that should return object with selector and css", () => {
  test("Empty object", () => {
    expect(getSelectorAndCssFromCssObject({})).toStrictEqual([]);
  });
  test("Valid data, but not with css", () => {
    expect(
      getSelectorAndCssFromCssObject({ asd: { test: "1" } })
    ).toStrictEqual([{ selector: "asd", css: "test:1;" }]);
  });
  test("Valid data, but not with css + hover", () => {
    expect(
      getSelectorAndCssFromCssObject({ asd: { test: "1" } }, HOVER)
    ).toStrictEqual([{ selector: "asd:hover", css: "test:1;" }]);
  });
  test("Valid data", () => {
    expect(
      getSelectorAndCssFromCssObject({ "{{WRAPPER}}": { height: "1px" } })
    ).toStrictEqual([{ css: "height:1px;", selector: "{{WRAPPER}}" }]);
  });
  test("Valid data + hover", () => {
    expect(
      getSelectorAndCssFromCssObject(
        { "{{WRAPPER}}": { border: "none" } },
        HOVER
      )
    ).toStrictEqual([{ css: "border:none;", selector: "{{WRAPPER}}:hover" }]);
  });
  test("Valid data + active", () => {
    expect(
      getSelectorAndCssFromCssObject(
        { "{{WRAPPER}}": { color: "red" } },
        ACTIVE
      )
    ).toStrictEqual([{ css: "color:red;", selector: "{{WRAPPER}}.active" }]);
  });

  test("Valid data + css with empty string value", () => {
    expect(
      getSelectorAndCssFromCssObject({ "{{WRAPPER}}": { content: "" } })
    ).toStrictEqual([{ css: "content:'';", selector: "{{WRAPPER}}" }]);
  });
});

describe("Testing concatStylesByCssObject that should merge new css objects in already existing", () => {
  test("Empty", () => {
    expect(
      concatStylesByCssObject({
        breakpoint: "desktop",
        cssObject: {},
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual(mockAllCssObjects);
  });
  test("Concat in empty desktop", () => {
    expect(
      concatStylesByCssObject({
        breakpoint: "desktop",
        cssObject: {
          test: {
            height: "10px"
          }
        },
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{}, { test: ["height:10px;"] }]
    });
  });
  test("Concat in existing desktop value", () => {
    expect(
      concatStylesByCssObject({
        breakpoint: "desktop",
        cssObject: {
          test: {
            height: "10px"
          }
        },
        allCSS: {
          ...mockAllCssObjects,
          desktop: [{ test2: ["width:10px;"] }]
        }
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{ test2: ["width:10px;"] }, { test: ["height:10px;"] }]
    });
  });
  test("Concat in existing desktop selector", () => {
    expect(
      concatStylesByCssObject({
        breakpoint: "desktop",
        cssObject: {
          test: {
            height: "10px"
          }
        },
        allCSS: {
          ...mockAllCssObjects,
          desktop: [{ test: ["width:10px;"] }]
        }
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{ test: ["width:10px;", "height:10px;"] }]
    });
  });
  test("Concat in hover", () => {
    expect(
      concatStylesByCssObject({
        breakpoint: "hover",
        cssObject: {
          ".list": {
            height: "15px"
          }
        },
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      hover: [{}, { ".list": ["height:15px;"] }]
    });
  });
  test("Concat in active", () => {
    expect(
      concatStylesByCssObject({
        breakpoint: "active",
        cssObject: {
          ".list-item": {
            color: "red"
          }
        },
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      active: [{}, { ".list-item": ["color:red;"] }]
    });
  });
  test("Concat in existing hover selector", () => {
    expect(
      concatStylesByCssObject({
        breakpoint: "hover",
        cssObject: {
          ".list": {
            height: "15px"
          }
        },
        allCSS: {
          ...mockAllCssObjects,
          hover: [{ ".list": ["color:blue;"] }]
        }
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      hover: [{ ".list": ["color:blue;", "height:15px;"] }]
    });
  });
});

describe("Testing concatStyles that should merge array of cssObjects in allCSS", () => {
  test("Empty", () => {
    expect(
      concatStyles({
        data: [],
        dataKey: "desktop",
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual(mockAllCssObjects);
  });
  test("Desktop 1 style", () => {
    expect(
      concatStyles({
        data: [{ selector: "{{WRAPPER}}", css: "height:20px;" }],
        dataKey: "desktop",
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{}, { "{{WRAPPER}}": ["height:20px;"] }]
    });
  });
  test("Desktop 2 styles", () => {
    expect(
      concatStyles({
        data: [
          { selector: "{{WRAPPER}}", css: "height:20px;" },
          { selector: "{{WRAPPER}} .item", css: "color:red;" }
        ],
        dataKey: "desktop",
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [
        {},
        { "{{WRAPPER}}": ["height:20px;"] },
        { "{{WRAPPER}} .item": ["color:red;"] }
      ]
    });
  });
  test("Desktop 2 styles with same selector", () => {
    expect(
      concatStyles({
        data: [
          { selector: "{{WRAPPER}}", css: "height:20px;" },
          { selector: "{{WRAPPER}}", css: "border:none;" }
        ],
        dataKey: "desktop",
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{}, { "{{WRAPPER}}": ["height:20px;", "border:none;"] }]
    });
  });
  test("Desktop 3 styles with same selector", () => {
    expect(
      concatStyles({
        data: [
          { selector: "{{WRAPPER}}", css: "color:white;" },
          { selector: "{{WRAPPER}}", css: "border:none;" },
          {
            selector: "{{WRAPPER}}",
            css: "background-color:black; background-image:none;"
          }
        ],
        dataKey: "hover",
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      hover: [
        {},
        {
          "{{WRAPPER}}": [
            "color:white;",
            "border:none;",
            "background-color:black; background-image:none;"
          ]
        }
      ]
    });
  });
});

describe("Testing mergeStyles that convert cssObjects to CSS and group it by selector", () => {
  test("Empty", () => {
    expect(mergeStylesArray(mockAllCssObjects)).toStrictEqual(emptyCSS);
  });
  test("Hover values", () => {
    expect(
      mergeStylesArray({
        ...mockAllCssObjects,
        hover: [
          {
            "{{WRAPPER}}": [
              "color:white;",
              "border:none;",
              "background-color:black; background-image:none;"
            ]
          }
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      hover: [
        "{{WRAPPER}}{color:white;border:none;background-color:black; background-image:none;}"
      ]
    });
  });
  test("Desktop values", () => {
    expect(
      mergeStylesArray({
        ...mockAllCssObjects,
        desktop: [
          {
            "{{WRAPPER}}": [
              "color:white;",
              "border:none;",
              "background-color:black; background-image:none;"
            ]
          }
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: [
        "{{WRAPPER}}{color:white;border:none;background-color:black; background-image:none;}"
      ]
    });
  });
  test("Tablet empty values", () => {
    expect(
      mergeStylesArray({
        ...mockAllCssObjects,
        tablet: [
          {
            "{{WRAPPER}}": []
          }
        ]
      })
    ).toStrictEqual(emptyCSS);
  });
  test("Merge in random selector", () => {
    expect(
      mergeStylesArray({
        ...mockAllCssObjects,
        desktop: [
          {
            asd: ["content:'';", "top:0;left:0;"]
          }
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: ["asd{content:'';top:0;left:0;}"]
    });
  });
});

describe("Testing getNewGeneratesCSSfromStyle that should return new allCSS object with new styles", () => {
  test("Option with selector, should return undefined", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        v: {},
        breakpoint: "desktop",
        option: borderOptionWithSelector,
        state: NORMAL,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual(undefined);
  });
  test("Height option with styles, should return cssObject with height", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        v: heightElementModel,
        breakpoint: "desktop",
        option: heightOptionWithStyle,
        state: NORMAL,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{}, { "{{WRAPPER}}": ["height:20px;"] }]
    });
  });
  test("Height option with styles for tablet, should return cssObject with height for tablet", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        v: heightElementModel,
        breakpoint: "tablet",
        option: heightOptionWithStyle,
        state: NORMAL,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      tablet: [{}, { "{{WRAPPER}}": ["height:20px;"] }]
    });
  });
  test("Height option with hover and tablet breakpoint", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        v: {
          ...heightElementModel,
          tabletHeight: 30
        },
        breakpoint: "tablet",
        option: heightOptionWithStyle,
        state: HOVER,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      hover: [{}, { "{{WRAPPER}}:hover": ["height:30px;"] }]
    });
  });
  test("Height option with active and mobile breakpoint", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        v: heightElementModel,
        breakpoint: "mobile",
        option: heightOptionWithStyle,
        state: ACTIVE,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      active: [{}, { "{{WRAPPER}}.active": ["height:20px;"] }]
    });
  });
});

describe("Testing getNewGeneratesCSSfromSelector that should return new allCSS object with new styles", () => {
  test("Option with style", () => {
    expect(
      getNewGeneratesCSSfromSelector({
        v: {},
        breakpoint: "desktop",
        option: heightOptionWithStyle,
        state: NORMAL,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual(undefined);
  });
  test("Border option with selector, should return cssObject with border", () => {
    expect(
      getNewGeneratesCSSfromSelector({
        v: borderElementModel,
        breakpoint: "desktop",
        option: borderOptionWithSelector,
        state: NORMAL,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [
        {},
        {
          "{{WRAPPER}} .list .list-item": [
            "border:5px solid rgba(115, 119, 127, 1);"
          ]
        }
      ]
    });
  });
  test("Border option with selector for tablet, should return cssObject with border for tablet", () => {
    expect(
      getNewGeneratesCSSfromSelector({
        v: borderElementModel,
        breakpoint: "tablet",
        option: borderOptionWithSelector,
        state: NORMAL,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      tablet: [
        {},
        {
          "{{WRAPPER}} .list .list-item": [
            "border:5px solid rgba(115, 119, 127, 1);"
          ]
        }
      ]
    });
  });
  test("Border option with hover and tablet breakpoint", () => {
    expect(
      getNewGeneratesCSSfromSelector({
        v: {
          ...borderElementModel,
          borderWidth: 30
        },
        breakpoint: "tablet",
        option: borderOptionWithSelector,
        state: HOVER,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      hover: [
        {},
        {
          "{{WRAPPER}} .list .list-item:hover": [
            "border:30px solid rgba(115, 119, 127, 1);"
          ]
        }
      ]
    });
  });
  test("Height option with active and mobile breakpoint", () => {
    expect(
      getNewGeneratesCSSfromSelector({
        v: borderElementModel,
        breakpoint: "mobile",
        option: borderOptionWithSelector,
        state: ACTIVE,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      active: [
        {},
        {
          "{{WRAPPER}} .list .list-item.active": [
            "border:5px solid rgba(115, 119, 127, 1);"
          ]
        }
      ]
    });
  });

  test("Border option with hover set int selector", () => {
    expect(
      getNewGeneratesCSSfromSelector({
        v: {
          ...borderElementModel,
          borderWidth: 30
        },
        breakpoint: "tablet",
        option: {
          ...borderOptionWithSelector,
          selector: "{{WRAPPER}} .list:hover .list-item"
        },
        state: HOVER,
        allCSS: mockAllCssObjects
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      hover: [
        {},
        {
          "{{WRAPPER}} .list:hover .list-item": [
            "border:30px solid rgba(115, 119, 127, 1);"
          ]
        }
      ]
    });
  });
});

describe("Testing concatFinalCSS that should concat 2 arrays with 3 strings by index", () => {
  expect(concatFinalCSS(["a", "b", "c"], ["d", "e", "f"])).toStrictEqual([
    "ad",
    "be",
    "cf"
  ]);

  expect(concatFinalCSS(["", "", ""], ["", "", ""])).toStrictEqual([
    "",
    "",
    ""
  ]);

  expect(concatFinalCSS(["a", "", ""], ["b", "", ""])).toStrictEqual([
    "ab",
    "",
    ""
  ]);

  expect(concatFinalCSS(["", "1", ""], ["", "2", ""])).toStrictEqual([
    "",
    "12",
    ""
  ]);

  expect(concatFinalCSS(["", "", "$"], ["", "", "%"])).toStrictEqual([
    "",
    "",
    "$%"
  ]);
});

describe("Testing getMissingKeys that should check which keys arr missing in object", () => {
  test("Empty array of keys and empty object", () => {
    expect(getMissingKeys([], {})).toStrictEqual([]);
  });

  test("Empty array only", () => {
    expect(getMissingKeys([], { a: 1 })).toStrictEqual([]);
  });

  test("Empty object only, should return 'a'", () => {
    expect(getMissingKeys(["a"], {})).toStrictEqual(["a"]);
  });

  test("Random keys test №1", () => {
    expect(getMissingKeys(["a", "b", "c"], { a: 1, b: 2 })).toStrictEqual([
      "c"
    ]);
  });

  test("Random keys test №2", () => {
    expect(getMissingKeys(["a", "b", "c", "d"], { a: 1, b: 2 })).toStrictEqual([
      "c",
      "d"
    ]);
  });

  test("Random keys test №3", () => {
    expect(
      getMissingKeys(["a", "b", "c", "d"], { a: 1, b: 2, c: 3, d: 4 })
    ).toStrictEqual([]);
  });
});

describe("Testing getMissingPropertiesFromModel that should return key:value from previous model if in current model is missing or undefined", () => {
  test("Empty default", () => {
    expect(
      getMissingPropertiesFromModel([], { vd: {}, vs: {}, v: {} }, "default")
    ).toStrictEqual(undefined);
  });

  test("Empty rules", () => {
    expect(
      getMissingPropertiesFromModel([], { vd: {}, vs: {}, v: {} }, "rules")
    ).toStrictEqual({});
  });

  test("Empty custom", () => {
    expect(
      getMissingPropertiesFromModel([], { vd: {}, vs: {}, v: {} }, "custom")
    ).toStrictEqual({});
  });

  test("Color hex in rules, but missing opacity, and palette. Should get opacity and palette from default", () => {
    expect(
      getMissingPropertiesFromModel(
        ["colorOpacity", "colorPalette"],
        {
          vd: { colorHex: "#000000", colorOpacity: 0.9, colorPalette: "" },
          vs: { colorHex: "#FF0000" },
          v: {}
        },
        "rules"
      )
    ).toStrictEqual({ colorOpacity: 0.9, colorPalette: "" });
  });

  test("Border color in custom, but missing width and type. Should get width and type from rules", () => {
    expect(
      getMissingPropertiesFromModel(
        ["borderWidth", "borderType"],
        {
          vd: { borderColor: "#000000", borderWidth: 5, borderType: "solid" },
          vs: { borderColor: "#000000", borderWidth: 7, borderType: "dashed" },
          v: { borderColor: "#FF0000" }
        },
        "custom"
      )
    ).toStrictEqual({
      borderWidth: 7,
      borderType: "dashed"
    });
  });

  test("Corner in custom, but missing width type. Should get width type from default, because in rules are still missing", () => {
    expect(
      getMissingPropertiesFromModel(
        ["cornerWidthType"],
        {
          vd: {
            cornerColor: "#000000",
            cornerWidth: 5,
            cornerWidthType: "grouped"
          },
          vs: {},
          v: { cornerColor: "#FF0000", cornerWidth: 7 }
        },
        "custom"
      )
    ).toStrictEqual({
      cornerWidthType: "grouped"
    });
  });
});

describe("Testing getCurrentModelFilteredValues that should return new filtered model ( 'vd' or 'vs' or 'v')", () => {
  test("Empty default", () => {
    expect(
      getCurrentModelFilteredValues("default", { vd: {}, vs: {}, v: {} })
    ).toStrictEqual({});
  });

  test("Empty rules", () => {
    expect(
      getCurrentModelFilteredValues("rules", { vd: {}, vs: {}, v: {} })
    ).toStrictEqual({});
  });

  test("Empty custom", () => {
    expect(
      getCurrentModelFilteredValues("custom", { vd: {}, vs: {}, v: {} })
    ).toStrictEqual({});
  });

  test("Omit _styles and _id for default", () => {
    expect(
      getCurrentModelFilteredValues("default", {
        vd: { _styles: [], _id: "" },
        vs: { _styles: [], _id: "" },
        v: { _styles: [], _id: "" }
      })
    ).toStrictEqual({});
  });

  test("Omit _styles and _id for rules", () => {
    expect(
      getCurrentModelFilteredValues("rules", {
        vd: { _styles: [], _id: "" },
        vs: { _styles: [], _id: "" },
        v: { _styles: [], _id: "" }
      })
    ).toStrictEqual({});
  });

  test("Omit _styles and _id for custom", () => {
    expect(
      getCurrentModelFilteredValues("custom", {
        vd: { _styles: [], _id: "" },
        vs: { _styles: [], _id: "" },
        v: { _styles: [], _id: "" }
      })
    ).toStrictEqual({});
  });

  test("Default model", () => {
    expect(
      getCurrentModelFilteredValues("default", {
        vd: borderElementModel,
        vs: borderElementModel,
        v: borderElementModel
      })
    ).toStrictEqual(borderElementModel);
  });

  test("Rules model as same values as default", () => {
    expect(
      getCurrentModelFilteredValues("rules", {
        vd: borderElementModel,
        vs: borderElementModel,
        v: borderElementModel
      })
    ).toStrictEqual({});
  });

  test("Custom model as same values as rules", () => {
    expect(
      getCurrentModelFilteredValues("custom", {
        vd: borderElementModel,
        vs: borderElementModel,
        v: borderElementModel
      })
    ).toStrictEqual({});
  });

  test("Rules model with some new values, should return unique key:value filtered with default", () => {
    expect(
      getCurrentModelFilteredValues("rules", {
        vd: borderElementModel,
        vs: {
          ...borderElementModel,
          borderColorHex: "#FF0000",
          borderColorOpacity: 0.9
        },
        v: borderElementModel
      })
    ).toStrictEqual({ borderColorHex: "#FF0000", borderColorOpacity: 0.9 });
  });

  test("Custom model with some new values, should return unique key:value filtered with rules", () => {
    expect(
      getCurrentModelFilteredValues("custom", {
        vd: borderElementModel,
        vs: borderElementModel,
        v: { ...borderElementModel, borderTopWidth: 7, borderRightWidth: 8 }
      })
    ).toStrictEqual({ borderTopWidth: 7, borderRightWidth: 8 });
  });
});

describe("Testing checkIfSomeKeyWasChanged that should check if min 1 key of option model in changed in vs or v", () => {
  test("Empty, should return false", () => {
    // @ts-expect-error testing purpose
    expect(checkIfSomeKeyWasChanged({})).toStrictEqual(false);
  });

  test("Border option in empty v, should return false", () => {
    expect(
      checkIfSomeKeyWasChanged({
        id: "border",
        type: "border",
        v: {},
        breakpoint: DESKTOP,
        state: NORMAL
      })
    ).toStrictEqual(false);
  });

  test("Border option with desktop normal, should return true", () => {
    expect(
      checkIfSomeKeyWasChanged({
        id: "border",
        type: "border",
        v: {
          borderColorHex: "asd"
        },
        breakpoint: DESKTOP,
        state: NORMAL
      })
    ).toStrictEqual(true);
  });

  test("Border option with desktop hover, should return true", () => {
    expect(
      checkIfSomeKeyWasChanged({
        id: "border",
        type: "border",
        v: {
          hoverBorderColorHex: "asd"
        },
        breakpoint: DESKTOP,
        state: HOVER
      })
    ).toStrictEqual(true);
  });

  test("Border option with desktop hover but any hover key is missing, should return false", () => {
    expect(
      checkIfSomeKeyWasChanged({
        id: "border",
        type: "border",
        v: {},
        breakpoint: DESKTOP,
        state: HOVER
      })
    ).toStrictEqual(false);
  });

  test("Border option with desktop active, should return true", () => {
    expect(
      checkIfSomeKeyWasChanged({
        id: "border",
        type: "border",
        v: {
          activeBorderColorHex: "a"
        },
        breakpoint: DESKTOP,
        state: ACTIVE
      })
    ).toStrictEqual(true);
  });

  test("Border option with desktop active but any active key is missing, should return false", () => {
    expect(
      checkIfSomeKeyWasChanged({
        id: "border",
        type: "border",
        v: {},
        breakpoint: DESKTOP,
        state: ACTIVE
      })
    ).toStrictEqual(false);
  });

  test("Border option with tablet but any active key is missing, should return false", () => {
    expect(
      checkIfSomeKeyWasChanged({
        id: "border",
        type: "border",
        v: {},
        breakpoint: TABLET,
        state: NORMAL
      })
    ).toStrictEqual(false);
  });

  test("Border option with tablet, should return true", () => {
    expect(
      checkIfSomeKeyWasChanged({
        id: "border",
        type: "border",
        v: {
          tabletBorderColorHex: 1
        },
        breakpoint: TABLET,
        state: NORMAL
      })
    ).toStrictEqual(true);
  });

  test("Border option with mobile, should return true", () => {
    expect(
      checkIfSomeKeyWasChanged({
        id: "border",
        type: "border",
        v: {
          mobileBorderColorHex: 1
        },
        breakpoint: MOBILE,
        state: NORMAL
      })
    ).toStrictEqual(true);
  });
});

describe("Testing getNewModel function that should return new option model that get missing keys from previous model, as example missing key from v is getting from vs, missing key from vs is getting from vd", () => {
  const model = {
    vd: borderElementModel,
    vs: borderElementModel,
    v: borderElementModel
  };

  test("Empty", () => {
    // @ts-expect-error testing purposes
    expect(getNewModel({})).toStrictEqual({});
  });

  test("Missing normal keys in vs must be taken from vd ", () => {
    expect(
      getNewModel({
        id: "border",
        type: "border",
        v: { borderColorHex: "#0000FF", borderColorOpacity: 0.9 },
        model,
        currentModel: "rules",
        breakpoint: DESKTOP,
        state: NORMAL
      })
    ).toStrictEqual({
      ...borderElementModel,
      borderColorHex: "#0000FF",
      borderColorOpacity: 0.9
    });
  });

  test("Missing normal keys in v must be taken from vs ", () => {
    expect(
      getNewModel({
        id: "border",
        type: "border",
        v: { borderWidth: 5 },
        model: {
          ...model,
          vs: {
            ...borderElementModel,
            borderColorHex: "asd",
            borderColorPalette: "asd2",
            borderColorOpacity: "asd3"
          }
        },
        currentModel: "custom",
        breakpoint: DESKTOP,
        state: NORMAL
      })
    ).toStrictEqual({
      ...borderElementModel,
      borderColorHex: "asd",
      borderColorOpacity: "asd3",
      borderColorPalette: "asd2"
    });
  });

  test("Missing normal keys in v must be taken from vd if also is still missing in vs ", () => {
    expect(
      getNewModel({
        id: "border",
        type: "border",
        v: { borderWidth: 5 },
        model: {
          ...model,
          vd: {
            ...borderElementModel,
            borderColorHex: "#FF0000",
            borderColorPalette: "color3",
            borderColorOpacity: "0.9"
          },
          vs: {}
        },
        currentModel: "custom",
        breakpoint: DESKTOP,
        state: NORMAL
      })
    ).toStrictEqual({
      ...borderElementModel,
      borderColorHex: "#FF0000",
      borderColorPalette: "color3",
      borderColorOpacity: "0.9"
    });
  });

  test("Missing hover keys in v must be taken from vd if also is still missing in vs ", () => {
    expect(
      getNewModel({
        id: "border",
        type: "border",
        v: { hoverBorderWidth: 5 },
        model: {
          ...model,
          vd: {
            hoverBorderColorHex: "#FF0000",
            hoverBorderColorPalette: "color3",
            hoverBorderColorOpacity: "0.9",
            hoverBorderBottomWidth: 1,
            hoverBorderLeftWidth: 2,
            hoverBorderRightWidth: 3,
            hoverBorderStyle: "solid",
            hoverBorderTopWidth: 4,
            hoverBorderWidthType: "grouped"
          },
          vs: {}
        },
        currentModel: "custom",
        breakpoint: DESKTOP,
        state: HOVER
      })
    ).toStrictEqual({
      hoverBorderBottomWidth: 1,
      hoverBorderColorHex: "#FF0000",
      hoverBorderColorOpacity: "0.9",
      hoverBorderColorPalette: "color3",
      hoverBorderLeftWidth: 2,
      hoverBorderRightWidth: 3,
      hoverBorderStyle: "solid",
      hoverBorderTopWidth: 4,
      hoverBorderWidth: 5,
      hoverBorderWidthType: "grouped"
    });
  });

  test("Missing active keys in v must be taken from vd if also is still missing in vs ", () => {
    expect(
      getNewModel({
        id: "border",
        type: "border",
        v: { activeBorderWidth: 5 },
        model: {
          ...model,
          vd: {
            activeBorderColorHex: "#FF0000",
            activeBorderColorPalette: "color3",
            activeBorderColorOpacity: "0.9",
            activeBorderBottomWidth: 1,
            activeBorderLeftWidth: 2,
            activeBorderRightWidth: 3,
            activeBorderStyle: "solid",
            activeBorderTopWidth: 4,
            activeBorderWidthType: "grouped"
          },
          vs: {}
        },
        currentModel: "custom",
        breakpoint: DESKTOP,
        state: ACTIVE
      })
    ).toStrictEqual({
      activeBorderBottomWidth: 1,
      activeBorderColorHex: "#FF0000",
      activeBorderColorOpacity: "0.9",
      activeBorderColorPalette: "color3",
      activeBorderLeftWidth: 2,
      activeBorderRightWidth: 3,
      activeBorderStyle: "solid",
      activeBorderTopWidth: 4,
      activeBorderWidth: 5,
      activeBorderWidthType: "grouped"
    });
  });

  test("Missing tablet keys in v must be taken from vd if also is still missing in vs ", () => {
    expect(
      getNewModel({
        id: "border",
        type: "border",
        v: { tabletBorderWidth: 5 },
        model: {
          ...model,
          vd: {
            tabletBorderColorHex: "#FF0000",
            tabletBorderColorPalette: "color3",
            tabletBorderColorOpacity: "0.9",
            tabletBorderBottomWidth: 1,
            tabletBorderLeftWidth: 2,
            tabletBorderRightWidth: 3,
            tabletBorderStyle: "solid",
            tabletBorderTopWidth: 4,
            tabletBorderWidthType: "grouped"
          },
          vs: {}
        },
        currentModel: "custom",
        breakpoint: TABLET,
        state: NORMAL
      })
    ).toStrictEqual({
      tabletBorderBottomWidth: 1,
      tabletBorderColorHex: "#FF0000",
      tabletBorderColorOpacity: "0.9",
      tabletBorderColorPalette: "color3",
      tabletBorderLeftWidth: 2,
      tabletBorderRightWidth: 3,
      tabletBorderStyle: "solid",
      tabletBorderTopWidth: 4,
      tabletBorderWidth: 5,
      tabletBorderWidthType: "grouped"
    });
  });

  test("Missing mobile keys in v must be taken from vd if also is still missing in vs ", () => {
    expect(
      getNewModel({
        id: "border",
        type: "border",
        v: { mobileBorderWidth: 5 },
        model: {
          ...model,
          vd: {
            mobileBorderColorHex: "#FF0000",
            mobileBorderColorPalette: "color3",
            mobileBorderColorOpacity: "0.9",
            mobileBorderBottomWidth: 1,
            mobileBorderLeftWidth: 2,
            mobileBorderRightWidth: 3,
            mobileBorderStyle: "solid",
            mobileBorderTopWidth: 4,
            mobileBorderWidthType: "grouped"
          },
          vs: {}
        },
        currentModel: "custom",
        breakpoint: MOBILE,
        state: NORMAL
      })
    ).toStrictEqual({
      mobileBorderBottomWidth: 1,
      mobileBorderColorHex: "#FF0000",
      mobileBorderColorOpacity: "0.9",
      mobileBorderColorPalette: "color3",
      mobileBorderLeftWidth: 2,
      mobileBorderRightWidth: 3,
      mobileBorderStyle: "solid",
      mobileBorderTopWidth: 4,
      mobileBorderWidth: 5,
      mobileBorderWidthType: "grouped"
    });
  });
});
