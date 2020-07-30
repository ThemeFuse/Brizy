import { times } from "underscore";
import {
  toElementValue,
  toPosts,
  trimTitle
} from "visual/component/Options/types/dev/InternalLink/utils";
import { Post } from "visual/component/Options/types/dev/InternalLink/types/Post";

describe("Testing 'trimTitle' function", function() {
  test("if title length > 24, slice to 23 characters and suffix with '...'", () => {
    const title = "QWERTYUIOPASDFGHJKLZXCVBNM";
    expect(trimTitle(title)).toBe("QWERTYUIOPASDFGHJKLZXCV...");
  });

  test("if title length <= 24, return original string", () => {
    const title = "QWERTYUIOPASDFGHJKLZXCV";
    expect(trimTitle(title)).toBe(title);
  });
});

describe("Testing 'toPosts' function", function() {
  test("If value is not an object, return undefined", () => {
    const values = [undefined, null, [], 1, "1"];
    values.map(v => expect(toPosts(v)).toBe(undefined));
  });

  test("If value has not property posts, return undefined", () => {
    const v = {};
    expect(toPosts(v)).toBe(undefined);
  });

  test("If property posts is not an array, return undefined", () => {
    const values = [undefined, null, 1, "1"];
    values.map(posts => expect(toPosts({ posts })).toBe(undefined));
  });

  test("If at least one post is invalid, return undefined", () => {
    const posts = [
      { ID: 1, title: "test1" },
      { id: 2, title: [] },
      { id: "test", title: "test 3" }
    ];
    expect(toPosts({ posts })).toBe(undefined);
  });

  test("Return a list of posts", () => {
    const posts = [
      { ID: 1, title: "test1" },
      { ID: 2, title: "test 2" },
      { ID: 3, title: "test 3" }
    ];

    const r = [
      { id: 1, title: "test1" },
      { id: 2, title: "test 2" },
      { id: 3, title: "test 3" }
    ];
    expect(toPosts({ posts })).toEqual(r);
  });
});

describe("Testing 'toElementValue' function", function() {
  test("Should change the id field to value field", () => {
    const items: Post[] = times(10, n => ({ id: n, title: `Test ${n}` }));

    items.map(p =>
      expect(toElementValue(p)).toEqual({ value: p.id, title: p.title })
    );
  });
});
