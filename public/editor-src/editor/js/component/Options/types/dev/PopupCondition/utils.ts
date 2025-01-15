import { useSelector } from "react-redux";
import {
  ConditionsProps,
  Trigger
} from "visual/component/Options/types/dev/PopupCondition/types";
import { isExternalPopup } from "visual/utils/models";
import { rulesAmountSelector, triggersSelector } from "visual/redux/selectors";

export const useConditions = ({ config }: ConditionsProps) => {
  const triggers: Trigger[] | null = useSelector(triggersSelector);
  const amountSelector = useSelector(rulesAmountSelector);
  let rulesAmount = 0;

  if (!isExternalPopup(config)) {
    rulesAmount = amountSelector || 0;
    // for cases when the rule was created by WP
    rulesAmount = rulesAmount === null ? 1 : rulesAmount;
  }

  if (triggers) {
    const triggerOnceExist = triggers.find(
      ({ id }: Trigger) => id === "triggerOnce"
    );

    const triggersLength = triggerOnceExist
      ? triggers.length
      : triggers.length + 1;

    return rulesAmount + triggersLength;
  }
};
