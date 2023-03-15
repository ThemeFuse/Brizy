import { Literal } from "visual/utils/types/Literal";
import { valueChoices, searchChoices, mergeChoices } from "./utils";
import { ChoicesSync } from "./types";

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
