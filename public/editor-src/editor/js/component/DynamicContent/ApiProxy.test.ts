import { ApiProxy } from "./ApiProxy";

describe("Testing 'getDynamicContent' method", function() {
  beforeAll(() => {
    ApiProxy.fetcher = ({ placeholders }) => {
      const fakePlaceholdersMap: { [k: string]: string } = {
        "{{ a }}": "a",
        "{{ b }}": "b",
        "{{ c }}": "c",
        "{{ d }}": "d"
      };

      return Promise.resolve(
        placeholders.map(p => fakePlaceholdersMap[p] ?? "")
      );
    };
  });
  beforeEach(() => {
    ApiProxy.cache.clear();
    ApiProxy.pendingFetches.clear();
  });

  test("Should work with fake fetcher", async () => {
    const dc = await ApiProxy.getDynamicContent(["{{ a }}", "{{ c }}"]);

    expect(dc).toEqual(["a", "c"]);
  });

  test("Should cache responses", async () => {
    const dc = await ApiProxy.getDynamicContent(["{{ a }}", "{{ c }}"]);
    const cacheEntries = Array.from(ApiProxy.cache.entries());

    expect(dc).toEqual(["a", "c"]);
    expect(cacheEntries).toEqual([
      ["{{ a }}", "a"],
      ["{{ c }}", "c"]
    ]);
  });

  // although this is an implementation detail, I have decided to still test it
  // because it's important to make as little fetches as possible
  test("Should set pending requests", async () => {
    ApiProxy.clearPendingFetchesWhenDone = false;
    ApiProxy.fetcher = jest.fn(ApiProxy.fetcher);

    await ApiProxy.getDynamicContent(["{{ a }}", "{{ c }}"]); // fetcherCalls++ (first time)
    await ApiProxy.getDynamicContent(["{{ c }}", "{{ a }}"]);
    await ApiProxy.getDynamicContent(["{{ a }}"]);
    await ApiProxy.getDynamicContent(["{{ c }}"]);
    await ApiProxy.getDynamicContent(["{{ c }}", "{{ d }}"]); // fetcherCalls++ (because of {{ d }})
    await ApiProxy.getDynamicContent(["{{ d }}"]);

    // @ts-ignore
    expect(ApiProxy.fetcher.mock.calls.length).toBe(2);
    // @ts-ignore
    expect(ApiProxy.fetcher.mock.calls[0][0].placeholders).toEqual([
      "{{ a }}",
      "{{ c }}"
    ]);
    // @ts-ignore
    expect(ApiProxy.fetcher.mock.calls[1][0].placeholders).toEqual(["{{ d }}"]);
  });
});
