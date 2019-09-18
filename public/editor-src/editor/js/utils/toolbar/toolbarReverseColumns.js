import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarReverseColumns({
  v,
  device,
  devices = "all",
  state,
  position = 20
}) {
  const reverseColumnsKey = defaultValueKey({
    v,
    key: "reverseColumns",
    device,
    state
  });
  const reverseColumnsValue = defaultValueValue({
    v,
    key: "reverseColumns",
    device,
    state
  });

  return {
    id: reverseColumnsKey,
    type: "toggle",
    position,
    devices,
    choices: [
      {
        icon: "nc-switch",
        title: t("Reverse Columns"),
        value: "on"
      },
      {
        icon: "nc-switch",
        title: t("Reverse Columns"),
        value: "off"
      }
    ],
    value: reverseColumnsValue
  };
}
