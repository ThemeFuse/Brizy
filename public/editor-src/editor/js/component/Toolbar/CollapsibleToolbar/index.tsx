import classnames from "classnames";
import { isT } from "fp-utilities";
import React, { RefObject, forwardRef } from "react";
import { connect } from "react-redux";
import { TransitionState } from "react-transition-state";
import ClickOutside from "visual/component/ClickOutside";
import HotKeys from "visual/component/HotKeys";
import { RightSidebarItems } from "visual/component/RightSidebar/RightSidebarItems";
import { currentUserRole } from "visual/component/Roles";
import { filterOptions } from "visual/editorComponents/EditorComponent/utils";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { useConfig } from "visual/providers/ConfigProvider";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import { targetExceptions } from "../../Options/constants";
import { ToolbarMonitorHandler, monitor } from "../monitor";
import { setPosition } from "../state";
import { AnimatedToolbar } from "./components/AnimatedToolbar";
import { Badge, BadgeProps } from "./components/Badge";
import { Icon, IconProps } from "./components/Icon";
import { Toolbar } from "./components/Toolbar";
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
      ".brz-ed-sidebar__addable",
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
    const { device, config, getItems: get } = this.props;
    const role = currentUserRole(config);

    return get().map(filterOptions(device, role)).filter(isT);
  };

  getSidebarItems = (): OptionDefinition[] => {
    const { device, config, getSidebarItems: get } = this.props;
    const role = currentUserRole(config);

    return get ? get().map(filterOptions(device, role)).filter(isT) : [];
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

  renderBadge = (): React.ReactElement<BadgeProps> | null => {
    const { membership, language, global } = this.props;
    const canRenderBadge = !(!membership && !global && !language);

    return canRenderBadge ? (
      <Badge membership={membership} language={language} global={global} />
    ) : null;
  };

  renderIcon = (state: TransitionState): React.ReactElement<IconProps> => {
    return <Icon {...state} onClick={this.handleClick} />;
  };

  renderToolbar = (
    ref: RefObject<HTMLDivElement>
  ): ((state: TransitionState) => React.ReactElement) => {
    return (state: TransitionState) => (
      <Toolbar
        {...state}
        ref={ref}
        items={this.getItems()}
        animation={this.props.animation}
      />
    );
  };

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
            <AnimatedToolbar
              opened={opened}
              className={className}
              renderBadge={this.renderBadge}
              renderToolbar={this.renderToolbar(ref)}
              renderIcon={this.renderIcon}
            />
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

type FCProps = Omit<PropsWithState, "config">;

const CollapsibleToolbar = forwardRef<_CollapsibleToolbar, FCProps>(
  (props, ref) => {
    const config = useConfig();

    return <_CollapsibleToolbar ref={ref} {...props} config={config} />;
  }
);

export default connect<
  { device: DeviceMode },
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  CollapsibleToolbarProps,
  ReduxState
>((s) => ({ device: s.ui.deviceMode }), null, null, {
  forwardRef: true
})(CollapsibleToolbar);
