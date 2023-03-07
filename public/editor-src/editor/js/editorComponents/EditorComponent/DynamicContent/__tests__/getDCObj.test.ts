import { EditorComponentContextValue } from "../../EditorComponentContext";
import { ECKeyDCInfo } from "../../types";
import { BatchFetcher, DCApiProxy, DCApiProxyConfig } from "../DCApiProxy";
import {
  DCObjComplete,
  DCObjIncomplete,
  getDCObjEditor_,
  getDCObjPreview
} from "../getDCObj";
import { dcApiProxyTestFetcher } from "../utils";

jest.useFakeTimers();

describe("Testing 'getDCObjPreview' function", () => {
  test.each<[ECKeyDCInfo[], DCObjComplete]>([
    //#region hasDC === false
    [
      [
        {
          key: "a",
          hasDC: false,
          staticValue: "a static",
          dcValue: "",
          fallback: "",
          attr: {}
        }
      ],
      {
        type: "complete",
        value: {},
        details: {}
      }
    ],
    //#endregion

    //#region attr-, fallback-
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_excerpt}}",
          attr: {},
          fallback: undefined
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{post_excerpt}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "{{post_excerpt}}"
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{      post_title   some_attr='1234'     }}",
          attr: {},
          fallback: ""
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{post_title some_attr='1234'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "{{post_title some_attr='1234'}}"
          }
        }
      }
    ],
    //#endregion

    //#region attr+, fallback-
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{a}}",
          attr: { a: "abc", b: 123 },
          fallback: ""
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{a a='abc' b='123'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "{{a a='abc' b='123'}}"
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{a att='some attribute'}}",
          attr: { x: "xyz" },
          fallback: ""
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{a att='some%20attribute' x='xyz'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "{{a att='some%20attribute' x='xyz'}}"
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{a att='original}}",
          attr: { att: "changed", x: "xyz" },
          fallback: ""
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{a att='changed' x='xyz'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "{{a att='changed' x='xyz'}}"
          }
        }
      }
    ],
    //#endregion

    //#region attr-, fallback+
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author}}",
          attr: {},
          fallback: "King Arthur"
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{post_author _fallback='King%20Arthur'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "{{post_author _fallback='King%20Arthur'}}"
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author att='history'}}",
          attr: {},
          fallback: "King Arthur"
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{post_author _fallback='King%20Arthur' att='history'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "{{post_author _fallback='King%20Arthur' att='history'}}"
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue:
            "{{  post_author       att=\"history\"        att2='England'      }}",
          attr: {},
          fallback: "King Arthur"
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{post_author _fallback='King%20Arthur' att='history' att2='England'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue:
              "{{post_author _fallback='King%20Arthur' att='history' att2='England'}}"
          }
        }
      }
    ],
    //#endregion

    //#region attr+, fallback+
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author}}",
          attr: { a: "qwerty" },
          fallback: "King Arthur"
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{post_author _fallback='King%20Arthur' a='qwerty'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "{{post_author _fallback='King%20Arthur' a='qwerty'}}"
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author att='history'}}",
          attr: { att: "changed", a: "123", b: "abc" },
          fallback: "King Arthur"
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{post_author _fallback='King%20Arthur' a='123' att='changed' b='abc'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue:
              "{{post_author _fallback='King%20Arthur' a='123' att='changed' b='abc'}}"
          }
        }
      }
    ],
    //#endregion

    //#region multiple keys
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_title}}",
          attr: {},
          fallback: undefined
        },
        {
          key: "b",
          hasDC: true,
          staticValue: "b static",
          dcValue: "{{post_author att='history'}}",
          attr: { y: "tho" },
          fallback: "King Arthur"
        }
      ],
      {
        type: "complete",
        value: {
          a: "{{post_title}}",
          b: "{{post_author _fallback='King%20Arthur' att='history' y='tho'}}"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "{{post_title}}"
          },
          b: {
            loaded: true,
            staticValue: "b static",
            dcValue:
              "{{post_author _fallback='King%20Arthur' att='history' y='tho'}}"
          }
        }
      }
    ]
    //#endregion
  ])("no. %#", (keys, expected) => {
    expect(getDCObjPreview(keys)).toStrictEqual(expected);
  });
});

describe("Testing 'getDCObjEditor_' function", () => {
  const makeEditorComponentContext = (
    itemId: string
  ): EditorComponentContextValue => ({
    dynamicContent: {
      itemId,
      config: {
        image: [],
        link: [],
        richText: [],
        reference: [],
        multiReference: []
      }
    }
  });
  const makeConfig = (postId: string): DCApiProxyConfig => ({ postId });

  test.each<[ECKeyDCInfo[], DCObjComplete]>([
    //#region cache+, value+
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ a }}",
          attr: {},
          fallback: undefined
        }
      ],
      {
        type: "complete",
        value: {
          a: "a-cached"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "a-cached"
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ a }}",
          attr: {},
          fallback: undefined
        },
        {
          key: "b",
          hasDC: true,
          staticValue: "b static",
          dcValue: "{{ b }}",
          attr: {},
          fallback: undefined
        }
      ],
      {
        type: "complete",
        value: {
          a: "a-cached",
          b: "b-cached"
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "a-cached"
          },
          b: {
            loaded: true,
            staticValue: "b static",
            dcValue: "b-cached"
          }
        }
      }
    ],
    //#endregion

    //#region cache+, value- (should be empty string)
    [
      [
        {
          key: "x",
          hasDC: true,
          staticValue: "x static",
          dcValue: "{{ x }}",
          attr: {},
          fallback: undefined
        }
      ],
      {
        type: "complete",
        value: {
          x: ""
        },
        details: {
          x: {
            loaded: true,
            staticValue: "x static",
            dcValue: ""
          }
        }
      }
    ],
    [
      [
        {
          key: "x",
          hasDC: true,
          staticValue: "x static",
          dcValue: "{{ x }}",
          attr: {},
          fallback: undefined
        },
        {
          key: "y",
          hasDC: true,
          staticValue: "y static",
          dcValue: "{{ y }}",
          attr: {},
          fallback: undefined
        }
      ],
      {
        type: "complete",
        value: {
          x: "",
          y: ""
        },
        details: {
          x: {
            loaded: true,
            staticValue: "x static",
            dcValue: ""
          },
          y: {
            loaded: true,
            staticValue: "y static",
            dcValue: ""
          }
        }
      }
    ],
    //#endregion

    //#region mixed
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ a }}",
          attr: {},
          fallback: undefined
        },
        {
          key: "x",
          hasDC: true,
          staticValue: "x static",
          dcValue: "{{ x }}",
          attr: {},
          fallback: undefined
        }
      ],
      {
        type: "complete",
        value: {
          a: "a-cached",
          x: ""
        },
        details: {
          a: {
            loaded: true,
            staticValue: "a static",
            dcValue: "a-cached"
          },
          x: {
            loaded: true,
            staticValue: "x static",
            dcValue: ""
          }
        }
      }
    ]
    //#endregion
  ])("(1) all cached no %#", (dcKeys, expected) => {
    const fetcher = jest.fn(dcApiProxyTestFetcher);
    const apiProxy = new DCApiProxy({
      fetcher: new BatchFetcher(fetcher)
    });
    const postId = "123";
    const context = makeEditorComponentContext(postId);
    const config = makeConfig(context.dynamicContent.itemId);

    for (const l of ["a", "b", "c", "d", "e", "f", "g"]) {
      apiProxy.setInCache(`{{${l}}}`, `${l}-cached`, config);
      apiProxy.setInCache(`{{ ${l} }}`, `${l}-cached`, config);
    }
    for (const l of ["x", "y", "z"]) {
      apiProxy.setInCache(`{{${l}}}`, "", config);
      apiProxy.setInCache(`{{ ${l} }}`, "", config);
    }

    expect(getDCObjEditor_(apiProxy)(dcKeys, context)).toStrictEqual(expected);
    expect(fetcher.mock.calls.length).toEqual(0);
  });

  type Expected2 = {
    incomplete: Pick<DCObjIncomplete, "partialValue" | "details">;
    complete: Pick<DCObjComplete, "value" | "details">;
  };
  test.each<[ECKeyDCInfo[], Expected2]>([
    //#region simple
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ a }}",
          attr: {},
          fallback: undefined
        },
        {
          key: "b",
          hasDC: true,
          staticValue: "b static",
          dcValue: "{{ b att='test' }}",
          attr: {},
          fallback: undefined
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            },
            b: {
              loaded: false,
              staticValue: "b static",
              dcValue: undefined
            }
          }
        },
        complete: {
          value: {
            a: "123_a",
            b: "123_b_att='test'"
          },
          details: {
            a: {
              loaded: true,
              staticValue: "a static",
              dcValue: "123_a"
            },
            b: {
              loaded: true,
              staticValue: "b static",
              dcValue: "123_b_att='test'"
            }
          }
        }
      }
    ],
    //#endregion

    //#region with attr
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ title }}",
          attr: { a: "abc", b: 123 },
          fallback: undefined
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        },
        complete: {
          value: {
            a: "123_title_a='abc'_b='123'"
          },
          details: {
            a: {
              loaded: true,
              staticValue: "a static",
              dcValue: "123_title_a='abc'_b='123'"
            }
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ book author='Smith' }}",
          attr: { about: "peace", year: "1986" },
          fallback: undefined
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        },
        complete: {
          value: {
            a: "123_book_about='peace'_author='Smith'_year='1986'"
          },
          details: {
            a: {
              loaded: true,
              staticValue: "a static",
              dcValue: "123_book_about='peace'_author='Smith'_year='1986'"
            }
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ book author='Smith' }}",
          attr: { author: "changed" },
          fallback: undefined
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        },
        complete: {
          value: {
            a: "123_book_author='changed'"
          },
          details: {
            a: {
              loaded: true,
              staticValue: "a static",
              dcValue: "123_book_author='changed'"
            }
          }
        }
      }
    ],
    //#endregion

    //#region with fallback
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author}}",
          attr: {},
          fallback: "King Arthur"
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        },
        complete: {
          value: {
            a: "123_post_author"
          },
          details: {
            a: {
              loaded: true,
              staticValue: "a static",
              dcValue: "123_post_author"
            }
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author _useFallback='true'}}",
          attr: {},
          fallback: "Arthur"
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        },
        complete: {
          value: {
            a: "123_Arthur"
          },
          details: {
            a: {
              loaded: true,
              staticValue: "a static",
              dcValue: "123_Arthur"
            }
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author _useFallback='true'}}",
          attr: {},
          fallback: "Arthur"
        },
        {
          key: "b",
          hasDC: true,
          staticValue: "b static",
          dcValue: "{{ recommendation }}",
          attr: { goodRead: "yes" },
          fallback: "rec_fallback"
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            },
            b: {
              loaded: false,
              staticValue: "b static",
              dcValue: undefined
            }
          }
        },
        complete: {
          value: {
            a: "123_Arthur",
            b: "123_recommendation_goodRead='yes'"
          },
          details: {
            a: {
              loaded: true,
              staticValue: "a static",
              dcValue: "123_Arthur"
            },
            b: {
              loaded: true,
              staticValue: "b static",
              dcValue: "123_recommendation_goodRead='yes'"
            }
          }
        }
      }
    ]
    //#endregion
  ])("(2) not cached no. %#", async (dcKeys, expected) => {
    const fetcher = jest.fn(dcApiProxyTestFetcher);
    const apiProxy = new DCApiProxy({
      fetcher: new BatchFetcher(fetcher)
    });
    const postId = "123";
    const context = makeEditorComponentContext(postId);

    const incomplete = getDCObjEditor_(apiProxy)(dcKeys, context);
    if (incomplete.type !== "incomplete") {
      throw new Error("obj should be incomplete");
    }
    expect(incomplete.partialValue).toStrictEqual(
      expected.incomplete.partialValue
    );
    expect(incomplete.details).toStrictEqual(expected.incomplete.details);

    const p = incomplete.getComplete();
    jest.runAllTimers();

    const complete = await p;
    expect(complete.type).toStrictEqual("complete");
    expect(complete.value).toEqual(expected.complete.value);
    expect(complete.details).toEqual(expected.complete.details);
  });

  type Expected3 = Expected2;
  test.each<[ECKeyDCInfo[], Expected3]>([
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ a }}",
          attr: {},
          fallback: undefined
        },
        {
          key: "b",
          hasDC: true,
          staticValue: "b static",
          dcValue: "{{ b }}",
          attr: {},
          fallback: undefined
        },
        {
          key: "notCached",
          hasDC: true,
          staticValue: "notCached static",
          dcValue: "{{ placeholder }}",
          attr: {},
          fallback: undefined
        }
      ],
      {
        incomplete: {
          partialValue: {
            a: "a-cached",
            b: "b-cached"
          },
          details: {
            a: {
              loaded: true,
              staticValue: "a static",
              dcValue: "a-cached"
            },
            b: {
              loaded: true,
              staticValue: "b static",
              dcValue: "b-cached"
            },
            notCached: {
              loaded: false,
              staticValue: "notCached static",
              dcValue: undefined
            }
          }
        },
        complete: {
          value: {
            a: "a-cached",
            b: "b-cached",
            notCached: "123_placeholder"
          },
          details: {
            a: {
              loaded: true,
              staticValue: "a static",
              dcValue: "a-cached"
            },
            b: {
              loaded: true,
              staticValue: "b static",
              dcValue: "b-cached"
            },
            notCached: {
              loaded: true,
              staticValue: "notCached static",
              dcValue: "123_placeholder"
            }
          }
        }
      }
    ]
  ])("(3) mixed cache/not cached no. %#", async (dcKeys, expected) => {
    const fetcher = jest.fn(dcApiProxyTestFetcher);
    const apiProxy = new DCApiProxy({
      fetcher: new BatchFetcher(fetcher)
    });
    const postId = "123";
    const context = makeEditorComponentContext(postId);
    const config = makeConfig(context.dynamicContent.itemId);

    for (const l of ["a", "b", "c", "d", "e", "f", "g"]) {
      apiProxy.setInCache(`{{${l}}}`, `${l}-cached`, config);
      apiProxy.setInCache(`{{ ${l} }}`, `${l}-cached`, config);
    }
    for (const l of ["x", "y", "z"]) {
      apiProxy.setInCache(`{{${l}}}`, "", config);
      apiProxy.setInCache(`{{ ${l} }}`, "", config);
    }

    const incomplete = getDCObjEditor_(apiProxy)(dcKeys, context);
    if (incomplete.type !== "incomplete") {
      throw new Error("obj should be incomplete");
    }
    expect(incomplete.partialValue).toStrictEqual(
      expected.incomplete.partialValue
    );
    expect(incomplete.details).toStrictEqual(expected.incomplete.details);

    const p = incomplete.getComplete();
    jest.runAllTimers();

    const complete = await p;
    expect(complete.type).toStrictEqual("complete");
    expect(complete.value).toEqual(expected.complete.value);
    expect(complete.details).toEqual(expected.complete.details);
  });

  type Expected4 = {
    incomplete: Pick<DCObjIncomplete, "partialValue" | "details">;
  };
  test.each<[ECKeyDCInfo[], Expected4]>([
    //#region simple
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ a }}",
          attr: {},
          fallback: undefined
        },
        {
          key: "b",
          hasDC: true,
          staticValue: "b static",
          dcValue: "{{ b att='test' }}",
          attr: {},
          fallback: undefined
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            },
            b: {
              loaded: false,
              staticValue: "b static",
              dcValue: undefined
            }
          }
        }
      }
    ],
    //#endregion

    //#region with attr
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ title }}",
          attr: { a: "abc", b: 123 },
          fallback: undefined
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ book author='Smith' }}",
          attr: { about: "peace", year: "1986" },
          fallback: undefined
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{ book author='Smith' }}",
          attr: { author: "changed" },
          fallback: undefined
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        }
      }
    ],
    //#endregion

    //#region with fallback
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author}}",
          attr: {},
          fallback: "King Arthur"
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author _useFallback='true'}}",
          attr: {},
          fallback: "Arthur"
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            }
          }
        }
      }
    ],
    [
      [
        {
          key: "a",
          hasDC: true,
          staticValue: "a static",
          dcValue: "{{post_author _useFallback='true'}}",
          attr: {},
          fallback: "Arthur"
        },
        {
          key: "b",
          hasDC: true,
          staticValue: "b static",
          dcValue: "{{ recommendation }}",
          attr: { goodRead: "yes" },
          fallback: "rec_fallback"
        }
      ],
      {
        incomplete: {
          partialValue: {},
          details: {
            a: {
              loaded: false,
              staticValue: "a static",
              dcValue: undefined
            },
            b: {
              loaded: false,
              staticValue: "b static",
              dcValue: undefined
            }
          }
        }
      }
    ]
    //#endregion
  ])("(4) not cached + aborted", (dcKeys, expected) => {
    const fetcher = jest.fn(dcApiProxyTestFetcher);
    const apiProxy = new DCApiProxy({
      fetcher: new BatchFetcher(fetcher)
    });
    const postId = "123";
    const context = makeEditorComponentContext(postId);

    const incomplete = getDCObjEditor_(apiProxy)(dcKeys, context);
    if (incomplete.type !== "incomplete") {
      throw new Error("obj should be incomplete");
    }
    expect(incomplete.partialValue).toStrictEqual(
      expected.incomplete.partialValue
    );
    expect(incomplete.details).toStrictEqual(expected.incomplete.details);

    const p = incomplete.getComplete();
    jest.runAllTimers();

    incomplete.abortGetComplete();
    return expect(p).rejects.toBeInstanceOf(Error);
  });
});
