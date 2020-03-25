import { Monoid } from "visual/utils/types/Monoid";

test("Prevent jest complaining that files has not tests", () => {});

export function testMonoid<T>(m: Monoid<T>, values: Array<T>) {
  const f = m.append;
  const e = m.empty;

  describe("Testing 'append' function", function() {
    test("Identity. append(empty, a) === append(a, empty) === a", () => {
      values.map(v => {
        expect(f(e, v)).toEqual(v);
        expect(f(v, e)).toEqual(v);
      });
    });

    test("Left associativity. append(empty, a) = a", () => {
      values.map(v => expect(f(e, v)).toEqual(v));
    });

    test("Right associativity. append(a, empty) = a", () => {
      values.map(v => expect(f(v, e)).toEqual(v));
    });

    test("Associativity. append(append(x, y), z) = append(x, append(y, z))", () => {
      const [x, y, z] = [...values, e, ...values, e, ...values, e];
      expect(f(f(x, y), z)).toEqual(f(x, f(y, z)));
    });
  });

  describe("Testing 'concat' function", function() {
    test("Should be a consecutive append application", () => {
      expect(m.concat(values)).toEqual(values.reduce(f, e));
    });
  });
}
