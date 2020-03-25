test("Prevent jest complaining that files has not tests", () => {});

/**
 * This is kind of function that take a value and checks if it is a valid value
 *  - if it is, return it
 *  - otherwise, return orElse value
 *
 * @param {function(v: *, orElse: *):*} f
 * @param {*[]} valid, a list of valid values that should be returned
 * @param {*[]} invalid, a list of invalid values that should be not returned
 */
export const testToValue = (f, valid, invalid) => {
  describe("Testing reader function behaviors", function() {
    test("Return value if it is valid", () => {
      valid.map(v => expect(f(v, {})).toBe(v));
    });

    test("Return orElse if value is invalid", () => {
      const orElse = {};
      invalid.map(v => expect(f(v, orElse)).toBe(orElse));
    });
  });
};

/**
 * Test monoid behaviors
 *
 * @param {function(a:*, b:*):*} f
 * @param {*} empty
 * @param {*[]} values, a list of valid values
 */
export const testMonoidBehavior = (f, empty, values) => {
  describe("Testing function monoidal behaviors", function() {
    test("Identity. f(empty, a) === f(a, empty) === a", () => {
      values.map(v => {
        expect(f(empty, v)).toBe(v);
        expect(f(v, empty)).toBe(v);
      });
    });

    test("Associativity. f(f(x, y), z) = f(x, f(y, z))", () => {
      const [x, y, z] = [...values, empty, ...values, empty, ...values, empty];
      expect(f(f(x, y), z)).toBe(f(x, f(y, z)));
    });
  });
};
