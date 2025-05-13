import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import Prompts from "visual/component/Prompts";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/providers/ConfigProvider";
import { updatePopupRules } from "visual/redux/actions";
import { updateGBRules } from "visual/redux/actions2";
import { globalBlocksSelector } from "visual/redux/selectors";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Rule } from "visual/types/Rule";
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

interface OptionsData {
  type: "block" | "popup";
  value: string;
  rules: GlobalBlock["rules"];
  dispatch: Dispatch;
}

export function getOptions(data: OptionsData, config: ConfigCommon): Options {
  const { type, value, rules, dispatch } = data;
  let options: Options = [];

  switch (type) {
    case "block": {
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
            const data = {
              data: { rules, id: value },
              meta
            };
            dispatch(updateGBRules(data));
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
      const { popupConditions } = config.api ?? {};
      const save = popupConditions?.conditions?.save;

      if (!isExternalPopup(config) && save) {
        options.push({
          id: "rules",
          type: "rules",
          icon: "nc-eye-17",
          label: t("Conditions"),
          title: t("WHERE DO YOU WANT TO DISPLAY IT?"),
          context: "popup",
          asyncGetValue: () => getRulesList(config),
          onChange: (data) => {
            dispatch(updatePopupRules(data));
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
  const globalBlocks = useSelector(globalBlocksSelector);
  const dispatch = useDispatch();
  const config = useConfig();
  const { rules } = globalBlocks[value] ?? { rules: [] };

  const handleMouseDown = (): void => {
    const data = { type: context, value, rules, dispatch };
    Prompts.open({
      prompt: "conditions",
      mode: "single",
      props: {
        options: getOptions(data, config)
      }
    });
  };

  return React.cloneElement(React.Children.only(children), {
    onMouseDown: handleMouseDown
  });
};

export default ConditionsComponent;
