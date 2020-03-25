import { _apply, apply, get, set, setter } from "visual/utils/model/index";
import {
  testGetter,
  testSetter,
  testSetterValidation
} from "visual/utils/model/utilities.test";

describe("Testing 'get' function", function() {
  testGetter(get.bind(null, "test"), "test", [1, "2"]);
});

describe("Testing 'set' function", function() {
  const key = "test";
  const valid = [1, 2, "test", "happy"];
  testSetter(set.bind(null, key), get.bind(null, key), {}, valid);
});

describe("Testing '_apply' function", function() {
  test("On empty setters list, return original model", () => {
    const model = { a: 1 };
    expect(_apply([], model)).toBe(model);
  });

  test("If setter is not a function, return current model", () => {
    const model = { a: 1 };
    expect(_apply([[undefined]], model)).toBe(model);
  });

  test("The setters list is traversed from left to right", () => {
    const model = { a: 1 };
    const setter1 = m => ({ ...m, a: m.a + 1 });
    const setter2 = m => ({ ...m, a: m.a * 2 });

    expect(_apply([[setter1], [setter2]], model).a).toBe(4);
    expect(_apply([[setter2], [setter1]], model).a).toBe(3);
  });
});

describe("Testing 'apply' function", function() {
  test("On empty setters list, return original model", () => {
    const model = { a: 1 };
    expect(apply([], model)).toBe(model);
  });

  test("The setters list is traversed from left to right", () => {
    const model = { a: 1 };
    const setter1 = (i, m) => ({ ...m, a: m.a + i });
    const setter2 = (i, m) => ({ ...m, a: m.a * i });

    expect(apply([[setter1, 1], [setter2, 2]], model).a).toBe(4);
    expect(apply([[setter2, 2], [setter1, 1]], model).a).toBe(3);
  });
});

describe("Testing 'setter' function", function() {
  const toValue = (v, orElse) => (v === undefined ? orElse : v);
  const getter = (m, orElse) => toValue((m || {}).test, orElse);
  const s = setter(toValue, getter, set.bind(null, "test"));

  testSetterValidation(s, getter, {}, [1, "test"], [undefined]);
});
