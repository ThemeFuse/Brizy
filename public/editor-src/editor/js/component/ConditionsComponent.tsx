import React, { ReactElement } from "react";
import Prompts from "visual/component/Prompts";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types";
import { updatePopupRules } from "visual/redux/actions";
import { updateGBRules } from "visual/redux/actions2";
import { globalBlocksSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { GlobalBlock, Rule } from "visual/types";
import { getRulesList } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { isExternalPopup } from "visual/utils/models";

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
  context: "block" | "popup";
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
          context: "block",
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
          context: "popup",
          title: t("WHAT WILL TRIGGER THE POPUP TO OPEN")
        }
      ];
      const config = Config.getAll();
      const { popupConditions } = config.api ?? {};
      const save = popupConditions?.conditions?.save;

      if (!isExternalPopup(Config.getAll()) && save) {
        // ts-ignore added because cms's getRulesList method is expecting
        // CollectionItemId, wp is expecting nothing
        const asyncGetValue = isCloud(config)
          ? (): Promise<Rule[]> => getRulesList(Config.get("page")?.id)
          : (): Promise<Rule[]> => getRulesList("");

        options.push({
          id: "rules",
          type: "rules",
          icon: "nc-eye-17",
          label: t("Conditions"),
          title: t("WHERE DO YOU WANT TO DISPLAY IT?"),
          context: "popup",
          asyncGetValue,
          onChange: (data) => {
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

export const ConditionsComponent = ({
  children,
  value,
  context
}: {
  value: string;
  context: "block" | "popup";
  children: React.ReactElement;
}): ReactElement => {
  const handleMouseDown = (): void => {
    Prompts.open({
      prompt: "conditions",
      mode: "single",
      props: {
        options: getOptions(context, value)
      }
    });
  };

  return React.cloneElement(React.Children.only(children), {
    onMouseDown: handleMouseDown
  });
};

export default ConditionsComponent;
