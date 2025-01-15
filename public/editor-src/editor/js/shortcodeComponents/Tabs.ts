import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "tabs",
    title: t("Tabs"),
    icon: "nc-tabs",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--tabs"],
        items: [
          {
            type: "Tabs",
            value: {
              _styles: ["tabs"],
              items: [
                {
                  type: "Tab",
                  value: {
                    labelText: "Tab 1",
                    items: [
                      {
                        type: "Cloneable",
                        value: {
                          _styles: [
                            "wrapper-clone",
                            "tabs--wrapper-clone--icon"
                          ],
                          items: [
                            {
                              type: "Icon",
                              value: {
                                _styles: ["icon", "tabs--icon"]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  type: "Tab",
                  value: {
                    labelText: "Tab 2",
                    items: [
                      {
                        type: "Cloneable",
                        value: {
                          _styles: [
                            "wrapper-clone",
                            "tabs--wrapper-clone--button"
                          ],
                          items: [
                            {
                              type: "Button",
                              value: {
                                _styles: ["button", "tabs--button"]
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
        ]
      }
    }
  };
}
