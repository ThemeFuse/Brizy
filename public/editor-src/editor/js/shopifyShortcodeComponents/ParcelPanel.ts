import { t } from "visual/utils/i18n";

export default {
  id: "ParcelPanel",
  title: t("Parcel Panel Order Tracking"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--parcel-panel"],
      items: [
        {
          type: "ParcelPanel",
          value: {
            _styles: ["parcel-panel"]
          }
        }
      ]
    }
  }
};
