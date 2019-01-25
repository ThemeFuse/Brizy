import { defaultValueValue } from "visual/utils/onChange";

export function stylePadding({ v, device, state, current, hasItems = true }) {
  return hasItems
    ? defaultValueValue({ v, key: "paddingType", device, state }) === "grouped"
      ? `${defaultValueValue({
          v,
          key: "padding",
          device,
          state
        })}${defaultValueValue({ v, key: "paddingSuffix", device, state })}`
      : `${defaultValueValue({
          v,
          key: current,
          device,
          state
        })}${defaultValueValue({ v, key: `${current}Suffix`, device, state })}`
    : "initial";
}
