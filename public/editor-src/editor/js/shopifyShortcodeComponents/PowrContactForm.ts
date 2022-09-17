import { t } from "visual/utils/i18n";

export default {
  id: "PowrContactForm",
  title: t("Advanced Contact Form by POWR"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--powr-contact-form"],
      items: [
        {
          type: "PowrContactForm",
          value: {
            _styles: ["powr-contact-form"]
          }
        }
      ]
    }
  }
};
