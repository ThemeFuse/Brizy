import { MigrationValues, findMigrations, migrate } from "../index";

const noop = <T extends Record<string, unknown>>(values: {
  vd: T;
  vs: T;
  v: T;
}): T => {
  return values.v;
};

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

        cb({ v }: MigrationValues) {
          return {
            ...v,
            b: "b"
          };
        }
      }
    ];
    const expected = {
      a: "a",
      b: "b"
    };

    expect(
      migrate(migrations, {
        vd: value,
        vs: value,
        v: value,
        renderContext: "editor" as const
      })
    ).toEqual(expected);
  });

  test("multiple migrations", () => {
    const value = {
      a: "a"
    };
    const migrations = [
      {
        version: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb({ v: value }: MigrationValues) {
          return {
            b: "b" + value.a
          };
        }
      },
      {
        version: 2,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb({ v: value }: MigrationValues) {
          return {
            c: "c" + value.b
          };
        }
      },
      {
        version: 3,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb({ v: value }: MigrationValues) {
          return {
            d: "d" + value.c
          };
        }
      }
    ];
    const expected = {
      d: "dcba"
    };

    expect(
      migrate(migrations, {
        vd: value,
        vs: value,
        v: value,
        renderContext: "editor" as const
      })
    ).toEqual(expected);
  });

  test("throws error", () => {
    const value = {
      a: "a"
    };
    const migrations = [
      {
        version: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cb({ v: value }: any) {
          return {
            b: "b" + value.undefined.property
          };
        }
      }
    ];

    expect(() => {
      migrate(migrations, {
        vd: value,
        vs: value,
        v: value,
        renderContext: "editor" as const
      });
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
        cb({ v: value }: MigrationValues, dep: any) {
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

    expect(
      migrate(
        migrations,
        { vd: value, vs: value, v: value, renderContext: "editor" as const },
        deps
      )
    ).toStrictEqual(expected);
  });
});
