import { apply, get, set } from "visual/utils/model/index";
import { testGetter, testSetter } from "visual/utils/model/utilities.test";

describe("Testing 'get' function", function() {
  const wrapper = (orElse, m) => get(orElse, "test", m);
  testGetter(wrapper, "test", [1, "2"]);
});

describe("Testing 'set' function", function() {
  const key = "test";
  const getter = (orElse, m) => get(orElse, key, m);
  testSetter(set.bind(null, key), getter, {}, [1, 2, "test", "happy"]);
});

describe("Testing 'apply' function", function() {
  test("On empty setters list, return original model", () => {
    const model = { a: 1 };
    expect(apply([], model)).toBe(model);
  });

  test("If setter is not a function, return current model", () => {
    const model = { a: 1 };
    expect(apply([[undefined]], model)).toBe(model);
  });

  test("The setters list is traversed from left to right", () => {
    const model = { a: 1 };
    const setter1 = m => ({ ...m, a: m.a + 1 });
    const setter2 = m => ({ ...m, a: m.a * 2 });

    expect(apply([[setter1], [setter2]], model).a).toBe(4);
    expect(apply([[setter2], [setter1]], model).a).toBe(3);
  });
});
