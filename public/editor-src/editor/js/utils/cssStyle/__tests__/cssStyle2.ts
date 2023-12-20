import { ElementModel } from "visual/component/Elements/Types";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import {
  filterStyles,
  filterStylesByDevice,
  generateCSSByStyleSelectors,
  getCSSObjects,
  getStylesCSS
} from "../cssStyle2";
import {
  backgroundColorElementModel,
  backgroundOptionWithSelector,
  borderElementModel,
  borderOptionWithSelector,
  emptyCSS,
  fontSizeOptionWithStyle,
  generatedCSSSameStyles,
  generatedCSSSameStylesDoubledData,
  heightOptionWithStyle,
  widthOptionWithStyle
} from "./utils";

const stylesWithColorOnWrapper = {
  ".brz &&": {
    standart: ["cssStyleColor"]
  }
};

describe("Testing getCSSObjects that traverse all options and return CSS generated from 'style' and 'selector'", () => {
  test("Empty values, should return empty object", () => {
    expect(getCSSObjects({}, [])).toStrictEqual({});

    expect(
      getCSSObjects({}, [heightOptionWithStyle, borderOptionWithSelector])
    ).toStrictEqual({});

    expect(getCSSObjects({ height: 100 }, [])).toStrictEqual({});
  });

  test("2 Options with same selector", () => {
    const output = {
      "{{WRAPPER}}": [
        "border:5px solid rgba(115, 119, 127, 1);",
        "background-color:rgba(255, 0, 0, 1);"
      ]
    };
    expect(
      getCSSObjects({ ...backgroundColorElementModel, ...borderElementModel }, [
        { ...borderOptionWithSelector, selector: "{{WRAPPER}}" },
        backgroundOptionWithSelector
      ])
    ).toStrictEqual({
      desktop: [output],
      desktopLarge: [output],
      mobile: [output],
      mobileLandscape: [output],
      tablet: [output],
      widescreen: [output]
    });
  });

  test("2 Options with same selector + hover", () => {
    const output = {
      "{{WRAPPER}}": [
        "border:5px solid rgba(115, 119, 127, 1);",
        "background-color:rgba(255, 0, 0, 1);"
      ]
    };
    expect(
      getCSSObjects(
        {
          ...backgroundColorElementModel,
          ...borderElementModel,
          hoverBorderColorHex: "#ff0000",
          hoverBgColorHex: "#ff0000"
        },
        [
          {
            ...borderOptionWithSelector,
            selector: "{{WRAPPER}}",
            states: [NORMAL, HOVER]
          },
          { ...backgroundOptionWithSelector, states: [NORMAL, HOVER] }
        ]
      )
    ).toStrictEqual({
      desktop: [output],
      desktopLarge: [output],
      hover: [
        {
          "{{WRAPPER}}:hover": [
            "border:5px solid rgba(255, 0, 0, 1);",
            "background-color:rgba(255, 0, 0, 1);"
          ]
        }
      ],
      mobile: [output],
      mobileLandscape: [output],
      tablet: [output],
      widescreen: [output]
    });
  });

  test("2 options, different selector", () => {
    const output = [
      {
        "{{WRAPPER}} .list .list-item": [
          "border:5px solid rgba(115, 119, 127, 1);"
        ]
      },
      { "{{WRAPPER}}": ["background-color:rgba(255, 0, 0, 1);"] }
    ];
    expect(
      getCSSObjects({ ...backgroundColorElementModel, ...borderElementModel }, [
        borderOptionWithSelector,
        backgroundOptionWithSelector
      ])
    ).toStrictEqual({
      desktop: output,
      desktopLarge: output,
      mobile: output,
      mobileLandscape: output,
      tablet: output,
      widescreen: output
    });
  });

  test("Option with 'style'", () => {
    const output = [{ "{{WRAPPER}}": ["height:30px;"] }];

    expect(
      getCSSObjects({ height: 30, heightSuffix: "px" }, [heightOptionWithStyle])
    ).toStrictEqual({
      desktop: output,
      desktopLarge: output,
      mobile: output,
      mobileLandscape: output,
      tablet: output,
      widescreen: output
    });
  });

  test("2 options with 'style' with same selector", () => {
    const output = [{ "{{WRAPPER}}": ["height:30px;", "width:50px;"] }];

    expect(
      getCSSObjects(
        { height: 30, heightSuffix: "px", width: 50, widthSuffix: "px" },
        [heightOptionWithStyle, widthOptionWithStyle]
      )
    ).toStrictEqual({
      desktop: output,
      desktopLarge: output,
      mobile: output,
      mobileLandscape: output,
      tablet: output,
      widescreen: output
    });
  });

  test("2 options with 'style' with different selector", () => {
    const output = [
      { "{{WRAPPER}}": ["height:30px;"] },
      { "{{WRAPPER}} .brz-map": ["width:50px;"] }
    ];

    expect(
      getCSSObjects(
        { height: 30, heightSuffix: "px", width: 50, widthSuffix: "px" },
        [
          heightOptionWithStyle,
          {
            ...widthOptionWithStyle,
            style: (data: ElementModel) => ({
              "{{WRAPPER}} .brz-map": {
                width: `${data.value}${data.unit}`
              }
            })
          }
        ]
      )
    ).toStrictEqual({
      desktop: output,
      desktopLarge: output,
      mobile: output,
      mobileLandscape: output,
      tablet: output,
      widescreen: output
    });
  });

  test("If exists style and selector on same option, should remain css from 'styles'", () => {
    const output = [{ "{{WRAPPER}}": ["height:50px;"] }];

    expect(
      getCSSObjects({ height: 50, heightSuffix: "px", asd: 1 }, [
        { ...heightOptionWithStyle, selector: "{{WRAPPER}} .brz-test" }
      ])
    ).toStrictEqual({
      desktop: output,
      desktopLarge: output,
      mobile: output,
      mobileLandscape: output,
      tablet: output,
      widescreen: output
    });
  });

  test("3 Options, all with default values + hover + active on same selector", () => {
    const output = [
      { "{{WRAPPER}}": ["height:30px;", "width:40px;", "font-size:50px;"] }
    ];

    expect(
      getCSSObjects(
        {
          height: 30,
          hoverHeight: 40,
          activeHeight: 50,
          heightSuffix: "px",
          width: 40,
          hoverWidth: 50,
          activeWidth: 60,
          widthSuffix: "px",
          fontSize: 50,
          hoverFontSize: 60,
          activeFontSize: 70,
          fontSizeSuffix: "px"
        },
        [
          {
            ...heightOptionWithStyle,
            states: [NORMAL, HOVER, ACTIVE]
          },
          { ...widthOptionWithStyle, states: [NORMAL, HOVER, ACTIVE] },
          { ...fontSizeOptionWithStyle, states: [NORMAL, HOVER, ACTIVE] }
        ]
      )
    ).toStrictEqual({
      active: [
        {
          "{{WRAPPER}}.active": [
            "height:50px;",
            "width:60px;",
            "font-size:70px;"
          ]
        }
      ],
      hover: [
        {
          "{{WRAPPER}}:hover": [
            "height:40px;",
            "width:50px;",
            "font-size:60px;"
          ]
        }
      ],
      desktop: output,
      desktopLarge: output,
      mobile: output,
      mobileLandscape: output,
      tablet: output,
      widescreen: output
    });
  });

  test("3 Options, all with default values + hover + active on different selector", () => {
    const output = [
      { "{{WRAPPER}} .brz-h1": ["height:100px;"] },
      { "{{WRAPPER}} .brz-h2": ["width:450px;"] },
      { "{{WRAPPER}} .brz-h3": ["font-size:230px;"] }
    ];

    expect(
      getCSSObjects(
        {
          height: 100,
          hoverHeight: 40,
          activeHeight: 70,
          heightSuffix: "px",
          width: 450,
          hoverWidth: 70,
          activeWidth: 90,
          widthSuffix: "px",
          fontSize: 230,
          hoverFontSize: 980,
          activeFontSize: 50,
          fontSizeSuffix: "px"
        },
        [
          {
            ...heightOptionWithStyle,
            style: (data: ElementModel) => ({
              "{{WRAPPER}} .brz-h1": {
                height: `${data.value}${data.unit}`
              }
            }),
            states: [NORMAL, HOVER, ACTIVE]
          },
          {
            ...widthOptionWithStyle,
            style: (data: ElementModel) => ({
              "{{WRAPPER}} .brz-h2": {
                width: `${data.value}${data.unit}`
              }
            }),
            states: [NORMAL, HOVER, ACTIVE]
          },
          {
            ...fontSizeOptionWithStyle,
            style: (data: ElementModel) => ({
              "{{WRAPPER}} .brz-h3": {
                "font-size": `${data.value}${data.unit}`
              }
            }),
            states: [NORMAL, HOVER, ACTIVE]
          }
        ]
      )
    ).toStrictEqual({
      active: [
        { "{{WRAPPER}} .brz-h1.active": ["height:70px;"] },
        { "{{WRAPPER}} .brz-h2.active": ["width:90px;"] },
        { "{{WRAPPER}} .brz-h3.active": ["font-size:50px;"] }
      ],
      hover: [
        { "{{WRAPPER}} .brz-h1:hover": ["height:40px;"] },
        { "{{WRAPPER}} .brz-h2:hover": ["width:70px;"] },
        { "{{WRAPPER}} .brz-h3:hover": ["font-size:980px;"] }
      ],
      desktop: output,
      desktopLarge: output,
      mobile: output,
      mobileLandscape: output,
      tablet: output,
      widescreen: output
    });
  });

  test("With more selectors on options", () => {
    const output = [
      {
        "{{WRAPPER}} .brz-container": [
          "border:5px solid rgba(115, 119, 127, 1);"
        ]
      },
      {
        " {{WRAPPER}}.brz-spacer": ["border:5px solid rgba(115, 119, 127, 1);"]
      },
      {
        " {{WRAPPER}} .brz-line": ["border:5px solid rgba(115, 119, 127, 1);"]
      },
      { ".brz {{WRAPPER}}": ["background-color:rgba(255, 0, 0, 1);"] },
      { ".brz-alert": ["background-color:rgba(255, 0, 0, 1);"] },
      { " #brz-root": ["background-color:rgba(255, 0, 0, 1);"] }
    ];

    expect(
      getCSSObjects({ ...borderElementModel, ...backgroundColorElementModel }, [
        {
          ...borderOptionWithSelector,
          selector:
            "{{WRAPPER}} .brz-container, {{WRAPPER}}.brz-spacer, {{WRAPPER}} .brz-line"
        },
        {
          ...backgroundOptionWithSelector,
          selector: ".brz {{WRAPPER}},.brz-alert, #brz-root"
        }
      ])
    ).toStrictEqual({
      desktop: output,
      desktopLarge: output,
      mobile: output,
      mobileLandscape: output,
      tablet: output,
      widescreen: output
    });
  });
});

describe("Testing filterStyles that should remove duplicate styles", () => {
  test("Mock data, should return all empty", () => {
    expect(filterStyles([emptyCSS, emptyCSS, emptyCSS])).toStrictEqual([
      emptyCSS,
      emptyCSS,
      emptyCSS
    ]);
  });

  test("Same styles, should remain only from vd", () => {
    expect(
      filterStyles([
        generatedCSSSameStyles,
        generatedCSSSameStyles,
        generatedCSSSameStyles
      ])
    ).toStrictEqual([
      {
        ...emptyCSS,
        desktop: ["{{WRAPPER}}{height:50px}"]
      },
      emptyCSS,
      emptyCSS
    ]);
  });

  test("New style in rules, should preserve", () => {
    expect(
      filterStyles([
        generatedCSSSameStyles,
        {
          ...generatedCSSSameStyles,
          desktop: [".brz-test{color:red}"]
        },
        generatedCSSSameStyles
      ])
    ).toStrictEqual([
      {
        ...emptyCSS,
        desktop: ["{{WRAPPER}}{height:50px}"]
      },
      {
        ...emptyCSS,
        desktop: [".brz-test{color:red}"]
      },
      emptyCSS
    ]);
  });

  test("New style in custom, should preserve", () => {
    expect(
      filterStyles([
        generatedCSSSameStyles,
        {
          ...generatedCSSSameStyles,
          desktop: [".brz-test{color:red}"]
        },
        {
          ...generatedCSSSameStyles,
          tablet: [".brz-spacer{height:50px"]
        }
      ])
    ).toStrictEqual([
      {
        ...emptyCSS,
        desktop: ["{{WRAPPER}}{height:50px}"]
      },
      {
        ...emptyCSS,
        desktop: [".brz-test{color:red}"]
      },
      {
        ...emptyCSS,
        tablet: [".brz-spacer{height:50px"]
      }
    ]);
  });

  test("Hover test, should preserve only unique", () => {
    expect(
      filterStyles([
        generatedCSSSameStyles,
        {
          ...generatedCSSSameStyles,
          hover: [".brz-a:hover{color:red}", ".brz-b:hover{color:green}"]
        },
        {
          ...generatedCSSSameStyles,
          hover: [".brz-a:hover{color:red}"]
        }
      ])
    ).toStrictEqual([
      {
        ...emptyCSS,
        desktop: ["{{WRAPPER}}{height:50px}"]
      },
      {
        ...emptyCSS,
        hover: [".brz-a:hover{color:red}", ".brz-b:hover{color:green}"]
      },
      {
        ...emptyCSS,
        hover: []
      }
    ]);
  });

  test("Active test, should preserve only unique", () => {
    expect(
      filterStyles([
        generatedCSSSameStyles,
        {
          ...generatedCSSSameStyles,
          active: [".brz-a.active{color:blue}", ".brz-b.active{color:yellor}"]
        },
        {
          ...generatedCSSSameStyles,
          active: [".brz-a.active{color:blue}"]
        }
      ])
    ).toStrictEqual([
      {
        ...emptyCSS,
        desktop: ["{{WRAPPER}}{height:50px}"]
      },
      {
        ...emptyCSS,
        active: [".brz-a.active{color:blue}", ".brz-b.active{color:yellor}"]
      },
      {
        ...emptyCSS,
        active: []
      }
    ]);
  });
});

describe("Testing filterStylesByDesktop that filter styles between devices", () => {
  test("Mock data, should return all empty", () => {
    expect(filterStylesByDevice(emptyCSS)).toStrictEqual(emptyCSS);
  });

  test("Filtering all the same data, should remaing only desktop", () => {
    expect(filterStylesByDevice(generatedCSSSameStyles)).toStrictEqual({
      ...emptyCSS,
      desktop: ["{{WRAPPER}}{height:50px}"]
    });
  });

  test("Filtering with 2 or more styles in, should remaing only desktop", () => {
    expect(
      filterStylesByDevice(generatedCSSSameStylesDoubledData)
    ).toStrictEqual({
      ...emptyCSS,
      desktop: ["{{WRAPPER}}{height:50px}"]
    });
  });

  test("Filtering where tablet has different styles, should remaing desktop and tablet", () => {
    expect(
      filterStylesByDevice({
        ...generatedCSSSameStyles,
        tablet: [".brz-spacer{height:50px}"]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: ["{{WRAPPER}}{height:50px}"],
      tablet: [".brz-spacer{height:50px}"]
    });
  });

  test("Filtering where all styles is different, should remaing all", () => {
    expect(
      filterStylesByDevice({
        widescreen: ["{{WRAPPER}}{height:50px}"],
        desktopLarge: ["{{WRAPPER}}{height:51px}"],
        desktop: ["{{WRAPPER}}{color:red}"],
        tablet: ["{{WRAPPER}} .list{width:50px}"],
        mobileLandscape: ["{{WRAPPER}}{{WRAPPER}}{background-size:cover}"],
        mobile: ["{{WRAPPER}}{border:none}"],
        hover: ["{{WRAPPER}}:hover{background-color:white; color:black}"],
        active: ["{{WRAPPER}}.active{border:1px solid red}"]
      })
    ).toStrictEqual({
      active: ["{{WRAPPER}}{{WRAPPER}}.active{border:1px solid red}"],
      desktop: ["{{WRAPPER}}{color:red}"],
      desktopLarge: ["{{WRAPPER}}{{WRAPPER}}{height:51px}"],
      hover: ["{{WRAPPER}}:hover{background-color:white; color:black}"],
      mobile: ["{{WRAPPER}}{{WRAPPER}}{border:none}"],
      mobileLandscape: [
        "{{WRAPPER}}{{WRAPPER}}{{WRAPPER}}{background-size:cover}"
      ],
      tablet: ["{{WRAPPER}}{{WRAPPER}} .list{width:50px}"],
      widescreen: ["{{WRAPPER}}{{WRAPPER}}{height:50px}"]
    });
  });
});

describe("Testing generateCSSByStyleSelectors that should return CSS writed in 'styles.ts' file", () => {
  test("Test with 1 function, should return css from this function", () => {
    const data = {
      colorHex: "#FF0000"
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor"]
      }
    };

    expect(
      generateCSSByStyleSelectors({ v: data, vs: data, vd: data, styles })
    ).toStrictEqual([".brz &&{color:rgba(255, 0, 0, 1);}", "", ""]);
  });

  test("Test with interval, should return css from function from interval", () => {
    const data = {
      hoverTransition: 50,
      hoverTransitionSuffix: ""
    };

    const styles = {
      ".brz &&": {
        interval: ["cssStyleHoverTransition"]
      }
    };

    expect(
      generateCSSByStyleSelectors({ v: data, vs: data, vd: data, styles })
    ).toStrictEqual([".brz &&{transition-duration:0.50s;}", "", ""]);
  });

  test("Test with more selector, should return css from each selector", () => {
    const data = {
      colorHex: "#FF0001",
      width: 70,
      widthSuffix: "%"
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor"]
      },
      ".brz && .brz-spacer": {
        standart: ["cssStyleSizeWidth"]
      }
    };

    expect(
      generateCSSByStyleSelectors({ v: data, vs: data, vd: data, styles })
    ).toStrictEqual([
      ".brz &&{color:rgba(255, 0, 1, 1);}.brz && .brz-spacer{width:70%;}",
      "",
      ""
    ]);
  });

  test("Test with more functions in 1 selector, should return css from each selector", () => {
    const data = {
      colorHex: "#FF0002",
      height: 70,
      heightSuffix: "%"
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor", "cssStyleSizeHeight"]
      }
    };

    expect(
      generateCSSByStyleSelectors({ v: data, vs: data, vd: data, styles })
    ).toStrictEqual([".brz &&{color:rgba(255, 0, 2, 1);height:70%;}", "", ""]);
  });

  test("Test with more functions on more selectors, should return css from each selector", () => {
    const data = {
      colorHex: "#FF0002",
      height: 70,
      heightSuffix: "%",
      fontSize: 16
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor", "cssStyleSizeHeightPxOnly"]
      },
      ".brz && .brz-line": {
        standart: ["cssStyleTypographyFontSize", "cssStyleSizeHeight"]
      }
    };

    expect(
      generateCSSByStyleSelectors({ v: data, vs: data, vd: data, styles })
    ).toStrictEqual([
      ".brz &&{color:rgba(255, 0, 2, 1);height: unset;}.brz && .brz-line{font-size:16px;height:70%;}",
      "",
      ""
    ]);
  });

  test("Test mode, delimited by '|||', should return css from each selector", () => {
    const data = {
      colorHex: "#FF0003",
      height: 70,
      heightSuffix: "%",
      fontSize: 16
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor|||editor"]
      }
    };

    expect(
      generateCSSByStyleSelectors({ v: data, vs: data, vd: data, styles })
    ).toStrictEqual([".brz &&{color:rgba(255, 0, 3, 1);}", "", ""]);
  });

  test("Test with rules and custom as same styles, should return unique css", () => {
    const vd = {
      colorHex: "#FF0003"
    };

    const vs = {
      colorHex: "#FF0003"
    };

    const v = {
      colorHex: "#FF0003"
    };

    expect(
      generateCSSByStyleSelectors({
        v,
        vs,
        vd,
        styles: stylesWithColorOnWrapper
      })
    ).toStrictEqual([".brz &&{color:rgba(255, 0, 3, 1);}", "", ""]);
  });

  test("Test with rules and custom as different styles, should return different css", () => {
    const vd = {
      colorHex: "#FF0003"
    };

    const vs = {
      colorHex: "#FF0004"
    };

    const v = {
      colorHex: "#FF0005"
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor"]
      }
    };

    expect(generateCSSByStyleSelectors({ v, vs, vd, styles })).toStrictEqual([
      ".brz &&{color:rgba(255, 0, 3, 1);}",
      ".brz &&{color:rgba(255, 0, 4, 1);}",
      ".brz &&{color:rgba(255, 0, 5, 1);}"
    ]);
  });

  test("Test filtering with more styles and selectors, should return unique css", () => {
    const vd = {
      colorHex: "#FF0003",
      fontSize: 16,
      height: 50,
      heightSuffix: "%",
      hoverTransition: 50,
      hoverTransitionSuffix: ""
    };

    const vs = {
      colorHex: "#FF0003",
      fontSize: 17
    };

    const v = {
      colorHex: "#FF0005",
      fontSize: 16,
      hoverTransition: 60
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor", "cssStyleTypographyFontSize"]
      },
      ".brz && .brz-spacer": {
        standart: ["cssStyleSizeHeight"],
        interval: ["cssStyleHoverTransition"]
      }
    };

    expect(generateCSSByStyleSelectors({ v, vs, vd, styles })).toStrictEqual([
      ".brz &&{color:rgba(255, 0, 3, 1);font-size:16px;}.brz && .brz-spacer{height:50%;transition-duration:0.50s;}",
      ".brz &&{color:rgba(255, 0, 3, 1);font-size:17px;}",
      ".brz &&{color:rgba(255, 0, 5, 1);font-size:16px;}.brz && .brz-spacer{transition-duration:0.60s;}"
    ]);
  });
});

describe("Testing getStylesCSS that should return an object where key is device and value is his css", () => {
  test("Test with 1 function and 1 selector", () => {
    const v = {
      colorHex: "#FFFFFF"
    };

    expect(getStylesCSS({ v, styles: stylesWithColorOnWrapper })).toStrictEqual(
      {
        desktop: [{ ".brz &&": ["color:rgba(255, 255, 255, 1);"] }],
        mobile: [{ ".brz &&": ["color:rgba(255, 255, 255, 1);"] }],
        tablet: [{ ".brz &&": ["color:rgba(255, 255, 255, 1);"] }]
      }
    );
  });

  test("Test with 1 selector and 2 function", () => {
    const v = {
      colorHex: "#FFFFFF",
      hoverTransition: 50
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor"],
        interval: ["cssStyleHoverTransition"]
      }
    };

    expect(getStylesCSS({ v, styles })).toStrictEqual({
      desktop: [
        {
          ".brz &&": ["color:rgba(255, 255, 255, 1);transition-duration:0.50s;"]
        }
      ],
      mobile: [
        {
          ".brz &&": ["color:rgba(255, 255, 255, 1);transition-duration:0.50s;"]
        }
      ],
      tablet: [
        {
          ".brz &&": ["color:rgba(255, 255, 255, 1);transition-duration:0.50s;"]
        }
      ]
    });
  });

  test("Test with 2 selector each with 1 function", () => {
    const v = {
      colorHex: "#FFFFFF",
      hoverTransition: 50
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor"]
      },
      ".brz && .brz-richtext": {
        interval: ["cssStyleHoverTransition"]
      }
    };

    expect(getStylesCSS({ v, styles })).toStrictEqual({
      desktop: [
        { ".brz &&": ["color:rgba(255, 255, 255, 1);"] },
        { ".brz && .brz-richtext": ["transition-duration:0.50s;"] }
      ],
      mobile: [
        { ".brz &&": ["color:rgba(255, 255, 255, 1);"] },
        { ".brz && .brz-richtext": ["transition-duration:0.50s;"] }
      ],
      tablet: [
        { ".brz &&": ["color:rgba(255, 255, 255, 1);"] },
        { ".brz && .brz-richtext": ["transition-duration:0.50s;"] }
      ]
    });
  });

  test("Test with 2 selector each with 2 function", () => {
    const v = {
      colorHex: "#FF0003",
      fontSize: 15,
      height: 100,
      heightSuffix: "px",
      hoverTransition: 100
    };

    const styles = {
      ".brz &&": {
        standart: ["cssStyleColor", "cssStyleSizeHeightPxOnly"]
      },
      ".brz && .brz-richtext": {
        standart: ["cssStyleTypographyFontSize", "cssStyleSizeHeight"]
      }
    };

    expect(getStylesCSS({ v, styles })).toStrictEqual({
      desktop: [
        { ".brz &&": ["color:rgba(255, 0, 3, 1);height:100px;"] },
        { ".brz && .brz-richtext": ["font-size:15px;height:100px;"] }
      ],
      mobile: [
        { ".brz &&": ["color:rgba(255, 0, 3, 1);height:100px;"] },
        { ".brz && .brz-richtext": ["font-size:15px;height:100px;"] }
      ],
      tablet: [
        { ".brz &&": ["color:rgba(255, 0, 3, 1);height:100px;"] },
        { ".brz && .brz-richtext": ["font-size:15px;height:100px;"] }
      ]
    });
  });

  test("Test with ':hover' but key missing in 'v', should return with hover styles", () => {
    const v = {
      colorHex: "#FF0003"
    };

    const styles = {
      ".brz &&:hover": {
        standart: ["cssStyleColor"]
      }
    };

    expect(getStylesCSS({ v, styles })).toStrictEqual({
      desktop: [{ ".brz &&": ["color:rgba(255, 0, 3, 1);"] }],
      hover: [{ ".brz &&:hover": [""] }],
      mobile: [{ ".brz &&": ["color:rgba(255, 0, 3, 1);"] }],
      tablet: [{ ".brz &&": ["color:rgba(255, 0, 3, 1);"] }]
    });
  });

  test("Test with ':hover', should return normal and hover styles", () => {
    const v = {
      colorHex: "#FF0005",
      hoverColorHex: "#FF0000"
    };

    const styles = {
      ".brz &&:hover": {
        standart: ["cssStyleColor"]
      }
    };

    expect(getStylesCSS({ v, styles })).toStrictEqual({
      desktop: [{ ".brz &&": ["color:rgba(255, 0, 5, 1);"] }],
      hover: [{ ".brz &&:hover": ["color:rgba(255, 0, 0, 1);"] }],
      mobile: [{ ".brz &&": ["color:rgba(255, 0, 5, 1);"] }],
      tablet: [{ ".brz &&": ["color:rgba(255, 0, 5, 1);"] }]
    });
  });
});
