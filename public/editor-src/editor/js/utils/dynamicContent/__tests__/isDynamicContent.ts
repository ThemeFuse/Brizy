import { Base64 } from "js-base64";
import { isDynamicContent } from "../isDynamicContent";

describe("Testing 'isDynamicContent' function", () => {
  test.each<[string, boolean]>([
    ["", false],
    ["invalid string", false],
    ["{", false],
    ["}", false],
    ["{ test", false],
    ["test }", false],
    ["{ test }", false],
    ["{{", false],
    ["}}", false],
    ["{{ test", false],
    ["test }}", false],
    ["{{ test }", false],
    ["{ test }}", false],
    ["a='123' b='456'", false],
    ["{ a='123' b='456' }", false],
    ["{{ placeholder1 a='123' b='456' }}", false],
    ["{{ __placeholder1 a='123' b='456' }}", false],
    ["{{ plr a='123' b='456' }}", false]
  ])("Invalid str %#", (str, expected) => {
    expect(isDynamicContent(str)).toStrictEqual(expected);
  });

  test.each<[string, boolean]>([
    [`{{ placeholder content='${Base64.encode("a")}' }}`, true],
    [`{{placeholder content='${Base64.encode("asd")}'}}`, true],
    [`{{ placeholder content='${Base64.encode("aa")}'}}`, true],
    [`{{ placeholder content='${Base64.encode("11")}' a='123' b='344'}}`, true],
    [
      `{{ placeholder content='${Base64.encode(
        "aaa"
      )}'     a='123'       b="abc-111__xyz"  }}`,
      true
    ],
    [
      `{{ placeholder content='${Base64.encode(
        "dasdasdas"
      )}'   ac='1'  12121212121 DC="z"  }}`,
      true
    ],
    [
      `{{ placeholder content='${Base64.encode(
        "dasdasdas"
      )}'   ac='1'  12121212121 DC="z"  }}`,
      true
    ]
  ])("Valid str %#", (str, expected) => {
    expect(isDynamicContent(str)).toStrictEqual(expected);
  });
});
