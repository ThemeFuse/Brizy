import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "accordion",
    title: t("Accordion"),
    icon: "nc-toggle",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--accordion"],
        items: [
          {
            type: "Accordion",
            value: {
              _styles: ["accordion"],
              items: [
                {
                  type: "AccordionItem",
                  value: {
                    labelText: "Accordion 1",
                    items: [
                      {
                        type: "Cloneable",
                        value: {
                          _styles: [
                            "wrapper-clone",
                            "accordion--wrapper-clone--icon"
                          ],
                          items: [
                            {
                              type: "Icon",
                              value: {
                                _styles: ["icon", "accordion--icon"]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  type: "AccordionItem",
                  value: {
                    labelText: "Accordion 2",
                    items: [
                      {
                        type: "Cloneable",
                        value: {
                          _styles: [
                            "wrapper-clone",
                            "accordion--wrapper-clone--button"
                          ],
                          items: [
                            {
                              type: "Button",
                              value: {
                                _styles: ["button", "accordion--button"]
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
