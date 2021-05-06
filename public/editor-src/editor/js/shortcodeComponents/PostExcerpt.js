import { t } from "visual/utils/i18n";

export default {
  id: "PostExcerpt",
  title: t("Excerpt"),
  icon: "nc-wp-post-excerpt",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-postExcerpt"],
      items: [
        {
          type: "WPPostExcerpt",
          value: {
            _styles: ["postExcerpt"]
          }
        }
      ]
    }
  }
};
