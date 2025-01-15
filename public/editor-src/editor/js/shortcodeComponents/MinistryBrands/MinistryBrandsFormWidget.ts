import { t } from "visual/utils/i18n";

export default function () {
  return {
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
}
