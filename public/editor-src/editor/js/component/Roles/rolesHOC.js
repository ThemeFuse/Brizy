import { isFunction } from "es-toolkit";
import React, { forwardRef } from "react";
import { currentUserRole } from "./utils";

export const rolesHOC = ({
  component: Component,
  fallbackComponent: FallbackComponent = undefined,
  allow = [],
  render = undefined,
  fallbackRender
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
        const { children } = props;

        return (
          <FallbackComponent {...props} ref={ref}>
            {isFunction(children) ? children(props, ref) : children}
          </FallbackComponent>
        );
      }

      if (fallbackRender) {
        return fallbackRender(props);
      }
    }

    return null;
  }

  rolesHOC.displayName = `RolesHOC(${Component.displayName || Component.name})`;

  return forwardRef(rolesHOC);
};
