import { t } from "visual/utils/i18n";

export default {
  id: "form",
  title: t("Form"),
  icon: "nc-form-left",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--iconText"],
      items: [
        {
          type: "Form",
          value: {
            _styles: ["form"],
            items: [
              {
                type: "FormFields",
                value: {
                  items: [
                    {
                      type: "FormField",
                      value: {
                        type: "Text",
                        label: "Input",
                        required: "off",
                        options: ["Option 1", "Option 2"]
                      }
                    },
                    {
                      type: "FormField",
                      value: {
                        type: "Select",
                        label: "Select",
                        required: "off",
                        options: ["Option 1", "Option 2"]
                      }
                    },
                    {
                      type: "FormField",
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
              }
            ]
          }
        }
      ]
    }
  }
};
