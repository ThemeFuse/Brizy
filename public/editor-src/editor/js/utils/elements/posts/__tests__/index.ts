import { Attributes } from "..//types";
import {
  decodeSymbols,
  encodeSymbols,
  stringifyAttributes
} from "../utils.common";

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

describe("Testing 'symbolsToV' function", () => {
  test.each([[{ gridRow: 3, gridColumn: 4 }], [{ offset: 1, symbols: {} }]])(
    "symbols empty",
    (v) => {
      expect(decodeSymbols(v)).toBe(v);
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
    expect(decodeSymbols(v)).toEqual(expected);
  });
});

describe("Testing 'vToSymbols' function", () => {
  test.each([[{ gridRow: 3, gridColumn: 4 }], [{ offset: 1, symbols: {} }]])(
    "symbols empty",
    (v) => {
      expect(encodeSymbols(v)).toBe(v);
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
    expect(encodeSymbols(v)).toEqual(expected);
  });
});
