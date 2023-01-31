import { t } from "visual/utils/i18n";

export default {
  id: "GroupSlider",
  title: t("Group Slider"),
  icon: "t2-group-slider",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "GroupSlider",
          value: {
            _styles: ["GroupSlider"]
          }
        }
      ]
    }
  }
};
