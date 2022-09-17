import { t } from "visual/utils/i18n";

export default {
  id: "TipoBooking",
  title: t("Appointment Booking"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--tipo-booking"],
      items: [
        {
          type: "TipoBooking",
          value: {
            _styles: ["tipo-booking"]
          }
        }
      ]
    }
  }
};
