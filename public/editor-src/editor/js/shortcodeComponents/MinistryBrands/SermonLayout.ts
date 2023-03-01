import { t } from "visual/utils/i18n";

export default {
  id: "SermonLayout",
  title: t("Sermon Layout"),
  icon: "t2-sermon-layout",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "SermonLayout",
          value: {
            _styles: ["sermonLayout"]
          }
        }
      ]
    }
  }
};
