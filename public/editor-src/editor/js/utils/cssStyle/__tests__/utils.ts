import { CSSProperties } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { RenderType } from "visual/providers/RenderProvider";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
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
import {
  AllCSSKeys,
  GeneratedCSS,
  OutputStyle
} from "visual/utils/cssStyle/types";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { mockDataForReduxStore } from "../../../../../jest-utils/mocks";
import { DESKTOP, MOBILE, ResponsiveMode, TABLET } from "../../responsiveMode";
import {
  addBreakpointForInterval,
  addBreakpointForStandart,
  addBreakpointsToCSS,
  addBreakpointsToFilteredCSS,
  addSameClassNameToIncreaseSpecificity,
  concatCSSWithBreakpoints,
  concatFinalCSS,
  concatStyles,
  concatStylesByCssObject,
  filterDeviceValues,
  getCSSForCompare,
  getCSSFromSelector,
  getCSSObjectFromStyle,
  getNewGeneratesCSSfromSelector,
  getNewGeneratesCSSfromStyle,
  getSelectorAndCssFromCssObject,
  mergeStylesArray,
  objectToCSS,
  removeDuplicateCSSByDevice,
  replaceCSSDuplicatesWithEmptyString,
  replaceHoverAndActive
} from "../index";

// is only for testing purposes
const _undefined = undefined as unknown;
const _null = null as unknown;
const _NaN = NaN as unknown;
const getConfig = (): ConfigCommon => ({}) as ConfigCommon;

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
  const store = createStore();
  const renderContext: RenderType = "editor";

  test("Empty data, should return undefined", () => {
    expect(
      getCSSObjectFromStyle({
        renderContext,
        store,
        v: {},
        breakpoint: "desktop",
        option: { id: "asd", type: "slider" },
        getConfig
      })
    ).toStrictEqual(undefined);
  });
  test("Test with option, but empty value", () => {
    expect(
      getCSSObjectFromStyle({
        renderContext,
        store,
        v: {},
        breakpoint: "desktop",
        option: heightOptionWithStyle,
        getConfig
      })
    ).toStrictEqual({ "{{WRAPPER}}": { height: "0" } });
  });
  test("Test with option with valid values", () => {
    expect(
      getCSSObjectFromStyle({
        renderContext,
        store,
        v: { height: 20, heightSuffix: "px" },
        breakpoint: "desktop",
        option: heightOptionWithStyle,
        getConfig
      })
    ).toStrictEqual({ "{{WRAPPER}}": { height: "20px" } });
  });
  test("Test with option with valid values + hover", () => {
    expect(
      getCSSObjectFromStyle({
        renderContext,
        store,
        v: { height: 30, heightSuffix: "px", hoverHeight: 50 },
        breakpoint: "desktop",
        option: heightOptionWithStyle,
        getConfig
      })
    ).toStrictEqual({ "{{WRAPPER}}": { height: "30px" } });
  });
  test("Test with option with valid values + active", () => {
    expect(
      getCSSObjectFromStyle({
        renderContext,
        store,
        v: { height: 40, heightSuffix: "px", activeHeight: 60 },
        breakpoint: "desktop",
        option: heightOptionWithStyle,
        getConfig
      })
    ).toStrictEqual({ "{{WRAPPER}}": { height: "40px" } });
  });
  test("Test with option with valid values + hover + active", () => {
    expect(
      getCSSObjectFromStyle({
        renderContext,
        store,
        getConfig,
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
  const store = createStore();
  store.dispatch(
    // @ts-expect-error There is not need to add types because is only for testing purposes
    hydrate(mockDataForReduxStore)
  );
  const renderContext: RenderType = "editor";

  test("Empty data, should return border without styles", () => {
    expect(
      getCSSFromSelector({
        renderContext,
        store,
        v: {},
        breakpoint: "desktop",
        option: borderOptionWithSelector,
        getConfig
      })
    ).toStrictEqual("border: none;");
  });

  test("Wrong option", () => {
    expect(
      getCSSFromSelector({
        renderContext,
        store,
        v: {},
        breakpoint: "desktop",
        option: heightOptionWithStyle,
        getConfig
      })
    ).toStrictEqual(undefined);
  });
  test("Valid Data", () => {
    expect(
      getCSSFromSelector({
        renderContext,
        store,
        v: borderElementModel,
        breakpoint: "desktop",
        option: borderOptionWithSelector,
        getConfig
      })
    ).toStrictEqual("border:5px solid rgba(115, 119, 127, 1);");
  });
  test("With hover", () => {
    expect(
      getCSSFromSelector({
        renderContext,
        store,
        v: {
          ...borderElementModel,
          hoverBorderColorHex: "#FF0000"
        },
        breakpoint: "desktop",
        option: borderOptionWithSelector,
        getConfig
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
  const store = createStore();
  const renderContext: RenderType = "editor";

  test("Option with selector, should return undefined", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        renderContext,
        store,
        v: {},
        breakpoint: "desktop",
        option: borderOptionWithSelector,
        state: NORMAL,
        allCSS: mockAllCssObjects,
        getConfig
      })
    ).toStrictEqual(undefined);
  });
  test("Height option with styles, should return cssObject with height", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        renderContext,
        store,
        v: heightElementModel,
        breakpoint: "desktop",
        option: heightOptionWithStyle,
        state: NORMAL,
        allCSS: mockAllCssObjects,
        getConfig
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{}, { "{{WRAPPER}}": ["height:20px;"] }]
    });
  });
  test("Height option with styles for tablet, should return cssObject with height for tablet", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        renderContext,
        store,
        v: heightElementModel,
        breakpoint: "tablet",
        option: heightOptionWithStyle,
        state: NORMAL,
        allCSS: mockAllCssObjects,
        getConfig
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      tablet: [{}, { "{{WRAPPER}}": ["height:20px;"] }]
    });
  });
  test("Height option with hover and tablet breakpoint", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        renderContext,
        store,
        v: {
          ...heightElementModel,
          tabletHeight: 30
        },
        breakpoint: "tablet",
        option: heightOptionWithStyle,
        state: HOVER,
        allCSS: mockAllCssObjects,
        getConfig
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      hover: [{}, { "{{WRAPPER}}:hover": ["height:30px;"] }]
    });
  });
  test("Height option with active and mobile breakpoint", () => {
    expect(
      getNewGeneratesCSSfromStyle({
        renderContext,
        store,
        v: heightElementModel,
        breakpoint: "mobile",
        option: heightOptionWithStyle,
        state: ACTIVE,
        allCSS: mockAllCssObjects,
        getConfig
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      active: [{}, { "{{WRAPPER}}.active": ["height:20px;"] }]
    });
  });
});

describe("Testing getNewGeneratesCSSfromSelector that should return new allCSS object with new styles", () => {
  const store = createStore();
  store.dispatch(
    // @ts-expect-error There is not need to add types because is only for testing purposes
    hydrate(mockDataForReduxStore)
  );
  const renderContext: RenderType = "editor";

  test("Option with style", () => {
    expect(
      getNewGeneratesCSSfromSelector({
        renderContext,
        store,
        v: {},
        breakpoint: "desktop",
        option: heightOptionWithStyle,
        state: NORMAL,
        allCSS: mockAllCssObjects,
        getConfig
      })
    ).toStrictEqual(undefined);
  });
  test("Border option with selector, should return cssObject with border", () => {
    expect(
      getNewGeneratesCSSfromSelector({
        renderContext,
        store,
        v: borderElementModel,
        breakpoint: "desktop",
        option: borderOptionWithSelector,
        state: NORMAL,
        allCSS: mockAllCssObjects,
        getConfig
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
        renderContext,
        store,
        v: borderElementModel,
        breakpoint: "tablet",
        option: borderOptionWithSelector,
        state: NORMAL,
        allCSS: mockAllCssObjects,
        getConfig
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
        renderContext,
        store,
        v: {
          ...borderElementModel,
          borderWidth: 30
        },
        breakpoint: "tablet",
        option: borderOptionWithSelector,
        state: HOVER,
        allCSS: mockAllCssObjects,
        getConfig
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
        renderContext,
        store,
        v: borderElementModel,
        breakpoint: "mobile",
        option: borderOptionWithSelector,
        state: ACTIVE,
        allCSS: mockAllCssObjects,
        getConfig
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
        renderContext,
        store,
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
        allCSS: mockAllCssObjects,
        getConfig
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

describe("replaceCSSDuplicatesWithEmptyString", () => {
  const t1 = ["value1", "value2", "value3"];
  const t2 = ["", "", ""];

  test.each([
    [
      ["value", "value", "other"],
      ["value", "", "other"]
    ],
    [t1, t1],
    [
      ["value", "value", "value"],
      ["value", "", ""]
    ],
    [t2, t2]
  ])("%o is not equal with %o", (input, output) => {
    expect(
      replaceCSSDuplicatesWithEmptyString(input as OutputStyle)
    ).toStrictEqual(output);
  });
});

describe("replaceHoverAndActive function", () => {
  const output = "button";

  test.each([
    ["button:hover"],
    ["button.active"],
    ["button:hover.active"],
    ["button"],
    ["button:hover.active:hover"]
  ])(`%s is not equal with ${output}`, (input) => {
    expect(replaceHoverAndActive(input)).toBe(output);
  });
});

describe("Testing addBreakpointForStandart fn which add breakpoints for devices in old CSS generator for cssStyle functions called in standart", () => {
  test.each([
    [{ device: DESKTOP, state: NORMAL }, ""],
    [{ device: DESKTOP, state: HOVER }, "@media(min-width:991px){"],
    [{ device: DESKTOP, state: ACTIVE }, ""],
    [
      { device: TABLET, state: NORMAL },
      "@media(max-width:991px) and (min-width:768px){"
    ],
    [
      { device: TABLET, state: HOVER },
      "@media(max-width:991px) and (min-width:768px){"
    ],
    [
      { device: TABLET, state: ACTIVE },
      "@media(max-width:991px) and (min-width:768px){"
    ],
    [{ device: MOBILE, state: NORMAL }, "@media(max-width:767px){"],
    [{ device: MOBILE, state: HOVER }, "@media(max-width:767px){"],
    [{ device: MOBILE, state: ACTIVE }, "@media(max-width:767px){"]
  ])(`%s is not equal with %s`, ({ device, state }, expected) => {
    expect(
      addBreakpointForStandart(device as ResponsiveMode, state, {
        desktop: 1500,
        tablet: 991,
        mobile: 767
      })
    ).toBe(expected);
  });
});

describe("Testing addBreakpointForInterval fn which add breakpoints for devices in old CSS generator for cssStyle functions called in interval", () => {
  test.each([
    [DESKTOP, "@media(min-width:991px){"],
    [TABLET, "@media(max-width:991px) and (min-width:768px){"],
    [MOBILE, "@media(max-width:767px){"]
  ])(`%s is not equal with %s`, (device, expected) => {
    expect(
      addBreakpointForInterval(device as ResponsiveMode, {
        desktop: 1500,
        tablet: 991,
        mobile: 767
      })
    ).toBe(expected);
  });

  test.each([
    [TABLET, ""],
    [MOBILE, ""]
  ])(`%s is not equal with %s`, (device, expected) => {
    expect(
      addBreakpointForInterval(device as ResponsiveMode, {
        desktop: 1500
      })
    ).toBe(expected);
  });
});
