import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarReverseColumns({ v, device, position = 20 }) {
  const reverseColumnsKey = defaultValueKey({
    v,
    key: "reverseColumns",
    device
  });
  const reverseColumnsValue = defaultValueValue({
    v,
    key: "reverseColumns",
    device
  });

  const iconOn =
    device === "tablet" ? "nc-reverse-columns-right" : "nc-reverse-columns-top";
  const iconOff =
    device === "tablet"
      ? "nc-reverse-columns-left"
      : "nc-reverse-columns-bottom";

  return {
    id: reverseColumnsKey,
    type: "toggle",
    position,
    choices: [
      {
        icon: iconOn,
        title: t("Reverse Columns"),
        value: "on"
      },
      {
        icon: iconOff,
        title: t("Reverse Columns"),
        value: "off"
      }
    ],
    value: reverseColumnsValue
  };
}
