import { t } from "visual/utils/i18n";

export default {
  id: "row",
  title: t("Row"),
  icon: "nc-row",
  resolve: {
    type: "Row",
    value: {
      _styles: ["row"],
      items: [
        {
          type: "Column",
          value: {
            _styles: ["column"],
            items: []
          }
        },
        {
          type: "Column",
          value: {
            _styles: ["column"],
            items: []
          }
        }
      ]
    }
  }
};
