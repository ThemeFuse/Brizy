import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { getDynamicContentOption } from "visual/utils/options";
import type { Props, Value } from "./type";

export const getItems: GetItems<Value, Props> = ({ context }) => {
  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "cssID",
              label: t("CSS ID"),
              type: "population",
              devices: "desktop",
              display: "block",
              helper: {
                content: t(
                  "Add your custom ID without the #pound, example: my-id"
                )
              },
              config: richTextDC,
              option: {
                id: "customID",
                type: "inputText"
              }
            },
            {
              id: "cssClass",
              label: t("CSS Class"),
              type: "population",
              devices: "desktop",
              display: "block",
              helper: {
                content: t(
                  "Add your custom class without the .dot, example: my-class"
                )
              },
              config: richTextDC,
              option: {
                id: "customClassName",
                type: "inputText"
              }
            },
            {
              id: "customAttributes",
              label: t("Custom Attributes"),
              type: "codeMirror",
              placeholder: 'key1:"value1"\nkey2:"value2"',
              display: "block",
              devices: "desktop",
              helper: {
                content: t(
                  "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
                )
              },
              population: richTextDC
            }
          ]
        }
      ]
    }
  ];
};
