import { t } from "visual/utils/i18n";

export default {
  id: "icon",
  title: t("Icon"),
  icon: "nc-star",
  resolve: {
    type: "Cloneable",
    value: {
      _styles: ["wrapper-clone", "wrapper-clone--icon"],
      items: [
        {
          type: "Icon",
          value: {
            _styles: ["icon"]
          }
        }
      ]
    }
  }
};
