import React from "react";
import _ from "underscore";
import classnames from "classnames";
import { Manager, Reference } from "react-popper";
import Portal from "visual/component/Portal";
import ClickOutside from "visual/component/ClickOutside";
import Content from "./Content";

let stack = [];

export let getCurrentTooltip = () => {
  return stack[stack.length - 1];
};

export { TooltipItem } from "./TooltipItem";

export default class Tooltip extends React.Component {
  static defaultProps = {
    className: "",
    overlayClassName: "",
    arrow: true,
    placement: "top-center",
    openOnClick: true,
    closeDelay: 0,
    overlay: "",
    size: "", // small, medium, big, large
    title: "",
    offset: 15,
    toolbar: null,
    inPortal: false,
    portalNode: null,
    clickOutsideExceptions: [],
    nodeRef: null,
    onOpen: () => {},
    onClose: () => {}
  };

  state = {
    isOpen: false,
    isHidden: false
  };

  contentRef = React.createRef();

  componentWillUnmount() {
    const index = stack.indexOf(this);

    if (index !== -1) {
      stack.splice(index);
    }

    clearTimeout(this.timeout);
  }

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

  handleMouseEnter = () => {
    this.setState({
      needClose: false
    });

    this.open();
  };

  handleMouseLeave = () => {
    this.setState({
      needClose: true
    });

    // Close with delay
    this.timeout = setTimeout(() => {
      if (this.state.needClose) {
        this.close();
      }
    }, this.props.closeDelay);
  };

  open() {
    const { isOpen } = this.state;

    if (!isOpen) {
      this.setState({ isOpen: true }, () => {
        stack.push(this);
        this.props.onOpen();
      });
    }
  }

  close() {
    const { isOpen } = this.state;

    if (isOpen) {
      this.setState({ isOpen: false }, () => {
        stack.pop();
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

  renderOverlay() {
    const { isOpen, isHidden } = this.state;

    if (!isOpen) {
      return null;
    }

    const {
      overlayClassName,
      nodeRef,
      overlay,
      arrow,
      placement,
      size,
      offset,
      toolbar,
      inPortal,
      portalNode
    } = this.props;
    const node = (nodeRef && nodeRef.current) || this.contentRef.current;
    const portal = portalNode || node.ownerDocument.body;

    const content = (
      <Content
        className={overlayClassName}
        node={node}
        arrow={arrow}
        placement={placement}
        size={size}
        offset={offset}
        isOpen={isOpen}
        toolbar={toolbar}
        inPortal={inPortal}
      >
        {overlay}
      </Content>
    );

    return inPortal || toolbar ? (
      <Portal
        node={portal}
        className={classnames(
          "brz-reset-all",
          "brz-ed-tooltip__content-portal",
          { "brz-invisible": isHidden }
        )}
      >
        {content}
      </Portal>
    ) : (
      content
    );
  }

  renderInToolbar() {
    const { title, children, openOnClick } = this.props;

    return (
      <>
        <div
          title={title}
          ref={this.contentRef}
          className="brz-ed-tooltip__content"
          onClick={openOnClick ? this.handleContentClick : _.noop}
        >
          {children}
        </div>
        {this.renderOverlay()}
      </>
    );
  }

  renderSimple() {
    const { title, children, openOnClick } = this.props;

    return (
      <Manager>
        <Reference>
          {() => (
            <div
              title={title}
              ref={this.contentRef}
              className="brz-ed-tooltip__content"
              onClick={openOnClick ? this.handleContentClick : _.noop}
            >
              {children}
            </div>
          )}
        </Reference>
        {this.renderOverlay()}
      </Manager>
    );
  }

  render() {
    const {
      toolbar,
      openOnClick,
      className: _className,
      clickOutsideExceptions: _clickOutsideExceptions
    } = this.props;
    const className = classnames(
      "brz-ed-tooltip",
      { "brz-ed-tooltip__static": !toolbar },
      { "brz-ed-tooltip--opened": this.state.isOpen },
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
        <div
          className={className}
          onMouseEnter={openOnClick ? _.noop : this.handleMouseEnter}
          onMouseLeave={openOnClick ? _.noop : this.handleMouseLeave}
        >
          {toolbar ? this.renderInToolbar() : this.renderSimple()}
        </div>
      </ClickOutside>
    );
  }
}
