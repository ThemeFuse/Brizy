import _ from "underscore";
import { defaultValueKey } from "visual/utils/onChange";

export function toolbarElementForm2Apps({ v, device, state, devices = "all" }) {
  const fields = _.pluck(v.items[0].value.items, "value");
  const dvk = (key) => defaultValueKey({ key, device, state });

  return {
    devices,
    id: dvk("apps"),
    type: "formApps",
    config: {
      id: v._id,
      fields,
      icon: "nc-extensions-2"
    }
  };
}
