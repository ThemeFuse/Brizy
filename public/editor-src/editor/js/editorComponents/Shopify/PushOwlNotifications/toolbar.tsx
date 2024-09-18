import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./index";

export const getItems = ({ v }: { v: Value }): ToolbarItemType[] => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device: "desktop", state: "normal" });

  const buttonType = dvv("buttonType") as string;

  return [
    {
      id: "toolbarVideoShopping",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Notifications")
      },
      options: [
        {
          id: "buttonType",
          label: t("Button Type"),
          type: "select",
          choices: [
            { title: "Subscription", value: "subscribe" },
            { title: "Back In Stock", value: "bis" },
            { title: "Product Discount", value: "pd" }
          ],
          helper: {
            content:
              buttonType !== "subscribe"
                ? t("Add only one item of this type on the page")
                : ""
          }
        },
        { id: "buttonName", type: "inputText", label: t("Button Name") },
        {
          id: "subMessage",
          type: "inputText",
          label: t("Post Subscription Text")
        },
        {
          id: "preDisplay",
          type: "select",
          label: t("Pre-display"),
          helper: {
            content: t("The button's state before visitors have subscribed")
          },
          choices: [
            { title: "Inline", value: "inline" },
            { title: "Block", value: "block" },
            { title: "Inline-Block", value: "inline-block" }
          ]
        },
        {
          id: "postDisplay",
          type: "select",
          label: t("Post-display Button"),
          helper: {
            content: t("The button's state after visitors have subscribed")
          },
          choices: [
            { title: "Inline", value: "inline" },
            { title: "Block", value: "block" },
            { title: "Inline-Block", value: "inline-block" },
            { title: "None", value: "none" }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      title: t("Settings")
    }
  ];
};
