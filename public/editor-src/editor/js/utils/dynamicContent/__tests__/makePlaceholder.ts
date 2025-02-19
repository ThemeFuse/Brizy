import { noop } from "es-toolkit";
import { Base64 } from "js-base64";
import { placeholderObjToStr } from "../makePlaceholder";
import { DCPlaceholderObj, placeholderName } from "../types";

describe("Testing 'placeholderObjToStr' function", () => {
  const c = Base64.encode("22");

  test.each<[DCPlaceholderObj, string]>([
    [
      { name: placeholderName, content: "1" },
      `{{placeholder content='${Base64.encode("1")}'}}`
    ],
    [
      { name: placeholderName, content: "11", attr: {} },
      `{{placeholder content='${Base64.encode("11")}'}}`
    ],
    [
      {
        name: placeholderName,
        content: "22",
        attr: { a: undefined, b: null, c: [1, 2, 3], d: noop }
      },
      `{{placeholder content='${c}'}}`
    ],
    [
      { name: placeholderName, content: "22", attr: { a: "", b: undefined } },
      `{{placeholder content='${c}' a=''}}`
    ],
    [
      { name: placeholderName, content: "22", attr: { a: "abc", b: 123 } },
      `{{placeholder content='${c}' a='abc' b='123'}}`
    ],
    [
      {
        name: placeholderName,
        content: "22",
        attr: { x: 777, c: "xxx", b: "abc", a: 123, _fallback: "fb" }
      },
      `{{placeholder content='${c}' _fallback='fb' a='123' b='abc' c='xxx' x='777'}}`
    ],
    [
      {
        name: placeholderName,
        content: "22",
        attr: { placeholder: "This is O'reilly book" }
      },
      `{{placeholder content='${c}' placeholder='This is O&#39;reilly book'}}`
    ],
    [
      {
        name: placeholderName,
        content: "22",
        attr: { entityType: "type1" }
      },
      `{{placeholder content='${c}' entityType='type1'}}`
    ],
    [
      {
        name: placeholderName,
        content: "22",
        attr: { entityType: "type1", entityId: "entity1" }
      },
      `{{placeholder content='${c}' entityId='entity1' entityType='type1'}}`
    ]
  ])("no. %#", (placeholderObj, expected) => {
    expect(placeholderObjToStr(placeholderObj)).toStrictEqual(expected);
  });
});
