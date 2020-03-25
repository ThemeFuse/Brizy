import { IsEqual } from "visual/utils/types/Eq";

test("Prevent jest complaining that files has not tests", () => {});

export function testEq<T>(eq: IsEqual<T>, a1: T, a2: T, b: T): void {
  describe("Testing 'eq' function", function() {
    test("a1 and a2 should be equal", () => {
      expect(eq(a1, a2)).toBe(true);
    });

    test("a1 and a2 should not be equal with b", () => {
      expect(eq(a1, b)).toBe(false);
      expect(eq(a2, b)).toBe(false);
    });

    test("Reflexivity: eq(x, x) = true", () => {
      expect(eq(a1, a1)).toBe(true);
      expect(eq(a2, a2)).toBe(true);
      expect(eq(b, b)).toBe(true);
    });

    test("Symmetry law. eq(x, y) = eq(y, x)", () => {
      expect(eq(a1, a2)).toBe(eq(a2, a1));
      expect(eq(a1, b)).toBe(eq(b, a1));
    });

    test("Transitivity: if eq(x, y) && eq(y, z) = True, then eq(x, z) = True", () => {
      const x = a1;
      const y = a2;
      const z = a1;

      expect(eq(x, y)).toBe(true);
      expect(eq(y, z)).toBe(true);
      expect(eq(z, x)).toBe(true);
    });
  });
}
