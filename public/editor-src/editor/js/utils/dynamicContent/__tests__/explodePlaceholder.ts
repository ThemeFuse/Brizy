import { Base64 } from "js-base64";
import { MValue } from "visual/utils/value";
import { placeholderObjFromStr } from "../explodePlaceholder";
import {
  DCPlaceholderObj,
  placeholderEndName,
  placeholderName
} from "../types";

describe("Testing 'placeholderObjFromStr' function", () => {
  test.each<[string, MValue<DCPlaceholderObj>]>([
    ["", undefined],
    ["invalid string", undefined],
    ["{", undefined],
    ["}", undefined],
    ["{ test", undefined],
    ["test }", undefined],
    ["{ test }", undefined],
    ["{{", undefined],
    ["}}", undefined],
    ["{{ test", undefined],
    ["test }}", undefined],
    ["{{ test }", undefined],
    ["{ test }}", undefined],
    ["a='123' b='456'", undefined],
    ["{ a='123' b='456' }", undefined],
    ["{{ placeholder a='123' b='456' }}", undefined],
    ["{{ placeholderaa a='123' b='456' }}", undefined],
    ["{{ end_placeholderaaa }}", undefined]
  ])("Invalid str %#", (str, expected) => {
    expect(placeholderObjFromStr(str)).toStrictEqual(expected);
  });

  test.each<[string, DCPlaceholderObj]>([
    [
      `{{ placeholder content='${Base64.encode("a")}' }}`,
      {
        name: placeholderName,
        content: "a"
      }
    ],
    [
      `{{placeholder content='${Base64.encode("asd")}'}}`,
      { name: placeholderName, content: "asd" }
    ],
    [
      `{{ placeholder content='${Base64.encode("aa")}'}}`,
      { name: placeholderName, content: "aa" }
    ],
    [
      `{{ placeholder content='${Base64.encode("11")}' a='123' b='344'}}`,
      {
        name: placeholderName,
        content: "11",
        attr: { a: "123", b: "344" }
      }
    ],
    [
      `{{ placeholder content='${Base64.encode(
        "aaa"
      )}'     a='123'       b="abc-111__xyz"  }}`,
      {
        name: placeholderName,
        content: "aaa",
        attr: { a: "123", b: "abc-111__xyz" }
      }
    ],
    [
      `{{ placeholder content='${Base64.encode(
        "dasdasdas"
      )}'   ac='1'  12121212121 DC="z"  }}`,
      {
        name: placeholderName,
        content: "dasdasdas",
        attr: { ac: "1", DC: "z" }
      }
    ],
    [
      "{{placeholder content='{{asdasdasd}}'}}",
      {
        name: placeholderName,
        content: Base64.decode("{{asdasdasd}}")
      }
    ],
    [
      `{{placeholder content='${Base64.encode("{{test}}")}'}}`,
      {
        name: placeholderEndName,
        content: "{{test}}"
      }
    ],
    [
      `{{placeholder content='${Base64.encode(
        "asdasdasd"
      )}' attr='1' attr='2'}}`,
      {
        name: placeholderEndName,
        content: "asdasdasd",
        attr: {
          attr: "2"
        }
      }
    ]
  ])("Valid str %#", (str, expected) => {
    expect(placeholderObjFromStr(str)).toStrictEqual(expected);
  });
});
