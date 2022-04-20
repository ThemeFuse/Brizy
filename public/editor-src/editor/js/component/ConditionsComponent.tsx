/* eslint-disable @typescript-eslint/no-use-before-define */
import React from "react";
import Prompts from "visual/component/Prompts";
import { t } from "visual/utils/i18n";
import { getStore } from "visual/redux/store";
import { updatePopupRules } from "visual/redux/actions";
import { updateGBRules } from "visual/redux/actions2";
import Config from "visual/global/Config";
import { GlobalBlock, Rule } from "visual/types";
import { getRulesList } from "visual/utils/api";
import { IS_CLOUD } from "visual/utils/env";
import { IS_EXTERNAL_POPUP } from "visual/utils/models";

import { globalBlocksSelector } from "visual/redux/selectors";

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
  asyncGetValue?: () => Promise<Rule[]>;
  value?: Rule[];
  onChange?: (data: ChangeCallbackData) => void;
}[];

export function getOptions(
  type: "block" | "popup" | undefined,
  value: string
): Options {
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
        // ts-ignore added because cms's getRulesList method is expecting
        // CollectionItemId, wp is expecting nothing
        const asyncGetValue = IS_CLOUD
          ? (): Promise<Rule[]> => getRulesList(Config.get("page")?.id)
          : // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            (): Promise<Rule[]> => getRulesList();

        options.push({
          id: "rules",
          type: "rules",
          icon: "nc-eye-17",
          label: t("Conditions"),
          title: t("WHERE DO YOU WANT TO DISPLAY IT?"),
          asyncGetValue,
          onChange: data => {
            // @ts-expect-error: Type 'string' is not assignable to type '"UPDATE_BLOCKS"'.
            getStore().dispatch(updatePopupRules(data));
          }
        });
      }
      break;
    }
    default:
      console.error("type should be given!!!");
  }

  return options;
}

export const ConditionsComponent: React.FC<{
  value: string;
  type?: "block" | "popup";
  children: React.ReactElement;
}> = ({ children, value, type = "block" }) => {
  const handleMouseDown = (): void => {
    Prompts.open({
      prompt: "conditions",
      mode: "single",
      props: {
        options: getOptions(type, value)
      }
    });
  };

  return React.cloneElement(React.Children.only(children), {
    onMouseDown: handleMouseDown
  });
};

export default ConditionsComponent;
