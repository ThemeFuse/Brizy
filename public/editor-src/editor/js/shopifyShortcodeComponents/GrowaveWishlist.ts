import { t } from "visual/utils/i18n";

export default {
  id: "GrowaveWishlist",
  title: t("Wishlist by Growave"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--growave-wishlist"],
      items: [
        {
          type: "GrowaveWishlist",
          value: {
            _styles: ["growave-wishlist"]
          }
        }
      ]
    }
  }
};
