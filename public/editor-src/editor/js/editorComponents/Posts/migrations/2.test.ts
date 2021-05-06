import { m2 } from "./2";

describe("testing m2 migration", () => {
  test.each([{}])("'type' and 'source' defaults", v => {
    const migrated = m2.cb(v);
    expect(migrated).toStrictEqual({
      type: "posts",
      source: "post",
      _styles: ["posts", "posts-posts"]
    });
  });

  const postsBase = {
    type: "posts",
    source: "post",
    _styles: ["posts", "posts-posts"]
  };
  test.each([
    // base
    [{ type: "posts" }, postsBase],

    //#region orderBy incorrect values
    [
      { type: "posts", orderBy: undefined },
      { ...postsBase, orderBy: "id" }
    ],
    [
      { type: "posts", orderBy: null },
      { ...postsBase, orderBy: "id" }
    ],
    [
      { type: "posts", orderBy: {} },
      { ...postsBase, orderBy: "id" }
    ],
    [
      { type: "posts", orderBy: [] },
      { ...postsBase, orderBy: "id" }
    ],
    [
      { type: "posts", orderBy: "" },
      { ...postsBase, orderBy: "id" }
    ],
    //#endregion

    //#region orderBy correct values
    [
      { type: "posts", orderBy: "id" },
      { ...postsBase, orderBy: "id" }
    ],
    [
      { type: "posts", orderBy: "title" },
      { ...postsBase, orderBy: "title" }
    ],
    [
      { type: "posts", orderBy: "date" },
      { ...postsBase, orderBy: "date" }
    ],
    [
      { type: "posts", orderBy: "something random" },
      { ...postsBase, orderBy: "something random" }
    ],
    // ID special case (needs to be normalized to "id" for the sake of sameness with cloud)
    [
      { type: "posts", orderBy: "ID" },
      { ...postsBase, orderBy: "id" }
    ],
    //#endregion

    //#region order incorrect values
    [
      { type: "posts", order: undefined },
      { ...postsBase, order: "ASC" }
    ],
    [
      { type: "posts", order: null },
      { ...postsBase, order: "ASC" }
    ],
    [
      { type: "posts", order: {} },
      { ...postsBase, order: "ASC" }
    ],
    [
      { type: "posts", order: [] },
      { ...postsBase, order: "ASC" }
    ],
    [
      { type: "posts", order: "" },
      { ...postsBase, order: "ASC" }
    ],
    [
      { type: "posts", order: "some string" },
      { ...postsBase, order: "ASC" }
    ],
    //#endregion

    //#region order incorrect values
    [
      { type: "posts", order: "ASC" },
      { ...postsBase, order: "ASC" }
    ],
    [
      { type: "posts", order: "asc" },
      { ...postsBase, order: "ASC" }
    ],
    [
      { type: "posts", order: "DESC" },
      { ...postsBase, order: "DESC" }
    ],
    [
      { type: "posts", order: "desc" },
      { ...postsBase, order: "DESC" }
    ],
    //#endregion

    //#region symbols
    [
      { type: "posts", taxonomy: "category", taxonomyId: 1 },
      {
        ...postsBase,
        symbols: { post_incBy: '["term"]', post_inc_term: '["category:1"]' }
      }
    ],
    [
      { type: "posts", taxonomy: "post_tag", taxonomyId: "3" },
      {
        ...postsBase,
        symbols: { post_incBy: '["term"]', post_inc_term: '["post_tag:3"]' }
      }
    ],
    [
      { type: "posts", taxonomy: "any_string", taxonomyId: "any_string" },
      {
        ...postsBase,
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
        type: "posts",
        _id: "abcde",
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      },
      {
        ...postsBase,
        _id: "abcde",
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      }
    ],
    //#endregion

    //#region misc
    [
      { type: "posts", orderBy: null, order: "DESC" },
      { ...postsBase, orderBy: "id", order: "DESC" }
    ],
    [
      {
        type: "posts",
        orderBy: "title",
        taxonomy: "post_tag",
        taxonomyId: "16",
        _id: "12345"
      },
      {
        ...postsBase,
        orderBy: "title",
        symbols: { post_incBy: '["term"]', post_inc_term: '["post_tag:16"]' },
        _id: "12345"
      }
    ]
    //#endregion
  ])("type = posts", (v, expected) => {
    const migrated = m2.cb(v);
    expect(migrated).toStrictEqual(expected);
  });

  const archiveBase = {
    type: "archives",
    _styles: ["posts", "posts-archive"],
    orderBy: "id",
    order: "DESC"
  };
  test.each([
    // base
    [{ type: "archives" }, archiveBase],
    [{ _styles: ["posts--archives"] }, archiveBase],
    [{ _styles: ["posts--archive"] }, archiveBase],
    [{ _styles: ["posts-archives"] }, archiveBase],
    [{ _styles: ["posts-archive"] }, archiveBase],
    [{ _styles: ["posts-dynamic", "posts--archives"] }, archiveBase],

    //#should ignore orderBy, order
    [{ _styles: ["posts--archives"], orderBy: "id" }, archiveBase],
    [{ _styles: ["posts--archives"], orderBy: "ID" }, archiveBase],
    [{ _styles: ["posts--archives"], orderBy: "title" }, archiveBase],
    [{ _styles: ["posts--archives"], orderBy: "date" }, archiveBase],
    [{ _styles: ["posts--archives"], order: "ASC" }, archiveBase],
    [{ _styles: ["posts--archives"], order: "DESC" }, archiveBase],
    [{ _styles: ["posts--archives"], order: "asc" }, archiveBase],
    [{ _styles: ["posts--archives"], order: "desc" }, archiveBase],
    //#endregion

    //#region other keys should remain untouched
    [
      { type: "archives", id: "abc" },
      { ...archiveBase, id: "abc" }
    ],
    [
      {
        _styles: ["posts--archives"],
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      },
      {
        ...archiveBase,
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      }
    ]
    //#endregion
  ])("type = archives", (v, expected) => {
    const migrated = m2.cb(v);
    expect(migrated).toStrictEqual(expected);
  });

  const productsBase = {
    type: "products",
    source: "product",
    _styles: ["posts", "posts-products"]
  };
  test.each([
    // base
    [{ type: "products" }, productsBase],

    //#region orderBy incorrect values
    [
      { type: "products", orderBy: undefined },
      { ...productsBase, orderBy: "id" }
    ],
    [
      { type: "products", orderBy: null },
      { ...productsBase, orderBy: "id" }
    ],
    [
      { type: "products", orderBy: {} },
      { ...productsBase, orderBy: "id" }
    ],
    [
      { type: "products", orderBy: [] },
      { ...productsBase, orderBy: "id" }
    ],
    [
      { type: "products", orderBy: "" },
      { ...productsBase, orderBy: "id" }
    ],
    //#endregion

    //#region orderBy correct values
    [
      { type: "products", orderBy: "id" },
      { ...productsBase, orderBy: "id" }
    ],
    [
      { type: "products", orderBy: "title" },
      { ...productsBase, orderBy: "title" }
    ],
    [
      { type: "products", orderBy: "date" },
      { ...productsBase, orderBy: "date" }
    ],
    [
      { type: "products", orderBy: "something random" },
      { ...productsBase, orderBy: "something random" }
    ],
    // ID special case (needs to be normalized to "id" for the sake of sameness with cloud)
    [
      { type: "products", orderBy: "ID" },
      { ...productsBase, orderBy: "id" }
    ],
    //#endregion

    //#region order incorrect values
    [
      { type: "products", order: undefined },
      { ...productsBase, order: "ASC" }
    ],
    [
      { type: "products", order: null },
      { ...productsBase, order: "ASC" }
    ],
    [
      { type: "products", order: {} },
      { ...productsBase, order: "ASC" }
    ],
    [
      { type: "products", order: [] },
      { ...productsBase, order: "ASC" }
    ],
    [
      { type: "products", order: "" },
      { ...productsBase, order: "ASC" }
    ],
    [
      { type: "products", order: "some string" },
      { ...productsBase, order: "ASC" }
    ],
    //#endregion

    //#region order incorrect values
    [
      { type: "products", order: "ASC" },
      { ...productsBase, order: "ASC" }
    ],
    [
      { type: "products", order: "asc" },
      { ...productsBase, order: "ASC" }
    ],
    [
      { type: "products", order: "DESC" },
      { ...productsBase, order: "DESC" }
    ],
    [
      { type: "products", order: "desc" },
      { ...productsBase, order: "DESC" }
    ],
    //#endregion

    //#region symbols
    [
      { type: "products", taxonomy: "product_cat", taxonomyId: 1 },
      {
        ...productsBase,
        symbols: {
          product_incBy: '["term"]',
          product_inc_term: '["product_cat:1"]'
        }
      }
    ],
    [
      { type: "products", taxonomy: "product_tag", taxonomyId: "3" },
      {
        ...productsBase,
        symbols: {
          product_incBy: '["term"]',
          product_inc_term: '["product_tag:3"]'
        }
      }
    ],
    [
      { type: "products", taxonomy: "any_string", taxonomyId: "any_string" },
      {
        ...productsBase,
        symbols: {
          product_incBy: '["term"]',
          product_inc_term: '["any_string:any_string"]'
        }
      }
    ],
    //#endregion

    //#region other keys should remain untouched
    [
      {
        type: "products",
        _id: "abcde",
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      },
      {
        ...productsBase,
        _id: "abcde",
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      }
    ],
    //#endregion

    //#region misc
    [
      { type: "products", orderBy: null, order: "DESC" },
      { ...productsBase, orderBy: "id", order: "DESC" }
    ],
    [
      {
        type: "products",
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
    const migrated = m2.cb(v);
    expect(migrated).toStrictEqual(expected);
  });

  const productArchiveBase = {
    type: "archives-product",
    _styles: ["posts", "posts-productArchive"],
    orderBy: "id",
    order: "DESC"
  };
  test.each([
    // base
    [{ type: "archives-product" }, productArchiveBase],
    [{ _styles: ["posts--archives-product"] }, productArchiveBase],

    //#should ignore orderBy, order
    [
      { _styles: ["posts--archives-product"], orderBy: "id" },
      productArchiveBase
    ],
    [
      { _styles: ["posts--archives-product"], orderBy: "ID" },
      productArchiveBase
    ],
    [
      { _styles: ["posts--archives-product"], orderBy: "title" },
      productArchiveBase
    ],
    [
      { _styles: ["posts--archives-product"], orderBy: "date" },
      productArchiveBase
    ],
    [
      { _styles: ["posts--archives-product"], order: "ASC" },
      productArchiveBase
    ],
    [
      { _styles: ["posts--archives-product"], order: "DESC" },
      productArchiveBase
    ],
    [
      { _styles: ["posts--archives-product"], order: "asc" },
      productArchiveBase
    ],
    [
      { _styles: ["posts--archives-product"], order: "desc" },
      productArchiveBase
    ],
    //#endregion

    //#region other keys should remain untouched
    [
      { type: "archives-product", id: "abc" },
      { ...productArchiveBase, id: "abc" }
    ],
    [
      {
        _styles: ["posts--archives-product"],
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      },
      {
        ...productArchiveBase,
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      }
    ]
    //#endregion
  ])("type = archives-product", (v, expected) => {
    const migrated = m2.cb(v);
    expect(migrated).toStrictEqual(expected);
  });

  const upsellBase = {
    type: "upsell",
    _styles: ["posts", "posts-upsell"],
    orderBy: "id",
    order: "DESC"
  };
  test.each([
    // base
    [{ type: "upsell" }, upsellBase],

    //#should ignore orderBy, order
    [{ type: "upsell", orderBy: "id" }, upsellBase],
    [{ type: "upsell", orderBy: "ID" }, upsellBase],
    [{ type: "upsell", orderBy: "title" }, upsellBase],
    [{ type: "upsell", orderBy: "date" }, upsellBase],
    [{ type: "upsell", order: "ASC" }, upsellBase],
    [{ type: "upsell", order: "DESC" }, upsellBase],
    [{ type: "upsell", order: "asc" }, upsellBase],
    [{ type: "upsell", order: "desc" }, upsellBase],
    //#endregion

    //#region other keys should remain untouched
    [
      { type: "upsell", id: "abc" },
      { ...upsellBase, id: "abc" }
    ],
    [
      {
        type: "upsell",
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      },
      {
        ...upsellBase,
        items: ["item 1", "item 2"],
        _thumbnail: "http://thumbnail.com/123"
      }
    ]
    //#endregion
  ])("type = upsell", (v, expected) => {
    const migrated = m2.cb(v);
    expect(migrated).toStrictEqual(expected);
  });
});
