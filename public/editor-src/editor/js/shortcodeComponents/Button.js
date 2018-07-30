import { t } from "visual/utils/i18n";

export default {
  id: "button",
  title: t("Button"),
  icon: "nc-button",
  resolve: {
    type: "Cloneable",
    value: {
      _styles: ["wrapper-clone", "wrapper-clone--button"],
      items: [
        {
          type: "Button",
          value: {
            _styles: ["button"]
          }
        }
      ]
    }
  }
};
