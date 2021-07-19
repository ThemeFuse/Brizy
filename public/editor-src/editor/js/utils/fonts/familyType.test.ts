import { FontFamilyType, is, types, fromString } from "./familyType";

describe("Testing 'types' constant", function() {
  test("Should be [GOOGLE, UPLOAD]", () => {
    expect(types).toEqual(Object.values(FontFamilyType));
  });
});

describe("Testing 'is' function", () => {
  const seed = [
    [FontFamilyType.upload, true],
    [FontFamilyType.google, true],
    ["test", false],
    ["GOOGLE", false],
    ["UPLOAD", false]
  ] as const;

  test.each(seed)("Expect '%s' to be %s", (v, r) => expect(is(v)).toBe(r));
});

describe("Testing 'fromString' function", () => {
  const seed = [
    FontFamilyType.upload,
    FontFamilyType.google,
    "test",
    "GOOGLE",
    "UPLOAD"
  ];

  describe("Should match `is` result", () => {
    seed.forEach(v =>
      test(`Expect ${v} to be ${is(v) ? v : undefined}`, () =>
        expect(fromString(v)).toBe(is(v) ? v : undefined))
    );
  });
});
