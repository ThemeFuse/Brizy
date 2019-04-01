import React from "react";
import ReactDOM from "react-dom";
import ClickOutside from "visual/component/ClickOutside";
import Toolbar from "./Toolbar";
import monitor from "../monitor";

let portalNodesByDocument = new WeakMap();
let portalNode;

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

  manualPropsGetter = null;

  componentDidMount() {
    if (!this.props.manualControl) {
      this.node = ReactDOM.findDOMNode(this);
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

  componentDidUpdate() {
    if (monitor.getActive() === this) {
      const props = this.props.manualControl
        ? this.manualPropsGetter()
        : this.props;

      this.renderPortal(props);
    }
  }

  componentWillUnmount() {
    monitor.unsetIfActive(this);
    this.node = null;
    this.manualPropsGetter = null;
  }

  handleClickOutside = () => {
    monitor.unsetActive();
  };

  handleMonitorActivationRequest() {
    this.show(this.props);
  }

  handleMonitorDeactivationRequest() {
    this.hide();
  }

  show(props) {
    if (this.props.manualControl) {
      const { getProps } = props;
      this.manualPropsGetter = getProps;

      props = getProps();
      this.node = props.node;
    }

    if (monitor.getActive() === this) {
      this.renderPortal(props);
    } else {
      monitor.setActive(this);
      setTimeout(() => {
        this.node = ReactDOM.findDOMNode(this);
        props.onBeforeOpen();
        this.renderPortal(props);
        props.onOpen();
      }, 0);
    }
  }

  hide() {
    const ownerDocument = this.node.ownerDocument;
    const portalNode = portalNodesByDocument.get(ownerDocument);

    this.props.onBeforeClose();
    ReactDOM.unmountComponentAtNode(portalNode);
    this.props.onClose();
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

  renderPortal = props => {
    const items = props.getItems();

    if (!items || items.length === 0) {
      return;
    }

    const ownerDocument = this.node.ownerDocument;
    let portalNode = portalNodesByDocument.get(ownerDocument);

    if (!portalNode) {
      portalNode = ownerDocument.createElement("div");
      portalNode.id = "brz-toolbar-portal";

      ownerDocument.body.appendChild(portalNode);
      portalNodesByDocument.set(ownerDocument, portalNode);
    }

    const node = props.node || ReactDOM.findDOMNode(this);
    const toolbar = (
      <ClickOutside
        exceptions={this.getOutSideExceptions()}
        onClickOutside={this.handleClickOutside}
      >
        <Toolbar
          {...props}
          window={ownerDocument.defaultView}
          items={items}
          node={node}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
        />
      </ClickOutside>
    );

    ReactDOM.unstable_renderSubtreeIntoContainer(this, toolbar, portalNode);
  };

  render() {
    return React.Children.only(this.props.children);
  }
}

export default PortalToolbar;
