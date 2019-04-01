import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import ClickOutside from "visual/component/ClickOutside";
import ToolbarItems from "./ToolbarItems";
import monitor from "./monitor";

import { CSSTransition, TransitionGroup } from "react-transition-group";

const animationClassName = {
  leftToRight: "animation-left-right",
  rightToLeft: "animation-right-left"
};

class CollapsibleToolbar extends React.Component {
  static defaultProps = {
    className: "",
    animation: "leftToRight",
    badge: false,
    arrow: false,
    items: [],
    outSideExceptions: [],
    onChange: _.noop,
    onBeforeOpen: _.noop,
    onBeforeClose: _.noop,
    onOpen: _.noop,
    onClose: _.noop
  };

  state = {
    opened: false
  };

  componentWillUnmount() {
    monitor.unsetIfActive(this);
  }

  getOutSideExceptions() {
    const { outSideExceptions } = this.props;

    return [
      ".brz-ed-collapsible__toolbar",
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      ...outSideExceptions
    ];
  }

  onClickOutside = () => {
    monitor.unsetIfActive(this);

    if (this.state.opened) {
      this.setState({
        opened: false
      });
      this.props.onClose();
    }
  };

  handleClick = () => {
    const nextOpened = !this.state.opened;

    if (nextOpened) {
      this.open();
    } else {
      this.close();
    }
  };

  handleMonitorActivationRequest() {
    this.open();
  }

  handleMonitorDeactivationRequest() {
    this.close();
  }

  open() {
    monitor.setActive(this);
    this.props.onBeforeOpen();
    this.props.onOpen();
    this.setState({ opened: true });
  }

  close() {
    monitor.unsetIfActive(this);
    this.props.onBeforeClose();
    this.props.onClose();
    this.setState({ opened: false });
  }

  renderBadge() {
    return (
      <CSSTransition key="badge" timeout={0}>
        <div className="brz-ed-collapsible__badge">
          <EditorIcon icon="nc-global" />
        </div>
      </CSSTransition>
    );
  }

  renderIcon() {
    return (
      <CSSTransition key="icon" classNames="fadeCollapsibleIcon" timeout={200}>
        <div className="brz-ed-collapsible__icon" onClick={this.handleClick}>
          <EditorIcon icon="nc-settings" />
        </div>
      </CSSTransition>
    );
  }

  renderToolbar() {
    const { getItems, arrow, animation } = this.props;
    const items = getItems();

    return (
      <CSSTransition
        key="toolbar"
        classNames={animationClassName[animation]}
        timeout={200}
      >
        <div className="brz-ed-collapsible__toolbar">
          <ToolbarItems items={items} arrow={arrow} />
        </div>
      </CSSTransition>
    );
  }

  render() {
    const { className: _className, badge } = this.props;
    const className = classnames("brz-ed-collapsible", _className);

    return (
      <ClickOutside
        onClickOutside={this.onClickOutside}
        exceptions={this.getOutSideExceptions()}
      >
        <div className={className}>
          <TransitionGroup className="brz-ed-collapsible-wrap">
            {badge && this.renderBadge()}
            {this.state.opened ? this.renderToolbar() : this.renderIcon()}
          </TransitionGroup>
        </div>
      </ClickOutside>
    );
  }
}

export default CollapsibleToolbar;
