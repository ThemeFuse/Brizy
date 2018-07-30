import { t } from "visual/utils/i18n";

export default {
  id: "columns",
  title: t("Column"),
  icon: "nc-column",
  resolve: {
    type: "Row",
    value: {
      _styles: ["row", "hide-row-borders", "padding-0"],
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
