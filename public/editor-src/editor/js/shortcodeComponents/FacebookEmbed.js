const { t } = global.Brizy;

export default {
  id: "FacebookEmbed",
  title: t("Embed"),
  icon: "nc-facebook",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--FacebookEmbed"],
      items: [
        {
          type: "FacebookEmbed",
          value: {
            _styles: ["FacebookEmbed"]
          }
        }
      ]
    }
  }
};
