import { t } from "visual/utils/i18n";

export default {
  id: "KlavyioMarketing",
  title: t("Email Marketing by Klavyio"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--klavyio-marketing"],
      items: [
        {
          type: "KlavyioMarketing",
          value: {
            _styles: ["klavyio-marketing"]
          }
        }
      ]
    }
  }
};
