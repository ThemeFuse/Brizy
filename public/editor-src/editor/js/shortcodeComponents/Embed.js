import { t } from "visual/utils/i18n";

export default {
  id: "embedCode",
  title: t("Embed"),
  icon: "nc-iframe",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--embedCode"],
      items: [
        {
          type: "EmbedCode",
          value: {
            _styles: ["embedCode"]
          }
        }
      ]
    }
  }
};
