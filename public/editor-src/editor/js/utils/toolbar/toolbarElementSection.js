import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementSectionBoxShadow({ v, device, state }) {
  const boxShadowBlur = defaultValueValue({
    v,
    key: "boxShadowBlur",
    device,
    state
  });

  const boxShadowVertical = defaultValueValue({
    v,
    key: "boxShadowVertical",
    device,
    state
  });

  return {
    id: defaultValueKey({ key: "boxShadow", device, state }),
    type: "multiInput",
    config: {
      defaultIcon: ["nc-shadow"],
      icons: ["nc-blur", "nc-vertical"]
    },
    value: [boxShadowBlur, boxShadowVertical],
    onChange: ([boxShadowBlur, boxShadowVertical]) => ({
      [defaultValueKey({
        key: "boxShadow",
        device,
        state
      })]: "on",

      [defaultValueKey({
        key: "boxShadowBlur",
        device,
        state
      })]: boxShadowBlur,
      [defaultValueKey({
        key: `tempBoxShadowBlur`,
        device,
        state
      })]: boxShadowBlur,

      [defaultValueKey({
        key: "boxShadowVertical",
        device,
        state
      })]: boxShadowVertical,
      [defaultValueKey({
        key: `tempBoxShadowVertical`,
        device,
        state
      })]: boxShadowVertical
    })
  };
}
