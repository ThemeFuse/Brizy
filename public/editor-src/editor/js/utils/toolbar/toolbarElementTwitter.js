import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementTwitter({ v, device, devices = "all", state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("twitter"),
    label: t("Twitter"),
    type: "select",
    devices,
    choices: [
      {
        title: t("Embed"),
        value: "embed"
      },
      {
        title: t("Button"),
        value: "button"
      }
    ],
    value: dvv("twitter"),
    onChange: twitter => {
      return {
        [dvk("twitter")]: twitter,
        [dvk("twitterType")]: twitter === "embed" ? "embed" : "followButton"
      };
    }
  };
}
