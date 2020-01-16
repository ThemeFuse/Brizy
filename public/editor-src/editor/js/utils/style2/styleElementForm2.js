import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function styleElementForm2FieldColumns({
  v,
  device,
  state,
  prefix = ""
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "columns"));
}
