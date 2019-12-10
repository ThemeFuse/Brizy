const { t } = global.Brizy;

export default {
  id: "FacebookGroup",
  title: t("Group"),
  icon: "nc-facebook",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--FacebookGroup"],
      items: [
        {
          type: "FacebookGroup",
          value: {
            _styles: ["FacebookGroup"]
          }
        }
      ]
    }
  }
};
