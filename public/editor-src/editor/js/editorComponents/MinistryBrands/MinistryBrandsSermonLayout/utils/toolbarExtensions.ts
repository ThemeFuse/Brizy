import { Props as TabProps } from "visual/component/Options/types/dev/Tabs/index";
import { t } from "visual/utils/i18n";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export const getAdditionalColorOptions = (): TabProps["tabs"] => [
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
