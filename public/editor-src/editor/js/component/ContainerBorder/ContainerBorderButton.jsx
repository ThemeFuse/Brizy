import React, { Component } from "react";
import classnames from "classnames";
import { CSSTransition } from "react-transition-group";
import EditorIcon from "visual/component/EditorIcon";

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

  renderIcon() {
    const { icon, activeIcon } = this.props;
    const { active } = this.state;

    if (!activeIcon) {
      return <EditorIcon icon={icon} />;
    }

    return (
      <CSSTransition in={active} timeout={150} classNames="brz-ed-fade">
        {active ? (
          <EditorIcon kre="activeIcon" icon={activeIcon} />
        ) : (
          <EditorIcon key="icon" icon={icon} />
        )}
      </CSSTransition>
    );
  }

  render() {
    const { innerRef, className: className_, position } = this.props;
    const { active } = this.state;

    const className = classnames("brz-ed-border__button", className_, {
      "brz-ed-border__button--top-left": position === "topLeft",
      "brz-ed-border__button--top-right": position === "topRight",
      "brz-ed-border__button--active": active
    });

    return (
      <div
        ref={innerRef}
        className={className}
        data-sortable-handle={this.props["data-sortable-handle"]}
      >
        {this.renderIcon()}
      </div>
    );
  }
}

export default ContainerBorderButton;
