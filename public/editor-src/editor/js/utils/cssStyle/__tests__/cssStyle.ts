import { ModelType } from "visual/component/Elements/Types";
import { RenderType } from "visual/providers/RenderProvider";
import { createStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import {
  filterMergedStylesByDevice,
  filterStylesByDevice,
  getCSSObjects
} from "../index";
import { CSS, GeneratedCSS, Option } from "../types";

export const heightOptionWithStyle: Option<"slider"> = {
  id: "height",
  type: "slider",
  style: (data) => ({
    "{{WRAPPER}}": {
      height: `${data.value.value}${data.value.unit}`
    }
  })
};

export const borderOptionWithSelector = {
  id: "border",
  label: t("Border"),
  type: "border" as const,
  selector: "{{WRAPPER}} .list .list-item"
};

export const backgroundOptionWithSelector = {
  id: "",
  label: t("Background"),
  type: "backgroundColor" as const,
  selector: "{{WRAPPER}}"
};

export const widthOptionWithStyle: Option<"slider"> = {
  id: "width",
  type: "slider",
  style: (data) => ({
    "{{WRAPPER}}": {
      width: `${data.value.value}${data.value.unit}`
    }
  })
};

export const fontSizeOptionWithStyle: Option<"slider"> = {
  id: "fontSize",
  type: "slider",
  style: (data) => ({
    "{{WRAPPER}}": {
      "font-size": `${data.value.value}${data.value.unit}`
    }
  })
};

export const generatedCSSSameStyles: GeneratedCSS<string> = {
  desktop: ["{{WRAPPER}}{height:50px}"],
  tablet: ["{{WRAPPER}}{height:50px}"],
  mobile: ["{{WRAPPER}}{height:50px}"],
  hover: ["{{WRAPPER}}{height:50px}"],
  active: ["{{WRAPPER}}{height:50px}"]
};

export const generatedCSSSameStylesDoubledData: GeneratedCSS<string> = {
  desktop: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  tablet: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  mobile: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  hover: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"],
  active: ["{{WRAPPER}}{height:50px}", "{{WRAPPER}}{height:50px}"]
};

export const emptyCSS = {
  desktop: [],
  tablet: [],
  mobile: [],
  hover: [],
  active: []
};

export const mockAllCssObjects = {
  desktop: [{}],
  tablet: [{}],
  mobile: [{}],
  hover: [{}],
  active: [{}]
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

export const borderElementModel = {
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

export const heightElementModel = {
  height: 20,
  heightSuffix: "px"
};

describe("Testing getCSSObjects that should return { selector, css } objects", () => {
  const store = createStore();
  const renderContext: RenderType = "editor";

  test("Empty values, should return empty object", () => {
    expect(
      getCSSObjects({
        renderContext,
        currentModel: ModelType.Default,
        model: { vd: {}, vs: {}, v: {} },
        options: [],
        store
      })
    ).toStrictEqual(emptyCSS);
  });

  test("2 Options with same selector", () => {
    const output = {
      "{{WRAPPER}}": [
        "border:5px solid rgba(115, 119, 127, 1);",
        "background-color:rgba(255, 0, 0, 1); background-image:none;"
      ]
    };

    expect(
      getCSSObjects({
        renderContext,
        currentModel: ModelType.Default,
        model: {
          vd: { ...backgroundColorElementModel, ...borderElementModel },
          vs: { ...backgroundColorElementModel, ...borderElementModel },
          v: { ...backgroundColorElementModel, ...borderElementModel }
        },
        options: [
          { ...borderOptionWithSelector, selector: "{{WRAPPER}}" },
          backgroundOptionWithSelector
        ],
        store
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: [output],
      tablet: [output],
      mobile: [output]
    });
  });

  test("2 Options with same selector + hover", () => {
    const model = {
      ...backgroundColorElementModel,
      ...borderElementModel,
      hoverBorderColorHex: "#ff0000",
      hoverBgColorHex: "#ff0000"
    };
    const output = {
      "{{WRAPPER}}": [
        "border:5px solid rgba(115, 119, 127, 1);",
        "background-color:rgba(255, 0, 0, 1); background-image:none;"
      ]
    };

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Default,
        model: { vd: model, vs: model, v: model },
        options: [
          {
            ...borderOptionWithSelector,
            selector: "{{WRAPPER}}",
            states: [NORMAL, HOVER]
          },
          { ...backgroundOptionWithSelector, states: [NORMAL, HOVER] }
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: [output],
      tablet: [output],
      mobile: [output],
      hover: [
        {
          "{{WRAPPER}}:hover": [
            "border:5px solid rgba(255, 0, 0, 1);",
            "background-color:rgba(255, 0, 0, 1); background-image:none;"
          ]
        }
      ]
    });
  });

  test("2 options, different selector", () => {
    const model = { ...backgroundColorElementModel, ...borderElementModel };
    const output = [
      {
        "{{WRAPPER}} .list .list-item": [
          "border:5px solid rgba(115, 119, 127, 1);"
        ]
      },
      {
        "{{WRAPPER}}": [
          "background-color:rgba(255, 0, 0, 1); background-image:none;"
        ]
      }
    ];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Default,
        model: { vd: model, vs: model, v: model },
        options: [borderOptionWithSelector, backgroundOptionWithSelector]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });

  test("Option with 'style'", () => {
    const model = { height: 30, heightSuffix: "px" };
    const output = [{ "{{WRAPPER}}": ["height:30px;"] }];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Default,
        model: { vd: model, vs: model, v: model },
        options: [heightOptionWithStyle]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });

  test("2 options with 'style' with same selector", () => {
    const model = {
      height: 30,
      heightSuffix: "px",
      width: 50,
      widthSuffix: "px"
    };
    const output = [{ "{{WRAPPER}}": ["height:30px;", "width:50px;"] }];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Default,
        model: { vd: model, vs: model, v: model },
        options: [heightOptionWithStyle, widthOptionWithStyle]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });

  test("2 options with 'style' with different selector", () => {
    const model = {
      height: 30,
      heightSuffix: "px",
      width: 50,
      widthSuffix: "px"
    };
    const output = [
      { "{{WRAPPER}}": ["height:30px;"] },
      { "{{WRAPPER}} .brz-map": ["width:50px;"] }
    ];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Default,
        model: { vd: model, vs: model, v: model },
        options: [
          heightOptionWithStyle,
          {
            ...widthOptionWithStyle,
            style: (data) => ({
              "{{WRAPPER}} .brz-map": {
                width: `${data.value.value}${data.value.unit}`
              }
            })
          } as Option<"slider">
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });

  test("If exists style and selector on same option, should remain css from 'styles'", () => {
    const model = { height: 50, heightSuffix: "px" };
    const output = [{ "{{WRAPPER}}": ["height:50px;"] }];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Default,
        model: { vd: model, vs: model, v: model },
        options: [
          { ...heightOptionWithStyle, selector: "{{WRAPPER}} .brz-test" }
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });

  test("3 Options, all with default values + hover + active on same selector", () => {
    const model = {
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
    };
    const output = [
      { "{{WRAPPER}}": ["height:30px;", "width:40px;", "font-size:50px;"] }
    ];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Default,
        model: { vd: model, vs: model, v: model },
        options: [
          {
            ...heightOptionWithStyle,
            states: [NORMAL, HOVER, ACTIVE]
          },
          { ...widthOptionWithStyle, states: [NORMAL, HOVER, ACTIVE] },
          { ...fontSizeOptionWithStyle, states: [NORMAL, HOVER, ACTIVE] }
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      active: [
        {
          "{{WRAPPER}}.active": [
            "height:50px;",
            "width:60px;",
            "font-size:70px;"
          ]
        }
      ],
      desktop: output,
      tablet: output,
      mobile: output,
      hover: [
        {
          "{{WRAPPER}}:hover": [
            "height:40px;",
            "width:50px;",
            "font-size:60px;"
          ]
        }
      ]
    });
  });

  test("3 Options, all with default values + hover + active on different selector", () => {
    const model = {
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
    };
    const output = [
      { "{{WRAPPER}} .brz-h1": ["height:100px;"] },
      { "{{WRAPPER}} .brz-h2": ["width:450px;"] },
      { "{{WRAPPER}} .brz-h3": ["font-size:230px;"] }
    ];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Default,
        model: { vd: model, vs: model, v: model },
        options: [
          {
            ...heightOptionWithStyle,
            style: (data) => ({
              "{{WRAPPER}} .brz-h1": {
                height: `${data.value.value}${data.value.unit}`
              }
            }),
            states: [NORMAL, HOVER, ACTIVE]
          } as Option<"slider">,
          {
            ...widthOptionWithStyle,
            style: (data) => ({
              "{{WRAPPER}} .brz-h2": {
                width: `${data.value.value}${data.value.unit}`
              }
            }),
            states: [NORMAL, HOVER, ACTIVE]
          } as Option<"slider">,
          {
            ...fontSizeOptionWithStyle,
            style: (data) => ({
              "{{WRAPPER}} .brz-h3": {
                "font-size": `${data.value.value}${data.value.unit}`
              }
            }),
            states: [NORMAL, HOVER, ACTIVE]
          } as Option<"slider">
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      active: [
        { "{{WRAPPER}} .brz-h1.active": ["height:70px;"] },
        { "{{WRAPPER}} .brz-h2.active": ["width:90px;"] },
        { "{{WRAPPER}} .brz-h3.active": ["font-size:50px;"] }
      ],
      desktop: output,
      tablet: output,
      mobile: output,
      hover: [
        { "{{WRAPPER}} .brz-h1:hover": ["height:40px;"] },
        { "{{WRAPPER}} .brz-h2:hover": ["width:70px;"] },
        { "{{WRAPPER}} .brz-h3:hover": ["font-size:980px;"] }
      ]
    });
  });

  test("With more selectors on option", () => {
    const model = { ...borderElementModel, ...backgroundColorElementModel };
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
      {
        ".brz {{WRAPPER}}": [
          "background-color:rgba(255, 0, 0, 1); background-image:none;"
        ]
      },
      {
        ".brz-alert": [
          "background-color:rgba(255, 0, 0, 1); background-image:none;"
        ]
      },
      {
        " #brz-root": [
          "background-color:rgba(255, 0, 0, 1); background-image:none;"
        ]
      }
    ];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Default,
        model: { vd: model, vs: model, v: model },
        options: [
          {
            ...borderOptionWithSelector,
            selector:
              "{{WRAPPER}} .brz-container, {{WRAPPER}}.brz-spacer, {{WRAPPER}} .brz-line"
          },
          {
            ...backgroundOptionWithSelector,
            selector: ".brz {{WRAPPER}},.brz-alert, #brz-root"
          }
        ]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });

  test("Testing with rules as current model that have no differences between default", () => {
    const output = [
      {
        "{{WRAPPER}} .list .list-item": [
          "border:5px solid rgba(115, 119, 127, 1);"
        ]
      }
    ];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Rules,
        model: {
          vd: borderElementModel,
          vs: borderElementModel,
          v: borderElementModel
        },
        options: [borderOptionWithSelector]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });

  test("Testing with custom as current model that have no differences between rules", () => {
    const output = [
      {
        "{{WRAPPER}} .list .list-item": [
          "border:5px solid rgba(115, 119, 127, 1);"
        ]
      }
    ];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Custom,
        model: {
          vd: borderElementModel,
          vs: borderElementModel,
          v: borderElementModel
        },
        options: [borderOptionWithSelector]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });

  test("Testing with custom as current model that have only 1 key:value difference between rules ( colorHex only should be unique, opacity should be preserved from rules )", () => {
    const output = [
      {
        "{{WRAPPER}} .list .list-item": ["border: none;"]
      }
    ];
    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Custom,
        model: {
          vd: borderElementModel,
          vs: { ...borderElementModel, borderColorOpacity: 0.7 },
          v: {
            borderColorHex: "#0000FF"
          }
        },
        options: [borderOptionWithSelector]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });

  test("Testing with custom as current model, but rules is empty, should get missing keys from default", () => {
    const output = [{ "{{WRAPPER}} .list .list-item": ["border: none;"] }];

    expect(
      getCSSObjects({
        renderContext,
        store,
        currentModel: ModelType.Custom,
        model: {
          vd: borderElementModel,
          vs: {},
          v: {
            borderColorOpacity: 0.5
          }
        },
        options: [borderOptionWithSelector]
      })
    ).toStrictEqual({
      ...emptyCSS,
      desktop: output,
      tablet: output,
      mobile: output
    });
  });
});

describe("Testing filterMergedStylesByDevice that filter styles between devices + hover + active", () => {
  test("Mock data, should return all empty", () => {
    expect(filterMergedStylesByDevice(emptyCSS)).toStrictEqual(emptyCSS);
  });
  test("Filtering all the same data, should remaing only desktop", () => {
    expect(filterMergedStylesByDevice(generatedCSSSameStyles)).toStrictEqual({
      ...emptyCSS,
      desktop: ["{{WRAPPER}}{height:50px}"]
    });
  });
  test("Filtering with 2 or more styles in, should remaing only desktop", () => {
    expect(
      filterMergedStylesByDevice(generatedCSSSameStylesDoubledData)
    ).toStrictEqual({
      ...emptyCSS,
      desktop: ["{{WRAPPER}}{height:50px}"]
    });
  });
  test("Filtering where tablet has different styles, should remaing desktop and tablet", () => {
    expect(
      filterMergedStylesByDevice({
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
      filterMergedStylesByDevice({
        desktop: ["{{WRAPPER}}{color:red}"],
        tablet: ["{{WRAPPER}} .list{width:50px}"],
        mobile: ["{{WRAPPER}}{border:none}"],
        hover: [
          "{{WRAPPER}}:hover{background-color:white; background-image:none; color:black}"
        ],
        active: ["{{WRAPPER}}.active{border:1px solid red}"]
      })
    ).toStrictEqual({
      active: ["{{WRAPPER}}{{WRAPPER}}.active{border:1px solid red}"],
      desktop: ["{{WRAPPER}}{color:red}"],
      hover: [
        "{{WRAPPER}}:hover{background-color:white; background-image:none; color:black}"
      ],
      mobile: ["{{WRAPPER}}{{WRAPPER}}{border:none}"],
      tablet: ["{{WRAPPER}}{{WRAPPER}} .list{width:50px}"]
    });
  });
});

describe("filterStylesByDevice function", () => {
  it("should return an empty object if all device styles are filtered out", () => {
    const data = {
      desktop: [],
      tablet: [],
      mobile: []
    };
    const newData = filterStylesByDevice(data as unknown as CSS);
    expect(newData).toEqual(data);
  });

  it("should return an empty object if all device styles except desktop are filtered out", () => {
    const data = {
      desktop: [{ ".selector1": ["style1", "style2"] }],
      tablet: [],
      mobile: []
    };
    const newData = filterStylesByDevice(data as unknown as CSS);
    expect(newData).toEqual(data);
  });

  it("should return an empty object if all device styles except tablet are filtered out", () => {
    const data = {
      desktop: [],
      tablet: [{ ".selector1": ["style1", "style2"] }],
      mobile: []
    };
    const newData = filterStylesByDevice(data as unknown as CSS);
    expect(newData).toEqual(data);
  });

  it("should return an empty object if all device styles except mobile are filtered out", () => {
    const data = {
      desktop: [],
      tablet: [],
      mobile: [{ ".selector1": ["style1", "style2"] }]
    };
    const newData = filterStylesByDevice(data as unknown as CSS);
    expect(newData).toEqual(data);
  });

  it("should return the same data if all devices have the same styles", () => {
    const sharedStyles = [{ ".selector1": ["style1", "style2"] }];
    const data = {
      desktop: sharedStyles,
      tablet: [{ ".selector1": [] }],
      mobile: [{ ".selector1": [] }]
    };
    const newData = filterStylesByDevice(data as unknown as CSS);
    expect(newData).toEqual(data);
  });

  it("should return only desktop styles if desktop and tablet have the same styles but mobile is empty", () => {
    const desktopStyles = [{ ".selector1": ["style1", "style2"] }];
    const data = {
      desktop: desktopStyles,
      tablet: desktopStyles,
      mobile: []
    };
    const newData = filterStylesByDevice(data as unknown as CSS);
    expect(newData).toEqual({
      desktop: desktopStyles,
      tablet: [{ ".selector1": [] }],
      mobile: []
    });
  });

  it("should return only desktop and tablet styles if they are different from mobile styles", () => {
    const desktopStyles = [{ ".selector1": ["style1", "style2"] }];
    const tabletStyles = [{ ".selector2": ["style3", "style4"] }];
    const mobileStyles = [{ ".selector3": ["style5", "style6"] }];
    const data = {
      desktop: desktopStyles,
      tablet: tabletStyles,
      mobile: mobileStyles
    };
    const newData = filterStylesByDevice(data as unknown as CSS);
    expect(newData).toEqual(data);
  });

  it("should return an empty object if all device styles are different and filtered out", () => {
    const desktopStyles = [{ ".selector1": ["style1", "style2"] }];
    const tabletStyles = [{ ".selector1": ["style1", "style2"] }];
    const mobileStyles = [{ ".selector1": ["style1", "style2"] }];
    const data = {
      desktop: desktopStyles,
      tablet: tabletStyles,
      mobile: mobileStyles
    };
    const newData = filterStylesByDevice(data as unknown as CSS);
    expect(newData).toEqual({
      desktop: desktopStyles,
      tablet: [{ ".selector1": [] }],
      mobile: [{ ".selector1": [] }]
    });
  });
});
