import { V } from "visual/types";
import { MValue } from "visual/utils/value";
import { ECKeyDCInfo } from "../../types";
import { DCPlaceholderObj } from "../types";
import {
  dcApiProxyTestFetcher,
  dcKeyToKey,
  hasDC,
  isDCKey,
  isPlaceholderStr,
  keyDCInfo,
  keyToDCAttrKey,
  keyToDCFallback2Key,
  keyToDCKey,
  placeholderObjFromECKeyDCInfo,
  placeholderObjFromStr,
  placeholderObjToStr
} from "../utils";

//#region keys

describe("Testing 'isDCKey' function", () => {
  test.each([
    ["test", false],
    ["abc", false],
    ["testPopulation", true],
    ["abcPopulation", true]
  ])("test %#", (key, expected) => {
    expect(isDCKey(key)).toStrictEqual(expected);
  });
});

describe("Testing 'keyToDCKey' & 'dcKeyToKey' functions", () => {
  test.each([
    ["test", "testPopulation"],
    ["abc", "abcPopulation"]
  ])("test %#", (key, dcKey) => {
    expect(keyToDCKey(key)).toStrictEqual(dcKey);
    expect(dcKeyToKey(dcKey)).toStrictEqual(key);
  });
});

describe("Testing 'keyToDCAttrKey' function", () => {
  test.each([
    ["test", "testPopulationAttr"],
    ["abc", "abcPopulationAttr"]
  ])("test %#", (key, expected) => {
    expect(keyToDCAttrKey(key)).toStrictEqual(expected);
  });
});

describe("Testing 'keyToDCFallback2Key' function", () => {
  test.each([
    ["test", "testPopulationFallback2"],
    ["abc", "abcPopulationFallback2"]
  ])("test %#", (key, expected) => {
    expect(keyToDCFallback2Key(key)).toStrictEqual(expected);
  });
});

describe("Testing 'hasDC' function", () => {
  test.each([
    [{}, "test", false],
    [{ test: "abc" }, "test", false],
    [{ testPopulation: undefined }, "test", false],
    [{ testPopulation: null }, "test", false],
    [{ testPopulation: [123, 1121] }, "test", false],
    [{ testPopulation: "" }, "test", false],

    [{ testPopulation: "{{ some_placeholder }}" }, "test", true],
    [{ testPopulation: "any string really" }, "test", true]
  ])("test %#", (v, key, expected) => {
    expect(hasDC(v, key)).toStrictEqual(expected);
  });
});

describe("Testing 'keyDCInfo' function", () => {
  test.each<[V, string, ECKeyDCInfo]>([
    [
      {
        test: "test static",
        testPopulation: "",
        testPopulationFallback2: "test fallback2"
      },
      "test",
      {
        key: "test",
        hasDC: false,
        staticValue: "test static",
        dcValue: "",
        fallback: "test fallback2",
        attr: {}
      }
    ],
    [
      {
        test: "test static",
        testPopulation: "{{ test_placeholder }}",
        testPopulationFallback2: "test fallback2"
      },
      "test",
      {
        key: "test",
        hasDC: true,
        staticValue: "test static",
        dcValue: "{{ test_placeholder }}",
        fallback: "test fallback2",
        attr: {}
      }
    ],
    [
      {
        test: "test static",
        testPopulation: "{{ test_placeholder }}",
        testPopulationFallback2: "test fallback2",
        testPopulationAttr: {
          a: "nonExistent1",
          b: "nonExistent2"
        }
      },
      "test",
      {
        key: "test",
        hasDC: true,
        staticValue: "test static",
        dcValue: "{{ test_placeholder }}",
        fallback: "test fallback2",
        attr: {
          a: undefined,
          b: undefined
        }
      }
    ],
    [
      {
        test: "test static",
        testPopulation: "{{ test_placeholder }}",
        testPopulationFallback2: "test fallback2",
        testPopulationAttr: {
          a: "aKey",
          b: "bKey"
        },
        aKey: 123,
        bKey: "abc"
      },
      "test",
      {
        key: "test",
        hasDC: true,
        staticValue: "test static",
        dcValue: "{{ test_placeholder }}",
        fallback: "test fallback2",
        attr: {
          a: 123,
          b: "abc"
        }
      }
    ]
  ])("no. %#", (v, key, expected) => {
    expect(keyDCInfo(v, key)).toStrictEqual(expected);
  });
});

//#endregion

//#region placeholder

describe("Testing 'placeholderObjFromStr' function", () => {
  test.each<[string, boolean, MValue<DCPlaceholderObj>]>([
    ["", false, undefined],
    ["invalid string", false, undefined],
    ["{", false, undefined],
    ["}", false, undefined],
    ["{ test", false, undefined],
    ["test }", false, undefined],
    ["{ test }", false, undefined],
    ["{{", false, undefined],
    ["}}", false, undefined],
    ["{{ test", false, undefined],
    ["test }}", false, undefined],
    ["{{ test }", false, undefined],
    ["{ test }}", false, undefined],
    ["a='123' b='456'", false, undefined],
    ["{ a='123' b='456' }", false, undefined],

    ["{ test }", true, { name: "{ test }" }],
    ["{{", true, { name: "{{" }],
    ["}}", true, { name: "}}" }],
    ["{{ test", true, { name: "{{ test" }],
    ["test }}", true, { name: "test }}" }],
    ["{{ test }", true, { name: "{{ test }" }],
    ["{ test }}", true, { name: "{ test }}" }],
    ["a='123' b='456'", true, { name: "a='123' b='456'" }],
    ["{ a='123' b='456' }", true, { name: "{ a='123' b='456' }" }],
    ["[[ asdasd asd ]]", true, { name: "[[ asdasd asd ]]" }]
  ])("Invalid str %#", (str, useCustomPlaceholder, expected) => {
    expect(placeholderObjFromStr(str, useCustomPlaceholder)).toStrictEqual(
      expected
    );
  });

  test.each<[string, boolean, DCPlaceholderObj]>([
    ["{{test}}", false, { name: "test" }],
    ["{{ test }}", false, { name: "test" }],
    ["{{            test   }}", false, { name: "test" }],
    ["{{test_abc123}}", false, { name: "test_abc123" }],
    ["{{ test_abc123}}", false, { name: "test_abc123" }],
    ["{{ test_abc123-23324}}", false, { name: "test_abc123-23324" }],
    ["{{test_abc123-23324 }}", false, { name: "test_abc123-23324" }],
    [
      "{{ test_abc123-23324 a='123' b='344'}}",
      false,
      { name: "test_abc123-23324", attr: { a: "123", b: "344" } }
    ],
    [
      "{{ test     a='123'       b=\"abc-111__xyz\"  }}",
      false,
      { name: "test", attr: { a: "123", b: "abc-111__xyz" } }
    ],
    [
      "{{ test  dasdasdas   ac='1'  12121212121 DC=\"z\"  }}",
      false,
      { name: "test", attr: { ac: "1", DC: "z" } }
    ],
    ["{{ a-b-c }}", false, { name: "a-b-c" }],
    ["{{ a='123' b='456' }}", false, { name: "a", attr: { b: "456" } }],
    [
      "{{ a='123' _fallback='test' }}",
      false,
      { name: "a", attr: { _fallback: "test" } }
    ],

    [
      "{{ a='123' _fallback='test' }}",
      true,
      { name: "{{ a='123' _fallback='test' }}" }
    ],
    [
      "{{ UserInfo['asdasdasd'] _fallback='test' }}",
      true,
      { name: "{{ UserInfo['asdasdasd'] _fallback='test' }}" }
    ]
  ])("Valid str %#", (str, useCustomPlaceholder, expected) => {
    expect(placeholderObjFromStr(str, useCustomPlaceholder)).toStrictEqual(
      expected
    );
  });
});

describe("Testing 'placeholderObjFromECKeyDCInfo' function", () => {
  test.each<[ECKeyDCInfo, boolean, DCPlaceholderObj | undefined]>([
    [
      {
        key: "test",
        hasDC: false,
        staticValue: "test static",
        dcValue: "",
        fallback: "",
        attr: {}
      },
      false,
      undefined
    ],
    [
      {
        key: "test",
        hasDC: false,
        staticValue: "test static",
        dcValue: "{{ test_placeholder }}",
        fallback: "",
        attr: {}
      },
      false,
      undefined
    ],
    [
      {
        key: "test",
        hasDC: true,
        staticValue: "test static",
        dcValue: "{{ test_placeholder }}",
        fallback: "",
        attr: {}
      },
      false,
      {
        name: "test_placeholder",
        attr: {}
      }
    ],
    [
      {
        key: "test",
        hasDC: true,
        staticValue: "test static",
        dcValue: "{{ test_placeholder }}",
        fallback: "fb",
        attr: {}
      },
      false,
      {
        name: "test_placeholder",
        attr: { _fallback: "fb" }
      }
    ],
    [
      {
        key: "test",
        hasDC: true,
        staticValue: "test static",
        dcValue: "{{ test_placeholder }}",
        fallback: "fb",
        attr: {
          a: undefined,
          b: 123,
          c: "qwerty"
        }
      },
      false,
      {
        name: "test_placeholder",
        attr: {
          _fallback: "fb",
          a: undefined,
          b: 123,
          c: "qwerty"
        }
      }
    ],

    [
      {
        key: "test",
        hasDC: true,
        staticValue: "test static",
        dcValue: "{{ UserInfo['admin'] }}",
        fallback: "fb",
        attr: {}
      },
      true,
      {
        name: "{{ UserInfo['admin'] }}",
        attr: {
          _fallback: "fb"
        }
      }
    ],
    [
      {
        key: "test",
        hasDC: true,
        staticValue: "test static",
        dcValue: "[[ UserInfo['3'] attr ]]",
        fallback: "",
        attr: {}
      },
      true,
      {
        name: "[[ UserInfo['3'] attr ]]",
        attr: {}
      }
    ]
  ])("no. %#", (keyDCInfo, useCustomPlaceholder, expected) => {
    expect(
      placeholderObjFromECKeyDCInfo(keyDCInfo, useCustomPlaceholder)
    ).toStrictEqual(expected);
  });
});

describe("Testing 'placeholderObjToStr' function", () => {
  test.each<[DCPlaceholderObj, boolean, string]>([
    [{ name: "a" }, false, "{{a}}"],
    [{ name: "b", attr: {} }, false, "{{b}}"],
    [
      { name: "c", attr: { a: undefined, b: null, c: [1, 2, 3], d: () => {} } },
      false,
      "{{c}}"
    ],
    [{ name: "d", attr: { a: "", b: undefined } }, false, "{{d a=''}}"],
    [
      { name: "efg", attr: { a: "abc", b: 123 } },
      false,
      "{{efg a='abc' b='123'}}"
    ],
    [
      {
        name: "h_i_j",
        attr: { x: 777, c: "xxx", b: "abc", a: 123, _fallback: "fb" }
      },
      false,
      "{{h_i_j _fallback='fb' a='123' b='abc' c='xxx' x='777'}}"
    ],
    [
      { name: "test", attr: { placeholder: "This is O'reilly book" } },
      false,
      "{{test placeholder='This%20is%20O%27reilly%20book'}}"
    ],
    [{ name: "{{UserAttribute['test']}}" }, true, "{{UserAttribute['test']}}"],
    [
      { name: "{{UserAttribute['test']}}", attr: { a: "", b: undefined } },
      true,
      "{{UserAttribute['test']}}"
    ]
  ])("no. %#", (placeholderObj, useCustomPlaceholder, expected) => {
    expect(
      placeholderObjToStr(placeholderObj, useCustomPlaceholder)
    ).toStrictEqual(expected);
  });
});

describe("Testing 'isPlaceholderStr' function", () => {
  test.each([
    ["", false, false],
    ["invalid string", false, false],
    ["{", false, false],
    ["}", false, false],
    ["{ test", false, false],
    ["test }", false, false],
    ["{ test }", false, false],
    ["{{", false, false],
    ["}}", false, false],
    ["{{ test", false, false],
    ["test }}", false, false],
    ["{{ test }", false, false],
    ["{ test }}", false, false],
    ["a='123' b='456'", false, false],
    ["{ a='123' b='456' }", false, false],

    ["{{a}}", false, true],
    ["{{  a       }}", false, true],
    ["{{ a }}", false, true],
    ["{{a a='123' b='abc'}}", false, true],
    ["{{a a='123' b='abc' c='fp'}}", false, true],
    ["{{a _fallback='Test fallback'}}", false, true],
    ["{{a _fallback='fb' a='aaa' x='xxx'}}", false, true],
    ["{{ UserAttr['asdasd'] }}", true, true],
    ["[[ a ]]", true, true]
  ])("no. %#", (str, useCustomPlaceholder, expected) => {
    expect(isPlaceholderStr(str, useCustomPlaceholder)).toStrictEqual(expected);
  });
});

//#endregion

describe("Testing 'dcApiProxyTestFetcher' function", () => {
  test.each([
    //#region simple (no attr, no fallback)
    [
      {
        "123": ["{{ a }}"]
      },
      false,
      {
        "123": ["123_a"]
      }
    ],
    [
      {
        "123": ["{{b}}"]
      },
      false,
      {
        "123": ["123_b"]
      }
    ],
    [
      {
        "123": ["{{a}}", "{{ b }}"]
      },
      false,
      {
        "123": ["123_a", "123_b"]
      }
    ],
    [
      {
        "123": ["{{ c }}", "{{ f }}"],
        "1234": ["{{ m }}", "{{ n }}"]
      },
      false,
      {
        "123": ["123_c", "123_f"],
        "1234": ["1234_m", "1234_n"]
      }
    ],
    //#endregion

    //#region with attr
    [
      {
        "123": ["{{ a x='1' }}"]
      },
      false,
      {
        "123": ["123_a_x='1'"]
      }
    ],
    [
      {
        "123": ["{{ a x='1' }}"],
        "1234": ["{{ c c='c' }}", "{{ b y='yyy' z='zzz' }}"]
      },
      false,
      {
        "123": ["123_a_x='1'"],
        "1234": ["1234_c_c='c'", "1234_b_y='yyy'_z='zzz'"]
      }
    ],
    //#endregion

    //#region with fallback
    [
      {
        "123": ["{{ a _fallback='fb1' }}", "{{ a abc='123' _fallback='fb2'}}"]
      },
      false,
      {
        "123": ["123_a", "123_a_abc='123'"]
      }
    ],
    [
      {
        "123": [
          "{{ a _fallback='fb1' _useFallback='true' }}",
          "{{ a abc='123' _fallback='fb2' _useFallback='true'}}"
        ]
      },
      false,
      {
        "123": ["123_fb1", "123_fb2"]
      }
    ],
    //#endregion

    //#region empty
    [
      {
        "123": ["{{ _empty_ }}"],
        "124": ["{{ _empty_ a='123' b='456' }}"],
        "125": ["{{ _empty_ _fallback='fb' _useFallback='true' }}"]
      },
      false,
      {
        "123": [""],
        "124": [""],
        "125": [""]
      }
    ],
    //#endregion

    //#region Custom Placeholder
    [
      {
        "123": ["{{ _empty_ }}"],
        "124": ["{{ userInfo['asdasdasd'] }}"],
        "125": ["{{ userInfo['asdasdasd'] asdasd }}"]
      },
      true,
      {
        "123": ["123_{{ _empty_ }}"],
        "124": ["124_{{ userInfo['asdasdasd'] }}"],
        "125": ["125_{{ userInfo['asdasdasd'] asdasd }}"]
      }
    ]
    //#endregion
  ])("no. %#", async (placeholdersByPostId, useCustomPlaceholder, expected) => {
    const r = await dcApiProxyTestFetcher({
      placeholders: placeholdersByPostId,
      useCustomPlaceholder
    });

    expect(r).toStrictEqual(expected);
  });
});
