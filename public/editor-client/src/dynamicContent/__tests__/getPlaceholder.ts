import { DCPlaceholderObj } from "../../types/DynamicContent";
import { getPlaceholder } from "../utils";

describe("Testing 'getPlaceholder' function", () => {
  test.each<[DCPlaceholderObj, string]>([
    [{ name: "a" }, "{{a}}"],
    [{ name: "b", attr: {} }, "{{b}}"],
    [
      {
        name: "c",
        attr: {
          a: undefined,
          b: null,
          c: [1, 2, 3],
          d: () => {
            return {};
          },
        },
      },
      "{{c}}",
    ],
    [{ name: "d", attr: { a: "", b: undefined } }, "{{d a=''}}"],
    [{ name: "efg", attr: { a: "abc", b: 123 } }, "{{efg a='abc' b='123'}}"],
    [
      {
        name: "h_i_j",
        attr: { x: 777, c: "xxx", b: "abc", a: 123, _fallback: "fb" },
      },

      "{{h_i_j _fallback='fb' a='123' b='abc' c='xxx' x='777'}}",
    ],
    [
      { name: "test", attr: { placeholder: "This is O'reilly book" } },

      "{{test placeholder='This%20is%20O'reilly%20book'}}",
    ],
    [{ name: "UserAttribute['test']" }, "{{UserAttribute['test']}}"],
    [
      { name: "UserAttribute['test']", attr: { a: "", b: undefined } },
      "{{UserAttribute['test'] a=''}}",
    ],
  ])("no. %#", (placeholderObj, expected) => {
    expect(getPlaceholder(placeholderObj)).toStrictEqual(expected);
  });
});
