import { t } from "visual/utils/i18n";

export default {
  id: "SnowBall",
  title: t("Marketing by Social SnowBall"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--snowball-marketing"],
      items: [
        {
          type: "SnowBall",
          value: {
            _styles: ["snowball-marketing"]
          }
        }
      ]
    }
  }
};
