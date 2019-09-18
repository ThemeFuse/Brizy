import React from "react";
import classnames from "classnames";
import Portal from "visual/component/Portal";
import ClickOutside from "visual/component/ClickOutside";
import Content from "./Content";

let stack = [];

export let getCurrentTooltip = () => {
  return stack[stack.length - 1];
};

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
    toolbar: null,
    inPortal: false,
    clickOutsideExceptions: [],
    nodeRef: null,
    onOpen: () => {},
    onClose: () => {}
  };

  state = {
    isOpen: false,
    isHidden: false
  };

  isMounted = false;

  contentRef = React.createRef();

  componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount() {
    const index = stack.indexOf(this);

    if (index !== -1) {
      stack.splice(index);
    }

    this.isMounted = false;
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
    setTimeout(() => {
      if (this.isMounted && this.state.needClose) {
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
      toolbar,
      inPortal
    } = this.props;
    const node = (nodeRef && nodeRef.current) || this.contentRef.current;

    const content = (
      <Content
        className={overlayClassName}
        node={node}
        arrow={arrow}
        placement={placement}
        size={size}
        isOpen={isOpen}
        toolbar={toolbar}
        inPortal={inPortal}
      >
        {overlay}
      </Content>
    );

    return inPortal || toolbar ? (
      <Portal
        node={node.ownerDocument.body}
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
  }

  render() {
    const {
      className: _className,
      title,
      toolbar,
      children,
      clickOutsideExceptions: _clickOutsideExceptions,
      openOnClick
    } = this.props;
    const clickOutsideExceptions = [
      ..._clickOutsideExceptions,
      ".brz-ed-tooltip__content-portal"
    ];
    let attributes = {
      className: classnames(
        "brz-ed-tooltip",
        { "brz-ed-tooltip__static": !toolbar },
        { "brz-ed-tooltip--opened": this.state.isOpen },
        _className
      )
    };
    let contentAttributes = {
      ref: this.contentRef,
      title,
      className: "brz-ed-tooltip__content"
    };

    if (openOnClick) {
      contentAttributes.onClick = this.handleContentClick;
    } else {
      attributes.onMouseEnter = this.handleMouseEnter;
      attributes.onMouseLeave = this.handleMouseLeave;
    }

    return (
      <ClickOutside
        onClickOutside={this.handleClickOutside}
        exceptions={clickOutsideExceptions}
      >
        <div {...attributes}>
          <div {...contentAttributes}>{children}</div>
          {this.renderOverlay()}
        </div>
      </ClickOutside>
    );
  }
}
