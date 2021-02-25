import { arrangeItems, toggleItemValue, _valueTitle } from "./utils";

test.each([
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["a"],
    "A"
  ],
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["b"],
    "B"
  ],
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["a", "c"],
    "2 Selected"
  ],
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["a", "b", "c"],
    "3 Selected"
  ],
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["x", "y"],
    undefined
  ]
])("Testing 'valueTitle' function", (items, value, expected) => {
  const t: (key: string) => string = key => key;
  const valueTitle = _valueTitle(t);

  expect(valueTitle(items, value)).toEqual(expected);
});

test.each([
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["a"],
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ]
  ],
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["b"],
    [
      { title: "B", value: "b" },
      { title: "A", value: "a" },
      { title: "C", value: "c" }
    ]
  ],
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["a", "c"],
    [
      { title: "A", value: "a" },
      { title: "C", value: "c" },
      { title: "B", value: "b" }
    ]
  ],
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["c", "b", "a"],
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ]
  ],
  [
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ],
    ["x", "y"],
    [
      { title: "A", value: "a" },
      { title: "B", value: "b" },
      { title: "C", value: "c" }
    ]
  ]
])("Testing 'arrangeItems' function", (items, value, expected) => {
  expect(arrangeItems(items, value)).toEqual(expected);
});

test.each([
  [{ title: "A", value: "a" }, [], ["a"]],
  [{ title: "A", value: "a" }, ["a"], []],
  [{ title: "B", value: "b" }, ["a"], ["a", "b"]],
  [{ title: "B", value: "b" }, ["a", "b"], ["a"]],
  [{ title: "C", value: "c" }, ["a", "b"], ["a", "b", "c"]],
  [{ title: "C", value: "c" }, ["a", "b", "c"], ["a", "b"]]
])("Testing 'toggleItemValue' function", (item, value, expected) => {
  expect(toggleItemValue(item, value)).toEqual(expected);
});
