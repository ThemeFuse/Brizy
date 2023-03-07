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
      type: "popover-dev",
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
          type: "select-dev",
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
        { id: "buttonName", type: "inputText-dev", label: t("Button Name") },
        {
          id: "subMessage",
          type: "inputText-dev",
          label: t("Post Subscription Text")
        },
        {
          id: "preDisplay",
          type: "select-dev",
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
          type: "select-dev",
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
      // @ts-expect-error: Old option
      type: "advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
};
