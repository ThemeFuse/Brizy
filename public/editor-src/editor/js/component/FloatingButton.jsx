import React, { Component } from "react";
import classnames from "classnames";
import { CSSTransition, Transition } from "react-transition-group";
import ClickOutside from "visual/component/ClickOutside";
import EditorIcon from "visual/component/EditorIcon";

class FloatingButton extends Component {
  static defaultProps = {
    className: "",
    icon: "nc-stre-up",
    activeIcon: "nc-drag",
    color: "grey", // grey, blue
    clickOutsideExceptions: [".brz-ed-sidebar__right"],
    reactToClick: true
  };

  state = {
    active: false
  };

  handleClick = () => {
    if (!this.state.active) {
      this.setState({
        active: true
      });
    }
  };

  handleClickOutside = () => {
    if (this.state.active) {
      this.setState({
        active: false
      });
    }
  };

  setActive = active => {
    this.setState({ active });
  };

  renderIcon = () => {
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
  };

  render() {
    const { active } = this.state;
    const {
      className: _className,
      color,
      icon,
      activeIcon,
      clickOutsideExceptions,
      reactToClick
    } = this.props;
    const className = classnames(
      "brz-ed-floating__button",
      { [`brz-ed-floating__button--${color}`]: color },
      _className,
      {
        "brz-ed-floating__button--active": active
      }
    );
    const iconClassName = classnames({
      "brz-ed-floating__button--icon-active": active
    });

    if (!reactToClick) {
      return <div className={className}>{this.renderIcon()}</div>;
    }

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.handleClickOutside}
      >
        <div className={className} onClick={this.handleClick}>
          {this.renderIcon()}
        </div>
      </ClickOutside>
    );
  }
}

export default FloatingButton;
