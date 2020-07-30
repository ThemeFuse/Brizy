import React from "react";
import { currentUserRole } from "./utils";

export const rolesHOC = ({
  component: Component,
  fallbackComponent: FallbackComponent = undefined,
  allow = [],
  render = undefined,
  fallbackRender = undefined
}) => {
  function rolesHOC(props, ref) {
    const roleTestPassed = allow.includes(currentUserRole());

    if (roleTestPassed) {
      if (Component) {
        return <Component {...props} ref={ref} />;
      }

      if (render) {
        return render(props);
      }
    } else {
      if (FallbackComponent) {
        return <FallbackComponent {...props} ref={ref} />;
      }

      if (fallbackRender) {
        return fallbackRender(props);
      }
    }

    return null;
  }
  rolesHOC.displayName = `RolesHOC(${Component.displayName || Component.name})`;

  return React.forwardRef(rolesHOC);
};
