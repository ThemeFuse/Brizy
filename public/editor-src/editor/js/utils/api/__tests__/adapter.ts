import { Rule } from "visual/types";
import { ApiRule, apiRuleToEditorRule, editorRuleToApiRule } from "../adapter";

describe("testing adapter", () => {
  test.each<[ApiRule, Rule]>([
    [
      {
        type: 1,
        appliedFor: 1,
        mode: "specific",
        entityType: "page",
        entityValues: ["1"]
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "specific",
        entityValues: ["1"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "specific",
        entityValues: ["1"]
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "specific",
        entityValues: ["1"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "reference",
        entityValues: ["1"]
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "reference",
        entityValues: ["1"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        entityValues: []
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page"
      }
    ],

    [
      {
        type: 1,
        appliedFor: 134,
        entityType: "",
        entityValues: []
      },
      {
        type: 1,
        appliedFor: 134,
        entityType: ""
      }
    ],

    [
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        entityValues: []
      },
      {
        type: 1
      }
    ],

    [
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        entityValues: ["2"]
      },
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        mode: "specific",
        entityValues: ["2"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 2,
        entityType: "",
        mode: "reference",
        entityValues: ["2"]
      },
      {
        type: 1,
        appliedFor: 2,
        entityType: "",
        mode: "reference",
        entityValues: ["2"]
      }
    ]
  ])("apiRuleToEditorRule nr %#", (apiRule, rule) => {
    expect(apiRuleToEditorRule(apiRule)).toStrictEqual(rule);
  });

  test.each<[Rule, ApiRule]>([
    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "specific",
        entityValues: ["1"]
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "specific",
        entityValues: ["1"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "reference",
        entityValues: ["1"]
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "reference",
        entityValues: ["1"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page"
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        entityValues: []
      }
    ],

    [
      {
        type: 1,
        appliedFor: 134,
        entityType: ""
      },
      {
        type: 1,
        appliedFor: 134,
        entityType: "",
        entityValues: []
      }
    ],

    [
      {
        type: 1
      },
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        entityValues: []
      }
    ],

    [
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        mode: "specific",
        entityValues: ["2"]
      },
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        mode: "specific",
        entityValues: ["2"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 2,
        entityType: "",
        mode: "specific",
        entityValues: ["2"]
      },
      {
        type: 1,
        appliedFor: 2,
        entityType: "",
        mode: "specific",
        entityValues: ["2"]
      }
    ]
  ])("editorRuleToApiRule nr %#", (rule, apiRule) => {
    expect(editorRuleToApiRule(rule)).toStrictEqual(apiRule);
  });
});

// @ts-expect-error: the TARGET is added from webpack, here we are hardcoded
const currentTarget = global.TARGET;

describe("testing adapter WP", () => {
  beforeAll(() => {
    // @ts-expect-error: the TARGET is added from webpack, here we are hardcoded
    global.TARGET = "WP";
  });

  afterAll(() => {
    // @ts-expect-error: the TARGET is added from webpack, here we are hardcoded
    global.TARGET = currentTarget;
  });

  test.each<[ApiRule, Rule]>([
    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        entityValues: ["1"]
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "specific",
        entityValues: ["1"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        entityValues: []
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page"
      }
    ],

    [
      {
        type: 1,
        appliedFor: 134,
        entityType: "",
        entityValues: []
      },
      {
        type: 1,
        appliedFor: 134,
        entityType: ""
      }
    ],

    [
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        entityValues: []
      },
      {
        type: 1
      }
    ],

    [
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        entityValues: []
      },
      {
        type: 1
      }
    ],

    [
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        entityValues: ["2"]
      },
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        mode: "specific",
        entityValues: ["2"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 2,
        entityType: "",
        entityValues: ["2"]
      },
      {
        type: 1,
        appliedFor: 2,
        entityType: "",
        mode: "specific",
        entityValues: ["2"]
      }
    ]
  ])("apiRuleToEditorRule nr %#", (apiRule, rule) => {
    expect(apiRuleToEditorRule(apiRule)).toStrictEqual(rule);
  });

  test.each<[Rule, ApiRule]>([
    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        mode: "specific",
        entityValues: ["1"]
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        entityValues: ["1"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 2,
        entityType: "post",
        mode: "reference",
        entityValues: ["1"]
      },
      {
        type: 1,
        appliedFor: 2,
        entityType: "post",
        entityValues: ["1"]
      }
    ],

    [
      {
        type: 1,
        appliedFor: 1,
        entityType: "page"
      },
      {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        entityValues: []
      }
    ],

    [
      {
        type: 1,
        appliedFor: 134,
        entityType: ""
      },
      {
        type: 1,
        appliedFor: 134,
        entityType: "",
        entityValues: []
      }
    ],

    [
      {
        type: 1
      },
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        entityValues: []
      }
    ],

    [
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        mode: "specific",
        entityValues: ["2"]
      },
      {
        type: 1,
        appliedFor: null,
        entityType: "",
        entityValues: ["2"]
      }
    ]

    //#endregion
  ])("editorRuleToApiRule nr %#", (rule, apiRule) => {
    expect(editorRuleToApiRule(rule)).toStrictEqual(apiRule);
  });
});
