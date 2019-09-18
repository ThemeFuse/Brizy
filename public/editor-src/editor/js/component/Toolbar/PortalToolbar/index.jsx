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
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onChange: () => console.log("ToolbarPortal default onChange")
  };

  node = null;

  state = {
    opened: false
  };

  componentDidMount() {
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
      this.setState({ opened: true }, this.props.onOpen);
    }
  }

  hide() {
    if (this.state.opened) {
      this.props.onBeforeClose();
      this.setState({ opened: false }, this.props.onClose);
    }
  }

  clickOutsideException = clickTarget => {
    try {
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
