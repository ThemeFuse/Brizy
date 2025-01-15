import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "iconText",
    title: t("Icon Box"),
    icon: "nc-paragraph",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--iconText"],
        items: [
          {
            type: "IconText",
            value: {
              _styles: ["iconText"],
              items: [
                {
                  type: "Icon",
                  value: {
                    _styles: ["icon", "iconText--icon"]
                  }
                },
                {
                  type: "RichText",
                  value: {
                    _styles: ["text", "iconText--text"]
                  }
                },
                {
                  type: "Cloneable",
                  value: {
                    _styles: [
                      "wrapper-clone",
                      "iconText--wrapper-clone--button"
                    ],
                    items: [
                      {
                        type: "Button",
                        value: {
                          _styles: ["button", "iconText--button"]
                        }
                      }
                    ]
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
