const { t } = global.Brizy;

export default {
  id: "facebookButton",
  title: t("Button"),
  icon: "nc-facebook",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--facebookButton"],
      items: [
        {
          type: "FacebookButton",
          value: {
            _styles: ["facebookButton"]
          }
        }
      ]
    }
  }
};
