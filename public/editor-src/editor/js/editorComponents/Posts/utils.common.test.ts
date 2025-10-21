import { V, VDecoded } from "./types";
import { decodeV } from "./utils.common";

describe("Testing 'decodeV' function", () => {
  test("empty", () => {
    const decoded: VDecoded = {
      type: "",
      gridRow: 1,
      gridColumn: 1,
      source: "",
      querySource: "",
      offset: 0,
      orderBy: "",
      order: "",
      symbols: {}
    };

    expect(decodeV({})).toEqual(decoded);
  });

  test("not empty", () => {
    const v: V = {
      type: "posts",
      gridRow: 1,
      gridColumn: 2,
      source: "blog",
      querySource: "post",
      offset: 3,
      orderBy: "title",
      order: "DESC",
      symbols: {
        blog_incBy: '["manual","/collection_types/191"]',
        blog_inc_manual: '["/collection_items/174"]',
        "blog_inc_/collection_types/191":
          '["/collection_items/57","/collection_items/181"]',
        page_incBy: "[]"
      }
    };
    const decoded: VDecoded = {
      type: "posts",
      gridRow: 1,
      gridColumn: 2,
      source: "blog",
      querySource: "post",
      offset: 3,
      orderBy: "title",
      order: "DESC",
      symbols: {
        blog_incBy: ["manual", "/collection_types/191"],
        blog_inc_manual: ["/collection_items/174"],
        "blog_inc_/collection_types/191": [
          "/collection_items/57",
          "/collection_items/181"
        ],
        page_incBy: []
      }
    };

    expect(decodeV(v)).toEqual(decoded);
  });
});
