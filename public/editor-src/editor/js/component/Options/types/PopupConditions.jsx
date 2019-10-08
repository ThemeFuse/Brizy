import React from "react";
import _ from "underscore";
import PropTypes from "prop-types";
import classNames from "classnames";
import { t } from "visual/utils/i18n";
import UIState from "visual/global/UIState";
import { getStore } from "visual/redux/store";

import { rulesAmountSelector, triggersSelector } from "visual/redux/selectors";

class PopupConditionsOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {}
  };

  handleMouseDown = () => {
    const { value, onChange } = this.props;

    UIState.set("prompt", {
      prompt: "conditions",
      options: [
        {
          id: "triggers",
          type: "triggers",
          icon: "nc-triggers",
          label: t("Triggers"),
          title: t("WHAT WILL TRIGGER THE POPUP TO OPEN")
        },
        {
          id: "rules",
          type: "rules",
          icon: "nc-eye-17",
          label: t("Conditions"),
          title: t("WHERE DO YOU WANT TO DISPLAY IT?")
        }
      ]
    });
  };

  render() {
    const { className: _className, attr: _attr } = this.props;
    const state = getStore().getState();
    let rulesAmount = rulesAmountSelector(state);
    // for cases when rule was created by WP
    rulesAmount = rulesAmount === undefined ? 1 : rulesAmount;

    const triggers = triggersSelector(state);

    const className = classNames(
      "brz-ed-option__popup_conditions",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} onMouseDown={this.handleMouseDown} {...attr}>
        <span className="brz-ed-option__popup_conditions-count">
          {rulesAmount + triggers.length}
        </span>{" "}
        {t("Set up Popup")}
      </div>
    );
  }
}

export default PopupConditionsOptionType;
