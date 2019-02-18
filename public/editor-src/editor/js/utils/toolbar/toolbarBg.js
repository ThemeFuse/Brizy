import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarBgType({ v, device, state }) {
  const bgColorTypeKey = defaultValueKey({ key: "bgColorType", device, state });
  const bgColorTypeValue = defaultValueValue({
    v,
    key: "bgColorType",
    device,
    state
  });

  const gradientActivePointerKey = defaultValueKey({
    key: "gradientActivePointer",
    device,
    state
  });
  const gradientActivePointerValue = defaultValueValue({
    v,
    key: "gradientActivePointer",
    device,
    state
  });

  return {
    id: bgColorTypeKey,
    type: "select",
    className: "brz-ed__select--transparent",
    choices: [
      {
        title: t("Solid"),
        value: "solid"
      },
      {
        title: t("Gradient"),
        value: "gradient"
      }
    ],
    value: bgColorTypeValue,
    onChange: value => {
      return {
        [bgColorTypeKey]: value,
        [gradientActivePointerKey]:
          value === "solid" ? "startPointer" : gradientActivePointerValue
      };
    }
  };
}
