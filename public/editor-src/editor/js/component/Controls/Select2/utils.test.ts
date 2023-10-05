import { tail, initial } from "underscore";
import {
  apply,
  dropdownHeight,
  getIndex,
  getValue,
  nextValue,
  prevValue
} from "./utils";

describe("Testing 'getValue' function", function() {
  const values = [1, "2", { v: 3 }, [1, 2, 3]];

  test.each(values)("Should return %s", v => {
    const item = { props: { value: v } };
    expect(getValue(item)).toBe(v);
  });
});

describe("Testing 'getIndex' function", function() {
  const values = [0, 1, 2, 3, 4, 5];
  const items = values.map(i => ({ props: { value: i } }));

  test.each(values)("Should return %i", i => {
    expect(getIndex(i, items)).toBe(i);
  });

  test("Return undefined if value is missing", () => {
    expect(getIndex(10, items)).toBe(undefined);
  });
});

describe("Testing 'prevValue' function", function() {
  const values = ["a", "b", "c", "d", "E"];

  tail(values).map((v, i) =>
    test(`Prev of ${v} is ${values[i]}`, () => {
      expect(prevValue(v, values)).toBe(values[i]);
    })
  );

  test("If items is empty, return undefined", () => {
    expect(prevValue("test", [])).toBe(undefined);
  });

  test("If value is not found in items, return first value", () => {
    expect(prevValue("test", values)).toBe(values[0]);
  });

  test("If value is the first in items, return last items value", () => {
    expect(prevValue("a", values)).toBe("E");
  });
});

describe("Testing 'nextValue' function", function() {
  const values = ["a", "b", "c", "d", "E"];

  initial(values).map((v, i) =>
    test(`Next of ${v} is ${values[i + 1]}`, () => {
      expect(nextValue(v, values)).toBe(values[i + 1]);
    })
  );

  test("If items is empty, return undefined", () => {
    expect(nextValue("test", [])).toBe(undefined);
  });

  test("If value is not found in items, return first value", () => {
    expect(nextValue("test", values)).toBe(values[0]);
  });

  test("If value is the last in items, return first items value", () => {
    expect(nextValue("E", values)).toBe("a");
  });
});

describe("Testing 'apply' function", function() {
  test("Identity test. Applying identity should lead to the same value", () => {
    const t = 3;
    let result;
    const id = (v: unknown) => {
      result = v;
    };

    apply(id, t);
    expect(result).toBe(t);

    apply(id, () => new Promise(r => r(t)));
    expect(result).toBe(t);
  });
});

describe("Testing 'dropdownHeight' function", function() {
  test("Dropdown height should be 50", () => {
    expect(dropdownHeight(100, 10, 5));
  });
});
