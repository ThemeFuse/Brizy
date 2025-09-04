import { noop } from "es-toolkit";
import { isT } from "fp-utilities";
import React, { JSX, RefObject, createRef, forwardRef } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ClickOutside from "visual/component/ClickOutside";
import HotKeys from "visual/component/HotKeys";
import { targetExceptions } from "visual/component/Options/constants";
import { RightSidebarItems } from "visual/component/RightSidebar/RightSidebarItems";
import { currentUserRole } from "visual/component/Roles";
import { filterOptions } from "visual/editorComponents/EditorComponent/utils";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { useConfig } from "visual/providers/ConfigProvider";
import { ActionUpdateUI, setActiveElement } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { ActiveElement, DeviceMode } from "visual/types";
import { attachRef } from "visual/utils/react";
import {
  ToolbarExtendContext,
  ToolbarExtendContextType
} from "../ToolbarExtend";
import {
  DeactivationOptions,
  ToolbarMonitorHandler,
  monitor
} from "../monitor";
import { PortalToolbarPositioner } from "./PortalToolbarPositioner";
import { PortalToolbarProps } from "./types";
import { selectorSearchCoordinates, selectorSearchDomTree } from "./utils";

const portalNodesByDocument: Map<Document, HTMLElement> = new Map();

type PortalToolbarState = {
  opened: boolean;
};

type ToolbarClickEvent = Event & {
  brzToolbarHandled?: boolean;
};

interface PropsWithState extends PortalToolbarProps {
  device: DeviceMode;
  setActiveElement: (element: ActiveElement) => void;
}

class _PortalToolbar
  extends React.Component<
    PropsWithState,
    PortalToolbarState,
    ToolbarExtendContextType
  >
  implements ToolbarMonitorHandler
{
  static contextType = ToolbarExtendContext;

  static defaultProps = {
    manualControl: false,
    setActiveElement: noop
  };

  context: ToolbarExtendContextType = undefined;

  state: PortalToolbarState = {
    opened: false
  };

  node: Element | null = null;

  selectorNode: Element | null = null;

  ref: RefObject<HTMLDivElement> = createRef();

  componentDidMount(): void {
    this.node = this.ref.current;

    if (this.node === null) {
      return;
    }

    if (this.node.ownerDocument === null) {
      return;
    }

    if (!portalNodesByDocument.get(this.node.ownerDocument)) {
      const portalNode = this.node.ownerDocument.createElement("div");
      portalNode.id = "brz-toolbar-portal";
      this.node.ownerDocument.body.appendChild(portalNode);
      portalNodesByDocument.set(this.node.ownerDocument, portalNode);
    }

    if (!this.props.manualControl) {
      this.makeComponentControlled();
    }
  }

  componentDidUpdate({ manualControl = false }: PortalToolbarProps): void {
    if (manualControl !== this.props.manualControl) {
      if (manualControl === true) {
        this.makeComponentControlled();
      } else {
        this.makeComponentUnControlled();
      }
    }
  }

  componentWillUnmount(): void {
    monitor.unsetIfActive(this);
    this.node = null;
    this.selectorNode = null;
  }

  makeComponentUnControlled = (): void => {
    if (this.node === null) {
      return;
    }

    this.node.removeEventListener("click", this.handleNodeClick);
  };

  makeComponentControlled = (): void => {
    if (this.node === null) {
      return;
    }

    this.node.addEventListener("click", this.handleNodeClick, false);
  };

  handleNodeClick = (event: Event): void => {
    if (this.node === null || (event as ToolbarClickEvent).brzToolbarHandled) {
      return;
    }

    this.props.setActiveElement(this.node);

    if (this.props.selector === undefined) {
      if (monitor.getActive() === this) {
        return;
      }

      (event as ToolbarClickEvent).brzToolbarHandled = true;
      this.show();
    } else {
      const search =
        this.props.selectorSearchStrategy === "dom-tree"
          ? selectorSearchDomTree
          : selectorSearchCoordinates;
      const target = search(
        this.node,
        this.props.selector,
        event as MouseEvent
      );

      if (target) {
        (event as ToolbarClickEvent).brzToolbarHandled = true;

        if (this.state.opened === false) {
          this.selectorNode = target;
          this.show();
        } else if (target !== this.selectorNode) {
          this.hide({
            onComplete: () => {
              this.selectorNode = target;
              this.show();
            }
          });
        }
      } else {
        this.hide();
      }
    }
  };

  handleClick = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();

    const { onClick } = this.props;

    if (onClick) {
      onClick(e);
    }
  };

  handleMouseEnter = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();

    const { onMouseEnter } = this.props;

    if (onMouseEnter) {
      onMouseEnter(e);
    }

    if (this.node !== null) {
      const customEvent = new CustomEvent("brz.toolbar.mouseenter", {
        bubbles: true
      });
      this.node.dispatchEvent(customEvent);
    }
  };

  handleMouseLeave = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();

    const { onMouseLeave } = this.props;

    if (onMouseLeave !== undefined) {
      onMouseLeave(e);
    }

    if (this.node) {
      const customEvent = new CustomEvent("brz.toolbar.mouseleave", {
        bubbles: true
      });
      this.node.dispatchEvent(customEvent);
    }
  };

  handleEscape = (): void => {
    const ownProps = this.props;
    const contextProps = this.context;
    const finalProps = { ...contextProps, ...ownProps };

    if (finalProps.onEscape) {
      finalProps.onEscape();
    } else {
      this.hide();
    }
  };

  handleClickOutside = (): void => {
    monitor.unsetActive();
  };

  handleMonitorActivationRequest(): void {
    this.show();
  }

  handleMonitorDeactivationRequest(config?: DeactivationOptions): void {
    this.hide({ eventDetail: config });
  }

  show(): void {
    if (!this.state.opened) {
      const { onBeforeOpen, onOpen } = this.props;

      monitor.setActive(this);
      onBeforeOpen && onBeforeOpen();

      this.setState({ opened: true }, () => {
        onOpen && onOpen();

        if (this.node !== null) {
          const e = new CustomEvent("brz.toolbar.open", {
            bubbles: true
          });

          this.node.dispatchEvent(e);
        }
      });
    }
  }

  hide(config?: {
    onComplete?: () => void;
    eventDetail?: DeactivationOptions;
  }): void {
    if (this.state.opened) {
      const { onBeforeClose, onClose } = this.props;

      onBeforeClose && onBeforeClose();
      this.setState({ opened: false }, () => {
        onClose && onClose();

        if (this.node !== null) {
          const e = new CustomEvent("brz.toolbar.close", {
            bubbles: true,
            detail: config?.eventDetail
          });
          this.node.dispatchEvent(e);
        }

        config?.onComplete?.();
      });
    }
  }

  setNode(node: Element | null): void {
    if (node !== null) {
      this.node = node;
    }
  }

  clickOutsideException = (clickTarget: HTMLElement): boolean => {
    try {
      const node = this.ref.current;
      return node !== null && node.contains(clickTarget);
    } catch (e) {
      return false;
    }
  };

  getOutSideExceptions = (): (string | ((t: HTMLElement) => boolean))[] => {
    return [
      ".brz-ed-sidebar__right",
      ".brz-ed-sidebar__addable",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-fixed",
      ".brz-ed-box__resizer--point",
      ".brz-ed-eyeDropper",
      ...targetExceptions,
      this.clickOutsideException // makes the toolbar not rerender when clicking repeatedly on the same node
    ];
  };

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

  renderToolbar(): React.ReactNode {
    if (this.node === null) {
      return;
    }
    if (this.node.ownerDocument === null) {
      return;
    }

    const items = this.getItems();

    if (!items || items.length === 0) {
      return;
    }

    const ownProps = this.props;
    const contextProps = this.context;
    const ownerDocument = this.node.ownerDocument;
    const portalNode = portalNodesByDocument.get(ownerDocument);

    return (
      <>
        {portalNode &&
          ReactDOM.createPortal(
            <>
              <ClickOutside
                exceptions={this.getOutSideExceptions()}
                onClickOutside={this.handleClickOutside}
              >
                {({ ref }) => {
                  const node = this.selectorNode ?? this.node;
                  attachRef(portalNode, ref);

                  return (
                    <PortalToolbarPositioner
                      {...contextProps}
                      {...ownProps}
                      items={items}
                      node={node}
                      onClick={this.handleClick}
                      onMouseEnter={this.handleMouseEnter}
                      onMouseLeave={this.handleMouseLeave}
                    />
                  );
                }}
              </ClickOutside>
              {ownProps.getSidebarItems && (
                <RightSidebarItems
                  getItems={this.getSidebarItems}
                  getTitle={ownProps.getSidebarTitle}
                />
              )}
              <HotKeys
                id="key-helper-toolbar-escape"
                keyNames={["esc"]}
                onKeyUp={this.handleEscape}
              />
            </>,
            portalNode
          )}
      </>
    );
  }

  render(): React.ReactNode {
    const { children } = this.props;
    const { opened } = this.state;

    return (
      <>
        {typeof children === "function"
          ? children({ open: this.handleNodeClick, ref: this.ref })
          : children}
        {opened && this.renderToolbar()}
      </>
    );
  }
}

export type PortalToolbarType = InstanceType<typeof _PortalToolbar>;

type FCProps = Omit<PropsWithState, "config">;

const PortalToolbar = forwardRef<PortalToolbarType, FCProps>(
  (props, ref): JSX.Element => {
    const config = useConfig();

    return <_PortalToolbar ref={ref} {...props} config={config} />;
  }
);

const mapDispatchToProps = (
  dispatch: Dispatch
): { setActiveElement: (element: ActiveElement) => ActionUpdateUI } => ({
  setActiveElement: (element: ActiveElement): ActionUpdateUI =>
    dispatch(setActiveElement(element))
});

export default connect<
  { device: DeviceMode },
  { setActiveElement: (element: ActiveElement) => void },
  Omit<PortalToolbarProps, "config">,
  ReduxState
>((s) => ({ device: s.ui.deviceMode }), mapDispatchToProps, null, {
  forwardRef: true
})(PortalToolbar);
