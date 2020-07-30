import React from "react";
import Prompts from "visual/component/Prompts";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { getStore } from "visual/redux/store";
import { updatePopupRules } from "visual/redux/actions";
import { updateGBRules } from "visual/redux/actions2";
import { GlobalBlock } from "visual/types";
import { getRulesList } from "visual/utils/api/editor";
import { IS_EXTERNAL_POPUP } from "visual/utils/models";

import { globalBlocksSelector } from "visual/redux/selectors";

const IS_PRO = Config.get("pro");

type ChangeCallbackData = {
  data: {
    rules: GlobalBlock["rules"];
  };
  meta: {
    syncSuccess: (s?: void) => void;
    syncFail: (e?: void) => void;
  };
};

type Options = {
  id: string;
  type: string;
  icon: string;
  label: string;
  title: string;
  asyncGetValue?: () => Promise<unknown>;
  value?: GlobalBlock["rules"];
  onChange?: (data: ChangeCallbackData) => void;
}[];

export const ConditionsComponent: React.FC<{
  value: string;
  type?: "block" | "popup";
  children: React.ReactElement;
}> = ({ children, value, type = "block" }) => {
  let options: Options = [];
  switch (type) {
    case "block": {
      const state = getStore().getState();
      const globalBlocks = globalBlocksSelector(state);
      const { rules } = globalBlocks[value] as GlobalBlock;

      options = [
        {
          id: "rules",
          type: "rules",
          icon: "nc-eye-17",
          label: t("Conditions"),
          title: t("WHERE DO YOU WANT TO DISPLAY IT?"),
          value: rules,
          onChange: ({ data: { rules }, meta }: ChangeCallbackData): void => {
            getStore().dispatch(
              updateGBRules({
                data: {
                  rules,
                  id: value
                },
                meta
              })
            );
          }
        }
      ];
      break;
    }
    case "popup": {
      options = [
        {
          id: "triggers",
          type: "triggers",
          icon: "nc-triggers",
          label: t("Triggers"),
          title: t("WHAT WILL TRIGGER THE POPUP TO OPEN")
        }
      ];

      if (!IS_EXTERNAL_POPUP) {
        options.push({
          id: "rules",
          type: "rules",
          icon: "nc-eye-17",
          label: t("Conditions"),
          title: t("WHERE DO YOU WANT TO DISPLAY IT?"),
          asyncGetValue: getRulesList,
          onChange: data => {
            getStore().dispatch(updatePopupRules(data));
          }
        });
      }
      break;
    }
    default:
      console.error("type should be given!!!");
  }
  const handleMouseDown = (): void => {
    Prompts.open({
      prompt: "conditions",
      mode: "single",
      props: {
        options
      }
    });
  };

  if (!IS_PRO) {
    return React.Children.only(children);
  }

  return React.cloneElement(React.Children.only(children), {
    onMouseDown: handleMouseDown
  });
};

export default ConditionsComponent;
