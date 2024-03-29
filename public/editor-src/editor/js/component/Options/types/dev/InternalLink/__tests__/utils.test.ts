import { trimTitle } from "visual/component/Controls/InternalLink/utils";
import { toPosts } from "visual/component/Options/types/dev/InternalLink/utils";

describe("Testing 'trimTitle' function", function () {
  test("if title length > 24, slice to 23 characters and suffix with '...'", () => {
    const title = "QWERTYUIOPASDFGHJKLZXCVBNM";
    expect(trimTitle(title)).toBe("QWERTYUIOPASDFGHJKLZXCV...");
  });

  test("if title length <= 24, return original string", () => {
    const title = "QWERTYUIOPASDFGHJKLZXCV";
    expect(trimTitle(title)).toBe(title);
  });
});

describe("Testing 'toPosts' function", function () {
  test("If value is not an object, return undefined", () => {
    const values = [undefined, null, [], 1, "1"];
    values.map((v) => expect(toPosts(v)).toBe(undefined));
  });

  test("If value has not property posts, return undefined", () => {
    const v = {};
    expect(toPosts(v)).toBe(undefined);
  });

  test("If property posts is not an array, return undefined", () => {
    const values = [undefined, null, 1, "1"];
    values.map((posts) => expect(toPosts({ posts })).toBe(undefined));
  });

  test("If at least one post is invalid, return undefined", () => {
    const posts = [
      { value: 1, title: "test1" },
      { value: 2, title: [] },
      { value: "test", title: "test 3" }
    ];
    expect(toPosts({ posts })).toBe(undefined);
  });

  test("Return a list of posts", () => {
    const posts = [
      { title: "test1", value: "1" },
      { title: "test 2", value: "2" },
      { title: "test 3", value: "3" }
    ];

    const r = [
      { title: "test1", value: "1" },
      { title: "test 2", value: "2" },
      { title: "test 3", value: "3" }
    ];
    expect(toPosts({ posts })).toEqual(r);
  });
});
