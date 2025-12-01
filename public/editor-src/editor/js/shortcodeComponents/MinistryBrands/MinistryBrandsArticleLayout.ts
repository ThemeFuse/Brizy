import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsArticleLayout",
    title: t("Article Layout"),
    icon: "t2-article-layout",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsArticleLayout",
            value: {
              _styles: ["ministryBrandsArticleLayout"]
            }
          }
        ]
      }
    }
  };
}
