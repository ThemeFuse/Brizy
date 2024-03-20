import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsFormWidget",
  title: t("FMS Forms"),
  icon: "nc-form-left",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsFormWidget",
          value: {
            _styles: ["ministryBrandsFormWidget"]
          }
        }
      ]
    }
  }
};
