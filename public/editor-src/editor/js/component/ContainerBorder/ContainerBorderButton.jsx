import classnames from "classnames";
import React, { Component } from "react";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { BorderButtonIcon } from "./BorderButtonIcon";

class ContainerBorderButton extends Component {
  static defaultProps = {
    className: "",
    icon: "nc-stre-up",
    activeIcon: "nc-drag",
    position: "topRight" // topLeft, topRight
  };

  state = {
    active: false
  };

  setActive(active) {
    if (active !== this.state.active) {
      this.setState({ active });
    }
  }

  render() {
    const {
      innerRef,
      className: className_,
      position,
      containerRef,
      icon,
      activeIcon
    } = this.props;
    const { active } = this.state;

    const className = classnames("brz-ed-border__button", className_, {
      "brz-ed-border__button--top-left": position === "topLeft",
      "brz-ed-border__button--top-right": position === "topRight",
      "brz-ed-border__button--active": active
    });

    return (
      <div
        ref={(el) => {
          attachRefs(el, [innerRef, containerRef]);
        }}
        className={className}
        {...makeDataAttr({
          name: "sortable-handle",
          value: this.props[makeAttr("sortable-handle")]
        })}
      >
        <BorderButtonIcon icon={icon} activeIcon={activeIcon} active={active} />
      </div>
    );
  }
}

export default ContainerBorderButton;
