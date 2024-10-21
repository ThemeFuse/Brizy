import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Props as TabProps } from "visual/component/Options/types/dev/Tabs/index";
import { t } from "visual/utils/i18n";

export const additionalColorOptions: TabProps["tabs"] = [
  {
    id: "tabItemBg",
    label: t("Item Background"),
    options: [
      {
        id: "item",
        type: "backgroundColor",
        states: [NORMAL, HOVER]
      }
    ]
  }
];
