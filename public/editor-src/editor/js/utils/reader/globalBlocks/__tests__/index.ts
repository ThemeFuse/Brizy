import { Rule } from "visual/types/Rule";
import { ApiRule, apiRuleToEditorRule } from "../";

describe("testing reader Global Blocks", () => {
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
    ],

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
});
