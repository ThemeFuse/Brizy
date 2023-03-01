import classNames from "classnames";
import React from "react";
import _ from "underscore";
import { ConditionsComponent } from "visual/component/ConditionsComponent";
import Config from "visual/global/Config";
import { rulesAmountSelector, triggersSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";
import { isExternalPopup } from "visual/utils/models";

class PopupConditionsOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {}
  };

  calConditionsAmount() {
    const state = getStore().getState();
    let rulesAmount = 0;
    if (!isExternalPopup(Config.getAll())) {
      rulesAmount = rulesAmountSelector(state);
      // for cases when rule was created by WP
      rulesAmount = rulesAmount === null ? 1 : rulesAmount;
    }

    const triggers = triggersSelector(state);
    const triggerOnceExist = triggers.find(({ id }) => id === "triggerOnce");
    const triggersLength = triggerOnceExist
      ? triggers.length
      : triggers.length + 1;

    return rulesAmount + triggersLength;
  }

  render() {
    const { className: _className, attr: _attr } = this.props;

    const className = classNames(
      "brz-ed-option__popup_conditions",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <ConditionsComponent context="popup">
        <div className={className} {...attr}>
          <span className="brz-ed-option__popup_conditions-count">
            {this.calConditionsAmount()}
          </span>
          {t(" Display Conditions")}
        </div>
      </ConditionsComponent>
    );
  }
}

export default PopupConditionsOptionType;
