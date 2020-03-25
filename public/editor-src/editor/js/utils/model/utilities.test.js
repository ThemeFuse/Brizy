test("Prevent jest complaining that files has not tests", () => {});

/**
 * @template {A}
 * @template {M}
 * @typedef {string|number} Value
 * @typedef {function(orElse:A, model:M):A} Getter
 * @typedef {function(v:A, model:M):A} Setter
 */

/**
 * Test basic getter laws
 *  - If model is not an object, return orElse
 *  - If model key is missing, return orElse
 *  - If model key is undefined, return orElse
 *
 *  @template M
 *  @template V
 *
 * @param {function(model:M, orElse: V):*} getter
 * @param {string} key
 * @param {number[]|string[]} valid a list of valid values
 */
export const testGetter = (getter, key, valid) => {
  describe("Basic getter tests", function() {
    test("Return key value from model", () => {
      valid.map(v => expect(getter({ [key]: v }, {})).toBe(v));
    });

    test("if model key is missing, return orElse", () => {
      const orElse = {};
      expect(getter({}, orElse)).toBe(orElse);
    });

    test("if model key is undefined, return orElse", () => {
      const orElse = {};
      expect(getter({ [key]: undefined }, orElse)).toBe(orElse);
    });
  });
};

/**
 * Test getter validation
 *  - Getter should pass basic getter laws
 *  - If model key value is valid, return value
 *  - If model key value is invalid, return orElse
 *
 *  @template M
 *  @template V
 *
 * @param {function(model:M, orElse: V):V} getter
 * @param {string} key
 * @param {V[]} valid a list of valid values
 * @param {*[]} invalid a list of valid values
 */
export const testGetterValidation = (getter, key, valid, invalid) => {
  testGetter(getter, key, valid);

  describe("Return model key value if value is valid", function() {
    test("Return key value from model, if key value is valid", () => {
      valid.map(v => expect(getter({ [key]: v }, {})).toBe(v));
    });

    test("Return orElse, if key value is invalid", () => {
      const orElse = {};
      invalid.map(v => expect(getter({ [key]: v }, orElse)).toBe(orElse));
    });
  });
};

/**
 * Test basic setter laws
 *  - If value is undefined, return original model
 *  - If value equal to current model value, return original model
 *  - Result model key value should be equal to provided value
 *  - If model is not an object, return a fresh object model with updated key
 *
 *  @template V
 *  @template M
 *
 * @param {function(v:M, model:M):M} setter
 * @param {function(model:M, orElse: V):V} getter
 * @param {M} m Model instance
 * @param {V[]} valid a list of valid values
 */
export const testSetter = (setter, getter, m, valid) => {
  describe("Testing basic setter laws", function() {
    test("If value is undefined, return original model", () => {
      expect(setter(undefined, m)).toBe(m);
    });

    test("If value equal to current model value, return original model", () => {
      valid.map(v => {
        const model = setter(v, m);
        expect(setter(v, model)).toBe(model);
      });
    });

    test("Result model key value should be equal to provided value", () => {
      valid.map(v => expect(getter(setter(v, m), {})).toBe(v));
    });

    test("If setter with same value is applied multiple times on same model, the result should be the same. s(a, s(a, m)) === s(a, m)", () => {
      valid.map(v => {
        const m1 = setter(v, m);
        const m2 = setter(v, setter(v, m));
        expect(m2).toEqual(m1);
      });
    });
  });
};

/**
 * Test setter validation
 *  - Setter should pass basic setter laws
 *  - If model key value is valid, return value
 *  - If model key value is invalid, return orElse
 *
 *  @template V
 *  @template M
 *
 * @param {function(v:V, model:M):M} setter
 * @param {function(model:M, orElse: V):V} getter
 * @param {M} m Model instance
 * @param {V[]} valid a list of valid values
 * @param {*[]} invalid a list of valid values
 */
export const testSetterValidation = (setter, getter, m, valid, invalid) => {
  testSetter(setter, getter, m, valid);

  describe("Testing setter with validation", function() {
    test("If value is invalid, return original model", () => {
      invalid.map(v => expect(setter(v, m)).toBe(m));
    });

    test("If value is valid, return updated model", () => {
      valid.map(v => expect(getter(setter(v, m), {})).toBe(v));
    });
  });
};

/**
 * Test setter of the value with temp value
 *  - If set empty value and current value is not empty, temp get current value
 *  - If set empty value and current value is empty, temp is not changed
 *  - If set none empty value, temp is not changed
 *
 *  @template V
 *  @template M
 *
 * @param {(function(v:V, m:V):M)} setter
 * @param {(function(m:M, orElse:V):V)} getter
 * @param {(function(m:M):V)} tempGetter
 * @param {M} m a valid empty model
 * @param {V} empty
 * @param {[]} valid
 */
export const testSetterTemp = (setter, getter, tempGetter, m, empty, valid) => {
  describe("Testing setter with temp value", function() {
    test("If set empty value and current value is not empty, temp get current value", () => {
      valid.map(v => {
        const model = setter(v, m);

        expect(tempGetter(setter(empty, model))).toEqual(v);
      });
    });

    test("If set empty value and current value is empty, temp is not changed", () => {
      const model = setter(empty, m);
      expect(tempGetter(setter(empty, model))).toEqual(tempGetter(model));
    });

    test("If set none empty value, temp is not changed", () => {
      valid.map(v => {
        expect(tempGetter(setter(v, m))).toEqual(tempGetter(m));
      });
    });
  });
};

/**
 * Test model toggle functions.
 * Toggle functions are specialized setters.
 * It takes an enable parameter of boolean type and a model.
 * - If the value is false, some specific keys from the model are set to their empty values
 * - If the values is true, some specific keys from the model are set to their none empty values
 *
 * @template V
 * @template M
 *
 * @param {(function(enable: boolean, m: M):M)} toggle
 * @param {M} m
 * @param {Array<[Getter, Value, Value]>} getters A list of getters paired with their empty and none empty value
 */
export const testModelToggle = (toggle, m, getters) => {
  const orElse = {};
  describe("Testing model toggle functions", function() {
    test("When toggle is set to false, values should have their empty values", () => {
      getters.map(([getter, empty]) => {
        expect(getter(toggle(false, m), orElse)).toBe(empty);
      });
    });

    test("When toggle is set to true, values should have their none empty values", () => {
      getters.map(([getter, _, v]) => {
        expect(getter(toggle(true, m), orElse)).toBe(v);
      });
    });

    test("Identity test. Calling same toggle consecutively should bring same result.", () => {
      [false, true].map(enable =>
        getters.map(([getter, _, v]) => {
          const m1 = toggle(enable, m);
          const m2 = toggle(enable, m1);
          const m3 = toggle(enable, m2);

          expect(getter(m1, orElse)).toBe(getter(m2, orElse));
          expect(getter(m2, orElse)).toBe(getter(m3, orElse));
        })
      );
    });
  });
};
