import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsGroupSlider",
  title: t("Group Slider"),
  icon: "t2-group-slider",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsGroupSlider",
          value: {
            _styles: ["ministryBrandsGroupSlider"]
          }
        }
      ]
    }
  }
};
