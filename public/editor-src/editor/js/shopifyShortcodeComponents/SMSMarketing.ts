import { t } from "visual/utils/i18n";

export default {
  id: "SMSMarketing",
  title: t("SMS Marketing"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--sms-marketing"],
      items: [
        {
          type: "SMSMarketing",
          value: {
            _styles: ["sms-marketing"]
          }
        }
      ]
    }
  }
};
