import { t } from "visual/utils/i18n";

export default {
  id: "HeroWishList",
  title: t("Wish List by Hero"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--hero-wishlist"],
      items: [
        {
          type: "HeroWishList",
          value: {
            _styles: ["hero-wishlist"]
          }
        }
      ]
    }
  }
};
