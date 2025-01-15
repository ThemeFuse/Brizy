import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsArticleDetail",
    title: t("Article Detail"),
    icon: "t2-article-detail",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsArticleDetail",
            value: {
              _styles: ["ministryBrandsArticleDetail"]
            }
          }
        ]
      }
    }
  };
}
