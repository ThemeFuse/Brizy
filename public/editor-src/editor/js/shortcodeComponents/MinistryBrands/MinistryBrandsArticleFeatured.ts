import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsArticleFeatured",
    title: t("Article Featured"),
    icon: "t2-article-featured",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: ElementTypes.MinistryBrandsArticleFeatured,
            value: {
              _styles: ["ministryBrandsArticleFeatured"]
            }
          }
        ]
      }
    }
  };
}
