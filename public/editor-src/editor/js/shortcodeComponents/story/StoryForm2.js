import { t } from "visual/utils/i18n";

export default {
  id: "form",
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
              }
            ]
          }
        }
      ]
    }
  }
};
