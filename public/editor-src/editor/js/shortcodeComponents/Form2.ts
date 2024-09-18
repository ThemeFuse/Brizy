import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "form",
    title: t("Form"),
    icon: "nc-form-left",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--form2"],
        items: [
          {
            type: "Form2",
            value: {
              _styles: ["form2"],
              items: [
                {
                  type: "Form2Fields",
                  value: {
                    items: [
                      {
                        type: "Form2Field",
                        _version: 2,
                        value: {
                          type: "Email",
                          label: "Email",
                          required: "on",
                          options: ["Option 1", "Option 2"]
                        }
                      },
                      {
                        type: "Form2Field",
                        _version: 2,
                        value: {
                          type: "Select",
                          label: "Select",
                          required: "off",
                          options: ["Option 1", "Option 2"]
                        }
                      },
                      {
                        type: "Form2Field",
                        _version: 2,
                        value: {
                          type: "Paragraph",
                          label: "Paragraph",
                          required: "off",
                          options: ["Option 1", "Option 2"]
                        }
                      }
                    ]
                  }
                },
                {
                  type: "Button",
                  value: {
                    _styles: ["button", "submit"]
                  }
                },
                {
                  type: "Form2Steps",
                  value: {
                    _styles: ["form2steps"],
                    items: [
                      {
                        type: "Form2Step",
                        value: {
                          name: "Step",
                          items: [
                            {
                              type: "Form2Fields",
                              value: {
                                items: [
                                  {
                                    type: "Form2Field",
                                    _version: 2,
                                    value: {
                                      type: "Email",
                                      label: "Email",
                                      required: "on",
                                      options: ["Option 1", "Option 2"]
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      {
                        type: "Form2Step",
                        value: {
                          name: "Step",
                          items: [
                            {
                              type: "Form2Fields",
                              value: {
                                items: [
                                  {
                                    type: "Form2Field",
                                    _version: 2,
                                    value: {
                                      type: "Paragraph",
                                      label: "Paragraph",
                                      required: "off",
                                      options: ["Option 1", "Option 2"]
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
                },
                {
                  type: "Button",
                  value: {
                    _styles: ["button"],
                    text: "Prev",
                    iconPosition: "left"
                  }
                },
                {
                  type: "Button",
                  value: {
                    _styles: ["button"],
                    text: "Next"
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
