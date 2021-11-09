import { V } from "visual/types";
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
  test.each([
    [""],
    ["invalid string"],
    ["{"],
    ["}"],
    ["{ test"],
    ["test }"],
    ["{ test }"],
    ["{{"],
    ["}}"],
    ["{{ test"],
    ["test }}"],
    ["{{ test }"],
    ["{ test }}"],
    ["a='123' b='456'"],
    ["{ a='123' b='456' }"]
  ])("Invalid str %#", str => {
    expect(placeholderObjFromStr(str)).toStrictEqual(undefined);
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
    ["{{ a='123' b='456' }}", { name: "a", attr: { b: "456" } }]
  ])("Valid str %#", (str, expected) => {
    expect(placeholderObjFromStr(str)).toStrictEqual(expected);
  });
});

describe("Testing 'placeholderObjFromECKeyDCInfo' function", () => {
  test.each<[ECKeyDCInfo, DCPlaceholderObj | undefined]>([
    [
      {
        key: "test",
        hasDC: false,
        staticValue: "test static",
        dcValue: "",
        fallback: "",
        attr: {}
      },
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
      {
        name: "test_placeholder",
        attr: {
          _fallback: "fb",
          a: undefined,
          b: 123,
          c: "qwerty"
        }
      }
    ]
  ])("no. %#", (keyDCInfo, expected) => {
    expect(placeholderObjFromECKeyDCInfo(keyDCInfo)).toStrictEqual(expected);
  });
});

describe("Testing 'placeholderObjToStr' function", () => {
  test.each<[DCPlaceholderObj, string]>([
    [{ name: "a" }, "{{a}}"],
    [{ name: "b", attr: {} }, "{{b}}"],
    [
      { name: "c", attr: { a: undefined, b: null, c: [1, 2, 3], d: () => {} } },
      "{{c}}"
    ],
    [{ name: "d", attr: { a: "", b: undefined } }, "{{d a=''}}"],
    [{ name: "efg", attr: { a: "abc", b: 123 } }, "{{efg a='abc' b='123'}}"],
    [
      {
        name: "h_i_j",
        attr: { x: 777, c: "xxx", b: "abc", a: 123, _fallback: "fb" }
      },
      "{{h_i_j _fallback='fb' a='123' b='abc' c='xxx' x='777'}}"
    ]
  ])("no. %#", (placeholderObj, expected) => {
    expect(placeholderObjToStr(placeholderObj)).toStrictEqual(expected);
  });
});

describe("Testing 'isPlaceholderStr' function", () => {
  test.each([
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

    ["{{a}}", true],
    ["{{  a       }}", true],
    ["{{ a }}", true],
    ["{{a a='123' b='abc'}}", true],
    ["{{a a='123' b='abc' c='fp'}}", true],
    ["{{a _fallback='Test fallback'}}", true],
    ["{{a _fallback='fb' a='aaa' x='xxx'}}", true]
  ])("no. %#", (str, expected) => {
    expect(isPlaceholderStr(str)).toStrictEqual(expected);
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
      {
        "123": ["123_a"]
      }
    ],
    [
      {
        "123": ["{{b}}"]
      },
      {
        "123": ["123_b"]
      }
    ],
    [
      {
        "123": ["{{a}}", "{{ b }}"]
      },
      {
        "123": ["123_a", "123_b"]
      }
    ],
    [
      {
        "123": ["{{ c }}", "{{ f }}"],
        "1234": ["{{ m }}", "{{ n }}"]
      },
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
      {
        "123": ["123_a_x='1'"]
      }
    ],
    [
      {
        "123": ["{{ a x='1' }}"],
        "1234": ["{{ c c='c' }}", "{{ b y='yyy' z='zzz' }}"]
      },
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
      {
        "123": [""],
        "124": [""],
        "125": [""]
      }
    ]
    //#endregion
  ])("no. %#", async (placeholdersByPostId, expected) => {
    const r = await dcApiProxyTestFetcher({
      placeholders: placeholdersByPostId
    });

    expect(r).toStrictEqual(expected);
  });
});
