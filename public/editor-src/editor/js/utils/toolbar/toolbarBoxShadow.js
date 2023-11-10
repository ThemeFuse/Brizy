import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarBoxShadowFields2({
  v,
  device,
  disabled = false,
  state,
  states,
  onChange,
  prefix = "",
  devices = "all"
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const fields = capByPrefix(boxShadow, "fields");
  const blur = capByPrefix(boxShadow, "blur");
  const spread = capByPrefix(boxShadow, "spread");
  const vertical = capByPrefix(boxShadow, "vertical");
  const horizontal = capByPrefix(boxShadow, "horizontal");

  return {
    devices,
    disabled,
    states,
    id: dvk(fields),
    type: "multiInput",
    config: {
      defaultIcon: "nc-shadow",
      icons: ["nc-blur", "nc-size", "nc-vertical", "nc-horizontal"]
    },
    value: [dvv(blur), dvv(spread), dvv(vertical), dvv(horizontal)],
    onChange: ([
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal
    ]) => {
      const values = {
        ...{ v, device, state, prefix, onChange },
        ...{
          boxShadowBlur,
          boxShadowSpread,
          boxShadowVertical,
          boxShadowHorizontal
        }
      };

      return saveOnChanges(values);
    }
  };
}
