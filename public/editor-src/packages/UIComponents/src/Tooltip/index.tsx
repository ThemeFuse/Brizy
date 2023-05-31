import classnames from "classnames";
import React, { ReactElement, ReactNode, RefObject } from "react";
import { Manager, Reference } from "react-popper";
import _ from "underscore";
import { ClickOutside } from "../ClickOutside";
import { Portal } from "../components/Portal";
import { TooltipContent as Content } from "./components/Content";
import { Props, State } from "./types";

const stack: Tooltip[] = [];

export const getCurrentTooltip = (): Tooltip | undefined => {
  return stack[stack.length - 1];
};

export { TooltipItem } from "./components/TooltipItem";

export class Tooltip extends React.Component<Props> {
  state: State = { isOpen: false, isHidden: false, needClose: false };

  contentRef: RefObject<HTMLDivElement> = React.createRef();

  private timeout?: number | NodeJS.Timeout;

  componentWillUnmount(): void {
    const index = stack.indexOf(this);

    if (index !== -1) {
      stack.splice(index);
    }
    clearTimeout(this.timeout as NodeJS.Timeout);
  }

  handleClickOutside = (): void => {
    const { isOpen } = this.state;

    if (isOpen) {
      this.close();
    }
  };

  handleContentClick = (): void => {
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

  handleMouseEnter = (): void => {
    this.setState({
      needClose: false
    });

    this.open();
  };

  handleMouseLeave = (): void => {
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

  open(): void {
    const { isOpen } = this.state;

    if (!isOpen) {
      this.setState({ isOpen: true }, () => {
        stack.push(this);
        this.props.onOpen?.();
      });
    }
  }

  close(): void {
    const { isOpen } = this.state;

    if (isOpen) {
      this.setState({ isOpen: false }, () => {
        stack.pop();
        this.props.onClose?.();
      });
    }
  }

  show(): void {
    const { isHidden } = this.state;

    if (isHidden) {
      this.setState({ isHidden: false });
    }
  }

  hide(): void {
    const { isHidden } = this.state;

    if (!isHidden) {
      this.setState({ isHidden: true });
    }
  }

  reposition(): void {
    this.forceUpdate();
  }

  renderOverlay(): ReactNode {
    const { isOpen, isHidden } = this.state;

    if (!isOpen) {
      return null;
    }

    const {
      overlayClassName,
      nodeRef,
      overlay,
      showArrow,
      placement,
      size,
      offset,
      toolbar,
      isInPortal,
      portalNode
    } = this.props;
    const node = (nodeRef && nodeRef.current) || this.contentRef.current;
    const portal = portalNode || node?.ownerDocument.body;

    const content = (
      <Content
        className={overlayClassName}
        node={node ?? undefined}
        showArrow={showArrow}
        placement={placement}
        size={size}
        offset={offset}
        isOpen={isOpen}
        toolbar={toolbar}
      >
        {overlay}
      </Content>
    );

    const portalClassName = classnames(
      "brz-reset-all",
      "brz-ed-tooltip__content-portal",
      { "brz-invisible": isHidden }
    );

    return (isInPortal || toolbar) && portal ? (
      <Portal node={portal} className={portalClassName}>
        {content}
      </Portal>
    ) : (
      content
    );
  }

  renderContent(): ReactElement {
    const { title, children, showOnClick } = this.props;

    return (
      <div
        title={title}
        ref={this.contentRef}
        className="brz-ed-tooltip__content"
        onClick={showOnClick ? this.handleContentClick : _.noop}
      >
        {children}
      </div>
    );
  }

  renderInToolbar(): ReactElement {
    return (
      <>
        {this.renderContent()}
        {this.renderOverlay()}
      </>
    );
  }

  renderSimple(): ReactElement {
    return (
      <Manager>
        <Reference>{(): ReactElement => this.renderContent()}</Reference>
        {this.renderOverlay()}
      </Manager>
    );
  }

  render(): ReactElement {
    const {
      toolbar,
      showOnClick,
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
      ...(_clickOutsideExceptions ?? []),
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-eyeDropper"
    ];

    return (
      <ClickOutside
        onClickOutside={this.handleClickOutside}
        exceptions={clickOutsideExceptions}
      >
        {(ref: RefObject<HTMLDivElement>) => (
          <div
            ref={ref}
            className={className}
            onMouseEnter={showOnClick ? _.noop : this.handleMouseEnter}
            onMouseLeave={showOnClick ? _.noop : this.handleMouseLeave}
          >
            {toolbar ? this.renderInToolbar() : this.renderSimple()}
          </div>
        )}
      </ClickOutside>
    );
  }
}
