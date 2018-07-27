import React from "react";
import classnames from "classnames";
import Portal from "visual/component-new/Portal";
import ClickOutside from "visual/component-new/ClickOutside";
import Content from "./Content";

export let currentTooltip = null;

export default class Tooltip extends React.Component {
  static defaultProps = {
    className: "",
    arrow: true,
    placement: "top-center",
    overlay: "",
    size: "",
    title: "",
    toolbar: null,
    clickOutsideExceptions: [],
    onOpen: () => {},
    onClose: () => {}
  };

  state = {
    isOpen: false,
    isHidden: false
  };

  componentWillUnmount() {
    currentTooltip = null;
  }

  handleContentRef = el => {
    this.content = el;
  };

  handleClickOutside = () => {
    const { isOpen } = this.state;

    if (isOpen) {
      this.close();
    }
  };

  handleContentClick = () => {
    const { isOpen, isHidden } = this.state;

    if (!isOpen) {
      this.open();
    } else {
      if (isHidden) {
        this.show();
      } else {
        this.close();
      }
    }
  };

  open() {
    const { isOpen } = this.state;

    if (!isOpen) {
      this.setState({ isOpen: true }, () => {
        currentTooltip = this;
        this.props.onOpen();
      });
    }
  }

  close() {
    const { isOpen } = this.state;

    if (isOpen) {
      this.setState({ isOpen: false }, () => {
        currentTooltip = null;
        this.props.onClose();
      });
    }
  }

  show() {
    const { isHidden } = this.state;

    if (isHidden) {
      this.setState({ isHidden: false });
    }
  }

  hide() {
    const { isHidden } = this.state;

    if (!isHidden) {
      this.setState({ isHidden: true });
    }
  }

  reposition() {
    this.forceUpdate();
  }

  renderOverlay = () => {
    const { isOpen, isHidden } = this.state;

    if (!isOpen) {
      return null;
    }

    const { overlay, arrow, placement, size, toolbar } = this.props;

    const content = (
      <Content
        node={this.content}
        arrow={arrow}
        placement={placement}
        size={size}
        isOpen={isOpen}
        toolbar={toolbar}
      >
        {overlay}
      </Content>
    );

    return toolbar ? (
      <Portal
        node={this.content.ownerDocument.body}
        className={classnames(
          "brz-reset-all",
          "brz-ed-tooltip__content-portal",
          {
            "brz-invisible": isHidden
          }
        )}
      >
        {content}
      </Portal>
    ) : (
      content
    );
  };

  render() {
    const {
      className: _className,
      title,
      toolbar,
      children,
      clickOutsideExceptions: _clickOutsideExceptions
    } = this.props;
    const { isOpen } = this.state;
    const className = classnames(
      "brz-ed-tooltip",
      { "brz-ed-tooltip__static": !toolbar },
      { "brz-ed-tooltip--opened": isOpen },
      _className
    );
    const clickOutsideExceptions = [
      ..._clickOutsideExceptions,
      ".brz-ed-tooltip__content-portal"
    ];

    return (
      <ClickOutside
        onClickOutside={this.handleClickOutside}
        exceptions={clickOutsideExceptions}
      >
        <div className={className}>
          <div
            ref={this.handleContentRef}
            title={title}
            className="brz-ed-tooltip__content"
            onClick={this.handleContentClick}
          >
            {children}
          </div>
          {this.renderOverlay()}
        </div>
      </ClickOutside>
    );
  }
}
