const { t } = global.Brizy;

export default {
  id: "starRating",
  title: t("Rating"),
  icon: "nc-starrating",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--starRating"],
      items: [
        {
          type: "StarRating",
          value: {
            _styles: ["starRating"]
          }
        }
      ]
    }
  }
};
