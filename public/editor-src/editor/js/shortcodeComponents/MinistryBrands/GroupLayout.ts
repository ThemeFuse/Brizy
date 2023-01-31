import { t } from "visual/utils/i18n";

export default {
  id: "GroupLayout",
  title: t("Group Layout"),
  icon: "t2-group-layout",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "GroupLayout",
          value: {
            _styles: ["GroupLayout"]
          }
        }
      ]
    }
  }
};
