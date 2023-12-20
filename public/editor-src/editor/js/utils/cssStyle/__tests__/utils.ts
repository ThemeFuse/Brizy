import { CSSProperties } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import { BreakpointsNames } from "visual/utils/breakpoints/types";
import { t } from "visual/utils/i18n";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { AllCSSKeys, CSS, GeneratedCSS } from "../types";
import {
  addBreakpointsToCSS,
  addBreakpointsToFilteredCSS,
  addSameClassNameToIncreaseSpecificity,
  concatCSSWithBreakpoints,
  concatStyles,
  concatStylesByCssObject,
  filterByGroupAndSelector,
  filterBySelector,
  filterCSSObjectBetweenCSSObjects,
  filterDeviceValues,
  filterStylesByDesktop,
  getCSSByState,
  getCSSForCompare,
  getCSSFromCssStyleFunction,
  getCSSFromSelector,
  getCSSObjectFromStyle,
  getCssStyleFnNameAndMode,
  getNewGeneratesCSSfromSelector,
  getNewGeneratesCSSfromStyle,
  getSelectorAndCssFromCssObject,
  getSelectorByState,
  getUniqueCSS,
  mergeStylesArray,
  objectToCSS,
  removeDuplicateCSSByDevice,
  selectorHasHover
} from "../utils";

// is only for testing purposes
const _undefined = undefined as unknown;
const _null = null as unknown;
const _NaN = NaN as unknown;

export const emptyCSS: GeneratedCSS<string> = {
  widescreen: [],
  desktopLarge: [],
  desktop: [],
  tablet: [],
  mobileLandscape: [],
  mobile: [],
  hover: [],
  active: []
};

export const generatedCSSSameStyles: GeneratedCSS<string> = {
  widescreen: ["{{WRAPPER}}{height:50px}"],
  desktopLarge: ["{{WRAPPER}}{height:50px}"],
  desktop: ["{{WRAPPER}}{height:50px}"],
  tablet: ["{{WRAPPER}}{height:50px}"],
  mobileLandscape: ["{{WRAPPER}}{height:50px}"],
  mobile: ["{{WRAPPER}}{height:50px}"],
  hover: ["{{WRAPPER}}{height:50px}"],
  active: ["{{WRAPPER}}{height:50px}"]
};

export const generatedCSSSameStylesDoubledData: GeneratedCSS<string> = {
  widescreen: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  desktopLarge: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  desktop: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  tablet: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  mobileLandscape: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  mobile: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  hover: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  active: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"]
};

export const heightOptionWithStyle = {
  id: "height",
  type: "slider-dev" as const,
  style: (data: ElementModel) => ({
    "{{WRAPPER}}": {
      height: `${data.value}${data.unit}`
    }
  })
};

export const widthOptionWithStyle = {
  id: "width",
  type: "slider-dev" as const,
  style: (data: ElementModel) => ({
    "{{WRAPPER}}": {
      width: `${data.value}${data.unit}`
    }
  })
};

export const fontSizeOptionWithStyle = {
  id: "fontSize",
  type: "slider-dev" as const,
  style: (data: ElementModel) => ({
    "{{WRAPPER}}": {
      "font-size": `${data.value}${data.unit}`
    }
  })
};

const heightElementModel = {
  height: 20,
  heightSuffix: "px"
};

export const borderOptionWithSelector = {
  id: "border",
  label: t("Border"),
  type: "border-dev" as const,
  selector: "{{WRAPPER}} .list .list-item"
};

export const borderElementModel: ElementModel = {
  borderStyle: "solid",
  borderColorHex: "#73777f",
  borderColorOpacity: 1,
  borderColorPalette: "",
  borderWidthType: "grouped",
  borderWidth: 5,
  borderTopWidth: 5,
  borderRightWidth: 5,
  borderBottomWidth: 5,
  borderLeftWidth: 5
};

export const backgroundOptionWithSelector = {
  id: "",
  label: t("Background"),
  type: "backgroundColor-dev" as const,
  selector: "{{WRAPPER}}"
};

export const backgroundColorElementModel = {
  bgColorType: "solid",
  bgColorHex: "#FF0000",
  bgColorOpacity: 1,
  bgColorPalette: "",
  gradientColorHex: "#0527CA",
  gradientColorOpacity: 1,
  gradientColorPalette: "",
  gradientType: "linear",
  gradientStartPointer: 0,
  gradientFinishPointer: 100,
  gradientActivePointer: "startPointer",
  gradientLinearDegree: 90,
  gradientRadialDegree: 90
};

const mockAllCssObjects: CSS = {
  desktop: [{}],
  widescreen: [{}],
  desktopLarge: [{}],
  tablet: [{}],
  mobileLandscape: [{}],
  mobile: [{}],
  hover: [{}],
  active: [{}]
};

describe("Testing CSS Generator utils functions", () => {
  test("getSelectorByState", () => {
    expect(getSelectorByState({ selector: _undefined as string })).toBe(
      _undefined
    );
    expect(getSelectorByState({ selector: _null as string })).toBe(_null);
    expect(getSelectorByState({ selector: ".class1" })).toBe(".class1");
    expect(getSelectorByState({ selector: ".class2", state: NORMAL })).toBe(
      ".class2"
    );
    expect(getSelectorByState({ selector: ".class3", state: HOVER })).toBe(
      ".class3:hover"
    );
    expect(
      getSelectorByState({
        selector: ".class4",
        state: HOVER
      })
    ).toBe(".class4:hover");
    expect(
      getSelectorByState({
        selector: ".class5",
        state: HOVER
      })
    ).toBe(".class5:hover");
    expect(getSelectorByState({ selector: ".class6", state: ACTIVE })).toBe(
      ".class6.active"
    );
    expect(
      getSelectorByState({
        selector: ".class7",
        state: ACTIVE
      })
    ).toBe(".class7.active");

    expect(
      getSelectorByState({
        selector: ".class8",
        state: ACTIVE
      })
    ).toBe(".class8.active");
  });

  test("getUniqueCSS", () => {
    expect(
      getUniqueCSS(generatedCSSSameStyles, generatedCSSSameStyles)
    ).toStrictEqual(emptyCSS);
    expect(
      getUniqueCSS(generatedCSSSameStyles, generatedCSSSameStyles)
    ).toStrictEqual(emptyCSS);
    expect(
      getUniqueCSS(generatedCSSSameStyles, generatedCSSSameStyles)
    ).toStrictEqual(emptyCSS);
    expect(
      getUniqueCSS(
        {
          ...emptyCSS,
          desktop: [".test1{}"]
        },
        {
          ...emptyCSS,
          desktop: [".test1{}"]
        }
      )
    ).toStrictEqual(emptyCSS);

    const data1 = {
      ...emptyCSS,
      desktop: [".test2{color:red}"]
    };

    expect(
      getUniqueCSS(data1, {
        ...emptyCSS,
        desktop: [".test3{color:blue}"]
      })
    ).toStrictEqual(data1);

    const data2 = {
      ...generatedCSSSameStyles,
      hover: [".brz-asd:hover{color:white}"],
      desktop: [".test{border:1px solid red}", ".test2{font-family: Arial}"],
      tablet: [".selector{height:30px}"]
    };

    expect(getUniqueCSS(data2, generatedCSSSameStyles)).toStrictEqual({
      desktop: [".test{border:1px solid red}", ".test2{font-family: Arial}"],
      desktopLarge: [],
      hover: [".brz-asd:hover{color:white}"],
      active: [],
      mobile: [],
      mobileLandscape: [],
      tablet: [".selector{height:30px}"],
      widescreen: []
    });
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

describe("Testing getUniqueCSS that should return filtered CSS between vd, vs, v", () => {
  test("No CSS, should return empty arrays", () => {
    expect(getUniqueCSS(emptyCSS, emptyCSS)).toStrictEqual(emptyCSS);
  });

  test("Compare rules with default where both has the same styles, should return rules as with empty arrays", () => {
    expect(
      getUniqueCSS(generatedCSSSameStyles, generatedCSSSameStyles)
    ).toStrictEqual(emptyCSS);
  });

  test("Compare rules with hover as different style, should return empty arrays except hover", () => {
    expect(
      getUniqueCSS(
        {
          ...generatedCSSSameStyles,
          hover: [".brz-test:hover{color:red;}"]
        },
        generatedCSSSameStyles
      )
    ).toStrictEqual({
      ...emptyCSS,
      hover: [".brz-test:hover{color:red;}"]
    });
  });

  test("Compare custom CSS with rules as different styles with default, should return unique custom style", () => {
    expect(
      getUniqueCSS(
        {
          ...generatedCSSSameStyles,
          hover: [".brz-test:hover{color:red;}"],
          active: [".brz-a.active{color:blue;}"],
          tablet: ["{{WRAPPER}}{height:70px}"]
        },
        {
          ...generatedCSSSameStyles,
          active: [".brz-a.active{color:blue;}"]
        }
      )
    ).toStrictEqual({
      ...emptyCSS,
      hover: [".brz-test:hover{color:red;}"],
      tablet: ["{{WRAPPER}}{height:70px}"],
      active: []
    });
  });

  const populatedAllCSSData = {
    widescreen: [".brz-a{color:white}", ".brz-a2{color:grey}"],
    desktopLarge: [".brz-b{font-size:16px}"],
    desktop: ["{{WRAPPER}}{height:100px}"],
    tablet: ["{{WRAPPER}} .list{height:70px}"],
    mobileLandscape: ["{{WRAPPER}} .brz-spacer{height:0px}"],
    mobile: ["{{WRAPPER}} .list .list-item{height:20px}"],
    hover: [".brz-test:hover{color:red;}"],
    active: [".brz-a.active{color:blue;}"]
  };

  test("Compare custom CSS where all styles are unique, should return all unique styles", () => {
    expect(
      getUniqueCSS(populatedAllCSSData, generatedCSSSameStyles)
    ).toStrictEqual(populatedAllCSSData);
  });

  test("Compare custom CSS where all styles are unique, but 1 is the same in default, should return all unique styles", () => {
    expect(
      getUniqueCSS(populatedAllCSSData, {
        ...generatedCSSSameStyles,
        widescreen: [".brz-a2{color:grey}"]
      })
    ).toStrictEqual({
      ...populatedAllCSSData,
      widescreen: [".brz-a{color:white}"]
    });
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

describe("Testing selectorHasHover that should return true/false is string has :hover", () => {
  test("Testing cases with populated strings", () => {
    expect(selectorHasHover("asd")).toBe(false);
    expect(selectorHasHover("asd hover")).toBe(false);
    expect(selectorHasHover("hover")).toBe(false);
    expect(selectorHasHover(":hover")).toBe(true);
    expect(selectorHasHover(".brz-spacer:hover")).toBe(true);
  });
});

describe("Testing getCssStyleFnNameAndMode that should return name of the cssStyle function and his mode (editor/preview)", () => {
  test("Testing without mode, should return object where only fnName is populated", () => {
    expect(getCssStyleFnNameAndMode("cssStyleBorder")).toStrictEqual({
      fnName: "cssStyleBorder",
      mode: ""
    });
  });

  test("Testing with mode, should return object fnName and mode is populated", () => {
    expect(getCssStyleFnNameAndMode("cssStyleBorder|||editor")).toStrictEqual({
      fnName: "cssStyleBorder",
      mode: "editor"
    });
  });

  test("Testing with mode, should return object fnName and mode is populated", () => {
    expect(getCssStyleFnNameAndMode("cssStyleBorder|||preview")).toStrictEqual({
      fnName: "cssStyleBorder",
      mode: "preview"
    });
  });

  test("Testing with incorrect delimiter, should return input data as fnName", () => {
    expect(getCssStyleFnNameAndMode("cssStyleBorder||editor")).toStrictEqual({
      fnName: "cssStyleBorder||editor",
      mode: ""
    });
  });

  test("Testing with incorrect delimiter, should return input data as fnName", () => {
    expect(getCssStyleFnNameAndMode("cssStyleBorder$editor")).toStrictEqual({
      fnName: "cssStyleBorder$editor",
      mode: ""
    });
  });
});

describe("Testing getCSSFromCssStyleFunction that should return CSS by cssStyle function name and mode", () => {
  test("Without useful data, should return undefined", () => {
    expect(
      getCSSFromCssStyleFunction({
        v: borderElementModel,
        name: "",
        breakpoint: "tablet",
        state: HOVER
      })
    ).toBe(undefined);
  });

  test("Testing with cssStyleBorder, should return css for for border", () => {
    expect(
      getCSSFromCssStyleFunction({
        v: borderElementModel,
        name: "cssStyleBorder",
        breakpoint: "desktop",
        state: NORMAL
      })
    ).toBe("border:5px solid rgba(115, 119, 127, 1);");
  });

  test("Testing with cssStyleBgColor, should return css for for background color", () => {
    expect(
      getCSSFromCssStyleFunction({
        v: backgroundColorElementModel,
        name: "cssStyleBgColor",
        breakpoint: "tablet",
        state: HOVER
      })
    ).toBe("background-color:rgba(255, 0, 0, 1);");
  });
});

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

describe("Testing getCSSByState that should return CSS for hover state", () => {
  const v = {
    ...heightElementModel,
    hoverHeight: 50
  };

  const option = {
    ...heightOptionWithStyle,
    states: [NORMAL, HOVER]
  };

  test("Testing with device tablet, should return undefined", () => {
    expect(
      getCSSByState({ v, breakpoint: "tablet", option, state: HOVER })
    ).toBe(undefined);
  });

  test("Testing without state hover in option, should return undefined", () => {
    expect(
      getCSSByState({
        v,
        breakpoint: "tablet",
        option: heightOptionWithStyle,
        state: NORMAL
      })
    ).toBe(undefined);
  });

  test("slider-dev option with 'style' as height, should return CSS for hover", () => {
    expect(
      getCSSByState({ v, breakpoint: "desktop", option, state: HOVER })
    ).toStrictEqual([{ css: "height:50px;", selector: "{{WRAPPER}}:hover" }]);
  });

  test("border-dev option with 'selector', should return CSS for hover", () => {
    const v = {
      ...borderElementModel,
      hoverBorderWidth: 10
    };

    const optionBorderWithHover = {
      ...borderOptionWithSelector,
      states: [NORMAL, HOVER]
    };

    expect(
      getCSSByState({
        v,
        breakpoint: "desktop",
        option: optionBorderWithHover,
        state: HOVER
      })
    ).toStrictEqual([
      {
        css: "border:10px solid rgba(115, 119, 127, 1);",
        selector: "{{WRAPPER}} .list .list-item:hover"
      }
    ]);
  });

  test("backgroundColor-dev option with 'selector', should return CSS for hover", () => {
    const v = {
      ...backgroundColorElementModel,
      hoverBgColorOpacity: 0
    };

    const optionBackgroundWithHover = {
      ...backgroundOptionWithSelector,
      states: [NORMAL, HOVER]
    };

    expect(
      getCSSByState({
        v,
        breakpoint: "desktop",
        option: optionBackgroundWithHover,
        state: HOVER
      })
    ).toStrictEqual([
      {
        css: "background-color:rgba(255, 0, 0, 0);",
        selector: "{{WRAPPER}}:hover"
      }
    ]);
  });

  test("Testing with more selectors", () => {
    const v = {
      ...backgroundColorElementModel,
      hoverBgColorHex: 0
    };

    const optionBackgroundWithHoverAndMoreSelectors = {
      ...backgroundOptionWithSelector,
      selector:
        "{{WRAPPER}} .brz-map, {{WRAPPER}} .brz-line, {{WRAPPER}} .brz-alert, {{WRAPPER}}.brz-map__content",
      states: [NORMAL, HOVER]
    };

    const css = "background-color:rgba(0, 0, 0, 1);";

    expect(
      getCSSByState({
        v,
        breakpoint: "desktop",
        option: optionBackgroundWithHoverAndMoreSelectors,
        state: HOVER
      })
    ).toStrictEqual([
      {
        selector: "{{WRAPPER}} .brz-map:hover",
        css
      },
      {
        selector: " {{WRAPPER}} .brz-line:hover",
        css
      },
      {
        selector: " {{WRAPPER}} .brz-alert:hover",
        css
      },
      {
        selector: " {{WRAPPER}}.brz-map__content:hover",
        css
      }
    ]);
  });
});

describe("Testing getCSSByState that should return CSS for active state", () => {
  const v = {
    ...heightElementModel,
    activeHeight: 50
  };

  const option = {
    ...heightOptionWithStyle,
    states: [NORMAL, ACTIVE]
  };

  test("Testing with device tablet, should return undefined", () => {
    expect(
      getCSSByState({ v, breakpoint: "tablet", option, state: ACTIVE })
    ).toBe(undefined);
  });

  test("Testing without state active in option, should return undefined", () => {
    expect(
      getCSSByState({
        v,
        breakpoint: "tablet",
        option: heightOptionWithStyle,
        state: NORMAL
      })
    ).toBe(undefined);
  });

  test("slider-dev option with 'style' as height, should return CSS for hover", () => {
    expect(
      getCSSByState({ v, breakpoint: "desktop", option, state: ACTIVE })
    ).toStrictEqual([{ css: "height:50px;", selector: "{{WRAPPER}}.active" }]);
  });

  test("border-dev option with 'selector', should return CSS for active", () => {
    const v = {
      ...borderElementModel,
      activeBorderWidth: 10
    };

    const optionBorderWithActive = {
      ...borderOptionWithSelector,
      states: [NORMAL, ACTIVE]
    };

    expect(
      getCSSByState({
        v,
        breakpoint: "desktop",
        option: optionBorderWithActive,
        state: ACTIVE
      })
    ).toStrictEqual([
      {
        css: "border:10px solid rgba(115, 119, 127, 1);",
        selector: "{{WRAPPER}} .list .list-item.active"
      }
    ]);
  });

  test("backgroundColor-dev option with 'selector', should return CSS for hover", () => {
    const v = {
      ...backgroundColorElementModel,
      activeBgColorOpacity: 0
    };

    const optionBackgroundWithActive = {
      ...backgroundOptionWithSelector,
      states: [NORMAL, ACTIVE]
    };

    expect(
      getCSSByState({
        v,
        breakpoint: "desktop",
        option: optionBackgroundWithActive,
        state: ACTIVE
      })
    ).toStrictEqual([
      {
        css: "background-color:rgba(255, 0, 0, 0);",
        selector: "{{WRAPPER}}.active"
      }
    ]);
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

describe("Testing addBreakpointsToCSS that add breakpoints to generated styles", () => {
  test("addBreakpointsToCSS", () => {
    expect(addBreakpointsToCSS(_undefined as BreakpointsNames, "")).toBe(
      undefined
    );
    expect(
      addBreakpointsToCSS(_null as BreakpointsNames, ".brz{color:red;}")
    ).toBe(undefined);
    expect(addBreakpointsToCSS("widescreen", "asd")).toBe(
      "@media only screen and (min-width: 1920px){asd}"
    );
    expect(addBreakpointsToCSS("desktopLarge", '.test{content:""}')).toBe(
      '@media only screen and (min-width: 1440px){.test{content:""}}'
    );
    expect(addBreakpointsToCSS("desktop", '.test{fontSize:"15px"}')).toBe(
      '.test{fontSize:"15px"}'
    );
    expect(addBreakpointsToCSS("tablet", ".ttt{}")).toBe(
      "@media only screen and (max-width: 991px) and (min-width: 768px){.ttt{}}"
    );
    expect(
      addBreakpointsToCSS("mobileLandscape", '.brz-line{height:"10px"}')
    ).toBe(
      '@media only screen and (max-width: 767px) and (min-width: 479px){.brz-line{height:"10px"}}'
    );
    expect(addBreakpointsToCSS("mobile", '.brz-richText{text:"Brizy"}')).toBe(
      '@media only screen and (max-width: 478px) {.brz-richText{text:"Brizy"}}'
    );
    expect(addBreakpointsToCSS("desktop", _undefined as string)).toBe(
      undefined
    );
    expect(addBreakpointsToCSS("tablet", _null as string)).toBe(
      "@media only screen and (max-width: 991px) and (min-width: 768px){null}"
    );
  });
});

describe("Testing addBreakpointsToFilteredCSS that add breakpoints to all styles from vd, vs, v", () => {
  test("addBreakpointsToFilteredCSS", () => {
    const defaultCSS = {
      widescreen: ["{{WRAPPER}}{height:500px}"],
      desktopLarge: [".test{width:20px}"],
      desktop: [".brz-column{max-width:20%}"],
      hover: [".brz-color-red:hover{color:red}"],
      active: [".brz-color-blue.active{color:red}"],
      tablet: ["{{WRAPPER}}{{WRAPPER}}{height:200px}"],
      mobileLandscape: ["{{WRAPPER}} .brz-map{zoom:100}"],
      mobile: [".brz-test{color:red}"]
    };

    expect(
      addBreakpointsToFilteredCSS([defaultCSS, emptyCSS, emptyCSS])
    ).toStrictEqual([
      "@media only screen and (min-width: 1920px){{{WRAPPER}}{height:500px}}@media only screen and (min-width: 1440px){.test{width:20px}}.brz-column{max-width:20%}@media only screen and (min-width: 992px){.brz-color-red:hover{color:red}}.brz-color-blue.active{color:red}@media only screen and (max-width: 991px) and (min-width: 768px){{{WRAPPER}}{{WRAPPER}}{height:200px}}@media only screen and (max-width: 767px) and (min-width: 479px){{{WRAPPER}} .brz-map{zoom:100}}@media only screen and (max-width: 478px) {.brz-test{color:red}}",
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
      ".brz-spacer{height:50px}@media only screen and (max-width: 991px) and (min-width: 768px){.brz-spacer{height:150px}}",
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
      ".brz-line{height:10px}@media only screen and (max-width: 991px) and (min-width: 768px){.brz-line{height:15px}}",
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

describe("Testing getCSSObjectFromStyle that should return CSSObject or undefined", () => {
  test("Empty data, should return undefined", () => {
    expect(
      getCSSObjectFromStyle({
        v: {},
        breakpoint: "desktop",
        option: { id: "asd", type: "slider-dev" }
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
    ).toStrictEqual({ "{{WRAPPER}}": { height: "undefinedundefined" } });
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
    ).toStrictEqual("border:0px solid rgba(0, 0, 0, 0);");
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
          { selector: "{{WRAPPER}}", css: "background-color:black;" }
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
            "background-color:black;"
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
              "background-color:black;"
            ]
          }
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      hover: ["{{WRAPPER}}{color:white;border:none;background-color:black;}"]
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
              "background-color:black;"
            ]
          }
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: ["{{WRAPPER}}{color:white;border:none;background-color:black;}"]
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

describe("Testing filterStylesByDesktop that should remove repeated CSS from hover/active css generated from vd", () => {
  test("Empty, should return the same input", () => {
    expect(filterStylesByDesktop(mockAllCssObjects)).toStrictEqual(
      mockAllCssObjects
    );
  });

  test("Same values, desktop and tablet, should return the same input", () => {
    expect(
      filterStylesByDesktop({
        ...mockAllCssObjects,
        desktop: [{ "{{WRAPPER}}": ["color:blue;"] }],
        tablet: [{ "{{WRAPPER}}": ["color:blue;"] }]
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{ "{{WRAPPER}}": ["color:blue;"] }],
      tablet: [{ "{{WRAPPER}}": ["color:blue;"] }]
    });
  });

  test("All values instead of hover/active are the same, should return the same input", () => {
    expect(
      filterStylesByDesktop({
        ...mockAllCssObjects,
        desktop: [{ "{{WRAPPER}}": ["color:blue;"] }],
        widescreen: [{ "{{WRAPPER}}": ["color:blue;"] }],
        desktopLarge: [{ "{{WRAPPER}}": ["color:blue;"] }],
        tablet: [{ "{{WRAPPER}}": ["color:blue;"] }],
        mobile: [{ "{{WRAPPER}}": ["color:blue;"] }],
        mobileLandscape: [{ "{{WRAPPER}}": ["color:blue;"] }]
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{ "{{WRAPPER}}": ["color:blue;"] }],
      widescreen: [{ "{{WRAPPER}}": ["color:blue;"] }],
      desktopLarge: [{ "{{WRAPPER}}": ["color:blue;"] }],
      tablet: [{ "{{WRAPPER}}": ["color:blue;"] }],
      mobile: [{ "{{WRAPPER}}": ["color:blue;"] }],
      mobileLandscape: [{ "{{WRAPPER}}": ["color:blue;"] }]
    });
  });

  test("Hover value like desktop, should remove hover", () => {
    expect(
      filterStylesByDesktop({
        ...mockAllCssObjects,
        desktop: [{ "{{WRAPPER}}": ["color:blue;"] }],
        hover: [{ "{{WRAPPER}}": ["color:blue;"] }]
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{ "{{WRAPPER}}": ["color:blue;"] }],
      hover: [{ "{{WRAPPER}}": [] }]
    });
  });

  test("Active value like desktop, should remove active", () => {
    expect(
      filterStylesByDesktop({
        ...mockAllCssObjects,
        desktop: [{ "{{WRAPPER}}": ["color:blue;"] }],
        active: [{ "{{WRAPPER}}": ["color:blue;"] }]
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{ "{{WRAPPER}}": ["color:blue;"] }],
      active: [{ "{{WRAPPER}}": [] }]
    });
  });

  test("Hover and active values like desktop, should remove hover and active", () => {
    expect(
      filterStylesByDesktop({
        ...mockAllCssObjects,
        desktop: [{ "{{WRAPPER}}": ["height:10px;"] }],
        hover: [{ "{{WRAPPER}}": ["height:10px;"] }],
        active: [{ "{{WRAPPER}}": ["height:10px;"] }]
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [{ "{{WRAPPER}}": ["height:10px;"] }],
      hover: [{ "{{WRAPPER}}": [] }],
      active: [{ "{{WRAPPER}}": [] }]
    });
  });

  test("More hover styles, hover should be empty array", () => {
    expect(
      filterStylesByDesktop({
        ...mockAllCssObjects,
        desktop: [
          { "{{WRAPPER}}": ["height:10px;", "width:10px;", "font-size: 15px;"] }
        ],
        hover: [
          { "{{WRAPPER}}": ["height:10px;", "width:10px;", "font-size: 15px;"] }
        ]
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [
        { "{{WRAPPER}}": ["height:10px;", "width:10px;", "font-size: 15px;"] }
      ],
      hover: [{ "{{WRAPPER}}": [] }]
    });
  });

  test("More active styles, hover should be empty array", () => {
    expect(
      filterStylesByDesktop({
        ...mockAllCssObjects,
        desktop: [
          {
            "{{WRAPPER}}": [
              "height:20px;",
              "width:30px;",
              "font-size: 15px;",
              "line-height: 5px;",
              "color:red;"
            ]
          }
        ],
        active: [
          {
            "{{WRAPPER}}": [
              "height:20px;",
              "width:30px;",
              "font-size: 15px;",
              "line-height: 5px;",
              "color:red;"
            ]
          }
        ]
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [
        {
          "{{WRAPPER}}": [
            "height:20px;",
            "width:30px;",
            "font-size: 15px;",
            "line-height: 5px;",
            "color:red;"
          ]
        }
      ],
      active: [{ "{{WRAPPER}}": [] }]
    });
  });

  test("More hover and active styles, hover and active should be empty array", () => {
    const data = [
      {
        "{{WRAPPER}}": [
          "height:20px;",
          "width:30px;",
          "font-size: 15px;",
          "line-height: 5px;",
          "color:red;"
        ]
      }
    ];
    expect(
      filterStylesByDesktop({
        ...mockAllCssObjects,
        desktop: data,
        active: data,
        hover: data
      })
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: data,
      active: [{ "{{WRAPPER}}": [] }],
      hover: [{ "{{WRAPPER}}": [] }]
    });
  });
});

describe("Testing filterBySelector function that should remove repeated CSS between 2 allCSS objects", () => {
  test("Empty", () => {
    expect(
      filterBySelector(mockAllCssObjects, mockAllCssObjects)
    ).toStrictEqual(mockAllCssObjects);
  });

  test("Filter beetween desktop and tablet, should remain unique CSS", () => {
    expect(
      filterBySelector(
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["color:red;"] },
            { "{{WRAPPER}} .list": ["color:blue;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          tablet: [
            { "{{WRAPPER}}": ["color:red;"] },
            { "{{WRAPPER}} .list": ["color:blue;"] }
          ]
        }
      )
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [
        { "{{WRAPPER}}": ["color:red;"] },
        { "{{WRAPPER}} .list": ["color:blue;"] }
      ]
    });
  });

  test("Filter beetween desktop and tablet 2, should remain unique CSS", () => {
    expect(
      filterBySelector(
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["color:red;"] },
            { "{{WRAPPER}} .list": ["color:blue;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          tablet: [
            { "{{WRAPPER}}": ["color:red;"] },
            { "{{WRAPPER}} .list": ["color:yellow;"] }
          ]
        }
      )
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [
        { "{{WRAPPER}}": ["color:red;"] },
        { "{{WRAPPER}} .list": ["color:blue;"] }
      ]
    });
  });

  test("Filter beetween desktop and tablet 3, should remain unique CSS", () => {
    expect(
      filterBySelector(
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["color:red;"] },
            { "{{WRAPPER}} .list": ["color:blue;", "color:yellow;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          tablet: [
            { "{{WRAPPER}}": ["color:red;"] },
            { "{{WRAPPER}} .list": ["color:yellow;"] }
          ]
        }
      )
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [
        { "{{WRAPPER}}": ["color:red;"] },
        { "{{WRAPPER}} .list": ["color:blue;", "color:yellow;"] }
      ]
    });
  });

  test("All from compared are unique, should remain all", () => {
    expect(
      filterBySelector(
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["height:10px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["color:white;"] },
            { "{{WRAPPER}} .list": ["line-height:1;"] }
          ]
        }
      )
    ).toStrictEqual({
      ...mockAllCssObjects,
      desktop: [
        { "{{WRAPPER}}": ["height:10px;"] },
        { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
      ]
    });
  });
});

describe("Testing filterByGroupAndSelector that should filter allCSS from cssObjects and all styles by selector", () => {
  test("Empty", () => {
    expect(
      filterByGroupAndSelector(
        mockAllCssObjects,
        mockAllCssObjects,
        mockAllCssObjects
      )
    ).toStrictEqual([emptyCSS, emptyCSS, emptyCSS]);
  });

  test("Same values as in vd styles", () => {
    expect(
      filterByGroupAndSelector(
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["height:10px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["height:10px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["height:10px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
          ]
        }
      )
    ).toStrictEqual([
      {
        ...emptyCSS,
        desktop: [
          "{{WRAPPER}}{height:10px;}",
          "{{WRAPPER}} .list{width:100%;height:100%;}"
        ]
      },
      emptyCSS,
      emptyCSS
    ]);
  });

  test("Different values, should remain unique CSS", () => {
    expect(
      filterByGroupAndSelector(
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["height:10px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["height:20px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:50%;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["height:30px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
          ]
        }
      )
    ).toStrictEqual([
      {
        ...emptyCSS,
        desktop: [
          "{{WRAPPER}}{height:10px;}",
          "{{WRAPPER}} .list{width:100%;height:100%;}"
        ]
      },
      {
        ...emptyCSS,
        desktop: ["{{WRAPPER}}{height:20px;}", "{{WRAPPER}} .list{height:50%;}"]
      },
      {
        ...emptyCSS,
        desktop: ["{{WRAPPER}}{height:30px;}"]
      }
    ]);
  });

  test("Same values in different breakpoints", () => {
    expect(
      filterByGroupAndSelector(
        {
          ...mockAllCssObjects,
          desktop: [
            { "{{WRAPPER}}": ["height:10px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          tablet: [
            { "{{WRAPPER}}": ["height:10px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
          ]
        },
        {
          ...mockAllCssObjects,
          mobile: [
            { "{{WRAPPER}}": ["height:10px;"] },
            { "{{WRAPPER}} .list": ["width:100%;", "height:100%;"] }
          ]
        }
      )
    ).toStrictEqual([
      {
        ...emptyCSS,
        desktop: [
          "{{WRAPPER}}{height:10px;}",
          "{{WRAPPER}} .list{width:100%;height:100%;}"
        ]
      },
      {
        ...emptyCSS,
        tablet: [
          "{{WRAPPER}}{height:10px;}",
          "{{WRAPPER}} .list{width:100%;height:100%;}"
        ]
      },
      {
        ...emptyCSS,
        mobile: [
          "{{WRAPPER}}{height:10px;}",
          "{{WRAPPER}} .list{width:100%;height:100%;}"
        ]
      }
    ]);
  });
});

describe("Testing filterCSSObjectBetweenCSSObjects", () => {
  test("Empty data", () => {
    expect(filterCSSObjectBetweenCSSObjects([], {})).toStrictEqual(undefined);
  });

  test("Empty compared value", () => {
    expect(
      filterCSSObjectBetweenCSSObjects([], { "{{WRAPPER}}": ["color: red;"] })
    ).toStrictEqual(undefined);
  });

  test("Empty cssObject", () => {
    expect(
      filterCSSObjectBetweenCSSObjects([{ "{{WRAPPER}}": ["color:red;"] }], {})
    ).toStrictEqual(undefined);
  });

  test("Testing with same item, should return empty array", () => {
    expect(
      filterCSSObjectBetweenCSSObjects([{ WRAPPER: ["color:blue;"] }], {
        WRAPPER: ["color:blue;"]
      })
    ).toStrictEqual({ WRAPPER: [] });
  });

  test("Testing with 2 same items, should return empty array", () => {
    expect(
      filterCSSObjectBetweenCSSObjects(
        [{ WRAPPER: ["color:blue;", "color:blue;"] }],
        {
          WRAPPER: ["color:blue;"]
        }
      )
    ).toStrictEqual({ WRAPPER: [] });
  });

  test("Testing with different styles, should remain unique style", () => {
    expect(
      filterCSSObjectBetweenCSSObjects(
        [{ WRAPPER: ["font-size:15px;", "line-height:20px"] }],
        {
          WRAPPER: ["color:green;"]
        }
      )
    ).toStrictEqual({ WRAPPER: ["color:green;"] });
  });

  test("More objects in compared + more styles in to compare object", () => {
    expect(
      filterCSSObjectBetweenCSSObjects(
        [
          { "{{WRAPPER}}": ["font-size:15px;", "line-height:20px"] },
          {
            "{{WRAPPER}} .brz-test": [
              "background-color:red;",
              "color:white;",
              "filter: grayscale(100);"
            ]
          }
        ],
        {
          "{{WRAPPER}} .brz-test": ["color:green;", "background-color:red;"]
        }
      )
    ).toStrictEqual({ "{{WRAPPER}} .brz-test": ["color:green;"] });
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
});
