import { identity } from "underscore";
import {
  drop,
  filter,
  findIndex,
  findIndexes,
  indexOf,
  map,
  nextIndex,
  onEmpty,
  pick,
  pred,
  prevIndex,
  read,
  readIndex,
  succ,
  toArray,
  orderByKeys
} from "./index";

describe("Testing 'toArray' function", () => {
  test("Always return same value if it is an valid array", () => {
    [[], [1], [undefined], [null, ""]].map(a => expect(toArray(a)).toBe(a));
  });

  test("Always return empty array for none array values", () => {
    [undefined, null, "", 1, {}].map(a => expect(toArray(a)).toEqual([]));
  });
});

describe("Testing 'onEmpty' function", () => {
  test("Always return the array, is it has at leas one value", () => {
    [[1], [1, 2], [1, 2, 3]].forEach(a =>
      expect(onEmpty([1, 2, 3], a)).toBe(a)
    );
  });

  test("Return the default value, if array is empty", () => {
    const def = [1, 2, 3];
    expect(onEmpty(def, [])).toBe(def);
  });

  test("Always return default value if the array is not a valid array", () => {
    const def = [1, 2, 3];
    [undefined, null, 1, "test", {}].forEach(a =>
      expect(onEmpty(def, a)).toBe(def)
    );
  });
});

describe("Testing 'drop' function", function() {
  test("Remove 1 item", () => {
    expect(drop(0, [1, 2, 3])).toEqual([2, 3]);
  });

  test("Remove 3-rd item", () => {
    expect(drop(2, [1, 2, 3, 4])).toEqual([1, 2, 4]);
  });

  test("If index is lower then 0, return same array", () => {
    expect(drop(-1, [1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  test("If index is higher then array length, return same array", () => {
    expect(drop(5, [1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });
});

describe("Testing 'readIndex' function", function() {
  test("Return undefined if index is not a valid index of the array", () => {
    [-1, -2, 0.5, 7, 8].map(v =>
      expect(readIndex(v, [0, 1, 2, 3])).toBe(undefined)
    );
  });

  test("Return index if index is a valid index of the array", () => {
    [0, 1, 2, 3].map(v => expect(readIndex(v, [0, 1, 2, 3])).toBe(v));
  });
});

describe("Testing 'indexOf' function", function() {
  test("Return undefined if items is not part of array", () => {
    expect(indexOf("d", ["a", "b", "c"])).toBe(undefined);
  });

  test.each([
    ["a", 0],
    ["b", 1],
    ["c", 2],
    ["d", 3]
  ])("Index of '%s' is %d", (v, i) =>
    expect(indexOf(v, ["a", "b", "c", "d"])).toBe(i)
  );
});

describe("Testing 'prevIndex' function", function() {
  test("If index is out of boundary, return undefined", () => {
    expect(prevIndex(6, ["a", "b", "c", "d"])).toBe(undefined);
  });

  test("If index is 0, return last array index", () => {
    expect(prevIndex(0, ["a", "b", "c", "d"])).toBe(3);
  });

  describe("Previous index o every element in: [0, 1, 2, 3]", function() {
    test.each([
      [0, 3],
      [1, 0],
      [2, 1],
      [3, 2]
    ])("Predecessor of '%s' is '%s'", (a, b) => {
      expect(prevIndex(a, [0, 1, 2, 3])).toBe(b);
    });
  });
});

describe("Testing 'nextIndex' function", function() {
  test("If index is out of boundary, return undefined", () => {
    expect(nextIndex(6, ["a", "b", "c", "d"])).toBe(undefined);
  });

  test("If index is the last index in array, return 0", () => {
    expect(nextIndex(3, ["a", "b", "c", "d"])).toBe(0);
  });

  describe("Next index o every element in: [0, 1, 2, 3]", function() {
    test.each([
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0]
    ])("Predecessor of '%s' is '%s'", (a, b) => {
      expect(nextIndex(a, [0, 1, 2, 3])).toBe(b);
    });
  });
});

describe("Testing 'pred' function", function() {
  test("If array is empty, return undefined", () => {
    expect(pred(1, [])).toBe(undefined);
  });

  test("If value is not in array, return undefined", () => {
    expect(pred(1, [2, 3, 4, 5])).toBe(undefined);
  });

  test("If element it the first in list, return last list element", () => {
    expect(pred("a", ["a", "b", "c", "d"])).toBe("d");
  });

  describe("Predecessor o every element in: ['a', 'b', 'c', 'd']", function() {
    test.each([
      ["a", "d"],
      ["b", "a"],
      ["c", "b"],
      ["d", "c"]
    ])("Predecessor of '%s' is '%s'", (a, b) => {
      expect(pred(a, ["a", "b", "c", "d"])).toBe(b);
    });
  });
});

describe("Testing 'succ' function", function() {
  test("If array is empty, return undefined", () => {
    expect(succ(1, [])).toBe(undefined);
  });

  test("If value is not in array, return undefined", () => {
    expect(succ(1, [2, 3, 4, 5])).toBe(undefined);
  });

  test("If element it the last in list, return first list element", () => {
    expect(succ("d", ["a", "b", "c", "d"])).toBe("a");
  });

  describe("Successor o every element in: ['a', 'b', 'c', 'd']", function() {
    test.each([
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
      ["d", "a"]
    ])("Successor of '%s' is '%s'", (a, b) => {
      expect(succ(a, ["a", "b", "c", "d"])).toBe(b);
    });
  });
});

describe("Testing 'read' function", function() {
  test("If value is not an array, return undefined", () => {
    const reader = (i: unknown): unknown => i;
    [undefined, null, 1, "1", {}, () => ({})].map(v =>
      expect(read(reader, v)).toBe(undefined)
    );
  });

  test("If the value is an empty array, return empty array, regardless of reader", () => {
    const reader = (i: unknown): undefined => undefined;
    expect(read(reader, [])).toEqual([]);
  });

  test("If at least one value does not pass the reader, return undefined", () => {
    const reader = (i: unknown): number | undefined => Number(i) || undefined;
    expect(read(reader, [1, 2, "test", 4])).toBe(undefined);
  });
});

describe("Testing 'findIndex' function", function() {
  test("Return first index witch value satisfies the predicate", () => {
    expect(findIndex(i => i > 4, [1, 2, 5, 3, 6])).toBe(2);
  });

  test("Return undefined if no items satisfies the predicate", () => {
    expect(findIndex(i => i < 0, [1, 2, 5, 3, 6])).toBe(undefined);
  });
});

describe("Testing 'findIndexes' function", function() {
  test("Return all indexes witch value satisfies the predicate", () => {
    expect(findIndexes(i => i > 4, [1, 2, 5, 3, 6])).toEqual([2, 4]);
  });

  test("Return empty array if no items satisfies the predicate", () => {
    expect(findIndexes(i => i < 0, [1, 2, 5, 3, 6])).toEqual([]);
  });
});

describe("Testing 'pick' function", function() {
  test("Return a list that contain exactly only the specified indexes", () => {
    expect(pick([1, 3, 5], [1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
  });

  test("Return an empty list if the target has not provided indexes", () => {
    expect(pick([4, 5, 6], [1, 2, 3])).toEqual([]);
  });

  test("Ignore values that are undefined", () => {
    expect(pick([1, 3, 5], [1, 2, 3, undefined, 5, 6])).toEqual([2, 6]);
  });

  test("Pick only indexes that are contained in list", () => {
    expect(pick([9, 1, 3, 5, 8], [1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
  });

  test("Pick values in the order provided by the indexes list", () => {
    expect(pick([5, 3, 1, 2], [1, 2, 3, 4, 5, 6])).toEqual([6, 4, 2, 3]);
  });

  test("Allow indexes to repeat", () => {
    expect(pick([5, 5, 3, 1, 2, 3], [1, 2, 3, 4, 5, 6])).toEqual([
      6,
      6,
      4,
      2,
      3,
      4
    ]);
  });
});

describe("Testing 'map' function", function() {
  test("Identity law. map(id) == id", () => {
    expect(map(identity, [1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  test("Composition law. map(f.g) == (map f) . (map g)", () => {
    const fn1 = (i: number): number => i + 3;
    const fn2 = (i: number): number => i * 3;
    const values = [1, 2, 3, 4, 5];

    expect(map(v => fn2(fn1(v)), values)).toEqual(map(fn2, map(fn1, values)));
  });

  test("Alias to Array.map, should behavior exactly the same", () => {
    const fns = [identity, (i: number): number => i + 1];
    const values = [1, 2, 3, 4, 5, 6];

    fns.map(fn => {
      expect(values.map(fn)).toEqual(map(fn, values));
    });
  });
});

describe("Testing 'filter' function", function() {
  test("Alias to Array.filter, should behavior exactly the same", () => {
    const fns = [
      (i: number): boolean => isNaN(i),
      (i: number): boolean => i % 1 === 0
    ];
    const values = [1, 2, 3, 4, 5, 6];

    fns.map(fn => {
      expect(values.filter(fn)).toEqual(filter(fn, values));
    });
  });
});

describe("Testing 'orderByKey' function", function() {
  const values = [0, 4, 1, 3, 2];
  const items = ["a", "b", "c", "d", "e"];

  test("Arrange list by provided keys", () => {
    expect(orderByKeys(values, items)).toEqual(["a", "e", "b", "d", "c"]);
  });

  test("If the values of the ordering and target do not match exactly. Return intersection", () => {
    expect(orderByKeys([4, 10, 6, 3], items)).toEqual(["e", "d"]);
  });
});
