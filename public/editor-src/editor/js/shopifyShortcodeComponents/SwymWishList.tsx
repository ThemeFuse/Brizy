import { t } from "visual/utils/i18n";

export default {
  id: "SwymWishList",
  title: t("WishList by Swym"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-swym-wishlist"],
      items: [
        {
          type: "SwymWishList",
          value: {
            _styles: ["swym-wishlist"]
          }
        }
      ]
    }
  }
};
