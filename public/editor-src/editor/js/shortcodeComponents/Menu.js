const { t } = global.Brizy;

export default {
  id: "menu",
  title: t("Menu"),
  icon: "nc-menu-3",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--menu"],
      items: [
        {
          type: "Menu",
          value: {
            _styles: ["menu"]
          }
        }
      ]
    }
  }
};
