import { m2 } from "../2";

describe("testing m2 migration", () => {
  test.each([{}])("'source' defaults", (v) => {
    const migrated = m2.cb({
      v,
      vs: v,
      vd: v,
      renderContext: "editor" as const
    });
    expect(migrated).toStrictEqual({
      source: "post"
    });
  });

  const carouselsBase = {
    source: "post"
  };
  test.each([
    // base
    [carouselsBase, carouselsBase],

    //#region orderBy incorrect values
    [{ orderBy: undefined }, { ...carouselsBase, orderBy: "id" }],
    [{ orderBy: null }, { ...carouselsBase, orderBy: "id" }],
    [{ orderBy: {} }, { ...carouselsBase, orderBy: "id" }],
    [{ orderBy: [] }, { ...carouselsBase, orderBy: "id" }],
    [{ orderBy: "" }, { ...carouselsBase, orderBy: "id" }],
    //#endregion

    //#region orderBy correct values
    [{ orderBy: "id" }, { ...carouselsBase, orderBy: "id" }],
    [{ orderBy: "title" }, { ...carouselsBase, orderBy: "title" }],
    [{ orderBy: "date" }, { ...carouselsBase, orderBy: "date" }],
    [
      { orderBy: "something random" },
      { ...carouselsBase, orderBy: "something random" }
    ],
    // ID special case (needs to be normalized to "id" for the sake of sameness with cloud)
    [{ orderBy: "ID" }, { ...carouselsBase, orderBy: "id" }],
    //#endregion

    //#region order incorrect values
    [{ order: undefined }, { ...carouselsBase, order: "ASC" }],
    [{ order: null }, { ...carouselsBase, order: "ASC" }],
    [{ order: {} }, { ...carouselsBase, order: "ASC" }],
    [{ order: [] }, { ...carouselsBase, order: "ASC" }],
    [{ order: "" }, { ...carouselsBase, order: "ASC" }],
    [{ order: "some string" }, { ...carouselsBase, order: "ASC" }],
    //#endregion

    //#region order incorrect values
    [{ order: "ASC" }, { ...carouselsBase, order: "ASC" }],
    [{ order: "asc" }, { ...carouselsBase, order: "ASC" }],
    [{ order: "DESC" }, { ...carouselsBase, order: "DESC" }],
    [{ order: "desc" }, { ...carouselsBase, order: "DESC" }],
    //#endregion

    //#region symbols
    [
      { taxonomy: "category", taxonomyId: 1 },
      {
        ...carouselsBase,
        symbols: { post_incBy: '["term"]', post_inc_term: '["category:1"]' }
      }
    ],
    [
      { taxonomy: "post_tag", taxonomyId: "3" },
      {
        ...carouselsBase,
        symbols: { post_incBy: '["term"]', post_inc_term: '["post_tag:3"]' }
      }
    ],
    [
      { taxonomy: "any_string", taxonomyId: "any_string" },
      {
        ...carouselsBase,
        symbols: {
          post_incBy: '["term"]',
          post_inc_term: '["any_string:any_string"]'
        }
      }
    ],
    //#endregion

    //#region other keys should remain untouched
    [
      {
        _id: "abcde",
        choices: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      },
      {
        ...carouselsBase,
        _id: "abcde",
        choices: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      }
    ],
    //#endregion

    //#region misc
    [
      { orderBy: null, order: "DESC" },
      { ...carouselsBase, orderBy: "id", order: "DESC" }
    ],
    [
      {
        orderBy: "title",
        taxonomy: "post_tag",
        taxonomyId: "16",
        _id: "12345"
      },
      {
        ...carouselsBase,
        orderBy: "title",
        symbols: { post_incBy: '["term"]', post_inc_term: '["post_tag:16"]' },
        _id: "12345"
      }
    ]
    //#endregion
  ])("type = posts", (v, expected) => {
    const migrated = m2.cb({
      v,
      vs: v,
      vd: v,
      renderContext: "editor" as const
    });
    expect(migrated).toStrictEqual(expected);
  });

  const productsBase = {
    source: "product"
  };
  test.each([
    //#region symbols
    [
      { taxonomy: "product_cat", taxonomyId: 1 },
      {
        ...productsBase,
        symbols: {
          product_incBy: '["term"]',
          product_inc_term: '["product_cat:1"]'
        }
      }
    ],
    [
      { taxonomy: "product_tag", taxonomyId: "3" },
      {
        ...productsBase,
        symbols: {
          product_incBy: '["term"]',
          product_inc_term: '["product_tag:3"]'
        }
      }
    ],
    [
      { taxonomy: "pa_brand", taxonomyId: "any_string" },
      {
        ...productsBase,
        symbols: {
          product_incBy: '["term"]',
          product_inc_term: '["pa_brand:any_string"]'
        }
      }
    ],
    //#endregion

    //#region misc
    [
      {
        orderBy: null,
        order: "DESC",
        taxonomy: "product_name",
        taxonomyId: "15"
      },
      {
        ...productsBase,
        orderBy: "id",
        order: "DESC",
        symbols: {
          product_incBy: '["term"]',
          product_inc_term: '["product_name:15"]'
        }
      }
    ],
    [
      {
        orderBy: "title",
        taxonomy: "product_tag",
        taxonomyId: "16",
        _id: "12345"
      },
      {
        ...productsBase,
        orderBy: "title",
        symbols: {
          product_incBy: '["term"]',
          product_inc_term: '["product_tag:16"]'
        },
        _id: "12345"
      }
    ]
    //#endregion
  ])("type = products", (v, expected) => {
    const migrated = m2.cb({
      v,
      vs: v,
      vd: v,
      renderContext: "editor" as const
    });
    expect(migrated).toStrictEqual(expected);
  });
});
