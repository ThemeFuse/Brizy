import { findMigrations, migrate } from "../index";

const noop = <T extends Record<string, unknown>>(r: T): T => r;

test.each([
  [
    [
      { version: 1, cb: noop },
      { version: 2, cb: noop },
      { version: 3, cb: noop }
    ],
    1,
    [
      { version: 2, cb: noop },
      { version: 3, cb: noop }
    ]
  ],
  [
    [
      { version: 1, cb: noop },
      { version: 2, cb: noop },
      { version: 3, cb: noop }
    ],
    2,
    [{ version: 3, cb: noop }]
  ],
  [
    [
      { version: 1, cb: noop },
      { version: 2, cb: noop },
      { version: 3, cb: noop }
    ],
    3,
    []
  ],
  [
    [
      { version: 1, cb: noop },
      { version: 2, cb: noop },
      { version: 3, cb: noop }
    ],
    12,
    []
  ],
  [
    // unordered
    [
      { version: 3, cb: noop },
      { version: 1, cb: noop },
      { version: 2, cb: noop }
    ],
    1,
    [
      { version: 2, cb: noop },
      { version: 3, cb: noop }
    ]
  ]
])("testing 'find' function", (migrations, version, expected) => {
  expect(findMigrations(migrations, version)).toEqual(expected);
});

describe("testing 'migrate' function", () => {
  test("one migration", () => {
    const value = {
      a: "a"
    };
    const migrations = [
      {
        version: 1,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb(value: any) {
          return {
            ...value,
            b: "b"
          };
        }
      }
    ];
    const expected = {
      a: "a",
      b: "b"
    };

    expect(migrate(migrations, value)).toEqual(expected);
  });

  test("multiple migrations", () => {
    const value = {
      a: "a"
    };
    const migrations = [
      {
        version: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb(value: any) {
          return {
            b: "b" + value.a
          };
        }
      },
      {
        version: 2,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb(value: any) {
          return {
            c: "c" + value.b
          };
        }
      },
      {
        version: 3,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb(value: any) {
          return {
            d: "d" + value.c
          };
        }
      }
    ];
    const expected = {
      d: "dcba"
    };

    expect(migrate(migrations, value)).toEqual(expected);
  });

  test("throws error", () => {
    const value = {
      a: "a"
    };
    const migrations = [
      {
        version: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb(value: any) {
          return {
            b: "b" + value.undefined.property
          };
        }
      }
    ];

    expect(() => {
      migrate(migrations, value);
    }).toThrow();
  });

  test("migration CB Dependencies", () => {
    const value = {
      a: "a"
    };
    const deps = {
      test: 1
    };

    const migrations = [
      {
        version: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb(value: any, dep: any) {
          return {
            ...value,
            b: value.a + dep.test
          };
        }
      }
    ];
    const expected = {
      a: "a",
      b: "a1"
    };

    expect(migrate(migrations, value, deps)).toStrictEqual(expected);
  });
});
