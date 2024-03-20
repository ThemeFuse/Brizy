import { diff, filterNullish } from "visual/utils/reader/object";

describe("Testing filterNullish function that should remove all undefined keys from object", () => {
  test("Empty object", () => {
    expect(filterNullish({})).toStrictEqual({});
  });

  test("Test with all valid values", () => {
    const data = { a: 1, b: 2, c: 3 };
    expect(filterNullish(data)).toStrictEqual(data);
  });

  test("Test with undefined key", () => {
    expect(filterNullish({ a: 1, b: 2, c: undefined })).toStrictEqual({
      a: 1,
      b: 2
    });
  });

  test("Test with null key", () => {
    expect(filterNullish({ a: 1, b: 2, c: null })).toStrictEqual({
      a: 1,
      b: 2
    });
  });

  test("Test with NaN key", () => {
    expect(filterNullish({ a: 1, b: 2, c: NaN })).toStrictEqual({
      a: 1,
      b: 2
    });
  });

  test("Test with more nullish keys", () => {
    expect(
      filterNullish({
        a: 1,
        b: 2,
        c: NaN,
        d: undefined,
        e: null,
        f: undefined,
        g: undefined,
        h: null
      })
    ).toStrictEqual({
      a: 1,
      b: 2
    });
  });

  test("Test with nested object with nullish keys", () => {
    expect(
      filterNullish({
        a: 1,
        b: 2,
        c: NaN,
        d: {
          da: 1,
          db: undefined,
          dc: null
        }
      })
    ).toStrictEqual({
      a: 1,
      b: 2,
      d: {
        da: 1
      }
    });
  });

  test("Test with 3 levels of nesting", () => {
    expect(
      filterNullish({
        a: 1,
        b: 2,
        c: NaN,
        d: {
          da: 1,
          db: undefined,
          dc: null,
          dd: {
            dda: 1,
            ddb: NaN
          }
        }
      })
    ).toStrictEqual({
      a: 1,
      b: 2,
      d: {
        da: 1,
        dd: {
          dda: 1
        }
      }
    });
  });
});

describe("Testing diff function that receive 2 objects and return new object with differences from second", () => {
  test("Empty", () => {
    expect(diff({}, {})).toStrictEqual({});
  });

  test("Same objects", () => {
    expect(diff({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toStrictEqual({});
  });

  test("First object has keys which in second is missing", () => {
    expect(diff({ a: 1, b: 2, c: 3 }, { a: 12 })).toStrictEqual({ a: 12 });
  });

  test("Second object has keys which in first is missing", () => {
    expect(diff({ a: 1 }, { a: 12, b: 2, c: 3 })).toStrictEqual({
      a: 12,
      b: 2,
      c: 3
    });
  });

  test("Test with same keys, but 'c' is different, should return 'c'", () => {
    expect(diff({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 7 })).toStrictEqual({
      c: 7
    });
  });

  test("Test with same keys, but more is different, should different keys", () => {
    expect(
      diff(
        { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 },
        { a: 12, b: 32, c: 7, d: 4, e: 5, f: 1, g: 7 }
      )
    ).toStrictEqual({ a: 12, b: 32, c: 7, f: 1 });
  });

  test("Test with nested objects", () => {
    expect(
      diff(
        { a: 1, b: { ba: 2 }, c: { ca: 3 }, d: 5 },
        { a: 2, b: { ba: 2 }, c: { ca: 3 }, d: 7 }
      )
    ).toStrictEqual({ a: 2, b: {}, c: {}, d: 7 });
  });
});
