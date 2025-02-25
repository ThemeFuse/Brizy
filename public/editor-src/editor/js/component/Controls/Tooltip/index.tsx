import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { ReactElement, ReactNode, RefObject } from "react";
import { Manager, Reference } from "react-popper";
import ClickOutside from "visual/component/ClickOutside";
import Portal from "visual/component/Portal";
import { TimerType } from "visual/types/TimerType";
import { WithClassName } from "visual/types/attributes";
import { TooltipContent as Content, Props as ContentProps } from "./Content";

const stack: Tooltip[] = [];

export const getCurrentTooltip = (): Tooltip | undefined => {
  return stack[stack.length - 1];
};

export { TooltipItem } from "./TooltipItem";

export interface Prs extends WithClassName {
  overlayClassName?: string;
  arrow: boolean;
  placement: ContentProps["placement"];
  openOnClick: boolean;
  closeDelay: number;
  overlay: ReactNode;
  size?: "small" | "medium" | "large" | "xlarge" | "auto";
  title?: string;
  offset: number;
  toolbar: ContentProps["toolbar"];
  inPortal: boolean;
  portalNode?: HTMLElement;
  clickOutsideExceptions: string[];
  nodeRef?: RefObject<HTMLElement>;
  children: ReactNode;
  onOpen: VoidFunction;
  onClose: VoidFunction;
}

export type Props = Partial<Prs>;

export interface State {
  isOpen: boolean;
  isHidden: boolean;
  needClose: boolean;
}

export class Tooltip extends React.Component<Props> {
  static defaultProps: Prs = {
    arrow: true,
    placement: "top",
    openOnClick: true,
    closeDelay: 0,
    overlay: "",
    size: undefined, // small, medium, big, large
    offset: 15,
    toolbar: undefined,
    inPortal: false,
    portalNode: undefined,
    clickOutsideExceptions: [],
    nodeRef: undefined,
    children: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpen: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose: () => {}
  };

  state: State = {
    isOpen: false,
    isHidden: false,
    needClose: false
  };

  contentRef: RefObject<HTMLDivElement> = React.createRef();

  private timeout?: TimerType;

  componentWillUnmount(): void {
    const index = stack.indexOf(this);

    if (index !== -1) {
      stack.splice(index);
    }

    clearTimeout(this.timeout);
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
    }, this.props.closeDelay) as unknown as TimerType;
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
      arrow,
      placement,
      size,
      offset,
      toolbar,
      inPortal,
      portalNode
    } = this.props;
    const node = (nodeRef && nodeRef.current) || this.contentRef.current;
    const portal = portalNode || node?.ownerDocument.body;

    const content = (
      <Content
        className={overlayClassName}
        node={node ?? undefined}
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

    return (inPortal || toolbar) && portal ? (
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

  renderInToolbar(): ReactElement {
    const { title, children, openOnClick } = this.props;

    return (
      <>
        <div
          title={title}
          ref={this.contentRef}
          className="brz-ed-tooltip__content"
          onClick={openOnClick ? this.handleContentClick : noop}
        >
          {children}
        </div>
        {this.renderOverlay()}
      </>
    );
  }

  renderSimple(): ReactElement {
    const { title, children, openOnClick } = this.props;

    return (
      <Manager>
        <Reference>
          {(): ReactElement => (
            <div
              title={title}
              ref={this.contentRef}
              className={"brz-ed-tooltip__content"}
              onClick={openOnClick ? this.handleContentClick : noop}
            >
              {children}
            </div>
          )}
        </Reference>
        {this.renderOverlay()}
      </Manager>
    );
  }

  render(): ReactElement {
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
      ...(_clickOutsideExceptions ?? []),
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-eyeDropper"
    ];

    return (
      <ClickOutside
        onClickOutside={this.handleClickOutside}
        exceptions={clickOutsideExceptions}
      >
        {({ ref }) => (
          <div
            className={className}
            onMouseEnter={openOnClick ? noop : this.handleMouseEnter}
            onMouseLeave={openOnClick ? noop : this.handleMouseLeave}
            ref={ref}
          >
            {toolbar ? this.renderInToolbar() : this.renderSimple()}
          </div>
        )}
      </ClickOutside>
    );
  }
}

export default Tooltip;
