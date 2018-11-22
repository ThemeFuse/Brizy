import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { ContextMenu, ContextMenuProvider } from "react-contexify";
import { rolesHOC } from "visual/component/Roles";
import Items from "./Items";
import { mergeItems, concatItems, filterItems } from "./utils";

// this component is a temporary hacky solution
// to avoid ContextMenuProvider to render a wrapper div
// because that breaks our layout
class TmpContextMenuWrapper extends Component {
  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener(
      "contextmenu",
      this.handleContextMenu
    );
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).removeEventListener(
      "contextmenu",
      this.handleContextMenu
    );
  }

  handleContextMenu = e => {
    e.nativeEvent = e;
    this.props.onContextMenu(e);
  };

  render() {
    return this.props.children;
  }
}

class ContextMenuComponent extends Component {
  static defaultProps = {
    id: "",
    items: []
  };

  static contextTypes = {
    getParentContextMenuExtendItems: PropTypes.func,
    getParentContextMenuItems: PropTypes.func
  };

  static childContextTypes = {
    getParentContextMenuItems: PropTypes.func
  };

  getChildContext() {
    return { getParentContextMenuItems: this.getItems };
  }

  getItems = () => {
    let { componentId, items } = this.props;
    const {
      getParentContextMenuExtendItems,
      getParentContextMenuItems
    } = this.context;

    items = [
      componentId,
      getParentContextMenuExtendItems
        ? mergeItems(items, getParentContextMenuExtendItems())
        : items
    ];

    if (getParentContextMenuItems) {
      items = [items, ...getParentContextMenuItems()];
    } else {
      items = [items];
    }

    return items;
  };

  squashItems(items) {
    return items.reduce(
      (acc, [componentId, items]) => {
        if (!acc.componentIdMap[componentId]) {
          acc.componentIdMap[componentId] = true;
          acc.items = concatItems(acc.items, items);
        }

        return acc;
      },
      {
        componentIdMap: {},
        items: []
      }
    ).items;
  }

  renderProvider = props => {
    return <TmpContextMenuWrapper {...props} children={this.props.children} />;
  };

  render() {
    if (IS_PREVIEW) {
      return this.props.children;
    }

    const { id, children } = this.props;
    const items = this.squashItems(this.getItems());
    const itemsMeta = {
      depth: 0
    };

    if (filterItems(items).length === 0) {
      return children;
    }

    return (
      <React.Fragment>
        <ContextMenuProvider id={id} render={this.renderProvider}>
          {children}
        </ContextMenuProvider>
        {ReactDOM.createPortal(
          <ContextMenu id={id}>
            <Items data={items} meta={itemsMeta} />
          </ContextMenu>,
          document.body
        )}
      </React.Fragment>
    );
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: ContextMenuComponent,
  fallbackComponent: ({ children }) => children
});

export { default as ContextMenuExtend } from "./ContextMenuExtend";
