import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarHorizontalAlign({ v, device, position = 100 }) {
  return {
    id: defaultValueKey({ key: "horizontalAlign", device }),
    type: "toggle",
    position,
    choices: [
      {
        icon: "nc-text-align-left",
        title: t("Align"),
        value: "left"
      },
      {
        icon: "nc-text-align-center",
        title: t("Align"),
        value: "center"
      },
      {
        icon: "nc-text-align-right",
        title: t("Align"),
        value: "right"
      }
    ],
    value: defaultValueValue({ v, key: "horizontalAlign", device }),
    onChange: value => ({
      [defaultValueKey({ key: "horizontalAlign", device })]: value
    })
  };
}
