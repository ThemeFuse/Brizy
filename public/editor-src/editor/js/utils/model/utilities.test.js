test("Prevent jest complaining that files has not tests", () => {});

/**
 * Test basic getter laws
 *  - If model is not an object, return orElse
 *  - If model key is missing, return orElse
 *  - If model key is undefined, return orElse
 *
 * @param {function(orElse: *, model:object):*} getter
 * @param {string} key
 * @param {number[]|string[]} valid a list of valid values
 */
export const testGetter = (getter, key, valid) => {
  describe("Basic getter tests", function() {
    test("Return key value from model", () => {
      valid.map(v => expect(getter({}, { [key]: v })).toBe(v));
    });

    test("if model is not an object, return orElse", () => {
      [undefined, null, 1, "test"].map(m => {
        const orElse = {};
        expect(getter(orElse, m)).toBe(orElse);
      });
    });

    test("if model key is missing, return orElse", () => {
      const orElse = {};
      expect(getter(orElse, {})).toBe(orElse);
    });

    test("if model key is undefined, return orElse", () => {
      const orElse = {};
      expect(getter(orElse, { [key]: undefined })).toBe(orElse);
    });
  });
};

/**
 * Test getter validation
 *  - Getter should pass basic getter laws
 *  - If model key value is valid, return value
 *  - If model key value is invalid, return orElse
 *
 * @param {function(orElse: *, model:object):*} getter
 * @param {string} key
 * @param {number[]|string[]} valid a list of valid values
 * @param {*[]} invalid a list of valid values
 */
export const testGetterValidation = (getter, key, valid, invalid) => {
  testGetter(getter, key, valid);

  describe("Return model key value if value is valid", function() {
    test("Return key value from model, if key value is valid", () => {
      valid.map(v => expect(getter({}, { [key]: v })).toBe(v));
    });

    test("Return orElse, if key value is invalid", () => {
      const orElse = {};
      invalid.map(v => expect(getter(orElse, { [key]: v })).toBe(orElse));
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
 * @param {function(v:string|number, model:object):object} setter
 * @param {function(orElse: *, model:object):*} getter
 * @param {object} m Model instance
 * @param {number[]|string[]} valid a list of valid values
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
      valid.map(v => expect(getter({}, setter(v, m))).toBe(v));
    });

    test("If model is not an object, return a fresh object model with updated key", () => {
      valid.map(v => expect(getter({}, setter(v, null))).toBe(v));
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
 * @param {function(orElse: *, model:object):*} setter
 * @param {function(orElse: *, model:object):*} getter
 * @param {object} m Model instance
 * @param {number[]|string[]} valid a list of valid values
 * @param {*[]} invalid a list of valid values
 */
export const testSetterValidation = (setter, getter, m, valid, invalid) => {
  testSetter(setter, getter, m, valid);

  describe("Testing setter with validation", function() {
    test("If value is invalid, return original model", () => {
      invalid.map(v => expect(setter(v, m)).toBe(m));
    });

    test("If value is valid, return updated model", () => {
      valid.map(v => expect(getter({}, setter(v, m))).toBe(v));
    });
  });
};
