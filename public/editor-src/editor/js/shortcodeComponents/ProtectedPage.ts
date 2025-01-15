import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "ProtectedPage",
    title: t("Protected Form"),
    icon: "nc-lock",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--protected-page"],
        items: [
          {
            type: "ProtectedPage",
            value: {
              items: [
                {
                  type: "Button",
                  value: {
                    text: "SUBMIT",
                    _styles: ["button", "submit"]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  };
}
