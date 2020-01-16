import React from "react";
import ReactDOM from "react-dom";
import ClickOutside from "visual/component/ClickOutside";
import Toolbar from "./Toolbar";
import monitor from "../monitor";

let portalNodesByDocument = new WeakMap();

class PortalToolbar extends React.Component {
  static defaultProps = {
    arrow: true,
    manualControl: false,
    items: [],
    offsetTop: 14,
    offsetBottom: 14,
    offsetLeft: 0,
    onBeforeOpen: () => {},
    onBeforeClose: () => {},
    onOpen: () => {},
    onClose: () => {},
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onChange: () => console.log("ToolbarPortal default onChange")
  };

  node = null;

  state = {
    opened: false
  };

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    this.node = ReactDOM.findDOMNode(this);

    if (!portalNodesByDocument.get(this.node.ownerDocument)) {
      const portalNode = this.node.ownerDocument.createElement("div");

      portalNode.id = "brz-toolbar-portal";
      this.node.ownerDocument.body.appendChild(portalNode);
      portalNodesByDocument.set(this.node.ownerDocument, portalNode);
    }

    if (!this.props.manualControl) {
      this.node.addEventListener(
        "click",
        event => {
          if (event.toolbarHandled || monitor.getActive() === this) {
            return;
          }

          event.toolbarHandled = true;
          this.show(this.props);
        },
        false
      );
    }
  }

  componentWillUnmount() {
    monitor.unsetIfActive(this);
    this.node = null;
  }

  handleClick = e => {
    e.stopPropagation();

    this.props.onClick();
  };

  handleMouseEnter = e => {
    e.stopPropagation();

    const customEvent = new CustomEvent("brz.toolbar.mouseenter", {
      bubbles: true
    });
    this.node.dispatchEvent(customEvent);
    this.props.onMouseEnter();
  };

  handleMouseLeave = e => {
    e.stopPropagation();

    const customEvent = new CustomEvent("brz.toolbar.mouseleave", {
      bubbles: true
    });
    this.node.dispatchEvent(customEvent);
    this.props.onMouseLeave();
  };

  handleClickOutside = () => {
    monitor.unsetActive();
  };

  handleMonitorActivationRequest() {
    this.show();
  }

  handleMonitorDeactivationRequest() {
    this.hide();
  }

  show() {
    if (monitor.getActive() !== this) {
      monitor.setActive(this);
      this.props.onBeforeOpen();
      this.setState({ opened: true }, () => {
        const e = new CustomEvent("brz.toolbar.open", {
          bubbles: true
        });
        this.node.dispatchEvent(e);
        this.props.onOpen();
      });
    }
  }

  hide() {
    if (this.state.opened) {
      this.props.onBeforeClose();
      this.setState({ opened: false }, () => {
        const e = new CustomEvent("brz.toolbar.close", {
          bubbles: true
        });
        this.node.dispatchEvent(e);
        this.props.onClose();
      });
    }
  }

  clickOutsideException = clickTarget => {
    try {
      // eslint-disable-next-line react/no-find-dom-node
      const node = ReactDOM.findDOMNode(this);
      return node.contains(clickTarget);
    } catch (e) {
      return false;
    }
  };

  getOutSideExceptions = () => {
    return [
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-fixed",
      this.clickOutsideException // makes the toolbar not rerender when clicking repeatedly on the same node
    ];
  };

  renderToolbar() {
    const items = this.props.getItems();

    if (!items || items.length === 0) {
      return;
    }

    const ownerDocument = this.node.ownerDocument;
    const portalNode = portalNodesByDocument.get(ownerDocument);

    return ReactDOM.createPortal(
      <ClickOutside
        exceptions={this.getOutSideExceptions()}
        onClickOutside={this.handleClickOutside}
      >
        <Toolbar
          {...this.props}
          window={ownerDocument.defaultView}
          items={items}
          node={this.node}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      </ClickOutside>,
      portalNode
    );
  }

  render() {
    const { children } = this.props;
    const { opened } = this.state;

    return (
      <React.Fragment>
        {children}
        {opened && this.renderToolbar()}
      </React.Fragment>
    );
  }
}

export default PortalToolbar;
