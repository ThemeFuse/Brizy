import React from "react";
import { currentUserRole } from "./utils";

export const rolesHOC = ({
  allow,
  component: Component,
  render,
  fallbackComponent: FallbackComponent,
  fallbackRender
}) => {
  return function rolesHOC(props) {
    const roleTestPassed = allow.includes(currentUserRole());

    if (roleTestPassed) {
      if (Component) {
        return <Component {...props} />;
      }

      if (render) {
        return render(props);
      }
    } else {
      if (FallbackComponent) {
        return <FallbackComponent {...props} />;
      }

      if (fallbackRender) {
        return fallbackRender(props);
      }
    }

    return null;
  };
};
