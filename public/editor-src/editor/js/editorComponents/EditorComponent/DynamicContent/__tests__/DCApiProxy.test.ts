import Base64 from "js-base64";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { BatchFetcher } from "../BatchFetcher";
import { DCApiProxy as DCApiProxy_ } from "../DCApiProxy";
import { DCApiProxyConfig } from "../types";
import { dcApiProxyTestFetcher } from "../utils";

jest.useFakeTimers();

const emptyGlobalConfig = {} as ConfigCommon;
const mockFetcher = () => jest.fn(dcApiProxyTestFetcher);

describe("Testing 'DCApiProxy'", function () {
  const config = (postId: string) => ({
    postId,
    globalConfig: emptyGlobalConfig
  });
  const fetcher = mockFetcher();
  const DCApiProxy = new DCApiProxy_({
    fetcher: new BatchFetcher(fetcher)
  });

  beforeEach(() => {
    DCApiProxy.clearCache();
    fetcher.mockClear();
  });

  test("Should work with fake fetcher", async () => {
    const p1 = DCApiProxy.getDC(
      [
        `{{ placeholder content='${Base64.encode("aa")}' }}`,
        `{{ placeholder content='${Base64.encode("cc")}' }}`
      ],
      config("p1")
    );

    jest.runAllTimers();

    const dc = await p1;

    expect(dc).toEqual(["p1_aa", "p1_cc"]);
  });

  test("Should work with multiple post ids", async () => {
    const p1 = DCApiProxy.getDC(
      [
        `{{ placeholder content='${Base64.encode("a")}' }}`,
        `{{ placeholder content='${Base64.encode("b")}' }}`
      ],
      config("p1")
    );
    const p2 = DCApiProxy.getDC(
      [
        `{{ placeholder content='${Base64.encode("a")}' }}`,
        `{{ placeholder content='${Base64.encode("c")}' }}`
      ],
      config("p2")
    );

    jest.runAllTimers();

    const [dc1, dc2] = await Promise.all([p1, p2]);

    expect(dc1).toEqual(["p1_a", "p1_b"]);
    expect(dc2).toEqual(["p2_a", "p2_c"]);
  });

  test("Should cache responses", async () => {
    const config_ = config("p5");
    const p1 = DCApiProxy.getDC(
      [
        `{{ placeholder content='${Base64.encode("a")}' }}`,
        `{{ placeholder content='${Base64.encode("g")}' }}`
      ],
      config_
    );

    jest.runAllTimers();

    const dc = await p1;

    expect(dc).toEqual(["p5_a", "p5_g"]);
    expect(
      DCApiProxy.getFromCache(
        `{{ placeholder content='${Base64.encode("a")}' }}`,
        config_
      )
    ).toEqual("p5_a");
    expect(
      DCApiProxy.getFromCache(
        `{{ placeholder content='${Base64.encode("g")}' }}`,
        config_
      )
    ).toEqual("p5_g");
  });

  test("Should cache responses with attributes and fallback", async () => {
    const config_ = config("p5");
    const a = Base64.encode("a");
    const p1 = DCApiProxy.getDC(
      [`{{ placeholder content='${a}' x='1' _fallback='fb' }}`],
      config_
    );

    jest.runAllTimers();

    const dc = await p1;

    expect(dc).toEqual(["p5_a_x='1'"]);
    expect(
      DCApiProxy.getFromCache(
        `{{ placeholder content='${a}' x='1' _fallback='fb' }}`,
        config_
      )
    ).toEqual("p5_a_x='1'");

    // same placeholder but with different attributes should need refetch
    expect(
      DCApiProxy.getFromCache(
        `{{ placeholder content='${a}' x='11232323232323232' _fallback='fb' }}`,
        config_
      )
    ).toEqual(undefined);

    // same placeholder but with different fallback should need refetch
    expect(
      DCApiProxy.getFromCache(
        `{{ placeholder content=${a} x='11' _fallback='fb121212121' }}`,
        config_
      )
    ).toEqual(undefined);
  });

  test("Should not cache responses if told so", async () => {
    const config = {
      postId: "p5",
      cache: false,
      globalConfig: emptyGlobalConfig
    };
    const p1 = DCApiProxy.getDC(
      [
        `{{ placeholder content='${Base64.encode("a")}' }}`,
        `{{ placeholder content='${Base64.encode("g")}' }}`
      ],
      config
    );

    jest.runAllTimers();

    const dc = await p1;

    expect(dc).toEqual(["p5_a", "p5_g"]);
    expect(
      DCApiProxy.getFromCache(
        `{{ placeholder content='${Base64.encode("a")}' }}`,
        config
      )
    ).toBe(undefined);
    expect(
      DCApiProxy.getFromCache(
        `{{ placeholder content='${Base64.encode("g")}' }}`,
        config
      )
    ).toBe(undefined);
  });

  test("Should fetch only when needed", async () => {
    const p1 = DCApiProxy.getDC(
      [
        `{{ placeholder content='${Base64.encode("a")}' }}`,
        `{{ placeholder content='${Base64.encode("c")}' }}`
      ],
      config("p1")
    );
    jest.runAllTimers();
    await p1; // fetcherCalls++ (first time)

    const p2 = DCApiProxy.getDC(
      [
        `{{ placeholder content='${Base64.encode("c")}' }}`,
        `{{ placeholder content='${Base64.encode("a")}' }}`
      ],
      config("p1")
    );
    jest.runAllTimers();
    await p2; // should get from cache

    const p3 = DCApiProxy.getDC(
      [`{{ placeholder content='${Base64.encode("a")}' }}`],
      config("p1")
    );
    jest.runAllTimers();
    await p3; // should get from cache

    const p4 = DCApiProxy.getDC(
      [`{{ placeholder content='${Base64.encode("c")}' }}`],
      config("p1")
    );
    jest.runAllTimers();
    await p4; // should get from cache

    const p5 = DCApiProxy.getDC(
      [
        `{{ placeholder content='${Base64.encode("c")}' }}`,
        `{{ placeholder content='${Base64.encode("d")}' }}`
      ],
      config("p1")
    );
    jest.runAllTimers();
    await p5; // fetcherCalls++ (because of {{ d }})

    const p6 = DCApiProxy.getDC(
      [`{{ placeholder content='${Base64.encode("d")}' }}`],
      config("p1")
    );
    jest.runAllTimers();
    await p6; // should get from cache

    expect(fetcher.mock.calls.length).toBe(2);
  });
});

describe("Testing 'BatchFetcher'", () => {
  interface BatchFetcherTestArgs {
    getDCArgs: [string[], DCApiProxyConfig][];
    expectedResults: string[][];
    expectedPlaceholders: { [postId: string]: string[] };
  }

  const config: (postId: string) => DCApiProxyConfig = (postId) => ({
    postId,
    globalConfig: emptyGlobalConfig
  });

  test.each<[BatchFetcherTestArgs]>([
    //#region 1 postId
    [
      {
        getDCArgs: [
          [[`{{ placeholder content='${Base64.encode("a")}' }}`], config("p1")],
          [
            [
              `{{ placeholder content='${Base64.encode("b")}' }}`,
              `{{ placeholder content='${Base64.encode("c")}' }}`
            ],
            config("p1")
          ],
          [[`{{ placeholder content='${Base64.encode("d")}' }}`], config("p1")]
        ],
        expectedResults: [["p1_a"], ["p1_b", "p1_c"], ["p1_d"]],
        expectedPlaceholders: {
          p1: [
            `{{ placeholder content='${Base64.encode("a")}' }}`,
            `{{ placeholder content='${Base64.encode("b")}' }}`,
            `{{ placeholder content='${Base64.encode("c")}' }}`,
            `{{ placeholder content='${Base64.encode("d")}' }}`
          ]
        }
      }
    ],
    [
      {
        getDCArgs: [
          [
            [
              `{{ placeholder content='${Base64.encode("c")}' }}`,
              `{{ placeholder content='${Base64.encode("f")}' }}`
            ],
            config("p1")
          ],
          [
            [
              `{{ placeholder content='${Base64.encode("a")}' }}`,
              `{{ placeholder content='${Base64.encode("g")}' }}`,
              `{{ placeholder content='${Base64.encode("d")}' }}`
            ],
            config("p1")
          ]
        ],
        expectedResults: [
          ["p1_c", "p1_f"],
          ["p1_a", "p1_g", "p1_d"]
        ],
        expectedPlaceholders: {
          p1: [
            `{{ placeholder content='${Base64.encode("c")}' }}`,
            `{{ placeholder content='${Base64.encode("f")}' }}`,
            `{{ placeholder content='${Base64.encode("a")}' }}`,
            `{{ placeholder content='${Base64.encode("g")}' }}`,
            `{{ placeholder content='${Base64.encode("d")}' }}`
          ]
        }
      }
    ],
    //#endregion

    //#region multiple postId
    [
      {
        getDCArgs: [
          [[`{{ placeholder content='${Base64.encode("a")}' }}`], config("p1")],
          [
            [
              `{{ placeholder content='${Base64.encode("b")}' }}`,
              `{{ placeholder content='${Base64.encode("c")}' }}`
            ],
            config("p2")
          ],
          [[`{{ placeholder content='${Base64.encode("d")}' }}`], config("p1")]
        ],
        expectedResults: [["p1_a"], ["p2_b", "p2_c"], ["p1_d"]],
        expectedPlaceholders: {
          p1: [
            `{{ placeholder content='${Base64.encode("a")}' }}`,
            `{{ placeholder content='${Base64.encode("d")}' }}`
          ],
          p2: [
            `{{ placeholder content='${Base64.encode("b")}' }}`,
            `{{ placeholder content='${Base64.encode("c")}' }}`
          ]
        }
      }
    ],
    [
      {
        getDCArgs: [
          [
            [
              `{{ placeholder content='${Base64.encode("c")}' }}`,
              `{{ placeholder content='${Base64.encode("f")}' }}`
            ],
            config("p3")
          ],
          [[`{{ placeholder content='${Base64.encode("a")}' }}`], config("p4")],
          [
            [
              `{{ placeholder content='${Base64.encode("g")}' }}`,
              `{{ placeholder content='${Base64.encode("e")}' }}`,
              `{{ placeholder content='${Base64.encode("h")}' }}`
            ],
            config("p5")
          ]
        ],
        expectedResults: [["p3_c", "p3_f"], ["p4_a"], ["p5_g", "p5_e", "p5_h"]],
        expectedPlaceholders: {
          p3: [
            `{{ placeholder content='${Base64.encode("c")}' }}`,
            `{{ placeholder content='${Base64.encode("f")}' }}`
          ],
          p4: [`{{ placeholder content='${Base64.encode("a")}' }}`],
          p5: [
            `{{ placeholder content='${Base64.encode("g")}' }}`,
            `{{ placeholder content='${Base64.encode("e")}' }}`,
            `{{ placeholder content='${Base64.encode("h")}' }}`
          ]
        }
      }
    ],
    //#endregion

    //#region duplicates
    [
      {
        getDCArgs: [
          [
            [
              `{{ placeholder content='${Base64.encode("a")}' }}`,
              `{{ placeholder content='${Base64.encode("a")}' }}`
            ],
            config("p1")
          ],
          [
            [
              `{{ placeholder content='${Base64.encode("a")}' }}`,
              `{{ placeholder content='${Base64.encode("a")}' }}`,
              `{{ placeholder content='${Base64.encode("a")}' }}`
            ],
            config("p1")
          ]
        ],
        expectedResults: [
          ["p1_a", "p1_a"],
          ["p1_a", "p1_a", "p1_a"]
        ],
        expectedPlaceholders: {
          p1: [`{{ placeholder content='${Base64.encode("a")}' }}`]
        }
      }
    ],
    [
      {
        getDCArgs: [
          [
            [
              `{{ placeholder content='${Base64.encode("a")}' }}`,
              `{{ placeholder content='${Base64.encode("b")}' }}`
            ],
            config("p1")
          ],
          [
            [
              `{{ placeholder content='${Base64.encode("b")}' }}`,
              `{{ placeholder content='${Base64.encode("a")}' }}`
            ],
            config("p1")
          ]
        ],
        expectedResults: [
          ["p1_a", "p1_b"],
          ["p1_b", "p1_a"]
        ],
        expectedPlaceholders: {
          p1: [
            `{{ placeholder content='${Base64.encode("a")}' }}`,
            `{{ placeholder content='${Base64.encode("b")}' }}`
          ]
        }
      }
    ],
    [
      {
        getDCArgs: [
          [
            [
              `{{ placeholder content='${Base64.encode("a")}' }}`,
              `{{ placeholder content='${Base64.encode("b")}' }}`
            ],
            config("p1")
          ],
          [
            [
              `{{ placeholder content='${Base64.encode("a")}' }}`,
              `{{ placeholder content='${Base64.encode("a")}' }}`
            ],
            config("p1")
          ]
        ],
        expectedResults: [
          ["p1_a", "p1_b"],
          ["p1_a", "p1_a"]
        ],
        expectedPlaceholders: {
          p1: [
            `{{ placeholder content='${Base64.encode("a")}' }}`,
            `{{ placeholder content='${Base64.encode("b")}' }}`
          ]
        }
      }
    ],
    [
      {
        getDCArgs: [
          [
            [
              `{{ placeholder content='${Base64.encode("b")}' }}`,
              `{{ placeholder content='${Base64.encode("b")}' }}`
            ],
            config("p1")
          ],
          [
            [
              `{{ placeholder content='${Base64.encode("b")}' }}`,
              `{{ placeholder content='${Base64.encode("a")}' }}`
            ],
            config("p1")
          ]
        ],
        expectedResults: [
          ["p1_b", "p1_b"],
          ["p1_b", "p1_a"]
        ],
        expectedPlaceholders: {
          p1: [
            `{{ placeholder content='${Base64.encode("b")}' }}`,
            `{{ placeholder content='${Base64.encode("a")}' }}`
          ]
        }
      }
    ],
    [
      {
        getDCArgs: [
          [
            [
              `{{ placeholder content='${Base64.encode("a")}' }}`,
              `{{ placeholder content='${Base64.encode("b")}' }}`,
              `{{ placeholder content='${Base64.encode("c")}' }}`
            ],
            config("p1")
          ],
          [[`{{ placeholder content='${Base64.encode("c")}' }}`], config("p1")],
          [
            [
              `{{ placeholder content='${Base64.encode("b")}' }}`,
              `{{ placeholder content='${Base64.encode("d")}' }}`
            ],
            config("p1")
          ]
        ],
        expectedResults: [["p1_a", "p1_b", "p1_c"], ["p1_c"], ["p1_b", "p1_d"]],
        expectedPlaceholders: {
          p1: [
            `{{ placeholder content='${Base64.encode("a")}' }}`,
            `{{ placeholder content='${Base64.encode("b")}' }}`,
            `{{ placeholder content='${Base64.encode("c")}' }}`,
            `{{ placeholder content='${Base64.encode("d")}' }}`
          ]
        }
      }
    ]
    //#endregion
  ])(
    "Testing duplicates",
    async ({ getDCArgs, expectedResults, expectedPlaceholders }) => {
      const fetcher = mockFetcher();
      const batchFetcher = new BatchFetcher(fetcher);
      const promises = getDCArgs.map(([args, config]) =>
        batchFetcher.getDC(args, config)
      );

      jest.runAllTimers();

      const getDCResponses = await Promise.all(promises);

      expect(getDCResponses).toEqual(expectedResults);
      expect(fetcher.mock.calls.length).toBe(1);
      expect(fetcher.mock.calls[0][0].placeholders).toStrictEqual(
        expectedPlaceholders
      );
    }
  );
});
