import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyForm",
    title: t("Form"),
    icon: "nc-form-left",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story", "wrapper--story-form2"],
        items: [
          {
            type: "Form2",
            value: {
              _styles: ["story-form2"],
              items: [
                {
                  type: "Form2Fields",
                  value: {
                    items: [
                      {
                        type: "Form2Field",
                        value: {
                          type: "Email",
                          label: "Email",
                          required: "on",
                          options: ["Option 1", "Option 2"]
                        }
                      },
                      {
                        type: "Form2Field",
                        value: {
                          type: "Select",
                          label: "Select",
                          required: "off",
                          options: ["Option 1", "Option 2"]
                        }
                      },
                      {
                        type: "Form2Field",
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
                    _styles: ["story-button", "story-form-button", "submit"]
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
