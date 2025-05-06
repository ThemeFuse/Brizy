import { Base64 } from "js-base64";
import {
  ConfigCommon,
  Mode
} from "visual/global/Config/types/configs/ConfigCommon";
import { V } from "visual/types";
import {
  DCPlaceholderObj,
  placeholderName
} from "visual/utils/dynamicContent/types";
import { ECKeyDCInfo } from "../../types";
import {
  dcApiProxyTestFetcher,
  dcKeyToKey,
  hasDC,
  isDCKey,
  keyDCInfo,
  keyToDCAttrKey,
  keyToDCEntityIdKey,
  keyToDCEntityTypeKey,
  keyToDCFallback2Key,
  keyToDCKey,
  placeholderObjFromECKeyDCInfo
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

describe("Testing 'keyToDCEntityIdKey' function", () => {
  test.each([
    ["test", "testPopulationEntityId"],
    ["abc", "abcPopulationEntityId"]
  ])("test %#", (key, expected) => {
    expect(keyToDCEntityIdKey(key)).toStrictEqual(expected);
  });
});

describe("Testing 'keyToDCEntityTypeKey' function", () => {
  test.each([
    ["test", "testPopulationEntityType"],
    ["abc", "abcPopulationEntityType"]
  ])("test %#", (key, expected) => {
    expect(keyToDCEntityTypeKey(key)).toStrictEqual(expected);
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
    ],
    [
      {
        test: "test static",
        testPopulation: "{{ test_placeholder }}",
        testPopulationFallback2: "test fallback2",
        testPopulationEntityId: "11",
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
        entityId: "11",
        attr: {
          a: 123,
          b: "abc"
        }
      }
    ],
    [
      {
        test: "test static",
        testPopulation: "{{ test_placeholder }}",
        testPopulationFallback2: "test fallback2",
        testPopulationEntityId: "111",
        testPopulationEntityType: "22",
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
        entityId: "111",
        entityType: "22",
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
        dcValue: "{{ placeholder }}",
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
        name: placeholderName,
        attr: {},
        content: "{{ test_placeholder }}"
      }
    ],
    [
      {
        key: "test",
        hasDC: true,
        staticValue: "test static",
        dcValue: "{{ test_placeholder }}",
        fallback: "fb",
        entityId: "11",
        entityType: "22",
        attr: {}
      },
      {
        name: placeholderName,
        attr: { _fallback: "fb", entityId: "11", entityType: "22" },
        content: "{{ test_placeholder }}"
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
        name: placeholderName,
        content: "{{ test_placeholder }}",
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
        dcValue: "{{ test_placeholder }}",
        fallback: "fb",
        entityId: "11",
        entityType: "111",
        attr: {
          a: undefined,
          b: 123,
          c: "qwerty"
        }
      },
      {
        name: placeholderName,
        content: "{{ test_placeholder }}",
        attr: {
          _fallback: "fb",
          entityId: "11",
          entityType: "111",
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

//#endregion

export const mockConfigCommon: ConfigCommon = {
  branding: {
    name: "brizy"
  },
  user: {
    isGuest: false,
    isAuthorized: false,
    role: "admin"
  },
  editorVersion: "1",
  mode: Mode.page,
  taxonomies: [],
  postTypesTaxs: [],
  imageSizes: [],
  project: {
    id: "",
    heartBeatInterval: 1,
    status: {
      locked: false,
      lockedBy: false
    }
  },
  server: {
    maxUploadFileSize: 40
  },
  container: {
    id: 545
  },
  onUpdate: () => {},
  onCompile: () => {}
};

describe("Testing 'dcApiProxyTestFetcher' function", () => {
  const c = Base64.encode("22a");

  test.each([
    //#region simple (no attr, no fallback)
    [
      {
        "123": [`{{ ${placeholderName} content='${c}' }}`]
      },
      {
        "123": [`123_${Base64.decode(c)}`]
      }
    ],
    [
      {
        "123": [`{{${placeholderName} content='${c}'}}`]
      },
      {
        "123": [`123_${Base64.decode(c)}`]
      }
    ],
    [
      {
        "123": [
          `{{${placeholderName} content='${c}'}}`,
          `{{ ${placeholderName} content='${c}'}}`
        ]
      },
      {
        "123": [`123_${Base64.decode(c)}`, `123_${Base64.decode(c)}`]
      }
    ],
    [
      {
        "123": [
          `{{ ${placeholderName} content='${c}'}}`,
          `{{ ${placeholderName} content='${c}' }}`
        ],
        "1234": [
          `{{ ${placeholderName} content='${c}' }}`,
          `{{ ${placeholderName} content='${c}' }}`
        ]
      },
      {
        "123": [`123_${Base64.decode(c)}`, `123_${Base64.decode(c)}`],
        "1234": [`1234_${Base64.decode(c)}`, `1234_${Base64.decode(c)}`]
      }
    ],
    //#endregion

    //#region with attr
    [
      {
        "123": [`{{ ${placeholderName} content='${c}' x='1' }}`]
      },
      {
        "123": [`123_${Base64.decode(c)}_x='1'`]
      }
    ],
    [
      {
        "123": [`{{ ${placeholderName} content='${c}' x='1' }}`],
        "1234": [
          `{{ ${placeholderName} content='${c}' c='c' }}`,
          `{{ ${placeholderName} content='${c}' y='yyy' z='zzz' }}`
        ]
      },
      {
        "123": [`123_${Base64.decode(c)}_x='1'`],
        "1234": [
          `1234_${Base64.decode(c)}_c='c'`,
          `1234_${Base64.decode(c)}_y='yyy'_z='zzz'`
        ]
      }
    ],
    //#endregion

    //#region with fallback
    [
      {
        "123": [
          `{{ ${placeholderName} content='${c}' _fallback='fb1' }}`,
          `{{ ${placeholderName} content='${c} 'abc='123' _fallback='fb2'}}`
        ]
      },
      {
        "123": [`123_${Base64.decode(c)}`, `123_${Base64.decode(c)}_abc='123'`]
      }
    ],
    [
      {
        "123": [
          `{{ ${placeholderName} content='${c}' _fallback='fb1' _useFallback='true' }}`,
          `{{ ${placeholderName} content='${c}' abc='123' _fallback='fb2' _useFallback='true'}}`
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
        "125": ["{{ _empty_ _fallback='fb' _useFallback='true' }}"],
        "126": [`{{ ${placeholderName} _fallback='fb' }}`],
        "127": [`{{ content='${c}' _fallback='fb' _useFallback='true' }}`]
      },
      {
        "123": [""],
        "124": [""],
        "125": [""],
        "126": [""],
        "127": [""]
      }
    ]
    //#endregion
  ])("no. %#", async (placeholdersByPostId, expected) => {
    const r = await dcApiProxyTestFetcher({
      placeholders: placeholdersByPostId,
      config: mockConfigCommon
    });

    expect(r).toStrictEqual(expected);
  });
});
