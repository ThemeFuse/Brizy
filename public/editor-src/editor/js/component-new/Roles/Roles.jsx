import React, { Component } from "react";
import { currentUserRole } from "./utils";

export class Roles extends Component {
  static defaultProps = {
    allow: []
  };

  render() {
    const {
      allow,
      children,
      component: Component,
      render,
      fallbackComponent: FallbackComponent,
      fallbackRender
    } = this.props;
    const roleTestPassed = allow.includes(currentUserRole());

    if (roleTestPassed) {
      if (children) {
        return children;
      }

      if (Component) {
        return <Component />;
      }

      if (render) {
        return render();
      }
    } else {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }

      if (fallbackRender) {
        return fallbackRender();
      }
    }

    return null;
  }
}
