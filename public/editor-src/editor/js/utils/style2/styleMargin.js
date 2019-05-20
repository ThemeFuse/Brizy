import { defaultValueValue } from "visual/utils/onChange";

export function styleMargin({ v, device, state, current, hasItems = true }) {
  return hasItems
    ? defaultValueValue({ v, key: "marginType", device, state }) === "grouped"
      ? `${defaultValueValue({
          v,
          key: "margin",
          device,
          state
        })}${defaultValueValue({ v, key: "marginSuffix", device, state })}`
      : `${defaultValueValue({
          v,
          key: current,
          device,
          state
        })}${defaultValueValue({
          v,
          key: `${current}Suffix`,
          device,
          state
        })}`
    : "initial";
}
