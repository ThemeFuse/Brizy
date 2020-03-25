import { Reader } from "visual/utils/types/Type";

test("Prevent jest complaining that files has not tests", () => {});

export function testReader<T>(
  read: Reader<T>,
  valid: Array<unknown>,
  invalid: Array<unknown>
) {
  test("Returned value should not be undefined", () => {
    valid.map(v => expect(read(v)).not.toBe(undefined));
  });

  test.each(invalid)("read(%s) should be undefined", v => {
    expect(read(v)).toBe(undefined);
  });
}
