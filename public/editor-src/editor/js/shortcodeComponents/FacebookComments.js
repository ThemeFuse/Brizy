const { t } = global.Brizy;

export default {
  id: "facebookComments",
  title: t("Comments"),
  icon: "nc-facebook",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--facebookComments"],
      items: [
        {
          type: "FacebookComments",
          value: {
            _styles: ["facebookComments"]
          }
        }
      ]
    }
  }
};
