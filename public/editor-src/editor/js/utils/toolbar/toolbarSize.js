import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarSizeContainerSize({
  v,
  device,
  state,
  devices = "all"
}) {
  return {
    id: defaultValueKey({
      key: "containerSize",
      device,
      state
    }),
    label: t("Width"),
    type: "slider",
    devices,
    position: 100,
    slider: {
      min: 35,
      max: 100
    },
    input: {
      show: true,
      min: 35,
      max: 100
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "%",
          value: "%"
        }
      ]
    },
    value: {
      value: defaultValueValue({
        v,
        key: "containerSize",
        device,
        state
      })
    },
    onChange: ({ value: containerSize }) => ({
      containerSize
    })
  };
}
