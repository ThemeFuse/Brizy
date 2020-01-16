const { t } = global.Brizy;

export default {
  id: "FacebookPage",
  title: t("Page"),
  icon: "nc-facebook",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--FacebookPage"],
      items: [
        {
          type: "FacebookPage",
          value: {
            _styles: ["FacebookPage"]
          }
        }
      ]
    }
  }
};
