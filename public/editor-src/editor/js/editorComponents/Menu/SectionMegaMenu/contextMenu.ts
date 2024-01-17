import { t } from "visual/utils/i18n";

const getItems = () =>  [
    {
      id: "main",
      type: "group",
      title: t("Mega Menu"),
      items: [
        {
          id: "duplicate",
          type: "button",
          disabled: true
        },
        {
          id: "remove",
          type: "button",
          disabled: true
        },
        {
          id: "paste",
          type: "button",
          disabled: true
        }
      ]
    }
  ];

export default {
  getItems
};
