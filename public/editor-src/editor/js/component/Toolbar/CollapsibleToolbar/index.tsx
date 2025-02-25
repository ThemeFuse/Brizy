import classnames from "classnames";
import { isT } from "fp-utilities";
import React, { RefObject } from "react";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ClickOutside from "visual/component/ClickOutside";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import { RightSidebarItems } from "visual/component/RightSidebar/RightSidebarItems";
import { currentUserRole } from "visual/component/Roles";
import { filterOptions } from "visual/editorComponents/EditorComponent/utils";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import { targetExceptions } from "../../Options/constants";
import { ToolbarItems } from "../ToolbarItems";
import { ToolbarMonitorHandler, monitor } from "../monitor";
import { setPosition } from "../state";
import {
  CollapsibleToolbarProps,
  CollapsibleToolbarState,
  PropsWithState
} from "./types";

class _CollapsibleToolbar
  extends React.Component<PropsWithState, CollapsibleToolbarState>
  implements ToolbarMonitorHandler
{
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
      ".brz-ed-popup-integrations",
      ".brz-ed-popup-authorization",
      ".brz-ed-eyeDropper",
      ".brz-ed-popup-two-wrapper",
      ...targetExceptions
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

  getItems = (): OptionDefinition[] => {
    const device = this.props.device;
    const role = currentUserRole();

    return this.props.getItems().map(filterOptions(device, role)).filter(isT);
  };

  getSidebarItems = (): OptionDefinition[] => {
    const device = this.props.device;
    const role = currentUserRole();

    return this.props.getSidebarItems
      ? this.props
          .getSidebarItems()
          .map(filterOptions(device, role))
          .filter(isT)
      : [];
  };

  open(): void {
    if (this.state.opened) {
      return;
    }

    setPosition("below");

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
    const { membership, language, global } = this.props;

    if (!membership && !global && !language) {
      return null;
    }

    return (
      <CSSTransition key="badge" timeout={0}>
        <div className="brz-ed-collapsible__badge">
          {global && <EditorIcon icon="nc-global" />}
          {membership && <EditorIcon icon="nc-user" />}
          {language && <EditorIcon icon="nc-multi-languages" />}
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

  renderToolbar(ref: RefObject<HTMLDivElement>): React.ReactNode {
    const { animation = "leftToRight" } = this.props;
    const animationClassName =
      animation === "leftToRight"
        ? "animation-left-right"
        : "animation-right-left";
    const items = this.getItems();

    return (
      <CSSTransition
        key="toolbar"
        classNames={animationClassName}
        timeout={200}
      >
        <div className="brz-ed-collapsible__toolbar" ref={ref}>
          <ToolbarItems items={items} arrow={false} />
        </div>
      </CSSTransition>
    );
  }

  render(): React.ReactNode {
    const {
      className: _className,
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
          {({ ref }) => (
            <TransitionGroup className={className}>
              {this.renderBadge()}
              {opened ? this.renderToolbar(ref) : this.renderIcon()}
            </TransitionGroup>
          )}
        </ClickOutside>
        {opened && getSidebarItems && (
          <RightSidebarItems
            getItems={this.getSidebarItems}
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

export default connect<
  { device: DeviceMode },
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  CollapsibleToolbarProps,
  ReduxState
>((s) => ({ device: s.ui.deviceMode }), null, null, { forwardRef: true })(
  _CollapsibleToolbar
);
