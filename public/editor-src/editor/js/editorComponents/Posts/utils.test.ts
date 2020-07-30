import { stringifyAttributes } from "./utils";

describe("Testing 'stringifyAttributes' function", () => {
  test.each([
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
        a: "abc",
        b: 123
      },
      "a='abc' b='123'"
    ],
    [
      {
        a: {}
      },
      "a=''"
    ],
    [
      {
        a: {
          b: undefined,
          c: null
        }
      },
      "a=''"
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
      "a='arr[]=a&arr[]=b&arr[]=c'"
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
      "a='b=abc&arr[]=a&arr[]=b&arr[]=c&obj[a]=def&obj[b]=123'"
    ]
  ])("stringifyAttribute", (attributes, expected) => {
    expect(stringifyAttributes(attributes)).toBe(expected);
  });
});
