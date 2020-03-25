import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

export function toolbarTags({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("tagName"),
    label: t("Html Tag"),
    type: "select",
    devices,
    choices: [
      {
        title: t("Div"),
        value: "div"
      },
      {
        title: t("Header"),
        value: "header"
      },
      {
        title: t("Footer"),
        value: "footer"
      },
      {
        title: t("Main"),
        value: "main"
      },
      {
        title: t("Article"),
        value: "article"
      },
      {
        title: t("Section"),
        value: "section"
      },
      {
        title: t("Aside"),
        value: "aside"
      },
      {
        title: t("Nav"),
        value: "nav"
      }
    ],
    disabled,
    value: dvv("tagName")
  };
}
