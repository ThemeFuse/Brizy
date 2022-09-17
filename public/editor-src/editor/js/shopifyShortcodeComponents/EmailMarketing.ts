import { t } from "visual/utils/i18n";

export default {
  id: "EmailMarketing",
  title: t("Email Marketing"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--email-marketing"],
      items: [
        {
          type: "EmailMarketing",
          value: {
            _styles: ["email-marketing"]
          }
        }
      ]
    }
  }
};
