import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsArticleList",
    title: t("Article List"),
    icon: "t2-article-list",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: ElementTypes.MinistryBrandsArticleList,
            value: {
              _styles: ["ministryBrandsArticleList"]
            }
          }
        ]
      }
    }
  };
}
