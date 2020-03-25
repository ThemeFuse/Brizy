import React from "react";
import classnames from "classnames";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import EditorIcon from "visual/component/EditorIcon";
import ClickOutside from "visual/component/ClickOutside";
import HotKeys from "visual/component/HotKeys";
import { ToolbarItems, ToolbarItemsProps } from "./ToolbarItems";
import { monitor, ToolbarMonitorHandler } from "./monitor";
import { OptionDefinition } from "visual/component/Options/Type";
import { RightSidebarItems } from "../RightSidebar/RightSidebarItems";

type CollapsibleToolbarProps = {
  getItems: () => OptionDefinition[];
  getSidebarItems?: () => OptionDefinition[];
  getSidebarTitle?: () => string;
  className?: string;
  animation?: "leftToRight" | "rightToLeft";
  badge?: boolean;
  onBeforeOpen?: () => void;
  onBeforeClose?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
} & ToolbarItemsProps;

type CollapsibleToolbarState = {
  opened: boolean;
};

export default class CollapsibleToolbar
  extends React.Component<CollapsibleToolbarProps, CollapsibleToolbarState>
  implements ToolbarMonitorHandler {
  static defaultProps = {
    animation: "leftToRight",
    badge: false
  };

  state = {
    opened: false
  };

  componentWillUnmount(): void {
    monitor.unsetIfActive(this);
  }

  getClickOutSideExceptions(): string[] {
    return [
      ".brz-ed-collapsible__toolbar",
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      ...(TARGET === "WP"
        ? [
            ".media-modal", // class of the WP media modal
            ".media-modal-backdrop"
          ]
        : [])
    ];
  }

  onClickOutside = (): void => {
    this.close();
  };

  handleClick = (): void => {
    const nextOpened = !this.state.opened;

    if (nextOpened) {
      this.open();
    } else {
      this.close();
    }
  };

  handleEscape = (): void => {
    this.close();
  };

  handleMonitorActivationRequest(): void {
    this.open();
  }

  handleMonitorDeactivationRequest(): void {
    this.close();
  }

  open(): void {
    if (this.state.opened) {
      return;
    }

    const { onBeforeOpen, onOpen } = this.props;

    monitor.setActive(this);
    onBeforeOpen && onBeforeOpen();
    this.setState({ opened: true }, () => {
      onOpen && onOpen();
    });
  }

  close(): void {
    if (!this.state.opened) {
      return;
    }

    const { onBeforeClose, onClose } = this.props;

    monitor.unsetIfActive(this);
    onBeforeClose && onBeforeClose();
    this.setState({ opened: false }, () => {
      onClose && onClose();
    });
  }

  renderBadge(): React.ReactNode {
    return (
      <CSSTransition key="badge" timeout={0}>
        <div className="brz-ed-collapsible__badge">
          <EditorIcon icon="nc-global" />
        </div>
      </CSSTransition>
    );
  }

  renderIcon(): React.ReactNode {
    return (
      <CSSTransition key="icon" classNames="fadeCollapsibleIcon" timeout={200}>
        <div className="brz-ed-collapsible__icon" onClick={this.handleClick}>
          <EditorIcon icon="nc-settings" />
        </div>
      </CSSTransition>
    );
  }

  renderToolbar(): React.ReactNode {
    const { getItems, animation } = this.props;
    const animationClassName =
      animation === "leftToRight"
        ? "animation-left-right"
        : "animation-right-left";
    const items = getItems();

    return (
      <CSSTransition
        key="toolbar"
        classNames={animationClassName}
        timeout={200}
      >
        <div className="brz-ed-collapsible__toolbar">
          <ToolbarItems items={items} arrow={false} />
        </div>
      </CSSTransition>
    );
  }

  render(): React.ReactNode {
    const {
      className: _className,
      badge,
      getSidebarItems,
      getSidebarTitle
    } = this.props;
    const { opened } = this.state;
    const className = classnames(
      "brz-ed-collapsible",
      { "brz-ed-collapsible--opened": opened },
      _className
    );

    return (
      <>
        <ClickOutside
          onClickOutside={this.onClickOutside}
          exceptions={this.getClickOutSideExceptions()}
        >
          <TransitionGroup className={className}>
            {badge && this.renderBadge()}
            {opened ? this.renderToolbar() : this.renderIcon()}
          </TransitionGroup>
        </ClickOutside>
        {opened && getSidebarItems && (
          <RightSidebarItems
            getItems={getSidebarItems}
            getTitle={getSidebarTitle}
          />
        )}
        {opened && (
          <HotKeys
            keyNames={["esc"]}
            id="key-helper-toolbar-escape"
            onKeyUp={this.handleEscape}
          />
        )}
      </>
    );
  }
}
