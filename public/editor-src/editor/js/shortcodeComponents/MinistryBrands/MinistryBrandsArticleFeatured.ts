import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsArticleFeatured",
    title: t("Article Featured"),
    icon: "t2-article-detail",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsArticleFeatured",
            value: {
              _styles: ["ministryBrandsArticleFeatured"]
            }
          }
        ]
      }
    }
  };
}
