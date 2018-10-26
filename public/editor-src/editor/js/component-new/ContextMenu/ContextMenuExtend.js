import React from "react";
import PropTypes from "prop-types";
import { rolesHOC } from "visual/component-new/Roles";

class ContextMenuExtend extends React.Component {
  static childContextTypes = {
    getParentContextMenuExtendItems: PropTypes.func
  };

  getChildContext() {
    return { getParentContextMenuExtendItems: this.getItems };
  }

  getItems = () => {
    return this.props.items;
  };

  render() {
    const { children } = this.props;

    return children;
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: ContextMenuExtend,
  fallbackComponent: ({ children }) => children
});
