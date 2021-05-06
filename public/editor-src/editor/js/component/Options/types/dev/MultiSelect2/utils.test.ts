import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import {
  getModel,
  toElement,
  valueChoices,
  searchChoices,
  mergeChoices
} from "./utils";
import { ChoicesSync } from "./types";

describe("Testing 'getModel' function", function() {
  test("Return empty array if value is not an stringified array of literals", () => {
    const values = [undefined, "", "1,2,3", "[[1,2,3]]"];

    values.map(v => {
      const m: { [k: string]: MValue<Literal> } = { value: v };
      const get = (k: string): MValue<Literal> => m[k];

      expect(getModel(get)).toEqual({ value: [] });
    });
  });

  test.each([
    ["[1,2,3]", { value: [1, 2, 3] }],
    ['["1","2","3"]', { value: ["1", "2", "3"] }],
    ['["1",2,"3"]', { value: ["1", 2, "3"] }],
    ['["1","2","3",{}]', { value: ["1", "2", "3"] }]
  ])("%s to %s", (a, b) => {
    const m: { [k: string]: MValue<Literal> } = { value: a };
    const get = (k: string): MValue<Literal> => m[k];
    expect(getModel(get)).toEqual(b);
  });
});

describe("Testing 'toElement' function", function() {
  [
    [1, 2, 3],
    ["1", "2", "3"],
    [1, "2", 3]
  ].map(v => {
    test(`${v.toString()} to {value: ${JSON.stringify(v)}}`, () => {
      expect(toElement(v)).toEqual({ value: JSON.stringify(v) });
    });
  });
});

test.each<[Literal[], ChoicesSync, ChoicesSync]>([
  [
    [],
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" },
      { title: "c", value: "c" }
    ],
    []
  ],
  [
    ["b"],
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" },
      { title: "c", value: "c" }
    ],
    [{ title: "b", value: "b" }]
  ],
  [
    ["a", "c"],
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" },
      { title: "c", value: "c" }
    ],
    [
      { title: "a", value: "a" },
      { title: "c", value: "c" }
    ]
  ],
  [
    ["x"],
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" },
      { title: "c", value: "c" }
    ],
    []
  ]
])("Testing 'valueChoices' function", function(value, choices, expected) {
  expect(valueChoices(value, choices)).toEqual(expected);
});

test.each<[string, ChoicesSync, ChoicesSync]>([
  [
    "",
    [
      { title: "Cat", value: "cat" },
      { title: "Dog", value: "dog" },
      { title: "Donkey", value: "donkey" }
    ],
    [
      { title: "Cat", value: "cat" },
      { title: "Dog", value: "dog" },
      { title: "Donkey", value: "donkey" }
    ]
  ],
  [
    "c",
    [
      { title: "Cat", value: "cat" },
      { title: "Dog", value: "dog" },
      { title: "Donkey", value: "donkey" }
    ],
    [{ title: "Cat", value: "cat" }]
  ],
  [
    "do",
    [
      { title: "Cat", value: "cat" },
      { title: "Dog", value: "dog" },
      { title: "Donkey", value: "donkey" }
    ],
    [
      { title: "Dog", value: "dog" },
      { title: "Donkey", value: "donkey" }
    ]
  ],
  [
    "key",
    [
      { title: "Cat", value: "cat" },
      { title: "Dog", value: "dog" },
      { title: "Donkey", value: "donkey" }
    ],
    [{ title: "Donkey", value: "donkey" }]
  ]
])("Testing 'searchChoices' function", function(search, choices, expected) {
  expect(searchChoices(search, choices)).toEqual(expected);
});

test.each<[ChoicesSync, ChoicesSync, ChoicesSync]>([
  [[], [], []],
  [[{ title: "a", value: "a" }], [], [{ title: "a", value: "a" }]],
  [[], [{ title: "a", value: "a" }], [{ title: "a", value: "a" }]],
  [
    [{ title: "a", value: "a" }],
    [{ title: "a", value: "a" }],
    [{ title: "a", value: "a" }]
  ],
  [
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" }
    ],
    [{ title: "a", value: "a" }],
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" }
    ]
  ],
  [
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" }
    ],
    [{ title: "c", value: "c" }],
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" },
      { title: "c", value: "c" }
    ]
  ]
])("Testing 'mergeChoices' function (2 args)", function(
  choicesA,
  choicesB,
  expected
) {
  expect(mergeChoices(choicesA, choicesB)).toEqual(expected);
});

test.each<[ChoicesSync, ChoicesSync, ChoicesSync, ChoicesSync]>([
  [[], [], [], []],
  [[{ title: "a", value: "a" }], [], [], [{ title: "a", value: "a" }]],
  [[], [{ title: "a", value: "a" }], [], [{ title: "a", value: "a" }]],
  [[], [], [{ title: "a", value: "a" }], [{ title: "a", value: "a" }]],
  [
    [{ title: "a", value: "a" }],
    [{ title: "a", value: "a" }],
    [{ title: "a", value: "a" }],
    [{ title: "a", value: "a" }]
  ],
  [
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" }
    ],
    [{ title: "a", value: "a" }],
    [{ title: "b", value: "b" }],
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" }
    ]
  ],
  [
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" }
    ],
    [{ title: "c", value: "c" }],
    [{ title: "d", value: "d" }],
    [
      { title: "a", value: "a" },
      { title: "b", value: "b" },
      { title: "c", value: "c" },
      { title: "d", value: "d" }
    ]
  ]
])("Testing 'mergeChoices' function (3 args)", function(
  choicesA,
  choicesB,
  choicesC,
  expected
) {
  expect(mergeChoices(choicesA, choicesB, choicesC)).toEqual(expected);
});
