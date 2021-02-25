import {
  decodeV,
  stringifyAttributes,
  symbolsToV,
  vToSymbols
} from "./utils.common";
import { Attributes, V, VDecoded } from "./types";

test.each<[Attributes, string]>([
  [{}, ""],
  [
    {
      a: null,
      b: undefined
    },
    ""
  ],
  [
    {
      a: {}
    },
    ""
  ],
  [
    {
      a: {
        b: undefined,
        c: null
      }
    },
    ""
  ],
  [
    {
      a: {
        b: undefined,
        c: null,
        d: {
          e: {
            f: {
              g: undefined
            }
          },
          h: null,
          i: []
        }
      }
    },
    ""
  ],
  [
    {
      a: {
        b: undefined,
        c: null,
        d: {
          e: {
            f: {
              g: undefined
            }
          },
          h: null
        },
        j: "abc",
        k: null,
        l: 123
      },
      m: "def"
    },
    "a='j=abc&l=123' m='def'"
  ],
  [
    {
      a: "abc",
      b: 123
    },
    "a='abc' b='123'"
  ],
  [
    {
      a: {
        b: "abc",
        c: 123
      }
    },
    "a='b=abc&c=123'"
  ],
  [
    {
      a: {
        arr: ["a", "b", "c"]
      }
    },
    "a='arr[0]=a&arr[1]=b&arr[2]=c'"
  ],
  [
    {
      a: {
        obj: {
          b: "abc",
          c: 123
        }
      }
    },
    "a='obj[b]=abc&obj[c]=123'"
  ],
  [
    {
      a: {
        b: "abc",
        arr: ["a", "b", "c"],
        obj: { a: "def", b: 123 }
      }
    },
    "a='b=abc&arr[0]=a&arr[1]=b&arr[2]=c&obj[a]=def&obj[b]=123'"
  ]
])("Testing 'stringifyAttributes' function", (attributes, expected) => {
  expect(stringifyAttributes(attributes)).toBe(expected);
});

describe("Testing 'decodeV' function", () => {
  test("empty", () => {
    const decoded: VDecoded = {
      type: "",
      gridRow: 1,
      gridColumn: 1,
      source: "",
      offset: 0,
      orderBy: "",
      order: "",
      symbols: {}
    };

    expect(decodeV({})).toEqual(decoded);
  });

  test("not empty", () => {
    const v: V = {
      type: "posts",
      gridRow: 1,
      gridColumn: 2,
      source: "blog",
      offset: 3,
      orderBy: "title",
      order: "DESC",
      symbols: {
        blog_incBy: '["manual","/collection_types/191"]',
        blog_inc_manual: '["/collection_items/174"]',
        "blog_inc_/collection_types/191":
          '["/collection_items/57","/collection_items/181"]',
        page_incBy: "[]"
      }
    };
    const decoded: VDecoded = {
      type: "posts",
      gridRow: 1,
      gridColumn: 2,
      source: "blog",
      offset: 3,
      orderBy: "title",
      order: "DESC",
      symbols: {
        blog_incBy: ["manual", "/collection_types/191"],
        blog_inc_manual: ["/collection_items/174"],
        "blog_inc_/collection_types/191": [
          "/collection_items/57",
          "/collection_items/181"
        ],
        page_incBy: []
      }
    };

    expect(decodeV(v)).toEqual(decoded);
  });
});

describe("Testing 'symbolsToV' function", () => {
  test.each([[{ gridRow: 3, gridColumn: 4 }], [{ offset: 1, symbols: {} }]])(
    "symbols empty",
    v => {
      expect(symbolsToV(v)).toBe(v);
    }
  );

  test.each([
    [
      { gridRow: 3, symbols: { s1: "s1", s2: "s2" } },
      {
        gridRow: 3,
        symbol_s1: "s1",
        symbol_s2: "s2",
        symbols: { s1: "s1", s2: "s2" }
      }
    ]
  ])("symbols not empty", (v, expected) => {
    expect(symbolsToV(v)).toEqual(expected);
  });
});

describe("Testing 'vToSymbols' function", () => {
  test.each([[{ gridRow: 3, gridColumn: 4 }], [{ offset: 1, symbols: {} }]])(
    "symbols empty",
    v => {
      expect(vToSymbols(v)).toBe(v);
    }
  );

  test.each([
    [
      { gridColumn: 1, symbol_s1: "s1", symbol_s2: "s2" },
      {
        gridColumn: 1,
        symbols: { s1: "s1", s2: "s2" }
      }
    ],
    [
      {
        gridColumn: 1,
        symbol_s1: "s1",
        symbol_s2: "s2",
        symbols: { s3: "s3" }
      },
      {
        gridColumn: 1,
        symbols: { s1: "s1", s2: "s2", s3: "s3" }
      }
    ]
  ])("symbols not empty", (v, expected) => {
    expect(vToSymbols(v)).toEqual(expected);
  });
});
