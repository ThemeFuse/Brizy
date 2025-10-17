import { ElementModel } from "visual/component/Elements/Types";
import { createFieldCollectionId } from "visual/utils/elements/posts";
import { Context } from "visual/utils/elements/posts/types";
import { m3 } from "../3";

type GetCollectionTypesInfoResult = Context["collectionTypesInfo"];

type EachTests = [
  ElementModel,
  GetCollectionTypesInfoResult | undefined,
  ElementModel
];

describe("testing m3 migration", () => {
  test.each<EachTests>([[{}, undefined, {}]])("Symbols Empty", (v, d, r) => {
    const migrated = m3.cb(v, d);
    expect(migrated).toStrictEqual(r);
  });

  const sourceBlogs = {
    source: "blogs",
    symbols: {
      blogs_incBy: JSON.stringify(["blog1"])
    }
  };

  test.each<EachTests>([[sourceBlogs, undefined, sourceBlogs]])(
    "Symbols source = 'blogs'",
    (v, d, r) => {
      const migrated = m3.cb(v, d);
      expect(migrated).toStrictEqual(r);
    }
  );

  const inBy = ["categories", "portfolio", "auto"];
  const categoriesInc = ["blog", "news", "social"];
  const portfolioInc = ["design", "wedding"];
  const autoInc = ["bmw", "opel", "vw", "baic"];
  const sizeInc: Array<string> = [];

  const sourceAuto = {
    source: "posts",
    symbols: {
      posts_incBy: JSON.stringify(inBy),
      posts_inc_categories: JSON.stringify(categoriesInc),
      posts_inc_portfolio: JSON.stringify(portfolioInc),
      posts_inc_auto: JSON.stringify(autoInc),
      posts_in_size: JSON.stringify(sizeInc)
    }
  };

  test.each<EachTests>([
    [
      sourceAuto,
      {
        sources: [],
        refsById: {}
      },
      sourceAuto
    ],
    [
      sourceAuto,
      {
        sources: [],
        refsById: {
          posts: [
            {
              type: "multi",
              id: "categories",
              fieldId: "categories_fields1",
              title: "Categories"
            },
            {
              type: "multi",
              id: "portfolio",
              fieldId: "portfolio_fields1",
              title: "Portfolio"
            },
            {
              type: "single",
              id: "auto",
              fieldId: "auto_fields1",
              title: "Auto"
            }
          ]
        }
      },
      {
        ...sourceAuto,
        symbols: {
          posts_incBy: JSON.stringify([
            "categories:categories_fields1",
            "portfolio:portfolio_fields1",
            "auto:auto_fields1"
          ]),
          posts_in_size: JSON.stringify(sizeInc),
          "posts_inc_categories:categories_fields1": JSON.stringify(
            categoriesInc.map((c) =>
              createFieldCollectionId(c, "categories_fields1")
            )
          ),
          "posts_inc_portfolio:portfolio_fields1": JSON.stringify(
            portfolioInc.map((p) =>
              createFieldCollectionId(p, "portfolio_fields1")
            )
          ),
          "posts_inc_auto:auto_fields1": JSON.stringify(
            autoInc.map((a) => createFieldCollectionId(a, "auto_fields1"))
          )
        }
      }
    ]
  ])("Symbols source = 'posts'", (v, d, r) => {
    const migrated = m3.cb(v, d);
    expect(migrated).toStrictEqual(r);
  });
});
