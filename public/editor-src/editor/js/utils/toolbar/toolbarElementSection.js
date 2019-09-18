import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarElementSectionBoxShadow({ v, device, state, onChange }) {
  const boxShadowBlurValue = defaultValueValue({
    v,
    key: "boxShadowBlur",
    device,
    state
  });

  const boxShadowVerticalValue = defaultValueValue({
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
    value: [boxShadowBlurValue, boxShadowVerticalValue],
    onChange: ([boxShadowBlur, boxShadowVertical]) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{
          boxShadowBlur,
          boxShadowVertical
        }
      };

      return saveOnChanges(values);
    }
  };
}
