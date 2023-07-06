import { DCPlaceholderObj } from "../../types/DynamicContent";
import { MValue } from "../../utils/types";
import { getPlaceholderObj } from "../utils";

describe("Testing 'getPlaceholderObj' function", () => {
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
    ["{{", undefined],
    ["}}", undefined],
    ["a='123' b='456'", undefined],
    ["{ a='123' b='456' }", undefined],
    ["[[ asdasd asd ]]", undefined]
  ])("Invalid str %#", (str, expected) => {
    expect(getPlaceholderObj(str)).toStrictEqual(expected);
  });

  test.each<[string, DCPlaceholderObj]>([
    ["{{test}}", { name: "test" }],
    ["{{ test }}", { name: "test" }],
    ["{{            test   }}", { name: "test" }],
    ["{{test_abc123}}", { name: "test_abc123" }],
    ["{{ test_abc123}}", { name: "test_abc123" }],
    ["{{ test_abc123-23324}}", { name: "test_abc123-23324" }],
    ["{{test_abc123-23324 }}", { name: "test_abc123-23324" }],
    [
      "{{ test_abc123-23324 a='123' b='344'}}",
      { name: "test_abc123-23324", attr: { a: "123", b: "344" } }
    ],
    [
      "{{ test     a='123'       b=\"abc-111__xyz\"  }}",
      { name: "test", attr: { a: "123", b: "abc-111__xyz" } }
    ],
    [
      "{{ test  dasdasdas   ac='1'  12121212121 DC=\"z\"  }}",
      { name: "test", attr: { ac: "1", DC: "z" } }
    ],
    ["{{ a-b-c }}", { name: "a-b-c" }],
    ["{{ a='123' b='456' }}", { name: "a", attr: { b: "456" } }],
    [
      "{{ a='123' _fallback='test' }}",
      { name: "a", attr: { _fallback: "test" } }
    ]
  ])("Valid str %#", (str, expected) => {
    expect(getPlaceholderObj(str)).toStrictEqual(expected);
  });
});
