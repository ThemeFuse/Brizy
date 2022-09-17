import { t } from "visual/utils/i18n";

export default {
  id: "OmnisendMarketing",
  title: t("Marketing by Omnisend"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--omnisend-marketing"],
      items: [
        {
          type: "OmnisendMarketing",
          value: {
            _styles: ["omnisend-marketing"]
          }
        }
      ]
    }
  }
};
