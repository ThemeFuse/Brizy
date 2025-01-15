import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "counter",
    title: t("Counter"),
    icon: "nc-counter-outline",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--counter"],
        items: [
          {
            type: "Counter",
            value: {
              _styles: ["counter"]
            }
          }
        ]
      }
    }
  };
}
