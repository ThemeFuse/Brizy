import { t } from "visual/utils/i18n";

export default {
  id: "UploadKit",
  title: t("Upload Fields"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--upload-uploadkit"],
      items: [
        {
          type: "UploadKit",
          value: {
            _styles: ["upload-uploadkit"]
          }
        }
      ]
    }
  }
};
