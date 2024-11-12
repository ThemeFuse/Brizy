import React, { JSX } from "react";
import { rolesHOC } from "visual/component/Roles";
import { noop } from "underscore";

class ContextMenuDisabled extends React.Component {
  static childContextTypes = {
    getParentContextMenuExtendItems: noop,
    getParentContextMenuItems: noop
  };

  getChildContext() {
    return {
      getParentContextMenuExtendItems: this.getItems,
      getParentContextMenuItems: this.getItems
    };
  }

  getItems = () => [];

  render() {
    const { children } = this.props;
    return children;
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: ContextMenuDisabled,
  fallbackRender: ({ children }: { children: JSX.Element }): JSX.Element =>
    children
});
