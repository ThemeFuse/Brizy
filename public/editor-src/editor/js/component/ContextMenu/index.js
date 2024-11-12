import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { contextMenu } from "react-contexify";
import { rolesHOC } from "visual/component/Roles";
import { Dropdown } from "./Dropdown";
import { mergeItems, concatItems, filterItems } from "./utils";

const meta = {
  depth: 0
};

// this component is a temporary hacky solution
// to avoid ContextMenuProvider to render a wrapper div
// because that breaks our layout
class TmpContextMenuWrapper extends Component {
  componentDidMount() {
    /* eslint-disable react/no-find-dom-node */
    ReactDOM.findDOMNode(this).addEventListener(
      "contextmenu",
      this.handleContextMenu
    );
    /* eslint-enabled react/no-find-dom-node */
  }

  componentWillUnmount() {
    /* eslint-disable react/no-find-dom-node */
    ReactDOM.findDOMNode(this).removeEventListener(
      "contextmenu",
      this.handleContextMenu
    );
    /* eslint-enabled react/no-find-dom-node */
  }

  handleContextMenu = e => {
    if (!e.shiftKey) {
      contextMenu.show({
        id: this.props.id,
        event: e
      });
    }
  };

  render() {
    return this.props.children;
  }
}

class ContextMenuComponent extends Component {
  static defaultProps = {
    id: "",
    getItems: () => []
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
    let { componentId, getItems: _getItems } = this.props;
    const {
      getParentContextMenuExtendItems,
      getParentContextMenuItems
    } = this.context;
    let items = _getItems();

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

  getSquashedItems = () => {
    const items = this.squashItems(this.getItems());
    return filterItems(items, meta);
  };

  render() {
    const { id, children } = this.props;

    if (IS_PREVIEW) {
      return children;
    }

    return (
      <>
        <TmpContextMenuWrapper id={id}>{children}</TmpContextMenuWrapper>
        <Dropdown id={id} getItems={this.getSquashedItems} itemsMeta={meta} />
      </>
    );
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: ContextMenuComponent,
  fallbackComponent: ({ children }) => children
});

export { default as ContextMenuExtend } from "./ContextMenuExtend";
export { default as ContextMenuDisabled } from "./ContextMenuDisabled";
