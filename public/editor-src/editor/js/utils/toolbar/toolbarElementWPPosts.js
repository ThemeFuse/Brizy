import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementWPPostsNumber({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "numberPosts", device, state }),
    label: t("Number of posts"),
    type: "input",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "numberPosts",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "numberPosts", device, state })]: value
    })
  };
}
