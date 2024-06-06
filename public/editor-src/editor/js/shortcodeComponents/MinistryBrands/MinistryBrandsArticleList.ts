import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsArticleList",
  title: t("Article List"),
  icon: "t2-article-list",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsArticleList",
          value: {
            _styles: ["ministryBrandsArticleList"]
          }
        }
      ]
    }
  }
};
